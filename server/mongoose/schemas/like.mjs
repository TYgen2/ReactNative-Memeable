import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  },
  createDate: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

export const Like = mongoose.model("Like", LikeSchema);
