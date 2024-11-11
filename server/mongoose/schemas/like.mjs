import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createDate: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

LikeSchema.index({ userId: 1, postId: 1, createDate: -1 }, { unique: true });
LikeSchema.index({ postId: 1 });

export const Like = mongoose.model("Like", LikeSchema);
