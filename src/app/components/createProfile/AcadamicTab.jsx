'use client';

import { GraduationCap } from 'lucide-react';

import InputField from '../elements/InputField';
import YearField from '../elements/Calendar';
import SelectField from '../elements/SelectFiled';
import { programOptions,specializationOptions } from '@/constants/gloabl';
export default function AcademicInformationTab({
  formik,
  getError,
  onBack,
  onNext,
}) {
 

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div>
        <div className="flex items-center gap-2 text-main-blue">
          <GraduationCap size={18} />

          <h2 className="text-xl font-semibold">Academic Information</h2>
        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <SelectField
          label="DEPARTMENT"
          name="department"
          value={formik.values.department}
          onChange={(value) => formik.setFieldValue('department', value)}
          onBlur={() => formik.setFieldTouched('department', true)}
          error={getError('department')}
          options={[
            {
              value: 'ENGINEERING',
              label: 'Engineering',
            },
            {
              value: 'MANAGEMENT',
              label: 'Managemnet',
            },

            {
              value: 'IT',
              label: 'IT',
            },
          ]}
        />
        <SelectField
          label="PROGRAM / DEGREE"
          name="program"
          value={formik.values.program}
          onChange={(value) => formik.setFieldValue('program', value)}
          onBlur={() => formik.setFieldTouched('program', true)}
          error={getError('program')}
          options={programOptions[formik.values.department] || []}
        />

        <SelectField
          label="SPECIALIZATION"
          name="specialization"
          value={formik.values.specialization}
          onChange={(value) => formik.setFieldValue('specialization', value)}
          onBlur={() => formik.setFieldTouched('specialization', true)}
          error={getError('specialization')}
          options={specializationOptions[formik.values.department] || []}
        />

        <InputField
          label="ROLL NUMBER"
          name="rollNumber"
          required
          placeholder="Enter roll number"
          formik={formik}
          error={getError('rollNumber')}
        />

        <YearField
          label="Academic Batch"
          name="academicBatch"
          required
          placeholder="Select batch"
          formik={formik}
          error={getError('academicBatch')}
        />
      </div>

      <div className="mt-8 flex justify-end">
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
