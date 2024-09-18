import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

FollowSchema.index({ userId: 1, followerId: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", FollowSchema);
