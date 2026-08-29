import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/student";
import Projects from "@/models/projects";

import { getHODContext } from "@/lib/getHODContext";

export async function GET() {
  try {
    await connectDB();

    // =====================================================
    // HOD AUTHENTICATION
    // =====================================================

    const hod = await getHODContext();

    if (!hod.success) {
      return NextResponse.json(
        {
          success: false,
          message: hod.response.message,
        },
        {
          status: hod.response.status,
        }
      );
    }

    const {
      user,
      mentor,
      department,
      normalizedDepartment,
    } = hod;

    // =====================================================
    // GET STUDENTS FROM HOD DEPARTMENT
    // =====================================================

    const departmentStudents =
      await Student.find({
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: {
                    $ifNull: ["$department", ""],
                  },
                },
              },
            },
            normalizedDepartment,
          ],
        },
      })
        .populate({
          path: "userId",
          select: "name email status",
        })
        .lean();

    // =====================================================
    // GET USER IDS OF DEPARTMENT STUDENTS
    // =====================================================

    const studentUserIds =
      departmentStudents
        .map((student) => student.userId?._id || student.userId)
        .filter(Boolean);

    // =====================================================
    // GET PROJECTS ASSIGNED TO LOGGED-IN HOD
    // =====================================================

    const projects = await Projects.find({
      student: {
        $in: studentUserIds,
      },

      $or: [
        {
          mentor: user._id,
        },
        {
          mentor2: user._id,
        },
      ],
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

    // =====================================================
    // GET UNIQUE STUDENT USER IDS
    // =====================================================

    const assignedStudentUserIds =
      new Set(
        projects
          .map((project) =>
            project.student?._id
              ? String(project.student._id)
              : null
          )
          .filter(Boolean)
      );

    // =====================================================
    // FILTER MY STUDENTS
    // =====================================================

    const myStudents =
      departmentStudents.filter((student) => {
        const studentUserId =
          student.userId?._id ||
          student.userId;

        return (
          studentUserId &&
          assignedStudentUserIds.has(
            String(studentUserId)
          )
        );
      });

    console.log("=================================");
    console.log("HOD:", user.name);
    console.log("HOD DEPARTMENT:", department);
    console.log(
      "MY STUDENTS:",
      myStudents.length
    );
    console.log(
      "MY PROJECTS:",
      projects.length
    );
    console.log("=================================");

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        hod: {
          name: user.name,
          email: user.email,
          department,
          designation: mentor.designation,
        },

        count: myStudents.length,

        students: myStudents,

        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "HOD MY STUDENTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch my students",
      },
      {
        status: 500,
      }
    );
  }
}