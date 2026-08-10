import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Project from "@/models/projects";


// ===============================
// GET SINGLE PROJECT
// ===============================
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("GET PROJECT ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required",
        },
        { status: 400 }
      );
    }

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        project,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET PROJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// ===============================
// UPDATE PROJECT
// ===============================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    project.title =
      body.projectName ?? project.title;

    project.description =
      body.description ?? project.description;

    project.techStack =
      body.techStack ?? project.techStack;

    project.githubLink =
      body.githubLink ?? project.githubLink;

    project.liveLink =
      body.liveDemoLink ?? project.liveLink;

    project.projectType =
      body.projectType ?? project.projectType;

    project.teamMembers =
      body.projectType === "team"
        ? body.teamMembers || []
        : [];

    project.semester =
      body.semester ?? project.semester;

    project.mentor =
      body.mentor ?? project.mentor;

    // If an approved project is edited,
    // send it for approval again.
    project.status = "Pending Approval";

    await project.save();

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        project,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// ===============================
// DELETE PROJECT
// ===============================
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}