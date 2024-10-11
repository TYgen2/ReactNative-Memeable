import { Router } from "express";
import { authenticateToken, upload } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { randomImageName, uploadToS3 } from "../../utils/helpers.mjs";
import sharp from "sharp";
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

    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (username) updates.username = username;
    if (userBio) updates.bio = userBio;

    try {
      const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).send({ msg: "User not found, update failed" });
      }

      return res.status(201).send({
        updatedStrings: {
          displayName: updatedUser.displayName,
          username: updatedUser.username,
          userBio: updatedUser.bio,
        },
        msg: "User profile updated successfully!",
      });
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
      const imageKey = `userInfo/${req.userId}/bgImages/${randomImageName()}`;
      const fileType = req.file.mimetype;
      await uploadToS3(buffer, imageKey, fileType);

      // update icon field in database
      const updatedBgImage = await User.findByIdAndUpdate(
        req.userId,
        { $set: { bgImage: `${CDN}` + `${imageKey}` } },
        { new: true }
      );
      if (!updatedBgImage) {
        return res
          .status(404)
          .send({ msg: "User not found when uploading bgImage" });
      }

      const response = {
        updatedBgImage: updatedBgImage.bgImage,
        msg: "bgImage updated and uploaded to S3 successfully!!",
      };

      return res.status(200).send(response);
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
      const imageKey = `userInfo/${req.userId}/icon/${randomImageName()}`;
      const fileType = req.file.mimetype;

      await uploadToS3(buffer, imageKey, fileType);

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
          .status(404)
          .send({ msg: "User not found when updating icon" });
      }

      const response = {
        updatedIcon: updatedIcon.icon,
        msg: "Icon updated to database and uploaded to S3!!",
      };

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ msg: "Something is wrong when updating icon" });
    }
  }
);

// update song in user profile
router.post(
  "/api/handleUpdateSong",
  upload.fields([
    { name: "albumImage", maxCount: 1 },
    { name: "songAudio", maxCount: 1 },
  ]),
  authenticateToken,
  async (req, res) => {
    try {
      const updates = {};

      // update song cover image if exist
      if (req.files.albumImage) {
        const imageBuffer = await sharp(req.files.albumImage[0].buffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        const imageKey = `userInfo/${
          req.userId
        }/song/coverImage/${randomImageName()}`;
        const imageType = req.files.albumImage[0].mimetype;

        await uploadToS3(imageBuffer, imageKey, imageType);
        updates["song.imageUri"] = `${CDN}` + `${imageKey}`;
      }

      // update song audio if exist
      if (req.files.songAudio) {
        const songBuffer = req.files.songAudio[0].buffer;
        const songKey = `userInfo/${
          req.userId
        }/song/audio/${randomImageName()}`;
        const songType = req.files.songAudio[0].mimetype;

        await uploadToS3(songBuffer, songKey, songType);
        updates["song.songUri"] = `${CDN}` + `${songKey}`;
      }

      // Include additional text fields
      if (req.body.borderColor) {
        updates["song.borderColor"] = req.body.borderColor;
      }

      if (req.body.songName) {
        updates["song.songName"] = req.body.songName;
      }

      // update song field in the database
      const updatedSong = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true }
      );

      if (!updatedSong) {
        return res
          .status(400)
          .send({ msg: "User not found when updating song" });
      }

      const response = {
        updatedSong: updatedSong.song,
        msg: "Song info updated to database and uploaded to S3!!",
      };

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ msg: "Something is wrong when updating song" });
    }
  }
);

// update pushToken in database
router.post(
  "/api/handleUpdatePushToken",
  authenticateToken,
  async (req, res) => {
    const { pushToken } = req.body;

    try {
      await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            pushToken,
          },
        },
        { new: true }
      );
      return res.status(200).send({ msg: "pushToken updated successfully!" });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ msg: "Something is wrong when updating pushToken" });
    }
  }
);

export default router;
