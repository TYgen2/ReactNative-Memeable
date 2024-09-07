import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../mongoose/schemas/user.mjs";
import { generateJWT, generateRefreshToken } from "./helpers.mjs";
import multer from "multer";

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const authenticateToken = async (req, res, next) => {
  // receive tokens from user's local storage
  const { jwtToken, refreshToken } = req.body;

  if (!jwtToken || !refreshToken) {
    return res.status(401).send({ msg: "Missing token" });
  }

  const user = await User.findOne({ refreshToken });
  req.userId = user.id;
  if (!user) {
    return res
      .status(400)
      .send({ msg: "Invalid refresh token / User not exist" });
  }

  try {
    jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log("JWT still valid, passed the token check from middleware!!");
    // jwtToken still valid, proceed to handle actions...
    next();
  } catch (jwtError) {
    // jwtToken is expired, proceed to check refreshToken
    try {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      console.log(
        "refreshToken still valid, now generate new tokens from middleware!!"
      );

      // refreshToken still valid, proceed to generate new tokens...
      const token = generateJWT({ id: user.id });
      const signedRefreshToken = generateRefreshToken();

      user.refreshToken = signedRefreshToken;
      await user.save();

      console.log("TOKENS generated successfully from middleware!!");

      // for later use
      req.newToken = token;
      req.newRefreshToken = signedRefreshToken;
      next();
    } catch (refreshError) {
      return res.status(400).send({
        msg: "Both tokens are expired!! Checked from middleware",
      });
    }
  }
};
