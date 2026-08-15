"use client";

import { ImagePlus } from "lucide-react";

import { MAX_PROJECT_IMAGES } from "@/constants/AddProjectConstant";
import ProjectImagePreview from "../../ProjectImagePreview";
import ExistingImagesGrid from "./ExistingImageGrid";

/* =========================================================
   PROJECT IMAGES SECTION
========================================================= */

export default function ProjectImagesSection({ formik, isEdit }) {
  const handleNewImages = (event) => {
    const files = Array.from(event.target.files || []);

    const existingCount = formik.values.existingProjectImages?.length || 0;

    const currentNewImages = formik.values.projectImages || [];

    const remainingSlots = Math.max(0, MAX_PROJECT_IMAGES - existingCount);

    const combinedImages = [...currentNewImages, ...files];

    const uniqueImages = combinedImages.filter(
      (file, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        )
    );

    formik.setFieldValue(
      "projectImages",
      uniqueImages.slice(0, remainingSlots)
    );

    formik.setFieldTouched("projectImages", true, false);

    event.target.value = "";
  };

  const removeExistingImage = (index) => {
    const updatedImages = formik.values.existingProjectImages.filter(
      (_, i) => i !== index
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
          Upload screenshots or images of your project. You can keep existing
          images, remove them, or add new ones. Maximum {MAX_PROJECT_IMAGES}{" "}
          images in total.
        </p>

        {/* EXISTING CLOUDINARY IMAGES */}
        {isEdit && formik.values.existingProjectImages?.length > 0 && (
          <ExistingImagesGrid
            images={formik.values.existingProjectImages}
            onRemove={removeExistingImage}
          />
        )}

        {/* NEW IMAGE UPLOAD */}
        <label className="flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50">
          <ImagePlus className="mb-2 h-6 w-6 text-orange-500" />

          <span className="text-xs font-medium text-slate-700">
            Add Project Images
          </span>

          <span className="mt-1 text-[10px] text-slate-400">
            JPG, PNG, WEBP • Max 5MB each
          </span>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleNewImages}
          />
        </label>

        {/* NEW IMAGE PREVIEWS */}
        {formik.values.projectImages.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-700">
              New Images
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {formik.values.projectImages.map((file, index) => (
                <ProjectImagePreview
                  key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                  file={file}
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