import { Router } from "express";
import { authenticateToken } from "../../utils/middleware.mjs";
import dotenv from "dotenv";
import { User } from "../../mongoose/schemas/user.mjs";
import { Follow } from "../../mongoose/schemas/follow.mjs";
dotenv.config();

const router = Router();

router.get("/api/searchUser", authenticateToken, async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find(
      { displayName: new RegExp(query, "i") },
      { authMethod: 0, email: 0, refreshToken: 0, googleId: 0, facebookId: 0 }
    );

    const userData = await Promise.all(
      users.map(async (user) => {
        const userObject = user.toObject();
        delete userObject.__v;
        userObject.isFollowing = Boolean(
          await Follow.exists({
            followerId: req.userId,
            userId: user._id,
          })
        );
        return userObject;
      })
    );

    return res.status(200).send(userData);
  } catch (error) {
    return res.status(400).send({ msg: "Error when searching" });
  }
});

export default router;
