import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { authenticateUser } from "@/lib/authentication";

/* =========================================================
   CLOUDINARY UPLOAD HELPER
========================================================= */

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
}

/* =========================================================
   FILE -> BUFFER
========================================================= */

async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/* =========================================================
   CHECK FILE
========================================================= */

function isValidFile(file) {
  return (
    file &&
    typeof file === "object" &&
    typeof file.arrayBuffer === "function" &&
    file.size > 0
  );
}

/* =========================================================
   SAFE FILE NAME
========================================================= */

function getSafeFileName(originalName) {
  if (!originalName) {
    return `file_${crypto.randomUUID()}`;
  }

  const extensionIndex = originalName.lastIndexOf(".");

  const hasExtension = extensionIndex > 0;

  const extension = hasExtension
    ? originalName.substring(extensionIndex).toLowerCase()
    : "";

  const nameWithoutExtension = hasExtension
    ? originalName.substring(0, extensionIndex)
    : originalName;

  const safeName = nameWithoutExtension
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  const finalName = safeName || "file";

  return `${finalName}_${crypto.randomUUID().slice(0, 8)}${extension}`;
}

/* =========================================================
   POST - CREATE PROJECT
========================================================= */

export async function POST(request) {
  try {
    await connectDB();

    /* =====================================================
       FORM DATA
    ===================================================== */

    const formData = await request.formData();

    /* =====================================================
       PROJECT DATA
    ===================================================== */

    const projectDataRaw = formData.get("projectData");

    if (!projectDataRaw) {
      return NextResponse.json(
        {
          success: false,
          message: "Project data is required.",
        },
        { status: 400 },
      );
    }

    let projectData;

    try {
      projectData = JSON.parse(projectDataRaw);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project data.",
        },
        { status: 400 },
      );
    }

    const {
      projectName,
      description,
      techStack,
      githubLink,
      liveDemoLink,
      projectType,
      teamMembers,
      semester,
      mentor,
      studentId,
    } = projectData;

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!projectName || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Project name, description  are required.",
        },
        { status: 400 },
      );
    }
    // Authenticate user
    const auth = await authenticateUser();
    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }
    const user = auth.user;
    const userId = user._id;
    /* =====================================================
       TEAM VALIDATION
    ===================================================== */

    if (projectType === "team" && (!teamMembers || teamMembers.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Team project must have at least one team member.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       CLOUDINARY FOLDER
    ===================================================== */

    const baseFolder = `student-projects/${studentId}`;

    /* =====================================================
       PROJECT IMAGES
    ===================================================== */

    const imageFiles = formData.getAll("projectImages");

    const projectImages = [];

    for (const file of imageFiles) {
      if (!isValidFile(file)) {
        continue;
      }

      const buffer = await fileToBuffer(file);

      const safeFileName = getSafeFileName(file.name);

      /*
       * For images:
       * Cloudinary normally adds the image
       * extension to the delivery URL.
       *
       * We therefore remove the extension
       * from public_id.
       */

      const imagePublicId = safeFileName.replace(/\.[^/.]+$/, "");

      const result = await uploadToCloudinary(buffer, {
        folder: `${baseFolder}/images`,

        resource_type: "image",

        public_id: imagePublicId,

        overwrite: false,
      });

      projectImages.push({
        url: result.secure_url,

        publicId: result.public_id,

        originalName: file.name,

        resourceType: result.resource_type,
      });
    }

    /* =====================================================
       HELPER FOR RAW DOCUMENTS
    ===================================================== */

    async function uploadDocument(file) {
      if (!isValidFile(file)) {
        return null;
      }

      const buffer = await fileToBuffer(file);

      /*
       * IMPORTANT:
       *
       * For raw files the extension MUST
       * be included in public_id.
       */

      const safeFileName = getSafeFileName(file.name);

      const result = await uploadToCloudinary(buffer, {
        folder: `${baseFolder}/documents`,

        resource_type: "raw",

        public_id: safeFileName,

        overwrite: false,
      });

      return {
        url: result.secure_url,

        publicId: result.public_id,

        originalName: file.name,

        resourceType: result.resource_type,
      };
    }

    /* =====================================================
       PRESENTATION
    ===================================================== */

    const presentationFile = formData.get("presentationFile");

    const presentationData = await uploadDocument(presentationFile);

    /* =====================================================
       SYNOPSIS
    ===================================================== */

    const synopsisFile = formData.get("synopsisFile");

    const synopsisData = await uploadDocument(synopsisFile);

    /* =====================================================
       FINAL REPORT
    ===================================================== */

    const reportFile = formData.get("reportFile");

    const reportData = await uploadDocument(reportFile);

    /* =====================================================
       CREATE PROJECT
    ===================================================== */

    const project = await Project.create({
      title: projectName,

      subtitle:
        projectType === "team"
          ? `Team Project • ${teamMembers?.length || 0} Members`
          : "Individual Project",

      description,

      techStack: techStack || [],

      githubLink,

      liveLink: liveDemoLink,

      projectType,

      teamMembers: projectType === "team" ? teamMembers || [] : [],

      semester,

      mentor,

      projectImages,

      synopsisFile: synopsisData,

      reportFile: reportData,

      presentationFile: presentationData,

      status: "Pending Approval",

      student: userId,
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message: "Project submitted for approval.",

        project,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("PROJECT_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,

        message: error.message || "Failed to create project.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   GET
========================================================= */

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID is required.",
        },
        { status: 400 },
      );
    }

    const projects = await Project.find({
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("PROJECT_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects.",
      },
      { status: 500 },
    );
  }
}
