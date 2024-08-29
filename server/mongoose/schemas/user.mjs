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
});

export const User = mongoose.model("User", UserSchema);
