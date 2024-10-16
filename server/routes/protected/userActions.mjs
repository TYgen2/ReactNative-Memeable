import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import {
  getTimeDifference,
  randomImageName,
  sendPushNotification,
} from "../../utils/helpers.mjs";
import sharp from "sharp";
import { Post } from "../../mongoose/schemas/post.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import { createPostValidationSchema } from "../../validationSchemas.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
import { Comment } from "../../mongoose/schemas/comment.mjs";
import { SavedPost } from "../../mongoose/schemas/savedPost.mjs";
import { CommentLike } from "../../mongoose/schemas/commentLike.mjs";
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
  const { postId, action } = req.body;
  const userId = req.userId;

  try {
    if (action === "like") {
      await Like.create({ userId, postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

      // working!!! temp token
      // await sendPushNotification(
      //   "WTF MAN",
      //   "foH2m8oxSNmOJfaDws2yR4:APA91bEdR8ID0YaqxOEMXfxUafn2YLO0iUQ2nwj3DkcuD2ZzajbaRCHajwza1V3Hdm62MhUhgK4nZZl7fvElliq7h9eOMvr7G6CIXBcuiSQ4sj37lYBl487pTq6tBWSixjVCIIdWm8J3"
      // );

      return res.status(200).send({ msg: "Liked the post!" });
    } else if (action === "unlike") {
      await Like.deleteOne({ userId, postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
      return res.status(200).send({ msg: "Unliked the post!" });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (error) {
    console.error("Error in handleLike:", error);
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

// comment on a post
router.post("/api/handleComment", authenticateToken, async (req, res) => {
  const { postId, parentCommentId, content } = req.body;

  try {
    const newComment = new Comment({
      userId: req.userId,
      postId,
      parentCommentId,
      content,
    });

    await newComment.save();

    const commentData = newComment.toObject();
    commentData.timeAgo = getTimeDifference(commentData.createDate);
    commentData.hasLiked = false; // Set initial hasLiked status

    res.status(201).send({
      msg: "Comment created successfully",
      comment: commentData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error creating comment" });
  }
});

// like a comment
router.post("/api/handleCommentLike", authenticateToken, async (req, res) => {
  const { commentId, action } = req.body;
  const userId = req.userId;

  try {
    if (action === "like") {
      await CommentLike.create({ userId, commentId });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } });
      return res.status(200).send({ msg: "Liked the comment!" });
    } else if (action === "unlike") {
      await CommentLike.deleteOne({ userId, commentId });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });
      return res.status(200).send({ msg: "Unliked the comment!" });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (error) {
    console.error("Error in handleCommentLike:", error);
    res
      .status(400)
      .send({ msg: "Error when handling the comment like function" });
  }
});

// save a post
router.post("/api/handleSavePost", authenticateToken, async (req, res) => {
  const { postId, action } = req.body;
  const userId = req.userId;

  try {
    if (action === "save") {
      const savedPost = new SavedPost({ userId, postId });
      await savedPost.save();
      return res.status(200).send({ msg: "saved successfully!" });
    } else if (action === "unsave") {
      await SavedPost.deleteOne({ userId, postId });
      return res.status(200).send({ msg: "unsaved successfully!" });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (error) {
    res.status(400).send({ msg: "Error when handling save/unsave" });
  }
});

export default router;
