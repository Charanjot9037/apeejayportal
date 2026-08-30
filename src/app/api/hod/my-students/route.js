import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/student";
import Projects from "@/models/projects";

import { getHODContext } from "@/lib/getHODContext";

export async function POST(request) {
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
    // RECEIVE FILTERS
    // =====================================================

    const filters = await request.json();

    const {
      program,
      semester,
      specialization,
    } = filters || {};

  

    // =====================================================
    // BUILD STUDENT FILTER
    // =====================================================

    const studentConditions = [
      // ---------------------------------------------------
      // HOD DEPARTMENT
      // ---------------------------------------------------

      {
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
      },
    ];

    // =====================================================
    // PROGRAM
    // =====================================================

    if (program) {
      studentConditions.push({
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: {
                    $ifNull: ["$program", ""],
                  },
                },
              },
            },
            program.trim().toLowerCase(),
          ],
        },
      });
    }

    // =====================================================
    // SPECIALIZATION
    // =====================================================

    if (specialization) {
      studentConditions.push({
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: {
                    $ifNull: ["$specialization", ""],
                  },
                },
              },
            },
            specialization.trim().toLowerCase(),
          ],
        },
      });
    }

    // =====================================================
    // SEMESTER
    // =====================================================

    if (semester) {
      studentConditions.push({
        $expr: {
          $eq: [
            {
              $toString: "$currentSemester",
            },
            String(semester),
          ],
        },
      });
    }

    // =====================================================
    // FINAL STUDENT QUERY
    // =====================================================

    const studentQuery = {
      $and: studentConditions,
    };


    // =====================================================
    // GET FILTERED DEPARTMENT STUDENTS
    // =====================================================

    const departmentStudents =
      await Student.find(studentQuery)
        .populate({
          path: "userId",
          select: "name email status",
        })
        .lean();

   
    // =====================================================
    // GET USER IDS
    // =====================================================

    const studentUserIds =
      departmentStudents
        .map(
          (student) =>
            student.userId?._id ||
            student.userId
        )
        .filter(Boolean);

    // =====================================================
    // IF NO STUDENTS MATCH FILTER
    // =====================================================

    if (studentUserIds.length === 0) {
      return NextResponse.json(
        {
          success: true,

          hod: {
            name: user.name,
            email: user.email,
            department,
            designation: mentor.designation,
          },

          count: 0,

          students: [],

          projects: [],
        },
        {
          status: 200,
        }
      );
    }

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
    // GET UNIQUE STUDENTS HAVING HOD PROJECT
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

    // =====================================================
    // LOG
    // =====================================================

   

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