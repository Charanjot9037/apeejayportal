import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
    },

    className: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    // Password is optional for Google users
    password: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: "student",
    },

    refreshToken: {
      type: String,
      default: null,
    },

    // NEW: Login provider
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    // NEW: Google Account ID
    googleId: {
      type: String,
      default: null,
    },

    // NEW: Google Profile Picture
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);