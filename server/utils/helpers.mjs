import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Follow } from "../mongoose/schemas/follow.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./config.mjs";
import redisClient from "../services/redisClient.mjs";
import admin from "../services/firebase.mjs";

dotenv.config();

const saltRounds = 10;

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) =>
  bcrypt.compareSync(plain, hashed);

export const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const randomImageName = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const randomUserName = () => {
  return crypto.randomBytes(8).toString("hex");
};

export const getTimeDifference = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  }
};

export const getFollowingIds = async (userId) => {
  const following = await Follow.find({ followerId: userId })
    .select("userId")
    .lean();
  const followingIds = following.map((follow) => follow.userId.toString());
  followingIds.push(userId);

  return followingIds;
};

export const validateTokens = async (jwtToken, refreshToken) => {
  // handle jwtToken checking first
  try {
    // get the user id from the jwt token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    // console.log("JWT still valid, passed the token check from middleware!!");
    return { user, newTokens: null };
  } catch (jwtError) {
    if (jwtError.name !== "TokenExpiredError") throw jwtError;
    console.log("JWT expired, checking refresh token from Redis");

    // in case jwtToken is invalid, check the refresh token
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const userId = decoded.id;
      let storedRefreshToken;

      // firstly check whether the refresh token exists in Redis
      try {
        storedRefreshToken = await redisClient.get(
          `user:${userId}:refreshToken`
        );
        console.log("refreshToken found in Redis!!!!!!");
      } catch (redisError) {
        console.error("Redis error:", redisError, "fallback to use MongoDB...");

        // If Redis fails, fall back to MongoDB
        const user = await User.findById(userId);
        storedRefreshToken = user ? user.refreshToken : null;
      }

      // if the refresh token is not found in Redis/database,
      // or it doesn't match the one in the request
      if (!storedRefreshToken || storedRefreshToken !== refreshToken)
        throw new Error("Invalid refresh token");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const newToken = generateJWT({ id: user.id });
      const newRefreshToken = generateRefreshToken({ id: user.id });

      await redisClient.set(`user:${userId}:refreshToken`, newRefreshToken, {
        EX: 60 * 60 * 24 * 7,
      });

      user.refreshToken = newRefreshToken;
      await user.save();

      console.log("TOKENS generated successfully from middleware!!");
      return {
        user,
        newTokens: { token: newToken, refreshToken: newRefreshToken },
      };
    } catch (refreshError) {
      console.log("Both tokens are expired!! Checked from middleware");
      throw new Error("Both tokens expired");
    }
  }
};

export const uploadToS3 = async (fileBuffer, key, contentType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  return await s3.send(command);
};

export const handleTokens = async (user) => {
  const token = generateJWT({ id: user.id });
  const signedRefreshToken = generateRefreshToken({ id: user.id });

  await redisClient.set(`user:${user.id}:refreshToken`, signedRefreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  user.refreshToken = signedRefreshToken;
  await user.save();

  return {
    headers: {
      "x-new-token": token,
      "x-new-refresh-token": signedRefreshToken,
    },
  };
};

export const sendPushNotification = async (body, user) => {
  const message = {
    notification: {
      title: "Memeable",
      body,
    },
  };

  try {
    // Filter active devices and send notifications only to them
    const activeDevices = user.devices.filter((device) => device.isActive);

    // Send to all active devices
    const notifications = activeDevices.map((device) => {
      return admin.messaging().send({
        ...message,
        token: device.pushToken,
      });
    });

    await Promise.all(notifications);
    console.log("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
