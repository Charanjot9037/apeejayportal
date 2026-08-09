"use client";

import { GraduationCap } from "lucide-react";

import InputField from "../elements/InputField";
import YearField from "../elements/Calendar"
import SelectField from "../elements/SelectFiled";
export default function AcademicInformationTab({
  formik,
  getError,
  onBack,
  onNext,
}) {

  const specializationOptions = {
  ENGINEERING: [
    {
      value: "CSE",
      label: "Computer Science & Engineering",
    },
    {
      value: "ECE",
      label: "Electronics & Communication Engineering",
    },
    {
      value: "ME",
      label: "Mechanical Engineering",
    },
    {
      value: "CIVIL",
      label: "Civil Engineering",
    },
    {
      value: "EEE",
      label: "Electrical & Electronics Engineering",
    },
  ],

  MANAGEMENT: [
    {
      value: "FINANCE",
      label: "Finance",
    },
    {
      value: "MARKETING",
      label: "Marketing",
    },
    {
      value: "HR",
      label: "Human Resource Management",
    },
    {
      value: "BUSINESS_ANALYTICS",
      label: "Business Analytics",
    },
  ],

  IT: [
    {
      value: "SOFTWARE_DEVELOPMENT",
      label: "Software Development",
    },
    {
      value: "DATA_SCIENCE",
      label: "Data Science",
    },
    {
      value: "AI_ML",
      label: "Artificial Intelligence & Machine Learning",
    },
    {
      value: "CYBER_SECURITY",
      label: "Cyber Security",
    },
    {
      value: "CLOUD_COMPUTING",
      label: "Cloud Computing",
    },
  ],
};
  const programOptions = {
  ENGINEERING: [
    {
      value: "BTECH",
      label: "B.Tech",
    },
  ],

  IT: [
    {
      value: "MCA",
      label: "MCA",
    },
    {
      value: "BCA",
      label: "BCA",
    },
  ],

  MANAGEMENT: [
    {
      value: "MBA",
      label: "MBA",
    },
    {
      value: "BBA",
      label: "BBA",
    },
    {
      value: "BCOM",
      label: "B.Com",
    },
  ],
};
const semesterOptions = {
  BTECH: Array.from({ length: 8 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BCA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BBA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BCOM: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  MCA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  MBA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),
};




  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div>
        <div className="flex items-center gap-2 text-main-blue">

          <GraduationCap size={18} />

          <h2 className="text-xl font-semibold">
            Academic Information
          </h2>

        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

 

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

   

     <SelectField
  label="DEPARTMENT"
  name="department"
  value={formik.values.department}
  onChange={(value) => formik.setFieldValue("department", value)}
  onBlur={() => formik.setFieldTouched("department", true)}
  error={getError("department")}
  options={[
    {
      value: "ENGINEERING",
      label: "Engineering",
    },
    {
      value: "MANAGEMENT",
      label: "Managemnet",
    },
   
    {
      value: "IT",
      label: "IT",
    },
  ]}
/>
<SelectField
 label="PROGRAM / DEGREE"
  name="program"
  value={formik.values.program}
  onChange={(value) => formik.setFieldValue("program", value)}
  onBlur={() => formik.setFieldTouched("program", true)}
  error={getError("program")}
  options={programOptions[formik.values.department] || []}
/>
    
<SelectField
  label="SPECIALIZATION"
  name="specialization"
  value={formik.values.specialization}
  onChange={(value) =>
    formik.setFieldValue("specialization", value)
  }
  onBlur={() =>
    formik.setFieldTouched("specialization", true)
  }
  error={getError("specialization")}
  options={
    specializationOptions[formik.values.department] || []
  }
/>
<SelectField
  label="CURRENT SEMESTER"
  name="currentSemester"
  required
  value={formik.values.currentSemester}
  onChange={(value) =>
    formik.setFieldValue("currentSemester", value)
  }
  onBlur={() =>
    formik.setFieldTouched("currentSemester", true)
  }
  error={getError("currentSemester")}
  options={
    semesterOptions[formik.values.program] || []
  }
/>

        <InputField
          label="ROLL NUMBER"
          name="rollNumber"
          required
          placeholder="Enter roll number"
          formik={formik}
          error={getError("rollNumber")}
        />
 
      
        
        <YearField
  label="academicBatch"
  name="academicBatch"
  required
  placeholder="Select batch"
  formik={formik}
  error={getError("academicBatch")}
/>

      </div>



      <div className="mt-8 flex justify-between">

        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          Save & Continue
        </button>

      </div>

    </div>
  );
}