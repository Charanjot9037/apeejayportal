import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import { authenticateUser } from "@/lib/authentication";

export async function GET(request) {
  try {
    await connectDB();

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }
    const user = auth.user;
    if (user.role !== "mentor") {
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

    const projects = await Project.find({ mentor: auth.user._id })
      .populate({ path: "student", select: "name email " })
      .sort({ createdAt: -1 })
      .lean();
    console.log("projects:", projects);

    // Get Student academic details for each project's student (User._id)
    const studentUserIds = projects.map((p) => p.student?._id).filter(Boolean);

    const studentProfiles = await Student.find({
      userId: { $in: studentUserIds },
    }).select("userId department program rollNumber specialization");

    // Map userId -> student profile for quick lookup
    const profileMap = {};
    studentProfiles.forEach((sp) => {
      profileMap[sp.userId.toString()] = sp;
    });

    // Merge department/program into each project's student data
    const enrichedProjects = projects.map((p) => ({
      ...p,
      student: p.student
        ? {
            ...p.student,
            department: profileMap[p.student._id.toString()]?.department || "",
            program: profileMap[p.student._id.toString()]?.program || "",
            rollNumber: profileMap[p.student._id.toString()]?.rollNumber || "",

            specialization:
              profileMap[p.student._id.toString()]?.specialization || "",
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      projects: enrichedProjects,
    });
  } catch (error) {
    console.error("MENTOR_PROJECTS_GET_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch mentor's projects." },
      { status: 500 },
    );
  }
}
