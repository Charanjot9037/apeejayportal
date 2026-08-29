import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/student";
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
    // GET ALL STUDENTS OF HOD DEPARTMENT
    // =====================================================

    const students = await Student.find({
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

    console.log("=================================");
    console.log("HOD:", user.name);
    console.log("HOD DEPARTMENT:", department);
    console.log("ALL STUDENTS:", students.length);
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

        count: students.length,

        students,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "HOD STUDENTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch students",
      },
      {
        status: 500,
      }
    );
  }
}