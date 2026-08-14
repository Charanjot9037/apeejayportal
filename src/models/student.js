import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    // Link Student to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    // =========================
    // ACADEMIC
    // =========================

    department: {
      type: String,
      default: '',
    },

    program: {
      type: String,
      default: '',
    },

    currentSemester: {
      type: String,
      default: '',
    },

    rollNumber: {
      type: String,
      default: '',
    },

    academicBatch: {
      type: String,
      default: '',
    },

    lastYear: {
      type: String,
      default: '',
    },

    specialiZation: {
      type: String,
      default: '',
    },

    // =========================
    // PROFILES
    // =========================
    linkedin: {
      type: String,
      default: '',
    },

    github: {
      type: String,
      default: '',
    },

    portfolio: {
      type: String,
      default: '',
    },

    resume: {
      type: String,
      default: '',
    },
    resumeName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const Student =
  mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
