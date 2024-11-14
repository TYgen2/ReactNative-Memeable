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
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import { createPostValidationSchema } from "../../validationSchemas.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
import { Comment } from "../../mongoose/schemas/comment.mjs";
import { SavedPost } from "../../mongoose/schemas/savedPost.mjs";
import { CommentLike } from "../../mongoose/schemas/commentLike.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
import { Notification } from "../../mongoose/schemas/notification.mjs";
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

      // Get post owner's info for notification
      const post = await Post.findById(postId);
      if (post) {
        const postOwner = await User.findById(post.userId);

        if (
          postOwner &&
          postOwner.devices?.length > 0 &&
          postOwner._id.toString() !== userId
        ) {
          // Find existing notification or create new one
          await Notification.findOneAndUpdate(
            {
              recipientId: postOwner._id,
              senderId: userId,
              type: "like_post",
              postId: postId,
            },
            {
              $set: {
                createDate: new Date(), // Update timestamp
                read: false, // Mark as unread again
              },
            },
            { upsert: true } // Create if doesn't exist
          );

          const liker = await User.findById(userId);
          const notificationBody = `${liker.displayName} liked your post`;
          await sendPushNotification(notificationBody, postOwner);
        }
      }

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

      // Get target user's info for notification
      const targetUser = await User.findById(targetId);
      if (targetUser && targetUser.devices?.length > 0) {
        // Find existing notification or create new one
        await Notification.findOneAndUpdate(
          {
            recipientId: targetId,
            senderId: req.userId,
            type: "follow",
          },
          {
            $set: {
              createDate: new Date(),
              read: false,
            },
          },
          { upsert: true }
        );

        const follower = await User.findById(req.userId);
        const notificationBody = `${follower.displayName} started following you`;
        await sendPushNotification(notificationBody, targetUser);
      }

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

    // Get post owner's info for notification
    const post = await Post.findById(postId);
    if (post) {
      const postOwner = await User.findById(post.userId);
      if (
        postOwner &&
        postOwner.devices?.length > 0 &&
        postOwner._id.toString() !== req.userId
      ) {
        // Find existing notification or create new one
        await Notification.findOneAndUpdate(
          {
            recipientId: postOwner._id,
            senderId: req.userId,
            type: "comment",
            postId: postId,
          },
          {
            $set: {
              createDate: new Date(),
              read: false,
              content: content, // Store comment content for reference
            },
          },
          { upsert: true }
        );

        const commenter = await User.findById(req.userId);
        const notificationBody = `${commenter.displayName} commented on your post: "${content}"`;
        await sendPushNotification(notificationBody, postOwner);
      }
    }

    const commentData = newComment.toObject();
    commentData.hasLiked = false;

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

      // Get comment owner's info for notification
      const comment = await Comment.findById(commentId);
      if (comment) {
        const commentOwner = await User.findById(comment.userId);
        if (
          commentOwner &&
          commentOwner.devices?.length > 0 &&
          commentOwner._id.toString() !== userId
        ) {
          // Find existing notification or create new one
          await Notification.findOneAndUpdate(
            {
              recipientId: commentOwner._id,
              senderId: userId,
              type: "like_comment",
              commentId: commentId,
              postId: comment.postId,
            },
            {
              $set: {
                createDate: new Date(),
                read: false,
              },
            },
            { upsert: true }
          );
          const liker = await User.findById(userId);
          const notificationBody = `${liker.displayName} liked your comment`;
          await sendPushNotification(notificationBody, commentOwner);
        }
      }

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

// delete a post
router.delete("/api/handleDeletePost", authenticateToken, async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;

  try {
    // First, get the post to check ownership and get the image key
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ msg: "Post not found" });
    }

    // Verify the user owns this post
    if (post.userId.toString() !== userId) {
      return res.status(403).send({ msg: "Unauthorized to delete this post" });
    }

    // Extract the image key from the CDN URL
    const imageUri = post.imageUri;
    const imageKey = imageUri.replace(CDN, "");

    // Delete image from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageKey,
    };
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

    // Delete the post and all related data
    await Promise.all([
      // Delete the post
      Post.findByIdAndDelete(postId),
      // Delete all likes associated with the post
      Like.deleteMany({ postId }),
      // Delete all comments associated with the post
      Comment.deleteMany({ postId }),
      // Delete all saved posts references
      SavedPost.deleteMany({ postId }),
      // Delete all notifications related to this post
      Notification.deleteMany({ postId }),
    ]);

    return res.status(200).send({ msg: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in handleDeletePost:", error);
    return res.status(400).send({ msg: "Error when deleting post" });
  }
});

// delete a comment
router.delete(
  "/api/handleCommentDelete",
  authenticateToken,
  async (req, res) => {
    const { commentId, parentCommentId } = req.body;
    const userId = req.userId;

    try {
      // First, get the comment to check ownership
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).send({ msg: "Comment not found" });
      }

      // Verify the user owns this comment
      if (comment.userId.toString() !== userId) {
        return res
          .status(403)
          .send({ msg: "Unauthorized to delete this comment" });
      }

      // Delete the comment and all related data
      await Promise.all([
        // Delete the comment
        Comment.findByIdAndDelete(commentId),
        // Delete all likes associated with the comment
        CommentLike.deleteMany({ commentId }),
        // Delete all notifications related to this comment
        Notification.deleteMany({ commentId }),
        // If it's a main comment, delete all sub-comments and their associated data
        ...(parentCommentId
          ? []
          : [
              Comment.deleteMany({ parentCommentId: commentId }),
              CommentLike.deleteMany({
                commentId: {
                  $in: (
                    await Comment.find({ parentCommentId: commentId })
                  ).map((c) => c._id),
                },
              }),
              Notification.deleteMany({
                commentId: {
                  $in: (
                    await Comment.find({ parentCommentId: commentId })
                  ).map((c) => c._id),
                },
              }),
            ]),
      ]);

      return res.status(200).send({ msg: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error in handleDeleteComment:", error);
      return res.status(400).send({ msg: "Error when deleting comment" });
    }
  }
);

export default router;
