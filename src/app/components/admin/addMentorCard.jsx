'use client';

import { useFormik } from 'formik';
import { mentorValidationSchema } from '@/validations/admin/mentorValidationSchema';

import { designationOptions } from '@/constants/adminData';
import { Button } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import InputField from '../elements/InputField';
import SelectField from '../elements/SelectFiled';

const AddMentor = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobileNumber: '',
      designation: '',
    },

    validationSchema: mentorValidationSchema,
    onSubmit: (values) => {
      console.log('Mentor Form Values:', values);
    },
  });

  return (
    <div className="flex items-center justify-center   px-4 py-8">
      <Card className="w-full max-w-xl border border-primary-orange  shadow-sm">
        <CardHeader className="border-b  border-primary-orange  ">
          <CardTitle className="text-lg  text-primary-orange font-semibold">
            Add Mentor
          </CardTitle>

          <CardDescription className="text-xs text-black">
            Enter the mentor's details below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <InputField
              label="Name"
              name="name"
              required
              placeholder="Enter mentor name"
              formik={formik}
              error={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ''
              }
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Enter mentor email"
              formik={formik}
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ''
              }
            />

            <InputField
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              required
              placeholder="Enter 10-digit mobile number"
              formik={formik}
              error={
                formik.touched.mobileNumber && formik.errors.mobileNumber
                  ? formik.errors.mobileNumber
                  : ''
              }
            />

            <SelectField
              label="Designation"
              name="designation"
              value={formik.values.designation}
              onChange={(value) => formik.setFieldValue('designation', value)}
              onBlur={() => formik.setFieldTouched('designation', true)}
              error={
                formik.touched.designation && formik.errors.designation
                  ? formik.errors.designation
                  : ''
              }
              options={designationOptions}
            />

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                className="h-9 rounded-md bg-primary-orange px-6 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:ring-2 focus:ring-orange-500/20"
              >
                Add Mentor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMentor;
