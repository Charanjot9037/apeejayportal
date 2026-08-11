"use client";

import { User } from "lucide-react";

import InputField from "../elements/InputField";
import SelectField from "../elements/SelectFiled";
import TextAreaField from "../elements/TextField";
export default function PersonalInformationTab({
  formik,
  getError,
  imageInputRef,
  handleProfileImage,
  removeProfileImage,
  onNext,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">

      {/* HEADER */}

   

      {/* CONTENT */}

      <div className=" flex flex-col  gap-8 md:flex-row">

        {/* PROFILE IMAGE */}

        <div className="flex shrink-0 w-full md:w-1/3 flex-col gap-2 justify-center items-center">

          <div className="relative">

            <div className="flex h-35 w-35 items-center justify-center rounded-full border-2 border-gray-500 bg-gray-100">

              {formik.values.profileImage ? (
                <img
                  src={URL.createObjectURL(
                    formik.values.profileImage
                  )}
                  alt="Profile preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User
                  size={42}
                  className="text-gray-500"
                />
              )}

            </div>

            {formik.values.profileImage && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                ×
              </button>
            )}

          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleProfileImage}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              imageInputRef.current?.click()
            }
            className=" rounded-md border border-orange-500 px-3 py-1.5 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
          >
            Upload Photo
          </button>

          <p className=" text-text-gray-500">
            JPG or PNG · Max 2MB
          </p>

          {getError("profileImage") && (
            <p className="mt-1 text-xs text-red-500">
              {getError("profileImage")}
            </p>
          )}

        </div>

        {/* PERSONAL FIELDS */}

        <div className="flex w-full px-5 flex-col gap-2">

          <InputField
            label="Full Name"
            name="fullName"
            required
            placeholder="Enter your full name"
            formik={formik}
            error={getError("fullName")}
          />

       <div>
        <div>
  <InputField
            label="Phone"
            name="phone"
            required
            placeholder="+91 98765 43210"
            formik={formik}
            error={getError("phone")}
          />

        </div>
       </div>

      
          <SelectField
            label="Gender"
            required
            name="gender"
            value={formik.values.gender}
            onChange={(value) =>
              formik.setFieldValue("gender", value)
            }
            onBlur={() =>
              formik.setFieldTouched("gender", true)
            }
            error={getError("gender")}
            options={[
              {
                value: "Male",
                label: "Male",
              },
              {
                value: "Female",
                label: "Female",
              },
              {
                value: "Other",
                label: "Other",
              },
            ]}
          />

          <TextAreaField
            label="Address"
            required
            name="address"
            placeholder="Enter your address"
            formik={formik}
            error={getError("address")}
          />

        </div>
      </div>

      {/* NEXT */}

      <div className="mt-8 flex justify-end">

        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Save & Continue
        </button>

      </div>

    </div>
  );
}