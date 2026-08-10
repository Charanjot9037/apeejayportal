import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Project from "@/models/projects";
import { authenticateUser } from "@/lib/authentication";

export async function POST(request) {
  try {
    await connectDB();

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
      synopsisFile,
      reportFile,
      presentationFile,
    } = body;

    if (!projectName || !description ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project name, description and student ID are required.",
        },
        { status: 400 }
      );
    }

    if (
      projectType === "team" &&
      (!teamMembers || teamMembers.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Team project must have at least one team member.",
        },
        { status: 400 }
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
//authorization
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

 const studentId = user._id;

    const project = await Project.create({
      title: projectName,

      subtitle:
        projectType === "team"
          ? `Team Project • ${teamMembers.length} Members`
          : "Individual Project",

      description,

      techStack: techStack || [],

      githubLink,

      liveLink: liveDemoLink,

      projectType,

      teamMembers:
        projectType === "team"
          ? teamMembers
          : [],

      semester,

      mentor,

      synopsisFile,

      reportFile,

      presentationFile,

      status: "Pending Approval",
      student: studentId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project submitted for approval.",
        // project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PROJECT_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create project.",
      },
      { status: 500 }
    );
  }
}

//GET

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
        { status: 400 }
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
      { status: 500 }
    );
  }
}