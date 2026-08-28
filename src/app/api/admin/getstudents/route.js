import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import { authenticateUser } from "@/lib/authentication";
import Mentor from "@/models/mentor";
import User from "@/models/user";
export async function POST(request) {
  try {
    await connectDB();

    // =========================
    // AUTHENTICATION
    // =========================
    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    // =========================
    // GET FILTERS
    // =========================
    const body = await request.json();

    const { department, program, academicBatch, specialization } = body;

    // =========================
    // BUILD QUERY
    // =========================
    const query = {};

    if (department) {
      query.department = {
        $regex: `^${department}$`,
        $options: "i",
      };
    }

    if (program) {
      query.program = {
        $regex: `^${program}$`,
        $options: "i",
      };
    }

    if (academicBatch) {
      query.academicBatch = {
        $regex: `^${academicBatch}$`,
        $options: "i",
      };
    }

    if (specialization) {
      query.specialization = {
        $regex: `^${specialization}$`,
        $options: "i",
      };
    }

    const students = await Student.find(query)
      .populate({
        path: "userId",
        select: "name email mentorId status",
      })
      .lean();
    const studentsWithMentor = await Promise.all(
      students.map(async (student) => {
        const mentorUserId = student.userId?.mentorId;

        if (!mentorUserId) {
          return {
            ...student,
            mentor: null,
          };
        }

        const mentor = await Mentor.findOne({
          userId: mentorUserId,
        })
          .select("_id userId mobileNumber department designation")
          .populate({
            path: "userId",
            select: "name email",
          })
          .lean();

        return {
          ...student,
          mentor: mentor || null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      students: studentsWithMentor,
    });
  } catch (error) {
    console.error("TEAM_STUDENTS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch students",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();
    const auth = await authenticateUser();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        {
          status: auth.status,
        },
      );
    }
    const adminuser = auth.user;
    const mentor1 = await Mentor.findOne({ userId: auth.user._id });

    if (auth.user.role !== "mentor" || mentor1.designation !== "Engineer") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to validate mentors.",
        },
        { status: 403 },
      );
    }

    const {
      studentId,
      fullName,
      department,
      program,
      status,
      academicBatch,
      specialization,
      mentorId,
    } = body;

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID is required",
        },
        { status: 400 },
      );
    }

    if (!mentorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor ID is required",
        },
        { status: 400 },
      );
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 },
      );
    }

    const user = await User.findById(student.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Student user not found",
        },
        { status: 404 },
      );
    }

    const mentor = await Mentor.findOne({
      userId: mentorId,
    });

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected mentor not found",
        },
        { status: 404 },
      );
    }

    user.name = fullName;

    user.mentorId = mentorId;
    user.status = status;
    await user.save();

    student.department = department;
    student.program = program;
    student.academicBatch = academicBatch;
    student.specialization = specialization;

    await student.save();

    // =========================================
    // GET UPDATED STUDENT WITH USER
    // =========================================

    const updatedStudent = await Student.findById(student._id)
      .populate({
        path: "userId",
        select: "name email mentorId status",
      })
      .lean();

    const updatedMentor = await Mentor.findOne({
      userId: mentorId,
    })
      .select("_id userId mobileNumber department designation")
      .populate({
        path: "userId",
        select: "name email",
      })
      .lean();

    // =========================================
    // RETURN COMPLETE STUDENT
    // =========================================

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",

      student: {
        ...updatedStudent,

        // Complete mentor object
        mentor: updatedMentor || null,
        rollNumber: updatedStudent.rollNumber || "-",
        // Mentor User ID
        mentorId: mentorId,
      },
    });
  } catch (error) {
    console.error("STUDENT_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update student",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
