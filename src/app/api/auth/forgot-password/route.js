
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

import { sendPasswordResetEmail } from "@/lib/sendEmail";
import {
  createPasswordResetToken,
} from "@/lib/jwt";

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


    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });


    if (!user) {
      return NextResponse.json(
        {
          message:
            "Password reset link has been sent.",
        },
        {
          status: 200,
        },
      );
    }

    /*
     * Create JWT reset token
     *
     * Token expires automatically after 15 minutes.
     */
    const resetToken =
      createPasswordResetToken(user);

    /*
     * Store JWT in User model
     *
     * No resetPasswordExpires is required
     * because expiry is handled by JWT.
     */
    user.resetPasswordToken = resetToken;

    await user.save();

    /*
     * Create reset URL
     */
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    // const resetUrl =
    //   `${baseUrl}/reset-password?token=${resetToken}`;
    const resetUrl =
  `${baseUrl}/api/auth/reset-password?token=${encodeURIComponent(
    resetToken,
  )}`;

    /*
     * Do NOT log resetToken/resetUrl in production.
     */

    /*
     * Send reset email
     */
    await sendPasswordResetEmail(
      normalizedEmail,
      resetUrl,
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset link has been sent.",
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