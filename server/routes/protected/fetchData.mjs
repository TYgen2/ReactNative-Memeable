import { Router } from "express";
import dotenv from "dotenv";
import { Post } from "../../mongoose/schemas/post.mjs";
import { getFollowingIds, getTimeDifference } from "../../utils/helpers.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
import { authenticateToken } from "../../utils/middleware.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
dotenv.config();

const router = Router();

// fetch posts (user's or following's)
router.get("/api/fetchPosts", authenticateToken, async (req, res) => {
  const { page, limit, userId, mode } = req.query;

  try {
    const user = await User.findById(userId).select("following").lean();
    if (!user) {
      res.status(400).send({ msg: "No user found, ERROR!!!" });
    }

    const followingIds = await getFollowingIds(userId);
    const likedPosts = await Like.find({ userId }).select("postId").lean();
    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    const search =
      mode == "main"
        ? Post.find({ userId: { $in: followingIds } })
        : Post.find({ userId });

    const posts = await search
      .sort({ createDate: -1 })
      .populate({ path: "userId", select: "icon displayName" })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const postData = posts.map((post) => {
      const postObject = post.toObject();
      delete postObject.__v;
      postObject.timeAgo = getTimeDifference(postObject.createDate);
      postObject.hasLiked = likedPostIds.includes(postObject._id.toString());
      return postObject;
    });

    return res.status(200).send(postData);
  } catch (error) {
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

// fetch user info
router.post("/api/fetchUserInfo", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    return res.status(200).send({
      email: user.email,
      userId: user.id,
      displayName: user.displayName,
      userIcon: user.icon,
    });
  } catch (error) {
    return res.status(400).send({ msg: error });
  }
});

// fetch user additional info (followers, following, posts)
router.get("/api/fetchAdditionalInfo", authenticateToken, async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }

    const followersCount = await Follow.countDocuments({ userId });
    const followingCount = await Follow.countDocuments({ followerId: userId });
    const postsCount = await Post.countDocuments({ userId });

    return res.status(200).send({ followersCount, followingCount, postsCount });
  } catch (error) {
    return res.status(400).send({ msg: "Error when fetching additional data" });
  }
});

export default router;
