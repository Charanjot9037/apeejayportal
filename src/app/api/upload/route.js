// app/api/upload/route.js

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "No file provided",
        },
        { status: 400 },
      );
    }

    // ------------------------------------
    // FILE TYPE CHECK
    // ------------------------------------

    const isImage = file.type.startsWith("image/");

    const isPDF = file.type === "application/pdf";

    const isPPT =
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    if (!isImage && !isPDF && !isPPT) {
      return Response.json(
        {
          success: false,
          message: "Only images, PDF and PPT/PPTX files are allowed",
        },
        { status: 400 },
      );
    }

    // ------------------------------------
    // DETERMINE RESOURCE TYPE
    // ------------------------------------

    const resourceType = isImage ? "image" : "raw";

    // ------------------------------------
    // DETERMINE FOLDER
    // ------------------------------------

    let folder;

    if (isImage) {
      folder = "students/profile-images";
    } else if (isPPT) {
      folder = "students/presentations";
    } else {
      folder = "students/documents";
    }

    // ------------------------------------
    // GET FILE EXTENSION
    // ------------------------------------

    const originalName = file.name;

    const extension = originalName.split(".").pop()?.toLowerCase() || "";

    // Remove extension from filename
    const filenameWithoutExtension = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    // ------------------------------------
    // READ FILE
    // ------------------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ------------------------------------
    // UPLOAD TO CLOUDINARY
    // ------------------------------------

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,

          folder,

          public_id: filenameWithoutExtension,

          use_filename: false,

          unique_filename: true,

          ...(isPDF && {
            format: "pdf",
          }),

          ...(isPPT && {
            format: extension,
          }),
        },

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

    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    return Response.json({
      success: true,

      url: result.secure_url,

      publicId: result.public_id,

      resourceType: result.resource_type,

      originalName: file.name,

      format: result.format,

      folder: folder,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "File upload failed",
      },
      { status: 500 },
    );
  }
}
