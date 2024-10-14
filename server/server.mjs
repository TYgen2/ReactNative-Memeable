import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const connectedDB =
  process.env.NODE_ENV === "development" ? "localhost" : "Atlas";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`Connected to MongoDB ${connectedDB}`))
  .catch((err) => console.log(`Error: `, err));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(morgan("dev"));

app.use(passport.initialize());
app.use(routes);

app.listen(5000, "0.0.0.0", () =>
  console.log(`Server listening to port 5000...`)
);
