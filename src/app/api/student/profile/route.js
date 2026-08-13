import Student from "@/models/student";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticateUser } from "@/lib/authentication";

export async function GET() {
  try {
    await connectDB();

    // Authenticate user
    const auth = await authenticateUser();
console.log("auth",auth);
    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    const user = auth.user;
    const userId = user._id;
    // Only students can access student profile
    if (user.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Students only are allowed.",
        },
        {
          status: 403,
        },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // Find student profile
    const student = await Student.findOne({ userId }).lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student profile not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student profile fetched successfully",

        data: {
          ...student,
          email: user.email,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get student profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student profile",
      },
      {
        status: 500,
      },
    );
  }
}
