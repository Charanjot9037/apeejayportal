import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { department, program, academicBatch, specialization } = body;

    if (!department || !program || !academicBatch) {
      return NextResponse.json(
        {
          success: false,
<<<<<<< HEAD
          message: "Department, program and academic batch are required.",
=======
          message: 'Department, program and academic batch are required.',
>>>>>>> c7867bdb6ad252bf3201acbf09d90366dba9f2fe
        },
        { status: 400 },
      );
    }

    const query = {
      department: {
        $regex: `^${department}$`,
        $options: "i",
      },

      program: {
        $regex: `^${program}$`,
        $options: "i",
      },

      academicBatch: {
        $regex: `^${academicBatch}$`,
        $options: "i",
      },
    };

    // Add specialization only when it is provided
    if (specialization) {
      query.specialization = {
        $regex: `^${specialization}$`,
        $options: "i",
      };
    }

    const students = await Student.find(query).select(
      "_id userId fullName rollNumber department program academicBatch specialization",
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
