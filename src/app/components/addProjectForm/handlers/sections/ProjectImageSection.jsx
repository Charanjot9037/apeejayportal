"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { MAX_PROJECT_IMAGES } from "@/constants/AddProjectConstant";
import ProjectImagePreview from "../../ProjectImagePreview";
import ExistingImagesGrid from "./ExistingImageGrid";

export default function ProjectImagesSection({ formik, isEdit }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleNewImages = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const existingCount = formik.values.existingProjectImages?.length || 0;

    const currentImages = formik.values.projectImages || [];

    const remainingSlots =
      MAX_PROJECT_IMAGES - existingCount - currentImages.length;

    if (remainingSlots <= 0) {
      alert(`You can upload a maximum of ${MAX_PROJECT_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    // Remove duplicate files
    const uniqueFiles = selectedFiles.filter(
      (file, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        ),
    );

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadedImages = [];

      for (let i = 0; i < uniqueFiles.length; i++) {
        const file = uniqueFiles[i];

        // Validate size
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is larger than 5MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }

        uploadedImages.push({
          url: data.url,
          publicId: data.publicId,
          originalName: data.originalName,
        });

        setUploadProgress(Math.round(((i + 1) / uniqueFiles.length) * 100));
      }

      // Add uploaded objects to Formik
      formik.setFieldValue("projectImages", [
        ...currentImages,
        ...uploadedImages,
      ]);

      formik.setFieldTouched("projectImages", true, false);
    } catch (error) {
      console.error("Image upload error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  const removeExistingImage = (index) => {
    const updatedImages = formik.values.existingProjectImages.filter(
      (_, i) => i !== index,
    );

    formik.setFieldValue("existingProjectImages", updatedImages);
  };

  const removeNewImage = (index) => {
    const updated = formik.values.projectImages.filter((_, i) => i !== index);

    formik.setFieldValue("projectImages", updated);
  };

  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Project Images
        </span>
      </h2>

      <div className="mt-4">
        <p className="mb-3 text-xs text-slate-500">
          Upload screenshots or images of your project. Maximum{" "}
          {MAX_PROJECT_IMAGES} images in total.
        </p>
        
        {isEdit && formik.values.existingProjectImages?.length > 0 && (
          <ExistingImagesGrid
            images={formik.values.existingProjectImages}
            onRemove={removeExistingImage}
          />
        )}
        {/* UPLOAD */}
        <label
          className={`flex min-h-[130px] flex-col items-center justify-center rounded-md border border-dashed ${
            uploading
              ? "cursor-not-allowed border-orange-300 bg-orange-50"
              : "cursor-pointer border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-6 w-6 animate-spin text-orange-500" />

              <span className="text-xs font-medium text-slate-700">
                Uploading images...
              </span>

              <span className="mt-1 text-xs text-slate-400">
                {uploadProgress}%
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="mb-2 h-6 w-6 text-orange-500" />

              <span className="text-xs font-medium text-slate-700">
                Add Project Images
              </span>

              <span className="mt-1 text-[10px] text-slate-400">
                JPG, PNG, WEBP • Max 5MB each
              </span>
            </>
          )}

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleNewImages}
          />
        </label>
        {/* NEW IMAGE PREVIEWS */}
        {formik.values.projectImages?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-700">
              Project Images
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {formik.values?.projectImages?.map((image, index) => (
                <ProjectImagePreview
                  key={`${image.publicId || image.url}-${index}`}
                  image={image}
                  onRemove={() => removeNewImage(index)}
                />
              ))}
            </div>
          </div>
        )}
        {formik.touched.projectImages && formik.errors.projectImages && (
          <p className="mt-2 text-xs text-red-500">
            {formik.errors.projectImages}
          </p>
        )}
      </div>
    </section>
  );
}
