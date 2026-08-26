import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Project from "@/models/projects";
import cloudinary from "@/lib/cloudinary";
import { authenticateUser } from "@/lib/authentication";

import Mentor from "@/models/mentor";
import User from "@/models/user";
import Student from "@/models/student";

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
   HELPER - IS FILE DIFFERENT
========================================================= */

function isDifferentFile(oldFile, newFile) {
  if (!oldFile?.publicId) {
    return false;
  }

  if (!newFile?.publicId) {
    return true;
  }

  return oldFile.publicId !== newFile.publicId;
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
       AUTHENTICATION
    ===================================================== */

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
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
       ACCESS CONTROL
       OWNER STUDENT, ASSIGNED MENTOR, OR TEAM MEMBER
    ===================================================== */

    const isOwnerStudent =
      project.student.toString() === auth.user._id.toString();

    let isAssignedMentor = false;

    if (project.mentor) {
      const mentorProfile = await Mentor.findOne({
        userId: auth.user._id,
      });

      isAssignedMentor =
        mentorProfile &&
        mentorProfile._id.toString() === project.mentor.toString();
    }

    const currentStudentProfile = await Student.findOne({
      userId: auth.user._id,
    });

    const isTeamMember =
      currentStudentProfile &&
      project.teamMembers &&
      project.teamMembers.toString() === currentStudentProfile._id.toString();

    if (!isOwnerStudent && !isAssignedMentor && !isTeamMember) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to update this project.",
        },
        { status: 403 },
      );
    }

    /* =====================================================
       PARSE BODY
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

    const {
      projectName,
      description,
      techStack,
      githubLink,
      liveDemoLink,
      projectType,
      teamMembers,
      semester,
      projectImages,
      presentationFile,
      synopsisFile,
      reportFile,
      presentationFile2,
      synopsisFile2,
      reportFile2,
    } = projectData;

    /* =====================================================
       FIELD-LEVEL PERMISSIONS
       - Only owner/mentor can edit project details & their files
       - Only team member/mentor can edit team member's files
       - Team members editing files ONLY should still be allowed
         through even though they don't own project metadata
    ===================================================== */

    const canEditProjectDetails = isOwnerStudent || isAssignedMentor;
    const canEditOwnerFiles = isOwnerStudent || isAssignedMentor;
    const canEditTeamMemberFiles = isTeamMember || isAssignedMentor;

    /* =====================================================
       BASIC VALIDATION (only required when editing details)
    ===================================================== */

    const studentId = auth.user._id;

    if (canEditProjectDetails) {
      if (!projectName || !description) {
        return NextResponse.json(
          {
            success: false,
            message: "Project name and description are required.",
          },
          { status: 400 },
        );
      }

      if (
        projectType === "team" &&
        (!teamMembers || teamMembers.length === 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Team project must have at least one team member.",
          },
          { status: 400 },
        );
      }
    }

    /* =====================================================
       OWNER FILES (presentation / synopsis / report)
    ===================================================== */

    if (canEditOwnerFiles) {
      const newPresentation = presentationFile || null;
      if (isDifferentFile(project.presentationFile, newPresentation)) {
        await deleteFromCloudinary(
          project.presentationFile.publicId,
          project.presentationFile.resourceType || "raw",
        );
      }
      project.presentationFile = newPresentation;

      const newSynopsis = synopsisFile || null;
      if (isDifferentFile(project.synopsisFile, newSynopsis)) {
        await deleteFromCloudinary(
          project.synopsisFile.publicId,
          project.synopsisFile.resourceType || "raw",
        );
      }
      project.synopsisFile = newSynopsis;

      const newReport = reportFile || null;
      if (isDifferentFile(project.reportFile, newReport)) {
        await deleteFromCloudinary(
          project.reportFile.publicId,
          project.reportFile.resourceType || "raw",
        );
      }
      project.reportFile = newReport;

      /* PROJECT IMAGES */
      const oldImages = project.projectImages || [];
      const newImages = Array.isArray(projectImages) ? projectImages : [];

      const newImageIds = new Set(
        newImages
          .map((image) =>
            typeof image === "string" ? image : image?.publicId,
          )
          .filter(Boolean),
      );

      for (const oldImage of oldImages) {
        if (oldImage?.publicId && !newImageIds.has(oldImage.publicId)) {
          await deleteFromCloudinary(
            oldImage.publicId,
            oldImage.resourceType || "image",
          );
        }
      }

      project.projectImages = newImages;
    }

    /* =====================================================
       TEAM MEMBER FILES (presentation2 / synopsis2 / report2)
    ===================================================== */

    if (canEditTeamMemberFiles) {
      const newPresentation2 = presentationFile2 || null;
      if (isDifferentFile(project.presentationFile2, newPresentation2)) {
        await deleteFromCloudinary(
          project.presentationFile2.publicId,
          project.presentationFile2.resourceType || "raw",
        );
      }
      project.presentationFile2 = newPresentation2;

      const newSynopsis2 = synopsisFile2 || null;
      if (isDifferentFile(project.synopsisFile2, newSynopsis2)) {
        await deleteFromCloudinary(
          project.synopsisFile2.publicId,
          project.synopsisFile2.resourceType || "raw",
        );
      }
      project.synopsisFile2 = newSynopsis2;

      const newReport2 = reportFile2 || null;
      if (isDifferentFile(project.reportFile2, newReport2)) {
        await deleteFromCloudinary(
          project.reportFile2.publicId,
          project.reportFile2.resourceType || "raw",
        );
      }
      project.reportFile2 = newReport2;
    }

    /* =====================================================
       PROJECT DETAILS (owner/mentor only)
    ===================================================== */

    if (canEditProjectDetails) {
      const mentor1 = await User.findById(studentId).select("mentorId");

      let mentor2Id = project.mentor2; // keep existing by default

      if (projectType === "team" && teamMembers) {
        const teamMemberDoc = await Student.findById(teamMembers).populate({
          path: "userId",
          select: "_id mentorId",
        });
        mentor2Id = teamMemberDoc?.userId?.mentorId || null;
      } else if (projectType !== "team") {
        mentor2Id = null;
      }

      project.title = projectName;

      project.subtitle =
        projectType === "team" ? "Team Project • 1 Member" : "Individual Project";

      project.description = description;

      project.techStack = techStack || [];

      project.githubLink = githubLink || "";

      project.liveLink = liveDemoLink || "";

      project.projectType = projectType;

      project.teamMembers =
        projectType === "team" && teamMembers ? teamMembers : null;

      project.semester = semester || "";

      project.mentor = mentor1.mentorId || null;

      project.mentor2 = mentor2Id;

      /* RESET STATUS only when project details change */
      project.status = "Pending Approval";
    }

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

/* =========================================================
   GET SINGLE PROJECT
========================================================= */

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

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }

    const project = await Project.findById(id)
      .populate({
        path: "mentor",
        select: "name",
      })
      .populate({
        path: "mentor2",
        select: "name",
      })
      .populate({
        path: "teamMembers",
        select: "fullName profileImage",
        populate: {
          path: "userId",
          select: "name email",
        },
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

    /* =====================================================
       DETERMINE VIEWER ROLE
    ===================================================== */

    const currentStudentProfile = await Student.findOne({
      userId: auth.user._id,
    });

    let viewerRole = "viewer";

    if (project.student.toString() === auth.user._id.toString()) {
      viewerRole = "owner";
    } else if (
      currentStudentProfile &&
      project.teamMembers &&
      project.teamMembers._id?.toString() ===
        currentStudentProfile._id.toString()
    ) {
      viewerRole = "teamMember";
    } else if (project.mentor) {
      const mentorProfile = await Mentor.findOne({ userId: auth.user._id });
      if (
        mentorProfile &&
        mentorProfile._id.toString() === project.mentor._id?.toString()
      ) {
        viewerRole = "mentor";
      }
    }

    return NextResponse.json(
      {
        success: true,
        project,
        viewerRole,
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
       AUTHENTICATION + OWNER-ONLY CHECK
    ===================================================== */

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }

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

    if (project.student.toString() !== auth.user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the project owner can delete this project.",
        },
        { status: 403 },
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
       DELETE OWNER DOCUMENTS
    ===================================================== */

    if (project.presentationFile?.publicId) {
      await deleteFromCloudinary(
        project.presentationFile.publicId,
        project.presentationFile.resourceType || "raw",
      );
    }

    if (project.synopsisFile?.publicId) {
      await deleteFromCloudinary(
        project.synopsisFile.publicId,
        project.synopsisFile.resourceType || "raw",
      );
    }

    if (project.reportFile?.publicId) {
      await deleteFromCloudinary(
        project.reportFile.publicId,
        project.reportFile.resourceType || "raw",
      );
    }

    /* =====================================================
       DELETE TEAM MEMBER DOCUMENTS
    ===================================================== */

    if (project.presentationFile2?.publicId) {
      await deleteFromCloudinary(
        project.presentationFile2.publicId,
        project.presentationFile2.resourceType || "raw",
      );
    }

    if (project.synopsisFile2?.publicId) {
      await deleteFromCloudinary(
        project.synopsisFile2.publicId,
        project.synopsisFile2.resourceType || "raw",
      );
    }

    if (project.reportFile2?.publicId) {
      await deleteFromCloudinary(
        project.reportFile2.publicId,
        project.reportFile2.resourceType || "raw",
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