
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";

import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import Projects from "@/models/projects";

import { authenticateUser } from "@/lib/authentication";

export const runtime = "nodejs";

export async function GET(request) {
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
    // 6. GET PROJECT IDS FROM FILTERED ROSTER
    // =========================================================

    const { searchParams } = new URL(request.url);

    const projectIdsParam =
      searchParams.get("projectIds") || "";

    const projectIds = projectIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

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

    // =========================================================
    // 8. GET STUDENT USER IDS
    // =========================================================

    const studentUserIds = projects
      .map((project) => project.student?._id)
      .filter(Boolean);

    // =========================================================
    // 9. GET STUDENT PROFILES
    // =========================================================

    const studentProfiles = await Student.find({
      userId: { $in: studentUserIds },
    }).lean();

    // =========================================================
    // 10. CREATE STUDENT MAP
    // =========================================================

    const studentMap = new Map();

    studentProfiles.forEach((student) => {
      studentMap.set(
        String(student.userId),
        student
      );
    });

    // =========================================================
    // 11. CREATE EXCEL
    // =========================================================

    const stream = new PassThrough();

    const workbook =
      new ExcelJS.stream.xlsx.WorkbookWriter({
        stream,
        useStyles: true,
        useSharedStrings: true,
      });

    const worksheet =
      workbook.addWorksheet("HOD Project Report");

    // =========================================================
    // 12. EXCEL COLUMNS
    // =========================================================

    worksheet.columns = [
      {
        header: "Student Name",
        key: "studentName",
        width: 28,
      },
      {
        header: "Email",
        key: "email",
        width: 35,
      },
      {
        header: "Roll Number",
        key: "rollNumber",
        width: 18,
      },
      {
        header: "Department",
        key: "department",
        width: 20,
      },
      {
        header: "Program",
        key: "program",
        width: 18,
      },
      {
        header: "Specialization",
        key: "specialization",
        width: 20,
      },
      {
        header: "Academic Batch",
        key: "academicBatch",
        width: 18,
      },
      {
        header: "Semester",
        key: "semester",
        width: 15,
      },
      {
        header: "Project Title",
        key: "projectTitle",
        width: 35,
      },
      {
        header: "Project Type",
        key: "projectType",
        width: 18,
      },
      {
        header: "Tech Stack",
        key: "techStack",
        width: 40,
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
        header: "Status",
        key: "status",
        width: 20,
      },
      {
        header: "Approval Date",
        key: "approvalDate",
        width: 20,
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
    // 13. HEADER STYLE
    // =========================================================

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).commit();

    // =========================================================
    // 14. WRITE FILTERED PROJECT STUDENTS
    // =========================================================

    for (const project of projects) {
      const studentUserId =
        project.student?._id;

      const studentProfile =
        studentUserId
          ? studentMap.get(
              String(studentUserId)
            )
          : null;

      const approvalDate =
        project.mentorReviewedAt
          ? new Date(
              project.mentorReviewedAt
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";

      const techStack =
        Array.isArray(project.techStack)
          ? [
              ...new Set(
                project.techStack
                  .filter(Boolean)
                  .map((item) =>
                    String(item).trim()
                  )
              ),
            ].join(", ")
          : "";

      worksheet
        .addRow({
          studentName:
            project.student?.name ||
            studentProfile?.fullName ||
            "",

          email:
            project.student?.email || "",

          rollNumber:
            studentProfile?.rollNumber || "",

          department:
            studentProfile?.department ||
            mentor.department ||
            "",

          program:
            studentProfile?.program || "",

          specialization:
            studentProfile?.specialization || "",

          academicBatch:
            studentProfile?.academicBatch || "",

          semester:
            project.semester ||
            studentProfile?.lastYear ||
            "",

          projectTitle:
            project.title || "",

          projectType:
            project.projectType || "",

          techStack,

          mentor:
            project.mentor?.name ||
            "Not Assigned",

          mentor2:
            project.mentor2?.name ||
            "Not Assigned",

          status:
            project.status || "",

          approvalDate,

          githubLink:
            project.githubLink || "",

          liveLink:
            project.liveLink || "",
        })
        .commit();
    }

    // =========================================================
    // 15. COMPLETE EXCEL
    // =========================================================

    await worksheet.commit();
    await workbook.commit();

    // =========================================================
    // 16. DOWNLOAD
    // =========================================================

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          stream.on("data", (chunk) => {
            controller.enqueue(chunk);
          });

          stream.on("end", () => {
            controller.close();
          });

          stream.on("error", (error) => {
            controller.error(error);
          });
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            'attachment; filename="hod-project-report.xlsx"',
        },
      }
    );
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

