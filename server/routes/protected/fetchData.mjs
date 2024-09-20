import { Router } from "express";
import dotenv from "dotenv";
import { Post } from "../../mongoose/schemas/post.mjs";
import { getFollowingIds, getTimeDifference } from "../../utils/helpers.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
import { authenticateToken } from "../../utils/middleware.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
import mongoose from "mongoose";
dotenv.config();

const router = Router();

// fetch local user info when login, store in Redux
router.get("/api/fetchUserInfo", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    const userId = req.userId;

    const [followersCount, followingCount, postsCount, likedPosts, posts] =
      await Promise.all([
        Follow.countDocuments({ userId }),
        Follow.countDocuments({
          followerId: userId,
        }),
        Post.countDocuments({ userId }),
        Like.find({ userId }).select("postId").lean(),
        Post.find({ userId }).sort({ createDate: -1 }).limit(9).exec(),
      ]);

    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    const postData = posts.map((post) => {
      const postObject = post.toObject();
      postObject.timeAgo = getTimeDifference(postObject.createDate);
      postObject.hasLiked = likedPostIds.includes(postObject._id.toString());
      return postObject;
    });

    return res.status(200).send({
      userDetails: {
        email: user.email,
        userId: user._id,
        displayName: user.displayName,
        username: user.username,
        userIcon: user.icon,
        userBio: user.bio,
        bgImage: user.bgImage,
        followersCount,
        followingCount,
        postsCount,
      },
      userPosts: postData,
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
      displayName: user.displayName,
      username: user.username,
      userIcon: user.icon,
      userBio: user.bio,
      bgImage: user.bgImage,
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

// fetch all posts in home page
router.get("/api/fetchAllPosts", authenticateToken, async (req, res) => {
  const { page, limit } = req.query;

  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).send({ msg: "No user found, ERROR!!!" });
    }

    const followingIds = await getFollowingIds(req.userId);

    // filter all the posts where the post has
    // a userId contained in the followingIds array
    let matchStage = {
      userId: {
        $in: followingIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    };

    const posts = await Post.aggregate([
      { $match: matchStage },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        // from the Like collection,
        $lookup: {
          from: "likes",
          // define a postId variable, where value = _id field.
          // Dollar sign means the _id field is in the current doc.
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                // allows the use of aggregation expressions
                $expr: {
                  $and: [
                    // double dollar sign used for access variables
                    // defined in the let clause (i.e. postId = "$_id")

                    // compare $postId in Like and $$postId in Post
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: [
                        "$userId",
                        new mongoose.Types.ObjectId(`${req.userId}`),
                      ],
                    },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "likeDocs",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeDocs" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          // field in Post
          localField: "userId",
          // field in User
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userId: {
            _id: "$user._id",
            displayName: "$user.displayName",
            icon: "$user.icon",
          },
          imageUri: 1,
          width: 1,
          height: 1,
          title: 1,
          description: 1,
          hashtag: 1,
          createDate: 1,
          likes: 1, // Keep the original likes field
          hasLiked: 1,
          timeAgo: { $literal: "" }, // Placeholder for timeAgo, to be calculated in application code
        },
      },
    ]);

    const hasMore = posts.length > limit;
    const postData = posts.slice(0, limit).map((post) => {
      post.timeAgo = getTimeDifference(post.createDate);
      return post;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

// fetch user posts in user profile page
router.get("/api/fetchUserPosts", authenticateToken, async (req, res) => {
  const { page, limit, targetId } = req.query;

  try {
    const user = await User.findById(targetId).lean();
    if (!user) {
      return res.status(404).send({ msg: "No user found, ERROR!!!" });
    }

    const posts = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(targetId) } },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        // from the Like collection,
        $lookup: {
          from: "likes",
          // define a postId variable, where value = _id field.
          // Dollar sign means the _id field is in the current doc.
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                // allows the use of aggregation expressions
                $expr: {
                  $and: [
                    // double dollar sign used for access variables
                    // defined in the let clause (i.e. postId = "$_id")

                    // compare $postId in Like and $$postId in Post
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(targetId)],
                    },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "likeDocs",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeDocs" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          // field in Post
          localField: "userId",
          // field in User
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userId: {
            _id: "$user._id",
            displayName: "$user.displayName",
            icon: "$user.icon",
          },
          imageUri: 1,
          width: 1,
          height: 1,
          title: 1,
          description: 1,
          hashtag: 1,
          createDate: 1,
          likes: 1, // Keep the original likes field
          hasLiked: 1,
          timeAgo: { $literal: "" }, // Placeholder for timeAgo, to be calculated in application code
        },
      },
    ]);

    const hasMore = posts.length > limit;
    const postData = posts.slice(0, limit).map((post) => {
      post.timeAgo = getTimeDifference(post.createDate);
      return post;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

export default router;
