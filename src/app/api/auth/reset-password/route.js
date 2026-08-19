// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import bcrypt from "bcrypt";

// import { connectDB } from "@/lib/db";
// import User from "@/models/user";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const {
//       token,
//       password,
//       confirmPassword,
//     } = await req.json();

//     if (!token || !password || !confirmPassword) {
//       return NextResponse.json(
//         {
//           message:
//             "Token, password and confirm password are required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         {
//           message: "Passwords do not match",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         {
//           message:
//             "Password must be at least 6 characters",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     /*
//      * Hash token received from URL
//      */
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//        console.log(hashedToken);

//     /*
    
//      * Find user with valid token
//      */
   
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: {
//         $gt: new Date(),
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid or expired password reset link",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     /*
//      * Hash new password
//      */
//     const hashedPassword = await bcrypt.hash(
//       password,
//       10,
//     );

//     user.password = hashedPassword;

//     /*
//      * Remove reset token after successful reset
//      */
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     /*
//      * Invalidate existing refresh token
//      *
//      * This logs the user out from existing sessions.
//      */
//     user.refreshToken = null;

//     await user.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Password reset successfully. You can now login.",
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.error("Reset password error:", error);

//     return NextResponse.json(
//       {
//         message:
//           error.message ||
//           "Something went wrong",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

import {
  verifyPasswordResetToken,
} from "@/lib/jwt";

export async function POST(req) {
  try {
    await connectDB();

    const {
      token,
      password,
      confirmPassword,
    } = await req.json();

    /*
     * Validate input
     */
    if (
      !token ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          message:
            "Token, password and confirm password are required",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Check passwords match
     */
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Passwords do not match",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Password length validation
     */
    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Verify JWT
     *
     * jwt.verify() checks:
     *
     * 1. JWT signature
     * 2. JWT expiration
     */
    let decoded;

    try {
      decoded =
        verifyPasswordResetToken(token);
    } catch (error) {
      /*
       * This catches:
       * - expired token
       * - invalid token
       * - wrong signature
       */
      return NextResponse.json(
        {
          message:
            "Invalid or expired password reset link",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Make sure this is a password reset token
     */
    if (
      !decoded ||
      decoded.type !== "password-reset"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid password reset token",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Find user
     *
     * We check both:
     * - user ID from JWT
     * - exact reset token stored in DB
     */
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
    });

    /*
     * Token does not match DB
     */
    if (!user) {
      return NextResponse.json(
        {
          message:
            "Invalid or expired password reset link",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Hash new password
     */
    const hashedPassword =
      await bcrypt.hash(
        password,
        10,
      );

    /*
     * Update password
     */
    user.password = hashedPassword;

    /*
     * Remove reset token
     *
     * This makes the reset link
     * single-use.
     */
    user.resetPasswordToken = null;

    /*
     * Invalidate existing refresh token
     *
     * This logs the user out from
     * existing sessions.
     */
    user.refreshToken = null;

    await user.save();

    /*
     * Successful response
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully. You can now login.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          error.message ||
          "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}