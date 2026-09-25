import mongoose from "mongoose";

const footerLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    href: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    openInNewTab: {
      type: Boolean,
      default: false,
    },

    subLinks: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },

        href: {
          type: String,
          required: true,
          trim: true,
        },

        order: {
          type: Number,
          default: 0,
        },

        isActive: {
          type: Boolean,
          default: true,
        },

        openInNewTab: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { _id: true }
);

const footerSchema = new mongoose.Schema(
  {
    brand: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      copyright: {
        type: String,
        default: "",
        trim: true,
      },
    },

    quickLinks: {
      title: {
        type: String,
        default: "Quick Links",
      },

      links: [footerLinkSchema],
    },

    legalLinks: {
      title: {
        type: String,
        default: "Legal",
      },

      links: [footerLinkSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Footer =
  mongoose.models.Footer ||
  mongoose.model("Footer", footerSchema);

export default Footer;