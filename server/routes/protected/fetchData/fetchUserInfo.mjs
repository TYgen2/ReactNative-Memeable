import { Router } from "express";
import { authenticateToken } from "../../../utils/middleware.mjs";
import { User } from "../../../mongoose/schemas/user.mjs";
import { Follow } from "../../../mongoose/schemas/follow.mjs";
import { Post } from "../../../mongoose/schemas/post.mjs";
import { Notification } from "../../../mongoose/schemas/notification.mjs";
import mongoose from "mongoose";
import { getTimeDifference } from "../../../utils/helpers.mjs";

const router = Router();

// fetch local user info when login, store in Redux
router.get("/api/fetchUserInfo", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    const userId = req.userId;

    const [followersCount, followingCount, postsCount] = await Promise.all([
      Follow.countDocuments({ userId }),
      Follow.countDocuments({
        followerId: userId,
      }),
      Post.countDocuments({ userId }),
      Post.find({ userId }).sort({ createDate: -1 }).limit(9).exec(),
    ]);

    return res.status(200).send({
      userId,
      displayName: user.displayName,
      username: user.username,
      userIcon: user.icon,
      userBio: user.bio,
      bgImage: user.bgImage,
      song: user.song,
      gradientConfig: user.gradientConfig,
      followersCount,
      followingCount,
      postsCount,
      isFollowing: false,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Internal server error (/api/fetchUserInfo)" });
  }
});

// fetch User profile info
router.get("/api/fetchUserProfile", authenticateToken, async (req, res) => {
  const { targetId } = req.query;

  try {
    const user = await User.findById(targetId).lean();
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }

    const [followersCount, followingCount, postsCount, isFollowing] =
      await Promise.all([
        Follow.countDocuments({ userId: targetId }),
        Follow.countDocuments({
          followerId: targetId,
        }),
        Post.countDocuments({ userId: targetId }),
        Follow.exists({
          followerId: req.userId,
          userId: targetId,
        }),
      ]);

    return res.status(200).send({
      userId: targetId,
      displayName: user.displayName,
      username: user.username,
      userIcon: user.icon,
      userBio: user.bio,
      bgImage: user.bgImage,
      song: user.song,
      gradientConfig: user.gradientConfig,
      followersCount,
      followingCount,
      postsCount,
      isFollowing: Boolean(isFollowing),
    });
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Internal server error (/api/fetchUserProfile)" });
  }
});

// fetch notifications
router.get("/api/fetchNotifications", authenticateToken, async (req, res) => {
  const { page, limit } = req.query;

  try {
    const notifications = await Notification.aggregate([
      {
        $match: {
          recipientId: new mongoose.Types.ObjectId(req.userId),
        },
      },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $addFields: {
          post: { $arrayElemAt: ["$post", 0] }, // This will keep null if post doesn't exist
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          read: 1,
          createDate: 1,
          timeAgo: { $literal: "" },
          sender: {
            _id: "$sender._id",
            displayName: "$sender.displayName",
            icon: "$sender.icon",
          },
          post: {
            _id: "$post._id",
            imageUri: "$post.imageUri",
          },
        },
      },
    ]);

    const hasMore = notifications.length > limit;
    const notificationData = notifications
      .slice(0, limit)
      .map((notification) => {
        notification.timeAgo = getTimeDifference(notification.createDate);
        return notification;
      });

    return res.status(200).send({ notificationData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching notifications" });
  }
});

export default router;
