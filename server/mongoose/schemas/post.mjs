import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageKey: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
  },
  description: {
    type: mongoose.Schema.Types.String,
  },
  hashtag: {
    type: mongoose.Schema.Types.String,
  },
  createDate: {
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  },
});

export const Post = mongoose.model("Post", PostSchema);
