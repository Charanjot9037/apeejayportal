import * as Yup from "yup";

export const signupSchema = Yup.object({

    name: Yup.string()
        .trim()
        .min(3, "Minimum 3 characters")
        .required("Name is required"),

    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

    className: Yup.string()
        .required("Please select class"),

    category: Yup.string()
        .required("Please select category"),

    password: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[a-z]/, "One lowercase required")
        .matches(/[0-9]/, "One number required")
        .matches(/[!@#$%^&*]/, "One special character required")
        .required("Password required"),

    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref("password")],
            "Passwords do not match"
        )
        .required("Confirm password")

});