import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Mentor from "@/models/mentor";

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
    // GET MENTORS FROM SAME DEPARTMENT
    // =====================================================

    const mentors = await Mentor.find({
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
        select: "name email status profileImage",
      })
      .select(
        "userId mobileNumber department designation"
      )
      .lean();

    console.log("=================================");
    console.log("HOD:", user.name);
    console.log("HOD DEPARTMENT:", department);
    console.log(
      "DEPARTMENT MENTORS:",
      mentors.length
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

        count: mentors.length,

        mentors,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "HOD MENTORS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch mentors",
      },
      {
        status: 500,
      }
    );
  }
}