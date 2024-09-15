import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { randomImageName } from "../../utils/helpers.mjs";
import sharp from "sharp";
import { Post } from "../../mongoose/schemas/post.mjs";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import {
  createPostValidationSchema,
  updateProfileValidationSchema,
} from "../../validationSchemas.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
import { Like } from "../../mongoose/schemas/like.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
dotenv.config();

const router = Router();
const CDN = process.env.AWS_CLOUDFRONT_CDN;

// upload image post
router.post(
  "/api/uploadPost",
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
      const response = { msg: "Image uploaded to S3 successfully!!" };

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

// save default icon
router.post("/api/uploadDefaultIcon", authenticateToken, async (req, res) => {
  try {
    // update icon field in database
    const updatedIcon = await User.findByIdAndUpdate(
      req.body.userId,
      { icon: req.body.icon },
      { new: true }
    );
    if (!updatedIcon) {
      return res
        .status(400)
        .send({ msg: "User not found when uploading icon" });
    }

    const response = { msg: "Default icon saved to database!!" };

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
      .send({ msg: "Something is wrong when uploading icon" });
  }
});

// save custom icon
router.post(
  "/api/uploadCustomIcon",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    try {
      // image compress
      const buffer = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      const imageKey = `icons/${randomImageName()}`;

      // upload image to S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // update icon field in database
      const updatedIcon = await User.findByIdAndUpdate(
        req.body.userId,
        { $set: { "icon.customIcon": `${CDN}` + `${imageKey}` } },
        { new: true }
      );
      if (!updatedIcon) {
        return res
          .status(400)
          .send({ msg: "User not found when uploading icon" });
      }

      const response = {
        msg: "Custom icon saved to database and uploaded to S3!!",
      };

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
        .send({ msg: "Something is wrong when uploading CUSTOM icon" });
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

router.post(
  "/api/handleUpdateStrings",
  authenticateToken,
  checkSchema(updateProfileValidationSchema),
  async (req, res) => {
    const { username, displayName, userBio } = req.body;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({
        msg: "Input data invalid",
        errorType: "validation",
        invalidData: result.array(),
      });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        {
          displayName,
          username,
          bio: userBio,
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ msg: "User not found, update failed" });
      }

      return res
        .status(200)
        .send({ msg: "User profile updated successfully!" });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .send({ msg: "Username already exists", errorType: "duplicate" });
      }

      return res.status(400).send({ msg: error.message, errorType: "unknown" });
    }
  }
);

// update bgImage in user profile
router.post(
  "/api/handleUpdateBgImage",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    try {
      // image compress
      const buffer = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      const imageKey = `bgImages/${req.userId}/${randomImageName()}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // update icon field in database
      const updatedBgImage = await User.findByIdAndUpdate(
        req.userId,
        { $set: { bgImage: `${CDN}` + `${imageKey}` } },
        { new: true }
      );
      if (!updatedBgImage) {
        return res
          .status(400)
          .send({ msg: "User not found when uploading bgImage" });
      }

      const response = {
        updatedBgImage,
        msg: "bgImage updated and uploaded to S3 successfully!!",
      };

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
        .send({ msg: "Something is wrong when uploading bgImage" });
    }
  }
);

// update icon in user profile
router.post(
  "/api/handleUpdateIcon",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    try {
      // image compress
      const buffer = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      const imageKey = `icons/${req.userId}/${randomImageName()}`;

      // upload image to S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // update icon field in database
      const updatedIcon = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            "icon.customIcon": `${CDN}` + `${imageKey}`,
            "icon.bgColor": null,
            "icon.id": null,
          },
        },
        { new: true }
      );
      if (!updatedIcon) {
        return res
          .status(400)
          .send({ msg: "User not found when updating icon" });
      }

      const response = {
        updatedIcon,
        msg: "Icon updated to database and uploaded to S3!!",
      };

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
        .send({ msg: "Something is wrong when updating icon" });
    }
  }
);

export default router;
