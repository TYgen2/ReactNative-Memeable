import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["like_post", "like_comment", "comment", "follow"],
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    // Only required for post/comment related notifications
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    // Only required for comment related notifications
  },
  read: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  createDate: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30, // 30 days
  },
});

NotificationSchema.index({ recipientId: 1, createDate: -1 });

export const Notification = mongoose.model("Notification", NotificationSchema);
