import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { randomImageName } from "../../utils/helpers.mjs";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/config.mjs";

import { User } from "../../mongoose/schemas/user.mjs";

dotenv.config();

const router = Router();
const CDN = process.env.AWS_CLOUDFRONT_CDN;

// save default icon
router.post("/api/uploadDefaultIcon", authenticateToken, async (req, res) => {
  try {
    // update icon field in database
    const updatedIcon = await User.findByIdAndUpdate(
      req.userId,
      { icon: req.body.icon },
      { new: true }
    );
    if (!updatedIcon) {
      return res
        .status(400)
        .send({ msg: "User not found when uploading icon" });
    }

    const response = { msg: "Default icon saved to database!!" };

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
        req.userId,
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

      return res.status(201).send(response);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ msg: "Something is wrong when uploading CUSTOM icon" });
    }
  }
);

export default router;
