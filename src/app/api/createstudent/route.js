import Student from "@/models/student"
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      userId,
      fullName,
      phone,
      gender,
      address,
      profileImage,
    } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Check whether Student already exists
    const existingStudent = await Student.findOne({ userId });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "Student profile already exists",
        },
        { status: 409 }
      );
    }

    const student = await Student.create({
      userId,
      fullName,
      phone,
      gender,
      address,
      profileImage: profileImage || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student profile created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student profile",
      },
      { status: 500 }
    );
  }
}