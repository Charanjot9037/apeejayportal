import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { createAccessToken } from "@/lib/jwt";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function authenticateUser() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, ACCESS_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
          return {
            success: false,
            status: 401,
            message: "User not found",
          };
        }
        const newAccessToken = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          ACCESS_SECRET,
          {
            expiresIn: "15m",
          },
        );

        cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60,
        });

        return {
          success: true,
          user,
        };
      } catch (accessError) {
        // Access token expired/invalid
        // Continue and try refresh token
      }
    }

    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(decodedRefresh.id);
        if (!user) {
          return {
            success: false,
            status: 401,
            message: "User not found",
          };
        }
        if (user.refreshToken !== refreshToken) {
          return {
            success: false,
            status: 401,
            message: "Invalid refresh token",
          };
        }

        const newAccessToken = createAccessToken(user);

        cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60,
        });

        return {
          success: true,
          user,
        };
      } catch (refreshError) {
        return {
          success: false,
          status: 401,
          message: "Session expired",
        };
      }
    }

    return {
      success: false,
      status: 401,
      message: "Authentication failed",
    };
  } catch (error) {
    console.error("Authentication error:", error);

    return {
      success: false,
      status: 500,
      message: "Authentication error",
    };
  }
}
