import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
  },
  displayName: mongoose.Schema.Types.String,
  googleId: {
    type: mongoose.Schema.Types.String,
  },
  facebookId: {
    type: mongoose.Schema.Types.String,
  },
  authMethod: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  refreshToken: {
    type: mongoose.Schema.Types.String,
  },
  icon: {
    id: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    bgColor: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    customIcon: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
  },
});

export const User = mongoose.model("User", UserSchema);
