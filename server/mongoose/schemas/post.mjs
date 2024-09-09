import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  imageUri: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  width: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  height: {
    type: mongoose.Schema.Types.Number,
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
    default: Date.now,
    index: true,
  },
  likes: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
});

PostSchema.index({ createDate: -1 });

export const Post = mongoose.model("Post", PostSchema);
