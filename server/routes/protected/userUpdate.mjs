import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { randomImageName } from "../../utils/helpers.mjs";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";
import { checkSchema, validationResult } from "express-validator";
import { updateProfileValidationSchema } from "../../validationSchemas.mjs";
import { User } from "../../mongoose/schemas/user.mjs";

dotenv.config();

const router = Router();
const CDN = process.env.AWS_CLOUDFRONT_CDN;

// update username, displayName and userBio in user profile
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
