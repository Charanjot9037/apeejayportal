import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { department, program, academicBatch, excludeUserId } = body;

    if (!department || !program || !academicBatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Department, program, and year are required.",
        },
        { status: 400 },
      );
    }

    const query = {
      department: { $regex: `^${department.trim()}$`, $options: "i" },
      program: { $regex: `^${program.trim()}$`, $options: "i" },
      academicBatch: { $regex: `^${academicBatch.trim()}$`, $options: "i" },
    };

    if (excludeUserId) {
      query.userId = { $ne: excludeUserId };
    }

    const students = await Student.find(query).select(
      "_id userId fullName department program academicBatch",
    );

    return NextResponse.json(
      {
        success: true,
        students,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("TEAM_STUDENTS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch students.",
      },
      { status: 500 },
    );
  }
}