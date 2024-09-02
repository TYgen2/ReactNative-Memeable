import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { randomImageName } from "../../utils/helpers.mjs";
import sharp from "sharp";
import { Post } from "../../mongoose/schemas/post.mjs";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import { createPostValidationSchema } from "../../validationSchemas.mjs";
dotenv.config();

const router = Router();

// create image post
router.post(
  "/api/create",
  checkSchema(createPostValidationSchema),
  upload.single("file"),
  authenticateToken,
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
      const imageKey = randomImageName();

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
        userId: req.userId,
        imageKey,
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

export default router;
