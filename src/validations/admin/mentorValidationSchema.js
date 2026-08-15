import * as Yup from 'yup';

export const mentorValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),

  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),

  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
    .required('Mobile number is required'),

  designation: Yup.string().required('Designation is required'),
});
