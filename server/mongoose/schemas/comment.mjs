import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
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
  content: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  likes: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  createDate: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

CommentSchema.index({ postId: 1, createDate: -1 });
CommentSchema.index({ parentCommentId: 1 });

export const Comment = mongoose.model("Comment", CommentSchema);
