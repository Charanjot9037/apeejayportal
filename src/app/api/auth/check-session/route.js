import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/authentication";

export async function GET() {
  try {
    const result = await authenticateUser();

    if (!result.success) {
      return NextResponse.json(
        {
          authenticated: false,
          message: result.message,
        },
        {
          status: result.status || 401,
        }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Session route error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        message: "Authentication failed",
      },
      { status: 500 }
    );
  }
}