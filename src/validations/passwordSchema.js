import * as Yup from "yup";

export const passwordSchema = Yup.object({
password: Yup.string()
    .required("Password is required")
    .min(
      8,
      "Password must be at least 8 characters",
    )
    .max(
      64,
      "Password must not exceed 64 characters",
    )
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase letter",
    )
    .matches(
      /[a-z]/,
      "Password must contain at least one lowercase letter",
    )
    .matches(
      /[0-9]/,
      "Password must contain at least one number",
    )
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match",
    ),
});