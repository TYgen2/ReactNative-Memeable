import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Follow } from "../mongoose/schemas/follow.mjs";

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

export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(40).toString("hex");
  return jwt.sign({ refreshToken }, process.env.REFRESH_SECRET, {
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
    return `${minutes}min`;
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
