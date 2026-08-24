import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import { authenticateUser } from "@/lib/authentication";
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { department, program, academicBatch, specialization } = body;

    if (!department || !program || !academicBatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Department, program and academic batch are required.",
        },
        { status: 400 },
      );
    }
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
      userId: {
        $ne: userId,
      },
    };

    // Add specialization only when it is provided
    if (specialization) {
      query.specialization = {
        $regex: `^${specialization}$`,
        $options: "i",
      };
    }
    const students = await Student.find(query)
      .select(
        "_id userId fullName rollNumber department program academicBatch specialization",
      )
      .populate({
        path: "userId",
        select: "mentorId",
        populate: {
          path: "mentorId",
          select: "_id name email",
        },
      });
    const formattedStudents = students.map((student) => ({
      _id: student._id,
      userId: student.userId?._id,
      fullName: student.fullName,
      rollNumber: student.rollNumber,
      department: student.department,
      program: student.program,
      academicBatch: student.academicBatch,
      specialization: student.specialization,

      mentor: student.userId?.mentorId
        ? {
            _id: student.userId.mentorId._id,
            name: student.userId.mentorId.name,
            email: student.userId.mentorId.email,
          }
        : null,
    }));

    return NextResponse.json(
      {
        success: true,
        formattedStudents,
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
