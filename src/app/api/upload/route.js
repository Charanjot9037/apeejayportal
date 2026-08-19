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
      return Response.json({ message: "No file provided" }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    const isPPT =
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (!isImage && !isPDF && !isPPT) {
      return Response.json(
        { message: "Only images and PDFs are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resourceType = isImage ? "image" : "raw";

    const folder = isImage ? "students/profile-images" : "students/resumes";

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folder,
          use_filename: true,
          unique_filename: true,

          ...(isPDF && {
            format: "pdf",
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

    console.log("Uploaded file:", result.secure_url);

    return Response.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      originalName: file.name,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return Response.json(
      {
        success: false,
        message: "File upload failed",
      },
      { status: 500 },
    );
  }
}
