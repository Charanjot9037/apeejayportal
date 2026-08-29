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
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../AuthGuardModal";
import { mentorValidationSchema } from "@/validations/admin/mentorValidationSchema";

import { Card, CardContent } from "@/components/ui/card";

import InputField from "../elements/InputField";
import SelectField from "../elements/SelectFiled";
import { DashboardHeader } from "../elements";
import { useRouter } from "next/navigation";
const AddMentor = () => {
  const [loading, setLoading] = useState(false);
  const [authModal, setAuthModal] = useState({
    open: false,
    type: "unauthorized",
    message: "",
  });
  const router = useRouter();
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
        if (response.status === 401) {
          setAuthModal({
            open: true,
            type: "authentication",
            message:
              data.message || "Your session has expired. Please login again.",
          });

          return;
        }

        if (response.status === 403) {
          setAuthModal({
            open: true,
            type: "unauthorized",
            message: data.message || "You are not authorized to add a mentor.",
          });

          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to create mentor");
        }

        toast.success("Mentor added successfully!");

        resetForm();
      } catch (error) {
        console.error("Add mentor error:", error);

        toast.error(error.message || "Something went wrong");
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
    <>
      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() => {
          setAuthModal({
            open: false,
            type: "unauthorized",
            message: "",
          });

          // For unauthorized user go back
          if (authModal.type === "unauthorized") {
            router.push("/");
          }
        }}
        onLogin={() => {
          router.push("/login");
        }}
      />
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
                onChange={(value) => formik.setFieldValue('designation', value)}
                onBlur={() => formik.setFieldTouched('designation', true)}
                error={getError('designation')}
                icon={<BriefcaseBusiness size={13} />}
                options={[
                  {
                    value: 'ASSISTANT-PROFESSOR',
                    label: 'assistant_professor',
                  },
                  {
                    value: 'hod',
                    label: 'HOD',
                  },
                  {
                    value: 'dean',
                    label: 'Dean',
                  },
                  {
                    value: 'director',
                    label: 'Director',
                  },
                  {
                    value: 'engineer',
                    label: 'Engineer',
                  },
                ]}
              />
                <SelectField
                  label="Designation / Role"
                  name="designation"
                  required
                  value={formik.values.designation}
                  onChange={(value) =>
                    formik.setFieldValue("designation", value)
                  }
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
                      value: "Engineer",
                      label: "Engineer",
                    },
                  ]}
                />

                <div className="flex p-4 justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Adding...
                      </>
                    ) : (
                      "Add Mentor"
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddMentor;
