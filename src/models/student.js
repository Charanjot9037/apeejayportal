import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One student profile per user
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      default: "",
    },

   category: {
  type: String,
  enum: ["engineering", "management","it"],
  required: true,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);