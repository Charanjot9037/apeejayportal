import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/projects";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({
      status: "Approved",
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("VERIFIED_PROJECTS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch verified projects.",
      },
      {
        status: 500,
      }
    );
  }
}
