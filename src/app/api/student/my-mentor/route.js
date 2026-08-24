import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { authenticateUser } from "@/lib/authentication";

export async function GET() {
  try {
    await connectDB();

    const auth = await authenticateUser();

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

    // Only students can access this route
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

    // Find logged-in student
    const student = await User.findOne({
      _id: userId,
      role: "student",
    }).select("_id name email mentorId");

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        {
          status: 404,
        },
      );
    }

    if (!student.mentorId) {
      return NextResponse.json(
        {
          success: false,
          message: "No mentor assigned to this student",
        },
        {
          status: 404,
        },
      );
    }

    // Find mentor using mentorId
    const mentor = await User.findOne({
      _id: student.mentorId,
      role: "mentor",
    }).select("_id name email");

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.error("Fetch assigned mentor error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch assigned mentor",
      },
      {
        status: 500,
      },
    );
  }
}
