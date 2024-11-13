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
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
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
  bio: {
    type: mongoose.Schema.Types.String,
    default: "Welcome to my world~~",
  },
  bgImage: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  song: {
    imageUri: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    songUri: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    songName: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
  },
  gradientConfig: {
    start: {
      x: {
        type: mongoose.Schema.Types.Number,
        default: 0,
      },
      y: {
        type: mongoose.Schema.Types.Number,
        default: 0.5,
      },
    },
    end: {
      x: {
        type: mongoose.Schema.Types.Number,
        default: 1,
      },
      y: {
        type: mongoose.Schema.Types.Number,
        default: 0.5,
      },
    },
    colors: {
      type: [mongoose.Schema.Types.String],
      default: ["#f300ff", "#00f3ff"],
    },
    sliderValue: {
      type: mongoose.Schema.Types.Number,
      default: 0,
    },
  },
  devices: [
    {
      pushToken: {
        type: mongoose.Schema.Types.String,
        default: null,
      },
      isActive: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      },
      lastActive: {
        type: mongoose.Schema.Types.Date,
        default: null,
      },
    },
  ],
});

export const User = mongoose.model("User", UserSchema);
