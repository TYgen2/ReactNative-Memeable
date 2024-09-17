import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../mongoose/schemas/user.mjs";
import { generateJWT, generateRefreshToken } from "./helpers.mjs";
import multer from "multer";

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const authenticateToken = async (req, res, next) => {
  const jwtToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!jwtToken || !refreshToken) {
    return res.status(404).send({ msg: "Missing tokens" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(404).send({ msg: "Invalid refresh token" });
  }

  req.userId = user.id;

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

      res.setHeader("x-new-token", token);
      res.setHeader("x-new-refresh-token", signedRefreshToken);
      next();
    } catch (refreshError) {
      return res.status(401).send({
        msg: "Both tokens are expired!! Checked from middleware",
      });
    }
  }
};
