import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    enrollment: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubLink: {
      type: String,
      trim: true,
    },

    liveLink: {
      type: String,
      trim: true,
    },

    projectType: {
      type: String,
      enum: ["individual", "team"],
      default: "individual",
    },

    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },

    semester: {
      type: String,
    },

    mentor: {
      type: String,
    },

    synopsisFile: {
      type: String,
    },

    reportFile: {
      type: String,
    },

    presentationFile: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "Pending Approval",
        "Approved",
        "Rejected",
        "Draft",
      ],
      default: "Pending Approval",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);