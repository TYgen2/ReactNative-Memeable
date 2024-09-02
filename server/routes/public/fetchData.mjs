import { Router } from "express";
import dotenv from "dotenv";
import { Post } from "../../mongoose/schemas/post.mjs";
dotenv.config();

const router = Router();
const CDN = process.env.AWS_CLOUDFRONT_CDN;

router.get("/api/fetchPosts", async (req, res) => {
  const posts = await Post.find({}).sort({ createDate: -1 }).exec();

  const postData = posts.map((post) => {
    const postObject = post.toObject();
    delete postObject.__v;
    postObject.imageUrl = `${CDN}` + post.imageKey;
    return postObject;
  });

  return res.status(200).send(postData);
});

export default router;
