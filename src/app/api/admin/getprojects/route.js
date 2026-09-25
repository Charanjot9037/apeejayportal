import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Projects from "@/models/projects";
import { authenticateUser } from "@/lib/authentication";

export async function POST(req) {
  try {
    // ---------------------------------------------------
    // CONNECT DATABASE
    // ---------------------------------------------------

    await connectDB();

    // ---------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.message ||
            "Authentication required",
        },
        {
          status: auth.status || 401,
        }
      );
    }

    const user = auth.user;

    // ---------------------------------------------------
    // AUTHORIZATION
    // ---------------------------------------------------

    // Only admin / Engineer should access all projects
    const isAdmin =
      user.role === "mentor";

    const isEngineer =
      user.role === "mentor" &&
      user.designation === "Engineer";

    if (!isAdmin && !isEngineer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to access projects.",
        },
        {
          status: 403,
        }
      );
    }
    let status;

try {
  const body = await req.json();
  status = body?.status;
} catch {
  status = undefined;
}
  
    // ---------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------

    const query = {};

    // If frontend sends status, filter by it
    if (status) {
      query.status = status;
    }

    const projects = await Projects.find(query).lean();


    return NextResponse.json(
      {
        success: true,
        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET_PROJECTS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch projects.",
      },
      {
        status: 500,
      }
    );
  }
}