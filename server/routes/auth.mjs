import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserValidationSchema } from "../validationSchemas.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import {
  comparePassword,
  handleTokens,
  hashPassword,
  randomUserName,
  validateTokens,
} from "../utils/helpers.mjs";
import "../strategies/jwt.mjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import axios from "axios";
import { authenticateToken } from "../utils/middleware.mjs";
import redisClient from "../services/redisClient.mjs";

dotenv.config();

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// local register
router.post(
  "/api/auth/register",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const { email } = req.body;

    // check whether the email has been registered before
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "This email has been used." });
    }

    // validate the received user creds
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    // create the hashed password for storing in db
    const data = matchedData(req);
    data.password = hashPassword(data.password);

    // create the new user instance in db
    const newUser = new User({
      ...data,
      username: randomUserName(),
    });

    try {
      // save the user to db to obtain the id
      const savedUser = await newUser.save();

      const { headers } = await handleTokens(savedUser);
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      return res.status(201).send({
        isNew: true,
        userId: savedUser.id,
      });
    } catch (error) {
      console.log("Cannot create new user wtf?", error);
      return res.status(400).send(error);
    }
  }
);

// local login
router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate email existence
    let user = await User.findOne({ email });
    // user haven't registered with the email /
    // user registered with this email but not local
    if (!user || user.authMethod != "local") {
      return res.status(400).send({ msg: "Invalid credentials" });
    }

    // validate password
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid credentials" });
    }

    const { headers } = await handleTokens(user);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).send({
      isNew: false,
      userId: user.id,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

// google login
router.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    // idToken received from client, verify it
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // if it's valid, get the info from the ticket
    const payload = ticket.getPayload();

    // check whether the user is exist or not by using googleId
    let user = await User.findOne({ email: payload.email });
    let isNew;
    // if not exist yet, create one
    if (!user) {
      isNew = true;
      user = new User({
        email: payload.email,
        displayName: payload.name,
        username: randomUserName(),
        googleId: payload.sub,
        authMethod: "google",
      });
    } else if (user && user.authMethod != "google") {
      // user already used the same email to register an account with other methods
      return res.status(400).send({
        msg: `You have used this email to register an account before! Method: ${user.authMethod}`,
      });
    } else {
      // user already registered with google
      isNew = false;
    }

    const { headers } = await handleTokens(user);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).send({
      isNew,
      userId: user.id,
    });
  } catch (err) {
    console.log("Invalid google token WTF??", err);
    return res
      .status(400)
      .send({ msg: "My backend said you're fucked (GOOGLE LOGIN)" });
  }
});

// facebook login
router.post("/api/auth/facebook", async (req, res) => {
  const { accessToken } = req.body;

  try {
    // check whether the receieved accessToken is valid
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=email,name`
    );

    // if success, response.data will contains the user's info
    // if failed, the error will be catched by the trycatch
    let user = await User.findOne({ email: response.data.email });
    let isNew;
    if (!user) {
      isNew = true;
      user = new User({
        email: response.data.email,
        displayName: response.data.name,
        username: randomUserName(),
        facebookId: response.data.id,
        authMethod: "facebook",
      });
    } else if (user && user.authMethod != "facebook") {
      console.log(
        `You have used this email to register an account before! Method: ${user.authMethod}`
      );
      return res.status(400).send({
        msg: `You have used this email to register an account before! Method: ${user.authMethod}`,
      });
    } else {
      isNew = false;
    }

    const { headers } = await handleTokens(user);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).send({
      isNew,
      userId: user.id,
    });
  } catch (err) {
    console.log("Invalid facebook token WTF??", err);
    return res.status(400).send(err);
  }
});

// tokens validation
router.post("/api/auth/token-validation", async (req, res) => {
  const jwtToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!jwtToken || !refreshToken) {
    return res.status(404).send({ msg: "Missing tokens", success: false });
  }

  try {
    const { newTokens } = await validateTokens(jwtToken, refreshToken);

    if (newTokens) {
      res.setHeader("x-new-token", newTokens.token);
      res.setHeader("x-new-refresh-token", newTokens.refreshToken);
    }

    res.status(200).send({
      msg: "JWT token is still valid. Process to other actions...",
      success: true,
    });
  } catch (error) {
    res.status(401).send({
      msg: error.message,
      success: false,
    });
  }
});

// logout
router.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    const pushToken = req.headers["x-push-token"];
    if (!pushToken) {
      return res.status(400).send({ msg: "Push token is required" });
    }

    await redisClient
      .del(`user:${req.userId}:refreshToken`)
      .catch(console.error);

    // Update the specific device's status to inactive
    const result = await User.findOneAndUpdate(
      {
        _id: req.userId,
        "devices.pushToken": pushToken,
      },
      {
        $set: {
          "devices.$.isActive": false,
          "devices.$.lastActive": new Date(),
          refreshToken: null,
        },
      }
    );

    if (!result) {
      // If no user was found with this device, add it as an inactive device
      await User.findByIdAndUpdate(req.userId, {
        $push: {
          devices: {
            pushToken: pushToken,
            isActive: false,
            lastActive: new Date(),
          },
        },
        $set: { refreshToken: null },
      });
    }

    res.status(200).send({ msg: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Error during logout" });
  }
});

export default router;
