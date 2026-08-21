import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import cloudinary from "@/lib/cloudinary";
import Mentor from "@/models/mentor";
import User from "@/models/user";
/* =========================================================
   DELETE CLOUDINARY FILE
========================================================= */

async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("CLOUDINARY_DELETE_ERROR:", error);
  }
}

/* =========================================================
   PUT - UPDATE PROJECT
========================================================= */
export async function PUT(request, context) {
  try {
    await connectDB();

    /* =====================================================
       GET PROJECT ID
    ===================================================== */

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       FIND PROJECT
    ===================================================== */

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      );
    }

    /* =====================================================
       READ JSON
    ===================================================== */

    let projectData;

    try {
      projectData = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON project data.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       PROJECT DATA
    ===================================================== */

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

      projectImages,
      presentationFile,
      synopsisFile,
      reportFile,
    } = projectData;

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!projectName || !description || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project name, description and student ID are required.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       STUDENT OWNERSHIP CHECK
    ===================================================== */

    if (project.student.toString() !== studentId.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to update this project.",
        },
        { status: 403 },
      );
    }

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
       CLOUDINARY FILE HELPER
    ===================================================== */

    const isDifferentFile = (oldFile, newFile) => {
      if (!oldFile?.publicId) {
        return false;
      }

      if (!newFile?.publicId) {
        return true;
      }

      return oldFile.publicId !== newFile.publicId;
    };

    /* =====================================================
       PROJECT IMAGES
    ===================================================== */

    const oldImages = project.projectImages || [];

    const newImages = Array.isArray(projectImages) ? projectImages : [];

    const newImageIds = new Set(
      newImages
        .map((image) => (typeof image === "string" ? image : image?.publicId))
        .filter(Boolean),
    );

    /* =====================================================
       DELETE REMOVED PROJECT IMAGES
    ===================================================== */

    for (const oldImage of oldImages) {
      if (oldImage?.publicId && !newImageIds.has(oldImage.publicId)) {
        await deleteFromCloudinary(
          oldImage.publicId,
          oldImage.resourceType || "image",
        );
      }
    }

    /* =====================================================
       FINAL PROJECT IMAGES
    ===================================================== */

    const finalProjectImages = newImages;

    /* =====================================================
       PRESENTATION
    ===================================================== */

    const oldPresentation = project.presentationFile;

    const newPresentation = presentationFile || null;

    if (isDifferentFile(oldPresentation, newPresentation)) {
      await deleteFromCloudinary(
        oldPresentation.publicId,
        oldPresentation.resourceType || "raw",
      );
    }

    /* =====================================================
       SYNOPSIS
    ===================================================== */

    const oldSynopsis = project.synopsisFile;

    const newSynopsis = synopsisFile || null;

    if (isDifferentFile(oldSynopsis, newSynopsis)) {
      await deleteFromCloudinary(
        oldSynopsis.publicId,
        oldSynopsis.resourceType || "raw",
      );
    }

    /* =====================================================
       REPORT
    ===================================================== */

    const oldReport = project.reportFile;

    const newReport = reportFile || null;

    if (isDifferentFile(oldReport, newReport)) {
      await deleteFromCloudinary(
        oldReport.publicId,
        oldReport.resourceType || "raw",
      );
    }

    /* =====================================================
       UPDATE PROJECT
    ===================================================== */

    project.title = projectName;

    project.subtitle =
      projectType === "team"
        ? `Team Project • ${teamMembers?.length || 0} Members`
        : "Individual Project";

    project.description = description;

    project.techStack = techStack || [];

    project.githubLink = githubLink || "";

    project.liveLink = liveDemoLink || "";

    project.projectType = projectType;

    project.teamMembers =
      projectType === "team" && teamMembers ? teamMembers : null;

    project.semester = semester || "";

    project.mentor = mentor || null;

    project.projectImages = finalProjectImages;

    project.presentationFile = newPresentation;

    project.synopsisFile = newSynopsis;

    project.reportFile = newReport;

    /* =====================================================
       RESET STATUS
    ===================================================== */

    project.status = "Pending Approval";

    await project.save();

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully.",
        project,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PROJECT_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update project.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required.",
        },
        { status: 400 },
      );
    }

    const project = await Project.findById(id)
      .populate({
        path: "mentor",
        select: "userId designation",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "teamMembers",
        select: "name email",
      });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        project,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PROJECT_SINGLE_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch project.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   DELETE PROJECT
========================================================= */

export async function DELETE(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       FIND PROJECT
    ===================================================== */

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      );
    }

    /* =====================================================
       DELETE PROJECT IMAGES
    ===================================================== */

    if (project.projectImages?.length) {
      for (const image of project.projectImages) {
        if (image?.publicId) {
          await deleteFromCloudinary(
            image.publicId,
            image.resourceType || "image",
          );
        }
      }
    }

    /* =====================================================
       DELETE PRESENTATION
    ===================================================== */

    if (project.presentationFile?.publicId) {
      await deleteFromCloudinary(
        project.presentationFile.publicId,
        project.presentationFile.resourceType || "raw",
      );
    }

    /* =====================================================
       DELETE SYNOPSIS
    ===================================================== */

    if (project.synopsisFile?.publicId) {
      await deleteFromCloudinary(
        project.synopsisFile.publicId,
        project.synopsisFile.resourceType || "raw",
      );
    }

    /* =====================================================
       DELETE REPORT
    ===================================================== */

    if (project.reportFile?.publicId) {
      await deleteFromCloudinary(
        project.reportFile.publicId,
        project.reportFile.resourceType || "raw",
      );
    }

    /* =====================================================
       DELETE PROJECT FROM DATABASE
    ===================================================== */

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PROJECT_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete project.",
      },
      { status: 500 },
    );
  }
}