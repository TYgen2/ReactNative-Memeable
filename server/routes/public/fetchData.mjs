import { Router } from "express";
import dotenv from "dotenv";
import { Post } from "../../mongoose/schemas/post.mjs";
import { getTimeDifference } from "../../utils/helpers.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
dotenv.config();

const router = Router();

router.get("/api/fetchPosts", async (req, res) => {
  const { page, limit, userId } = req.query;

  try {
    const likedPosts = await Like.find({ userId }).select("postId").lean();
    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    const posts = await Post.find({})
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

export default router;
