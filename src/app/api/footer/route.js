
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Footer from "@/models/footerLinkModel";

import { authenticateUser } from "@/lib/authentication";

/* =========================================================
   DEFAULT FOOTER
========================================================= */

const DEFAULT_FOOTER = {
  brand: {
    name: "Apeejay Institute of Management & Engineering",

    description:
      "Dedicated to excellence in education, research, and holistic student development.",

    copyright:
      "Apeejay Education © 2026. All Rights Reserved.",
  },

  quickLinks: {
    title: "Quick Links",

    links: [
      {
        label: "LMS",
        href: "/lms",
        order: 1,
        isActive: true,
        openInNewTab: false,
        subLinks: [],
      },

      {
        label: "OPAC",
        href: "/opac",
        order: 2,
        isActive: true,
        openInNewTab: false,
        subLinks: [],
      },

      {
        label: "IQAC",
        href: "/iqac",
        order: 3,
        isActive: true,
        openInNewTab: false,
        subLinks: [],
      },
    ],
  },

  legalLinks: {
    title: "Legal",

    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
        order: 1,
        isActive: true,
        openInNewTab: false,
      },

      {
        label: "Terms of Service",
        href: "/terms-of-service",
        order: 2,
        isActive: true,
        openInNewTab: false,
      },

      {
        label: "Post Your Grievance",
        href: "/post-your-grievance",
        order: 3,
        isActive: true,
        openInNewTab: false,
      },
    ],
  },
};



const cleanMongoId = (item) => {
  if (!item || typeof item !== "object") {
    return item;
  }

  const cleaned = { ...item };

 

  if (
    cleaned._id &&
    !mongoose.Types.ObjectId.isValid(cleaned._id)
  ) {
    delete cleaned._id;
  }

  return cleaned;
};



const cleanQuickLinks = (quickLinks) => {
  if (!quickLinks) {
    return DEFAULT_FOOTER.quickLinks;
  }

  return {
    title: quickLinks.title || "Quick Links",

    links: (quickLinks.links || []).map((link, index) => {
      const cleanedLink = cleanMongoId(link);

      const cleanedSubLinks = (
        cleanedLink.subLinks || []
      ).map((subLink, subIndex) => {
        const cleanedSubLink = cleanMongoId(subLink);

        return {
          ...cleanedSubLink,

          label: cleanedSubLink.label || "",

          href: cleanedSubLink.href || "",

          order:
            cleanedSubLink.order ??
            subIndex + 1,

          isActive:
            cleanedSubLink.isActive ??
            true,

          openInNewTab:
            cleanedSubLink.openInNewTab ??
            false,
        };
      });

      return {
        ...cleanedLink,

        label: cleanedLink.label || "",

        href: cleanedLink.href || "",

        order:
          cleanedLink.order ??
          index + 1,

        isActive:
          cleanedLink.isActive ??
          true,

        openInNewTab:
          cleanedLink.openInNewTab ??
          false,

        subLinks: cleanedSubLinks,
      };
    }),
  };
};


const cleanLegalLinks = (legalLinks) => {
  if (!legalLinks) {
    return DEFAULT_FOOTER.legalLinks;
  }

  return {
    title: legalLinks.title || "Legal",

    links: (legalLinks.links || []).map(
      (link, index) => {
        const cleanedLink = cleanMongoId(link);

        return {
          ...cleanedLink,

          label: cleanedLink.label || "",

          href: cleanedLink.href || "",

          order:
            cleanedLink.order ??
            index + 1,

          isActive:
            cleanedLink.isActive ??
            true,

          openInNewTab:
            cleanedLink.openInNewTab ??
            false,
        };
      }
    ),
  };
};



export async function GET() {
  try {
    await connectDB();

    

    let footer = await Footer.findOne().lean();

    

    if (!footer) {
      const createdFooter =
        await Footer.create(DEFAULT_FOOTER);

      footer = createdFooter.toObject();
    }

    return NextResponse.json({
      success: true,
      footer,
    });
  } catch (error) {
    console.error(
      "Footer GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch footer",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PUT(req) {
  try {
    await connectDB();



    const auth = await authenticateUser();

    if (
      !auth?.success ||
      !auth?.user?._id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth?.message ||
            "Unauthorized",
        },
        {
          status:
            auth?.status ||
            401,
        }
      );
    }



    const user = await User.findById(
      auth.user._id
    )
      .select("name email role")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }


    if (
      user.role?.trim().toLowerCase() !==
      "mentor"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        }
      );
    }



    const mentorProfile =
      await Mentor.findOne({
        userId: user._id,
      })
        .select("designation")
        .lean();

    if (!mentorProfile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mentor profile not found",
        },
        {
          status: 404,
        }
      );
    }


    const designation =
      mentorProfile.designation
        ?.trim()
        .toLowerCase();

    if (designation !== "engineer") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Access denied. Only Engineer can manage the footer.",
        },
        {
          status: 403,
        }
      );
    }


    const body = await req.json();


    const cleanedFooter = {
      brand: {
        name:
          body.brand?.name ||
          DEFAULT_FOOTER.brand.name,

        description:
          body.brand?.description ||
          DEFAULT_FOOTER.brand.description,

        copyright:
          body.brand?.copyright ||
          DEFAULT_FOOTER.brand.copyright,
      },

      quickLinks: cleanQuickLinks(
        body.quickLinks
      ),

      legalLinks: cleanLegalLinks(
        body.legalLinks
      ),
    };


    const footer =
      await Footer.findOneAndUpdate(
        {},

        {
          brand:
            cleanedFooter.brand,

          quickLinks:
            cleanedFooter.quickLinks,

          legalLinks:
            cleanedFooter.legalLinks,
        },

        {
          returnDocument: "after",

          upsert: true,

          runValidators: true,

          setDefaultsOnInsert: true,
        }
      );


    return NextResponse.json({
      success: true,

      message:
        "Footer updated successfully",

      footer,
    });
  } catch (error) {
    console.error(
      "Footer PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to update footer",
      },
      {
        status: 500,
      }
    );
  }
}