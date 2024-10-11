import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import serverless from "serverless-http";
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error: `, err));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(morgan("dev"));

app.use(passport.initialize());
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}...`));

// export const handler = serverless(app);
