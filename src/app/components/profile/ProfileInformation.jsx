"use client";

import {  useState } from "react";
import { useFormik } from "formik";
import InformationField from "../elements/InformationField";
import GenderField from "../elements/GenderFlied";
import {
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { personalInformationSchema } from "@/validations/profileSchema";

const defaultData = {
  fullName: "Alex Johnson",
  email: "alex.johnson@university.edu",
  phone: "+91 98765 43210",
  dateOfBirth: "15 March 2003",
  gender: "Male",
  address: "42, Sector 12, Chandigarh, India",
};

export default function PersonalInformation({
  data = defaultData,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      gender: data.gender || "",
      address: data.address || "",
    },

    validationSchema: personalInformationSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        alert("alert");
        if (onSave) {
          await onSave(values);
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save profile:", error);
      }
    },
  });

  function handleEdit() {
    setIsEditing(true);
  }


  function handleCancel() {
    formik.resetForm();
    setIsEditing(false);
  }

  return (
    <section className="w-full rounded-lg border border-gray-300 bg-white px-5 py-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">

        <div>
          <h2 className="text-xl font-semibold text-blue-900">
            Personal Information
          </h2>

          <div className="mt-1 h-0.5 w-6 bg-orange-500" />
        </div>

        {/* ACTION BUTTONS */}
        {!isEditing ? (
          <Button
           
            onClick={handleEdit}
            className="flex items-center gap-1.5 bg-white rounded-md border border-orange-500 px-3 py-1.5 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
          >
            <Pencil size={14} />

            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">

            {/* CANCEL */}
            <Button
              type="button"
              onClick={handleCancel}
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={14} />

              Cancel
            </Button>

            {/* SAVE */}
            <Button
              type="submit"
              form="personal-information-form"
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={14} />

              {formik.isSubmitting
                ? "Saving..."
                : "Save"}
            </Button>

          </div>
        )}
      </div>

      {/* FORM */}
      <form
        id="personal-information-form"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">

          {/* FULL NAME */}
          <InformationField
            label="FULL NAME"
            name="fullName"
            value={formik.values.fullName}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.fullName &&
              formik.errors.fullName
            }
          />
          <InformationField
            label="EMAIL ADDRESS"
            name="email"
            type="email"
            value={formik.values.email}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.email &&
              formik.errors.email
            }
          />
          <InformationField
            label="PHONE NUMBER"
            name="phone"
            type="tel"
            value={formik.values.phone}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phone &&
              formik.errors.phone
            }
          />

          {/* DATE OF BIRTH */}
       

          {/* GENDER */}
          <GenderField
            value={formik.values.gender}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.gender &&
              formik.errors.gender
            }
          />

          {/* ADDRESS */}
          <InformationField
            label="ADDRESS"
            name="address"
            value={formik.values.address}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address &&
              formik.errors.address
            }
          />

        </div>
      </form>
    </section>
  );
}





