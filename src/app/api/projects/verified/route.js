import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Project from "@/models/projects";
import Student from "@/models/student";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const department = searchParams.get("department");
    const program = searchParams.get("program");
    const specialization = searchParams.get("specialization");

    // ------------------------------------------------------------
    // PAGINATION
    // ------------------------------------------------------------

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = 3;

    const skip = (page - 1) * limit;

    // ------------------------------------------------------------
    // STUDENT FILTER
    // ------------------------------------------------------------

    const studentFilter = {};

    if (department && department !== "all") {
      studentFilter.department = {
        $regex: `^${department}$`,
        $options: "i",
      };
    }

    if (program && program !== "all") {
      studentFilter.program = {
        $regex: `^${program}$`,
        $options: "i",
      };
    }

    if (specialization && specialization !== "all") {
      studentFilter.specialization = {
        $regex: `^${specialization}$`,
        $options: "i",
      };
    }

    // ------------------------------------------------------------
    // FIND MATCHING STUDENTS
    // ------------------------------------------------------------

    let studentIds = null;

    if (Object.keys(studentFilter).length > 0) {
      const students = await Student.find(studentFilter)
        .select("userId")
        .lean();

      studentIds = students.map(
        (student) => student.userId
      );

      // No students matched filters
      if (studentIds.length === 0) {
        return NextResponse.json({
          success: true,
          projects: [],
          pagination: {
            page,
            limit,
            hasMore: false,
            total: 0,
          },
        });
      }
    }

    // ------------------------------------------------------------
    // PROJECT FILTER
    // ------------------------------------------------------------

    const projectFilter = {
      status: "Approved",
    };

    // Project.student → User._id
    if (studentIds) {
      projectFilter.student = {
        $in: studentIds,
      };
    }

    // ------------------------------------------------------------
    // TOTAL PROJECT COUNT
    // ------------------------------------------------------------

    const total = await Project.countDocuments(
      projectFilter
    );

    // ------------------------------------------------------------
    // FETCH PROJECTS
    // ------------------------------------------------------------

    const projects = await Project.find(projectFilter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "student",
        select: "name email profileImage",
      })
      .lean();

    // ------------------------------------------------------------
    // GET STUDENT ACADEMIC DETAILS
    // ------------------------------------------------------------

    const studentUserIds = projects
      .map((project) => project.student?._id)
      .filter(Boolean);

    const students = await Student.find({
      userId: {
        $in: studentUserIds,
      },
    })
      .select(
        "userId department program specialization academicBatch rollNumber"
      )
      .lean();

    // ------------------------------------------------------------
    // STUDENT MAP
    // ------------------------------------------------------------

    const studentMap = new Map(
      students.map((student) => [
        student.userId.toString(),
        student,
      ])
    );

    // ------------------------------------------------------------
    // COMBINE PROJECT + USER + STUDENT
    // ------------------------------------------------------------

    const mappedProjects = projects.map((project) => {
      const student = studentMap.get(
        project.student?._id?.toString()
      );

      return {
        ...project,

        studentInfo: {
          id: project.student?._id || null,

          // From User
          name: project.student?.name || "",
          email: project.student?.email || "",
           profileImage: project.student?.profileImage || "",

          // From Student
          department: student?.department || "",
          program: student?.program || "",
          specialization:
            student?.specialization || "",
          academicBatch:
            student?.academicBatch || "",
          rollNumber:
            student?.rollNumber || "-",
        },
      };
    });

    // ------------------------------------------------------------
    // PAGINATION INFO
    // ------------------------------------------------------------

    const hasMore = skip + projects.length < total;

    return NextResponse.json({
      success: true,

      projects: mappedProjects,

      pagination: {
        page,
        limit,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error(
      "VERIFIED_PROJECTS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch verified projects.",
      },
      {
        status: 500,
      }
    );
  }
}