// import { NextResponse } from "next/server";
// import crypto from "crypto";

// import { connectDB } from "@/lib/db";
// import User from "@/models/user";

// import { sendPasswordResetEmail } from "@/lib/sendEmail";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         {
//           message: "Email is required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const user = await User.findOne({
//       email: normalizedEmail,
//     });

//     /*
//      * Don't reveal whether an email exists.
//      * This prevents account enumeration.
//      */
//     if (!user) {
//       return NextResponse.json(
//         {
//           message:
//             "If an account exists with this email, a password reset link has been sent.",
//         },
//         {
//           status: 200,
//         },
//       );
//     }

//     /*
//      * Generate random token
//      */
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     /*
//      * Store HASH of token in database
//      */
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     /*
//      * Token expires after 15 minutes
//      */
//     const resetTokenExpires = new Date(
//       Date.now() + 15 * 60 * 1000,
//     );

//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = resetTokenExpires;
//     console.log("in forgot password : ",resetPasswordToken);

//     await user.save();

//     /*
//      * Create reset URL
//      */
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL ||
//       "http://localhost:3000";

//     const resetUrl =
//       `${baseUrl}/reset-password?token=${resetToken}`;

//     /*
//      * Send email
//      */
//     await sendPasswordResetEmail(
//       normalizedEmail,
//       resetUrl,
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "If an account exists with this email, a password reset link has been sent.",
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.error("Forgot password error:", error);

//     return NextResponse.json(
//       {
//         message: "Something went wrong. Please try again later.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

import { sendPasswordResetEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
     * Don't reveal whether an email exists.
     */
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        {
          status: 200,
        },
      );
    }

    /*
     * Generate random token
     */
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    /*
     * Hash token before storing in database
     */
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    /*
     * Token expires after 15 minutes
     */
    const resetTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    /*
     * Save hashed token and expiry
     */
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpires;

    console.log(
      "Hashed reset token:",
      hashedToken,
    );

    console.log(
      "Reset token expires:",
      resetTokenExpires,
    );

    await user.save();

    /*
     * Create reset URL
     */
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/reset-password?token=${resetToken}`;

    console.log("Reset URL:", resetUrl);

    /*
     * Send email
     */
    await sendPasswordResetEmail(
      normalizedEmail,
      resetUrl,
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Forgot password error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}