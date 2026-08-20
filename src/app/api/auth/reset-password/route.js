
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

import {
  verifyPasswordResetToken,
} from "@/lib/jwt";

/*
 * GET
 *
 * Receives the token from the email link.
 * Stores it in an HttpOnly cookie.
 * Redirects the user to the clean reset-password page.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    /*
     * No token
     */
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/reset-password?error=invalid-link",
          req.url,
        ),
      );
    }

    /*
     * Verify JWT before putting it into cookie.
     */
    let decoded;

    try {
      decoded = verifyPasswordResetToken(token);
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          "/reset-password?error=invalid-link",
          req.url,
        ),
      );
    }

    /*
     * Make sure this is a password reset token.
     */
    if (
      !decoded ||
      decoded.type !== "password-reset"
    ) {
      return NextResponse.redirect(
        new URL(
          "/reset-password?error=invalid-link",
          req.url,
        ),
      );
    }

    /*
     * Create redirect response.
     */
    const response = NextResponse.redirect(
      new URL("/reset-password", req.url),
    );

    /*
     * Store token in HttpOnly cookie.
     *
     * Frontend JavaScript CANNOT read this cookie.
     */
    response.cookies.set(
      "password_reset_token",
      token,
      {
        httpOnly: true,

        /*
         * HTTPS only in production.
         */
        secure:
          process.env.NODE_ENV === "production",

        /*
         * Prevent cross-site requests from
         * automatically sending this cookie.
         */
        sameSite: "lax",

        /*
         * Cookie only needs to be sent to
         * the reset-password API.
         */
        path: "/api/auth/reset-password",

        /*
         * 5 minutes.
         */
        maxAge: 5 * 60,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Password reset initialization error:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/reset-password?error=invalid-link",
        req.url,
      ),
    );
  }
}

/*
 * POST
 *
 * Reads token from HttpOnly cookie.
 */
export async function POST(req) {
  try {
    await connectDB();

    const {
      password,
      confirmPassword,
    } = await req.json();

    /*
     * Validate password input.
     */
    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          message:
            "Password and confirm password are required",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Check passwords match.
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
     * Server-side password validation.
     */
    if (
      password.length < 8 ||
      password.length > 64
    ) {
      return NextResponse.json(
        {
          message:
            "Password must be between 8 and 64 characters",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Read token from HttpOnly cookie.
     *
     * JavaScript cannot access this.
     */
    const token = req.cookies.get(
      "password_reset_token",
    )?.value;

    if (!token) {
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
     * Verify JWT.
     */
    let decoded;

    try {
      decoded =
        verifyPasswordResetToken(token);
    } catch (error) {
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
     * Verify token type.
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
     * Find user.
     */
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
    });

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
     * Hash new password.
     */
    const hashedPassword =
      await bcrypt.hash(password, 10);

    /*
     * Update password.
     */
    user.password = hashedPassword;

    /*
     * Make reset token single-use.
     */
    user.resetPasswordToken = null;

    /*
     * Invalidate existing sessions.
     */
    user.refreshToken = null;

    await user.save();

    /*
     * Successful response.
     *
     * Delete reset cookie.
     */
    const response =
      NextResponse.json(
        {
          success: true,
          message:
            "Password reset successfully. You can now login.",
        },
        {
          status: 200,
        },
      );

    response.cookies.set(
      "password_reset_token",
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/reset-password",
        maxAge: 0,
      },
    );

    return response;
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