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
      required: function () {
        return this.role === "student";
      },
    },
    role: {
      type: String,
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
