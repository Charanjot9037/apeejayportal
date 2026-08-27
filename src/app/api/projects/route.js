import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import { authenticateUser } from "@/lib/authentication";
import User from "@/models/user";
import Student from "@/models/student";
export async function POST(request) {
  try {
    await connectDB();

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }
    const user = auth.user;
    const userId = user._id;

    const body = await request.json();

    const {
      projectName,
      description,
      techStack,
      githubLink,
      liveDemoLink,
      projectType,
      teamMembers,
      semester,

      projectImages,
      presentationFile,
      synopsisFile,
      reportFile,
      presentationFile2,
      synopsisFile2,
      reportFile2,
    } = body;

    const mentor1 = await User.findById(userId).select("mentorId");
    const teamMember = await Student.findById(teamMembers).populate({
      path: "userId",
      select: "_id mentorId",
    });

    if (!projectName || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Project name and description are required.",
        },
        { status: 400 },
      );
    }

    const project = await Project.create({
      title: projectName,
      subtitle:
        projectType === "team"
          ? `Team Project • ${teamMembers?.length || 0} Members`
          : "Individual Project",

      description,

      techStack: techStack || [],

      githubLink: githubLink || "",

      liveLink: liveDemoLink || "",

      projectType,

      teamMembers: projectType === "team" ? teamMembers || null : null,

      semester,

      mentor: mentor1.mentorId || null,
      ...(projectType === "team" && teamMember
        ? { mentor2: teamMember.userId?.mentorId || null }
        : {}),

      projectImages: projectImages || [],

      presentationFile: presentationFile || null,

      synopsisFile: synopsisFile || null,

      reportFile: reportFile || null,
      presentationFile2: presentationFile2 || null,
      synopsisFile2: synopsisFile2 || null,
      reportFile2: reportFile2 || null,

      status: "Pending Approval",

      student: userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project submitted successfully.",
        // project,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("PROJECT_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create project.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   GET PROJECTS
========================================================= */

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

    const userId = auth.user._id;

    // Resolve this user's Student profile — teamMembers stores a Student _id
    const studentProfile = await Student.findOne({ userId });

    const orConditions = [{ student: userId }];
    if (studentProfile) {
      orConditions.push({ teamMembers: studentProfile._id });
    }

    const projects = await Project.find({ $or: orConditions }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("PROJECT_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects." },
      { status: 500 },
    );
  }
}
