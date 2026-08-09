"use client";

import { User } from "lucide-react";

import InputField from "../elements/InputField";
import SelectField from "../elements/SelectFiled";

export default function PersonalInformationTab({
  formik,
  getError,
  imageInputRef,
  handleProfileImage,
  removeProfileImage,
  onNext,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div>
        <div className="flex items-center gap-2 text-main-blue">
          <User size={18} />

          <h2 className="text-xl font-semibold">
            Personal Information
          </h2>
        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

      {/* CONTENT */}

      <div className="mt-6 flex flex-col gap-8 md:flex-row">

        {/* PROFILE IMAGE */}

        <div className="flex shrink-0 flex-col items-center">

          <div className="relative">

            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100">

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
                  className="text-gray-400"
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
            className="mt-3 rounded-md border border-orange-500 px-3 py-1.5 text-xs font-medium text-orange-500 transition hover:bg-orange-50"
          >
            Upload Photo
          </button>

          <p className="mt-1 text-[10px] text-gray-400">
            JPG or PNG · Max 2MB
          </p>

          {getError("profileImage") && (
            <p className="mt-1 text-xs text-red-500">
              {getError("profileImage")}
            </p>
          )}

        </div>

        {/* PERSONAL FIELDS */}

        <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

          <InputField
            label="FULL NAME"
            name="fullName"
            required
            placeholder="Enter your full name"
            formik={formik}
            error={getError("fullName")}
          />

          <InputField
            label="EMAIL"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            formik={formik}
            error={getError("email")}
          />

          <InputField
            label="PHONE"
            name="phone"
            required
            placeholder="+91 98765 43210"
            formik={formik}
            error={getError("phone")}
          />

          <InputField
            label="DATE OF BIRTH"
            name="dateOfBirth"
            required
            type="date"
            formik={formik}
            error={getError("dateOfBirth")}
          />

          <SelectField
            label="GENDER"
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

          <InputField
            label="ADDRESS"
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