import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserValidationSchema } from "../validationSchemas.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import {
  comparePassword,
  generateJWT,
  generateRefreshToken,
  hashPassword,
} from "../utils/helpers.mjs";
import "../strategies/jwt.mjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

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

    const signedRefreshToken = generateRefreshToken();

    const newUser = new User({ ...data, refreshToken: signedRefreshToken });

    try {
      const savedUser = await newUser.save();
      const token = generateJWT({ id: savedUser.id });

      res.status(201).send({ token: token, refreshToken: signedRefreshToken });
    } catch (error) {
      console.log("Cannot create new user wtf?", error);
      res.status(400).send(error);
    }
  }
);

// local login
router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate email existence
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "Invalid credentials" });
    }

    // validate password
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid credentials" });
    }

    const token = generateJWT({ id: user.id });
    const signedRefreshToken = generateRefreshToken();

    // update refreshToken in db
    user.refreshToken = signedRefreshToken;
    await user.save();

    res.status(201).send({ token: token, refreshToken: signedRefreshToken });
  } catch (error) {
    res.status(400).send(error);
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

    // get refreshToken
    const signedRefreshToken = generateRefreshToken();

    // check whether the user is exist or not by using googleId
    let user = await User.findOne({ googleId: payload.sub });
    // if not exist yet, create one
    if (!user) {
      user = new User({
        email: payload.email,
        displayName: payload.name,
        googleId: payload.sub,
        authMethod: "google",
        refreshToken: signedRefreshToken,
      });
    } else {
      // if exist, update the refreshToken in db
      user.refreshToken = signedRefreshToken;
    }
    await user.save();

    // return the generated JWT to client
    const token = generateJWT({ id: user.id });

    res.status(201).send({ token: token, refreshToken: signedRefreshToken });
  } catch (err) {
    console.log("Invalid google token WTF??", err);
    res.status(400).send(err);
  }
});

// tokens validation
router.post("/api/auth/token-validation", async (req, res) => {
  const { jwtToken, refreshToken } = req.body;

  // check whether there is a matched refreshToken in db
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).send({ msg: "Invalid refresh token" });
  }

  try {
    // firstly verify the JWT is expired or not
    jwt.verify(jwtToken, process.env.JWT_SECRET);

    // if not expired yet, just return
    res
      .status(200)
      .send({ msg: "JWT token is still valid. Process to other actions..." });
  } catch (jwtError) {
    // when JWT is expired
    console.log(
      "JWT token is expired!! Now proceed to validate refreshToken..."
    );
    try {
      // verify the refreshToken is expired or not
      jwt.verify(refreshToken, process.env.REFRESH_SECRET);

      // if not expired, continue to generate new tokens
      const token = generateJWT({ id: user.id });
      const signedRefreshToken = generateRefreshToken();

      user.refreshToken = signedRefreshToken;
      await user.save();

      console.log("TOKENS generated successfully!!");
      res.status(200).send({ token: token, refreshToken: signedRefreshToken });
    } catch (refreshError) {
      // when both tokens are expired
      res.status(400).send({
        msg: "Both tokens are expired!! Please login agagin.",
      });
    }
  }
});

export default router;
