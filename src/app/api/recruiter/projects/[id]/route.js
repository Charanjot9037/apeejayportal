import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import projects from "@/models/projects";
import Student from "@/models/student";
import User from"@/models/user";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await projects.findOne({
      _id: id,
      status: "Approved",
    })
      .populate({
        path: "student",
        model: User,
        select: "name email profileImage",
      })
      .lean();

    if (!project) {
      return NextResponse.json(
        { message: "Verified project not found" },
        { status: 404 }
      );
    }

    // Get student information
    let studentInfo = null;

    if (project.student?._id) {
      studentInfo = await Student.findOne({
        userId: project.student._id,
      }).lean();
    }

    return NextResponse.json({
      success: true,

      project: {
        ...project,

        studentInfo: studentInfo
          ? {
              program: studentInfo.program || "",
              department: studentInfo.department || "",
              specialization: studentInfo.specialization || "",
              semester:
                studentInfo.currentSemester ||
                studentInfo.semester ||
                "",
            }
          : null,
      },

      viewerRole: "recruiter",
    });
  } catch (error) {
    console.error("RECRUITER_PROJECT_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project details",
      },
      { status: 500 }
    );
  }
}