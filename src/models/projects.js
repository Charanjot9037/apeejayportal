import mongoose from "mongoose";

/* =========================================================
   TEAM MEMBER
========================================================= */

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
  {
    _id: false,
  },
);

/* =========================================================
   CLOUDINARY FILE
========================================================= */

const CloudinaryFileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
    },

    publicId: {
      type: String,
      trim: true,
    },

    originalName: {
      type: String,
      trim: true,
    },

    resourceType: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   PROJECT
========================================================= */

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    semester: {
      type: String,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },

    /* =====================================================
       PROJECT IMAGES
    ===================================================== */

    projectImages: {
      type: [CloudinaryFileSchema],
      default: [],
    },

    /* =====================================================
       DOCUMENTS
    ===================================================== */

    synopsisFile: {
      type: CloudinaryFileSchema,
      default: null,
    },

    reportFile: {
      type: CloudinaryFileSchema,
      default: null,
    },

    presentationFile: {
      type: CloudinaryFileSchema,
      default: null,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    status: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected", "Draft"],
      default: "Pending Approval",
    },

    /* =====================================================
       STUDENT
    ===================================================== */

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
