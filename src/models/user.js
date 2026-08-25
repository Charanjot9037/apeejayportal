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

    password: {
      type: String,
      default: null,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "student",
    },

    refreshToken: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
