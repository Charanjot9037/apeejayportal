"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";

import { mentorValidationSchema } from "@/validations/admin/mentorValidationSchema";

import { Card, CardContent } from "@/components/ui/card";

import InputField from "../elements/InputField";
import SelectField from "../elements/SelectFiled";
import { DashboardHeader } from "../elements";

const AddMentor = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
      department: "",
      designation: "",
    },

    validationSchema: mentorValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/creatementor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create mentor");
        }

        console.log("Mentor created:", data);

        alert("Mentor added successfully");

        resetForm();
      } catch (error) {
        console.error("Add mentor error:", error);

        alert(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const getError = (field) => {
    return formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : "";
  };

  return (
    <div className="min-h-full py-4">
      <div className="mx-auto w-full rounded-sm border bg-white p-6 flex flex-col gap-3">
        {/* Header */}
        <div>
          <DashboardHeader
            title="Add New Mentor"
            description="Enter the details below to register a new mentor into the system."
          />
        </div>

        <Card className="w-full rounded-sm ">
          <CardContent>
            <form
              onSubmit={formik.handleSubmit}
              className=" flex flex-col gap-3"
            >
              <div className="flex gap-3 flex-col md:flex-row ">
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Full Name"
                    name="name"
                    required
                    type="text"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    formik={formik}
                    icon={<UserRound size={13} />}
                    error={getError("name")}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Email Address"
                    name="email"
                    required
                    type="email"
                    placeholder="sarah.jenkins@university.edu"
                    formik={formik}
                    icon={<Mail size={13} />}
                    error={getError("email")}
                  />
                </div>
              </div>

              {/* Mobile + Department */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Mobile Number"
                    name="mobileNumber"
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    formik={formik}
                    icon={<Phone size={13} />}
                    error={getError("mobileNumber")}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <SelectField
                    label="Department"
                    name="department"
                    required
                    value={formik.values.department}
                    onChange={(value) =>
                      formik.setFieldValue("department", value)
                    }
                    onBlur={() => formik.setFieldTouched("department", true)}
                    error={getError("department")}
                    icon={<Building2 size={13} />}
                    options={[
                      {
                        value: "Information Technology",
                        label: "Information Technology",
                      },
                      {
                        value: "Management",
                        label: "Management",
                      },
                      {
                        value: "Engineering",
                        label: "Engineering",
                      },
                    ]}
                  />
                </div>
              </div>

              <SelectField
                label="Designation / Role"
                name="designation"
                required
                value={formik.values.designation}
                onChange={(value) => formik.setFieldValue("designation", value)}
                onBlur={() => formik.setFieldTouched("designation", true)}
                error={getError("designation")}
                icon={<BriefcaseBusiness size={13} />}
                options={[
                  {
                    value: "ASSISTANT-PROFESSOR",
                    label: "Assistant professor",
                  },
                  {
                    value: "HOD",
                    label: "HOD",
                  },
                  {
                    value: "DEAN",
                    label: "Dean",
                  },
                  {
                    value: "DIRECTOR",
                    label: "Director",
                  },
                  {
                    value: "Engineer",
                    label: "Engineer",
                  },
                ]}
              />

              {/* Submit */}
              <div className="flex p-4 justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add Mentor"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddMentor;
