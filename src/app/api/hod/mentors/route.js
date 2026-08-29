import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Mentor from "@/models/mentor";

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
    // GET FILTERS FROM FRONTEND
    // =====================================================

    const filters = await request.json().catch(() => ({}));

    const {
      designation,
    } = filters || {};



    // =====================================================
    // BUILD MENTOR QUERY
    // =====================================================

    const mentorConditions = [
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
    // DESIGNATION FILTER
    // =====================================================

    if (designation) {
      mentorConditions.push({
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: {
                    $ifNull: ["$designation", ""],
                  },
                },
              },
            },
            String(designation)
              .trim()
              .toLowerCase(),
          ],
        },
      });
    }

    // =====================================================
    // FINAL QUERY
    // =====================================================

    const mentorQuery = {
      $and: mentorConditions,
    };

    


    // =====================================================
    // GET MENTORS
    // =====================================================

    const mentors = await Mentor.find(
      mentorQuery
    )
      .populate({
        path: "userId",
        select:
          "name email status profileImage",
      })
      .select(
        "userId mobileNumber department designation"
      )
      .lean();

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