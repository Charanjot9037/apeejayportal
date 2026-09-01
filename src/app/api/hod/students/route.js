import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/student";
import { getHODContext } from "@/lib/getHODContext";

export async function POST(request) {
  try {
    await connectDB();

    // =====================================================
    // 1. HOD AUTHENTICATION
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
        },
      );
    }

    const { user, mentor, department, normalizedDepartment } = hod;

    // =====================================================
    // 2. GET FILTERS FROM FRONTEND
    // =====================================================

    const filters = await request.json();

    const { program, semester, specialization } = filters || {};

    // =====================================================
    // 3. BUILD STUDENT CONDITIONS
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
    // CURRENT SEMESTER
    // =====================================================

    if (semester) {
      studentConditions.push({
        $expr: {
          $eq: [
            {
              $toString: {
                $ifNull: ["$currentSemester", ""],
              },
            },
            String(semester).trim(),
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
    // 4. FINAL QUERY
    // =====================================================

    const studentQuery = {
      $and: studentConditions,
    };

    console.log("STUDENT QUERY:", JSON.stringify(studentQuery, null, 2));

    // =====================================================
    // 5. GET FILTERED STUDENTS
    // =====================================================

    const students = await Student.find(studentQuery)
      .populate({
        path: "userId",
        select: "name email status mentorId",
        populate: {
          path: "mentorId",
          select: "name email status",
        },
      })
      .lean();

    // =====================================================
    // 6. RESPONSE
    // =====================================================

    console.log("FILTERED STUDENTS:", students);

    return NextResponse.json(
      {
        success: true,

        hod: {
          name: user.name,
          email: user.email,
          department,
          designation: mentor.designation,
        },

        filters: {
          program: program || "",
          semester: semester || "",
          specialization: specialization || "",
        },

        count: students.length,

        students,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("HOD STUDENTS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch students",
      },
      {
        status: 500,
      },
    );
  }
}
