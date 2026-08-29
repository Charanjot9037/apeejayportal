import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import Projects from "@/models/projects";

import { authenticateUser } from "@/lib/authentication";

export async function GET() {
  try {
    // =========================================================
    // 1. CONNECT DATABASE
    // =========================================================

    await connectDB();

    // =========================================================
    // 2. AUTHENTICATE LOGGED-IN USER
    // =========================================================

    const auth = await authenticateUser();

    if (!auth?.success || !auth?.user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: auth?.message || "Unauthorized",
        },
        {
          status: auth?.status || 401,
        }
      );
    }

    // =========================================================
    // 3. GET USER
    // =========================================================

    const user = await User.findById(auth.user._id)
      .select("name email role")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 4. CHECK MENTOR ROLE
    // =========================================================

    if (
      user.role?.trim().toLowerCase() !== "mentor"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        }
      );
    }

    // =========================================================
    // 5. GET MENTOR PROFILE
    // =========================================================

    const mentor = await Mentor.findOne({
      userId: user._id,
    })
      .select("department designation")
      .lean();

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor profile not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 6. CHECK HOD DESIGNATION
    // =========================================================

    const designation =
      mentor.designation?.trim().toLowerCase();

    if (designation !== "hod") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only HODs can access this dashboard",
        },
        {
          status: 403,
        }
      );
    }

    // =========================================================
    // 7. GET HOD DEPARTMENT
    // =========================================================

    const department =
      mentor.department?.trim();

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "HOD department not found",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedDepartment =
      department.toLowerCase();

    // =========================================================
    // 8. GET STUDENTS FROM HOD DEPARTMENT
    //
    // Student.department
    //        ↓
    // Student.userId
    //        ↓
    // Projects.student
    // =========================================================

    const students = await Student.find({
      $expr: {
        $eq: [
          {
            $toLower: {
              $trim: {
                input: {
                  $ifNull: [
                    "$department",
                    "",
                  ],
                },
              },
            },
          },
          normalizedDepartment,
        ],
      },
    })
      .select("userId")
      .lean();

    // =========================================================
    // 9. GET STUDENT USER IDS
    // =========================================================

    const studentUserIds = students
      .map(
        (student) => student.userId
      )
      .filter(Boolean);

    // =========================================================
    // 10. GET MENTOR COUNT
    //
    // Mentors belonging to same department
    // =========================================================

    const mentorCount =
      await Mentor.countDocuments({
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: {
                    $ifNull: [
                      "$department",
                      "",
                    ],
                  },
                },
              },
            },
            normalizedDepartment,
          ],
        },
      });

    // =========================================================
    // 11. GET PROJECTS
    //
    // Only projects belonging to students
    // from HOD's department.
    //
    // projectType and status come directly
    // from Projects collection.
    // =========================================================

    let rawProjects = [];

    if (studentUserIds.length > 0) {
      rawProjects =
        await Projects.find({
          student: {
            $in: studentUserIds,
          },
        })
          .select(
            "_id title subtitle semester student mentor status mentorReviewedAt createdAt updatedAt"
          )
          .populate({
            path: "student",
            select: "name email",
          })
          .populate({
            path: "mentor",
            select: "name",
          })
          .sort({
            createdAt: -1,
          })
          .lean();
    }

    // =========================================================
    // 12. PROJECT STATISTICS
    // =========================================================

    let pendingReviews = 0;
    let mentorVerified = 0;

    rawProjects.forEach((project) => {
      const status =
        project.status
          ?.trim()
          .toLowerCase();

      // Pending
      if (
        status === "pending approval" ||
        status === "in review"
      ) {
        pendingReviews++;
      }

      // Verified
      if (
        status === "approved"
      ) {
        mentorVerified++;
      }
    });

    // =========================================================
    // 13. FORMAT PROJECTS FOR ROSTER
    // =========================================================

    const projects =
      rawProjects.map((project) => {
        let approvalDate = "-";

        if (project.mentorReviewedAt) {
          approvalDate =
            new Date(
              project.mentorReviewedAt
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );
        }

        return {
          // ---------------------------------------
          // IDs
          // ---------------------------------------

          _id: String(project._id),

          id: String(project._id),

          // ---------------------------------------
          // PROJECT
          // ---------------------------------------

          projectTitle:
            project.title || "-",

          title:
            project.title || "-",

          subtitle:
            project.subtitle || "",


          semester:
            project.semester || "",

          // ---------------------------------------
          // STUDENT
          // ---------------------------------------

          student:
            project.student?.name ||
            "Unknown Student",

          // ---------------------------------------
          // MENTORS
          // ---------------------------------------

          mentor:
            project.mentor?.name ||
            "Not Assigned",


          // ---------------------------------------
          // STATUS
          // ---------------------------------------

          status:
            project.status || "-",

          // ---------------------------------------
          // APPROVAL
          // ---------------------------------------

          approvalDate,

          mentorReviewedAt:
            project.mentorReviewedAt ||
            null,

        };
      });

    // =========================================================
    // 14. RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        // ---------------------------------------
        // HOD INFORMATION
        // ---------------------------------------

        hod: {
          name: user.name,
          email: user.email,
          department,
          designation:
            mentor.designation,
        },

        // ---------------------------------------
        // DASHBOARD STATISTICS
        // ---------------------------------------

        statistics: {
          students:
            students.length,

          mentors:
            mentorCount,

          projects:
            projects.length,

          pendingReviews,

          mentorVerified,
        },

        // ---------------------------------------
        // PROJECT ROSTER
        // ---------------------------------------

        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "HOD DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch HOD dashboard",
      },
      {
        status: 500,
      }
    );
  }
}