import mongoose from "mongoose";

const CommentLikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommentLikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

export const CommentLike = mongoose.model("CommentLike", CommentLikeSchema);
