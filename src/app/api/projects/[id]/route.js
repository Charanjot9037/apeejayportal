import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import cloudinary from "@/lib/cloudinary";

/* =========================================================
   CLOUDINARY UPLOAD HELPER
========================================================= */

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
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
   DELETE CLOUDINARY FILE
========================================================= */

async function deleteFromCloudinary(
  publicId,
  resourceType = "image"
) {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );

    console.log(
      "Deleted from Cloudinary:",
      publicId
    );
  } catch (error) {
    console.error(
      "CLOUDINARY_DELETE_ERROR:",
      error
    );
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
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FIND PROJECT
    ===================================================== */

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       READ FORM DATA
    ===================================================== */

    const formData =
      await request.formData();

    const projectDataRaw =
      formData.get("projectData");

    if (!projectDataRaw) {
      return NextResponse.json(
        {
          success: false,
          message: "Project data is required.",
        },
        {
          status: 400,
        }
      );
    }

    let projectData;

    try {
      projectData =
        JSON.parse(projectDataRaw);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project data.",
        },
        {
          status: 400,
        }
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

      /*
       * IDs of existing Cloudinary images
       * that the user wants to KEEP.
       */
      existingProjectImages,
    } = projectData;

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (
      !projectName ||
      !description ||
      !studentId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project name, description and student ID are required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       STUDENT OWNERSHIP CHECK
    ===================================================== */

    if (
      project.student.toString() !==
      studentId.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to update this project.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       TEAM VALIDATION
    ===================================================== */

    if (
      projectType === "team" &&
      (!teamMembers ||
        teamMembers.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Team project must have at least one team member.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CLOUDINARY FOLDER
    ===================================================== */

    const baseFolder =
      `student-projects/${studentId}`;

    /* =====================================================
       EXISTING PROJECT IMAGES
    ===================================================== */

    let keepImages = [];

    if (
      Array.isArray(
        existingProjectImages
      )
    ) {
      keepImages =
        existingProjectImages;
    }

    /*
     * If no existingProjectImages were sent,
     * don't accidentally delete all existing images.
     *
     * This makes the route safer.
     */
    const keepImageIds = new Set(
      keepImages
        .map((image) => {
          if (
            typeof image === "string"
          ) {
            return image;
          }

          return image?.publicId;
        })
        .filter(Boolean)
    );

    /* =====================================================
       DELETE REMOVED PROJECT IMAGES
    ===================================================== */

    const oldImages =
      project.projectImages || [];

    for (const oldImage of oldImages) {
      if (
        oldImage.publicId &&
        !keepImageIds.has(
          oldImage.publicId
        )
      ) {
        await deleteFromCloudinary(
          oldImage.publicId,
          oldImage.resourceType ||
            "image"
        );
      }
    }

    /* =====================================================
       UPLOAD NEW PROJECT IMAGES
    ===================================================== */

    const newImageFiles =
      formData.getAll(
        "projectImages"
      );

    const uploadedImages = [];

    for (const file of newImageFiles) {
      if (!isValidFile(file)) {
        continue;
      }

      const buffer =
        await fileToBuffer(file);

      const result =
        await uploadToCloudinary(
          buffer,
          {
            folder:
              `${baseFolder}/images`,

            resource_type: "image",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          }
        );

      uploadedImages.push({
        url: result.secure_url,

        publicId:
          result.public_id,

        originalName:
          file.name,

        resourceType:
          result.resource_type,
      });
    }

    /* =====================================================
       KEEP EXISTING IMAGES
    ===================================================== */

    const existingImagesToKeep =
      oldImages.filter(
        (image) =>
          image.publicId &&
          keepImageIds.has(
            image.publicId
          )
      );

    const finalProjectImages = [
      ...existingImagesToKeep,
      ...uploadedImages,
    ];

    /* =====================================================
       SYNOPSIS
    ===================================================== */

    let synopsisData =
      project.synopsisFile;

    const newSynopsis =
      formData.get(
        "synopsisFile"
      );

    if (isValidFile(newSynopsis)) {
      /*
       * Delete old synopsis
       */

      if (
        project.synopsisFile
          ?.publicId
      ) {
        await deleteFromCloudinary(
          project.synopsisFile
            .publicId,
          project.synopsisFile
            .resourceType || "raw"
        );
      }

      /*
       * Upload new synopsis
       */

      const buffer =
        await fileToBuffer(
          newSynopsis
        );

      const result =
        await uploadToCloudinary(
          buffer,
          {
            folder:
              `${baseFolder}/documents`,

            resource_type: "raw",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          }
        );

      synopsisData = {
        url: result.secure_url,

        publicId:
          result.public_id,

        originalName:
          newSynopsis.name,

        resourceType:
          result.resource_type,
      };
    }

    /* =====================================================
       REPORT
    ===================================================== */

    let reportData =
      project.reportFile;

    const newReport =
      formData.get(
        "reportFile"
      );

    if (isValidFile(newReport)) {
      /*
       * Delete old report
       */

      if (
        project.reportFile
          ?.publicId
      ) {
        await deleteFromCloudinary(
          project.reportFile
            .publicId,
          project.reportFile
            .resourceType || "raw"
        );
      }

      /*
       * Upload new report
       */

      const buffer =
        await fileToBuffer(
          newReport
        );

      const result =
        await uploadToCloudinary(
          buffer,
          {
            folder:
              `${baseFolder}/documents`,

            resource_type: "raw",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          }
        );

      reportData = {
        url: result.secure_url,

        publicId:
          result.public_id,

        originalName:
          newReport.name,

        resourceType:
          result.resource_type,
      };
    }

    /* =====================================================
       PRESENTATION
    ===================================================== */

    let presentationData =
      project.presentationFile;

    const newPresentation =
      formData.get(
        "presentationFile"
      );

    if (
      isValidFile(
        newPresentation
      )
    ) {
      /*
       * Delete old presentation
       */

      if (
        project.presentationFile
          ?.publicId
      ) {
        await deleteFromCloudinary(
          project.presentationFile
            .publicId,
          project.presentationFile
            .resourceType || "raw"
        );
      }

      /*
       * Upload new presentation
       */

      const buffer =
        await fileToBuffer(
          newPresentation
        );

      const result =
        await uploadToCloudinary(
          buffer,
          {
            folder:
              `${baseFolder}/documents`,

            resource_type: "raw",

            use_filename: true,

            unique_filename: true,

            overwrite: false,
          }
        );

      presentationData = {
        url: result.secure_url,

        publicId:
          result.public_id,

        originalName:
          newPresentation.name,

        resourceType:
          result.resource_type,
      };
    }

    /* =====================================================
       UPDATE PROJECT
    ===================================================== */

    project.title =
      projectName;

    project.subtitle =
      projectType === "team"
        ? `Team Project • ${
            teamMembers?.length || 0
          } Members`
        : "Individual Project";

    project.description =
      description;

    project.techStack =
      techStack || [];

    project.githubLink =
      githubLink || "";

    project.liveLink =
      liveDemoLink || "";

    project.projectType =
      projectType;

    project.teamMembers =
      projectType === "team"
        ? teamMembers || []
        : [];

    project.semester =
      semester || "";

    project.mentor =
      mentor || "";

    project.projectImages =
      finalProjectImages;

    project.synopsisFile =
      synopsisData;

    project.reportFile =
      reportData;

    project.presentationFile =
      presentationData;

    /*
     * Keep project status as Pending Approval
     * after an update.
     */

    project.status =
      "Pending Approval";

    await project.save();

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "Project updated successfully.",

        project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PROJECT_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Failed to update project.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   GET SINGLE PROJECT
========================================================= */

export async function GET(
  request,
  context
) {
  try {
    await connectDB();

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "PROJECT_SINGLE_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch project.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE PROJECT
========================================================= */

export async function DELETE(
  request,
  context
) {
  try {
    await connectDB();

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       DELETE PROJECT IMAGES
    ===================================================== */

    for (const image of
      project.projectImages || []) {
      if (image.publicId) {
        await deleteFromCloudinary(
          image.publicId,
          image.resourceType ||
            "image"
        );
      }
    }

    /* =====================================================
       DELETE SYNOPSIS
    ===================================================== */

    if (
      project.synopsisFile
        ?.publicId
    ) {
      await deleteFromCloudinary(
        project.synopsisFile
          .publicId,
        project.synopsisFile
          .resourceType || "raw"
      );
    }

    /* =====================================================
       DELETE REPORT
    ===================================================== */

    if (
      project.reportFile
        ?.publicId
    ) {
      await deleteFromCloudinary(
        project.reportFile
          .publicId,
        project.reportFile
          .resourceType || "raw"
      );
    }

    /* =====================================================
       DELETE PRESENTATION
    ===================================================== */

    if (
      project.presentationFile
        ?.publicId
    ) {
      await deleteFromCloudinary(
        project.presentationFile
          .publicId,
        project.presentationFile
          .resourceType || "raw"
      );
    }

    /* =====================================================
       DELETE PROJECT
    ===================================================== */

    await Project.findByIdAndDelete(
      id
    );

    return NextResponse.json({
      success: true,

      message:
        "Project and associated files deleted successfully.",
    });
  } catch (error) {
    console.error(
      "PROJECT_DELETE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to delete project.",
      },
      {
        status: 500,
      }
    );
  }
}