import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Projects from "@/models/projects";

import { authenticateUser } from "@/lib/authentication";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectDB();

    // =========================================================
    // 1. AUTHENTICATE HOD
    // =========================================================

    const auth = await authenticateUser();

    if (!auth?.success || !auth?.user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: auth?.message || "Unauthorized",
        },
        { status: auth?.status || 401 }
      );
    }

    // =========================================================
    // 2. GET LOGGED-IN USER
    // =========================================================

    const user = await User.findById(auth.user._id).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 3. USER MUST BE MENTOR
    // =========================================================

    if (user.role?.trim().toLowerCase() !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // =========================================================
    // 4. FIND MENTOR PROFILE
    // =========================================================

    const mentor = await Mentor.findOne({
      userId: user._id,
    }).lean();

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor profile not found",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 5. ONLY HOD
    // =========================================================

    if (
      mentor.designation?.trim().toLowerCase() !== "hod"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HODs can export this report",
        },
        { status: 403 }
      );
    }

    // =========================================================
    // 6. GET PROJECT IDS FROM REQUEST BODY
    // =========================================================

    const body = await request.json();

    const projectIds = Array.isArray(body.projectIds)
      ? body.projectIds.filter(Boolean)
      : [];

    if (projectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No projects selected for export",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 7. GET PROJECTS
    // =========================================================

    const projects = await Projects.find({
      _id: { $in: projectIds },
    })
      .populate({
        path: "student",
        select: "name email",
      })
      .populate({
        path: "mentor",
        select: "name email",
      })
      .populate({
        path: "mentor2",
        select: "name email",
      })
      .lean();

    if (projects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No projects found",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 8. CREATE EXCEL WORKBOOK
    // =========================================================

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
      "HOD Project Report"
    );

    // =========================================================
    // 9. ONLY PROJECT ROSTER FIELDS
    // =========================================================

    worksheet.columns = [
      {
        header: "Project Title",
        key: "projectTitle",
        width: 35,
      },
      {
        header: "Student",
        key: "student",
        width: 25,
      },
      {
        header: "Mentor",
        key: "mentor",
        width: 25,
      },
      {
        header: "Second Mentor",
        key: "mentor2",
        width: 25,
      },
      {
        header: "Project Type",
        key: "projectType",
        width: 20,
      },
      {
        header: "Tech Stack",
        key: "techStack",
        width: 40,
      },
      {
        header: "Status",
        key: "status",
        width: 22,
      },
      {
        header: "Semester",
        key: "semester",
        width: 15,
      },
      {
        header: "GitHub",
        key: "githubLink",
        width: 40,
      },
      {
        header: "Live Link",
        key: "liveLink",
        width: 40,
      },
    ];

    // =========================================================
    // 10. HEADER STYLE
    // =========================================================

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // =========================================================
    // 11. ADD PROJECT ROWS
    // =========================================================

    for (const project of projects) {
      const techStack = Array.isArray(project.techStack)
        ? [
            ...new Set(
              project.techStack
                .filter(Boolean)
                .map((item) => String(item).trim())
            ),
          ].join(", ")
        : "";

      worksheet.addRow({
        projectTitle: project.title || "-",

        student:
          project.student?.name ||
          "Not Assigned",

        mentor:
          project.mentor?.name ||
          "Not Assigned",

        mentor2:
          project.mentor2?.name ||
          "Not Assigned",

        projectType:
          project.projectType || "-",

        techStack,

        status:
          project.status || "-",

        semester:
          project.semester || "-",

        githubLink:
          project.githubLink || "-",

        liveLink:
          project.liveLink || "-",
      });
    }

    // =========================================================
    // 12. FORMAT WORKSHEET
    // =========================================================

    worksheet.eachRow((row, rowNumber) => {
      row.alignment = {
        vertical: "middle",
      };

      if (rowNumber !== 1) {
        row.height = 22;
      }
    });

    // =========================================================
    // 13. GENERATE XLSX BUFFER
    // =========================================================

    const buffer = await workbook.xlsx.writeBuffer();

    // =========================================================
    // 14. DOWNLOAD
    // =========================================================

    return new NextResponse(buffer, {
      status: 200,

      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="hod-project-report.xlsx"',
      },
    });
  } catch (error) {
    console.error(
      "HOD_EXPORT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to export HOD report",
      },
      {
        status: 500,
      }
    );
  }
}