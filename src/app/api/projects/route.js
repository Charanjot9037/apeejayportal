import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";
import { authenticateUser } from "@/lib/authentication";

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
      mentor,
      studentId,

      projectImages,
      presentationFile,
      synopsisFile,
      reportFile,
    } = body;

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

      teamMembers: projectType === "team" ? teamMembers || [] : [],

      semester,

      mentor: mentor || null,

      projectImages: projectImages || [],

      presentationFile: presentationFile || null,

      synopsisFile: synopsisFile || null,

      reportFile: reportFile || null,

      status: "Pending Approval",

      student: studentId || auth.user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project submitted successfully.",
        project,
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

    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID is required.",
        },
        { status: 400 },
      );
    }

    const projects = await Project.find({
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("PROJECT_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects.",
      },
      { status: 500 },
    );
  }
}
