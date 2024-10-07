import dotenv from "dotenv";
import { validateTokens } from "./helpers.mjs";
import multer from "multer";

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const authenticateToken = async (req, res, next) => {
  const jwtToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!jwtToken || !refreshToken) {
    console.log("Missing tokens");
    return res.status(404).send({ msg: "Missing tokens" });
  }

  try {
    const { user, newTokens } = await validateTokens(jwtToken, refreshToken);
    req.userId = user.id;

    if (newTokens) {
      console.log(`New tokens generated for user ${user.displayName}`);
      res.setHeader("x-new-token", newTokens.token);
      res.setHeader("x-new-refresh-token", newTokens.refreshToken);
    } else {
      console.log(`Using existing tokens for user ${user.displayName}`);
    }

    next();
  } catch (error) {
    return res.status(401).send({ msg: error.message });
  }
};
