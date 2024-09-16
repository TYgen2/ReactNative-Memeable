import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { getTimeDifference, randomImageName } from "../../utils/helpers.mjs";
import sharp from "sharp";
import { Post } from "../../mongoose/schemas/post.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import { createPostValidationSchema } from "../../validationSchemas.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
dotenv.config();

const router = Router();
const CDN = process.env.AWS_CLOUDFRONT_CDN;

// upload image post
router.post(
  "/api/handleUploadPost",
  upload.single("file"),
  authenticateToken,
  checkSchema(createPostValidationSchema),
  async (req, res) => {
    // validate the received image metadata
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    try {
      // image compress
      const buffer = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      const imageName = randomImageName();
      const imageKey = `posts/${req.userId}/${imageName}`;
      const { width, height } = await sharp(buffer).metadata();

      // upload image to S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        // this should be unique, if not s3 will
        // overrite the file with same name
        Key: imageKey,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // create post in database
      const newPost = new Post({
        // req.userId from auth token middleware
        userId: req.userId,
        imageUri: `${CDN}` + `${imageKey}`,
        width,
        height,
        title: req.body.title,
        description: req.body.description,
        hashtag: req.body.hashtag,
      });
      await newPost.save();

      const populatedPost = await Post.findById(newPost._id).populate({
        path: "userId",
        select: "icon displayName",
      });

      const postData = populatedPost.toObject();
      delete postData.__v;
      postData.timeAgo = getTimeDifference(postData.createDate);
      postData.hasLiked = false;

      const response = { msg: "Image uploaded to S3 successfully!!", postData };

      // when new pair of tokens are generated from authenticateToken middleware
      if (req.newToken && req.newRefreshToken) {
        console.log("HAVE NEW TOKENN!!!");
        response.token = req.newToken;
        response.refreshToken = req.newRefreshToken;
      }

      return res.status(201).send(response);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ msg: "Something is wrong when uploading image" });
    }
  }
);

// user like / unlike posts
router.post("/api/handleLike", authenticateToken, async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const target = await Like.findOne({ userId, postId });
    if (target) {
      await target.deleteOne();
    } else {
      const like = new Like({ userId, postId });
      await like.save();
    }
    await Post.findByIdAndUpdate(postId, { $inc: { likes: target ? -1 : 1 } });
    res
      .status(200)
      .send({ msg: target ? "Unliked the post!" : "Liked the post!" });
  } catch (error) {
    res.status(400).send({ msg: "Error when handling the like function" });
  }
});

// user follow / unfollow other users
router.post("/api/handleFollow", authenticateToken, async (req, res) => {
  const { targetId, action } = req.body;

  try {
    if (action === "follow") {
      await Follow.create({ userId: targetId, followerId: req.userId });
      return res.status(200).send({ msg: "Followed successfully!" });
    } else if (action === "unfollow") {
      await Follow.deleteOne({ userId: targetId, followerId: req.userId });
      return res.status(200).send({ msg: "Unfollowed successfully!" });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (error) {
    res.status(400).send({ msg: "Error when handling follow/unfollow" });
  }
});

export default router;
