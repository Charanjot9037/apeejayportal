import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { department, program, academicBatch } = body;

    if (!department || !program || !academicBatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Department and class are required.",
        },
        { status: 400 },
      );
    }

    const students = await Student.find({
      department: {
        $regex: `^${department}$`,
        $options: "i",
      },

      program: {
        $regex: `^${program}$`,
        $options: "i",
      },
    }).select("_id userId fullName");

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
