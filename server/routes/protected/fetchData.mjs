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

// fetch posts (user's or following's)
router.get("/api/fetchPosts", authenticateToken, async (req, res) => {
  const { page, limit, mode, since } = req.query;

  try {
    const user = await User.findById(req.userId).select("following").lean();
    if (!user) {
      res.status(404).send({ msg: "No user found, ERROR!!!" });
    }

    const followingIds = await getFollowingIds(req.userId);
    const likedPosts = await Like.find({ userId: req.userId })
      .select("postId")
      .lean();
    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    let search;
    if (mode === "main") {
      search = Post.find({ userId: { $in: followingIds } });
    } else {
      search = Post.find({ userId: req.userId });
    }

    if (since) {
      search = search.where("createDate").gt(new Date(since));
    } else {
      search = search.skip((page - 1) * limit).limit(Number(limit) + 1);
    }

    const posts = await search
      .sort({ createDate: -1 })
      .populate({ path: "userId", select: "icon displayName" })
      .exec();

    const hasMore = posts.length > limit;
    const postData = posts.slice(0, limit).map((post) => {
      const postObject = post.toObject();
      delete postObject.__v;
      postObject.timeAgo = getTimeDifference(postObject.createDate);
      postObject.hasLiked = likedPostIds.includes(postObject._id.toString());
      return postObject;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

export default router;
