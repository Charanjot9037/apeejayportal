import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import Projects from "@/models/projects";

import { authenticateUser } from "@/lib/authentication";

export async function POST(request) {
  try {
    // =========================================================
    // 1. CONNECT DATABASE
    // =========================================================

    await connectDB();

    // =========================================================
    // 2. GET FILTERS FROM ROSTER
    // =========================================================

    const filters = await request.json();
    console.log("filters : ", filters);

    const {
      program,
      semester,
      specialization,
      status,
      mentor,
      department,
      academiYear,
    } = filters || {};

    const auth = await authenticateUser();

    if (!auth?.success || !auth?.user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: auth?.message || "Unauthorized",
        },
        {
          status: auth?.status || 401,
        },
      );
    }

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
        },
      );
    }

    if (user.role?.trim().toLowerCase() !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        },
      );
    }

    const mentorProfile = await Mentor.findOne({
      userId: user._id,
    })
      .select("department designation")
      .lean();

    if (!mentorProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor profile not found",
        },
        {
          status: 404,
        },
      );
    }

    const designation = mentorProfile.designation?.trim().toLowerCase();
    console.log(designation);
    if (designation !== "engineer") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can access this dashboard",
        },
        {
          status: 403,
        },
      );
    }

    const normalizedDepartment = department?.toLowerCase();

    const studentConditions = [
      // ---------------------------------------------------------
      // HOD DEPARTMENT
      // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // PROGRAM
    // ---------------------------------------------------------

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
    if (academiYear) {
      studentConditions.push({
        $expr: {
          $eq: [
            {
              $toString: {
                $ifNull: ["$academicYear", ""],
              },
            },
            academiYear.toString().trim(),
          ],
        },
      });
    }

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

    const studentQuery = {
      $and: studentConditions,
    };

    const students = await Student.find(studentQuery)
      .select("userId fullName program specialization")
      .lean();

    const studentUserIds = students
      .map((student) => student.userId)
      .filter(Boolean);

    const totalStudents = await Student.countDocuments({});

    // Total mentors
    const totalMentors = await Mentor.countDocuments({});

    // Total projects
    const totalProjects = await Projects.countDocuments({});

    // Pending reviews
    const pendingReviews = await Projects.countDocuments({
      // CHANGE THIS CONDITION according to your schema
      status: "Pending Approval",
    });

    // Mentor verified projects
    const mentorVerified = await Projects.countDocuments({
      // CHANGE this field if your schema uses another name
      status: "Approved",
    });

    let rawProjects = [];

    if (studentUserIds.length > 0) {
      const projectQuery = {
        $or: [
          {
            student: {
              $in: studentUserIds,
            },
          },
          {
            teamMembers: {
              $in: studentUserIds,
            },
          },
        ],
      };
      // -------------------------------------------------------
      // PROJECT SEMESTER
      // -------------------------------------------------------

      if (semester) {
        projectQuery.semester = {
          $in: [String(semester), Number(semester)],
        };
      }
      //   // -------------------------------------------------------
      //   // PROJECT STATUS
      //   // -------------------------------------------------------

      if (status) {
        projectQuery.status = status;
      }

      // -------------------------------------------------------
      // PROJECT MENTOR
      // -------------------------------------------------------

      if (mentor) {
        projectQuery.mentor = mentor;
      }

      rawProjects = await Projects.find(projectQuery)
        .select(
          "_id title subtitle semester student mentor status mentorReviewedAt createdAt updatedAt",
        )
        .populate({
          path: "student",
          select: "name email",
        })
        .populate({
          path: "mentor",
          select: "name email",
        })
        .sort({
          createdAt: -1,
        })
        .lean();
    }

    const projects = rawProjects.map((project) => {
      let approvalDate = "-";

      if (project.mentorReviewedAt) {
        approvalDate = new Date(project.mentorReviewedAt).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          },
        );
      }

      return {
        // IDs
        _id: String(project._id),
        id: String(project._id),

        // PROJECT
        projectTitle: project.title || "-",

        title: project.title || "-",

        subtitle: project.subtitle || "",

        semester: project.semester || "",

        // STUDENT
        student: project.student?.name || "Unknown Student",

        // MENTOR
        mentor: project.mentor?.name || "Not Assigned",

        // STATUS
        status: project.status || "-",

        // APPROVAL
        approvalDate,
      };
    });

    // =========================================================
    // 17. RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        statistics: {
          students: totalStudents,
          mentors: totalMentors,
          projects: totalProjects,
          pendingReviews,
          mentorVerified,
        },

        projects,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("HOD DASHBOARD API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch HOD dashboard",
      },
      {
        status: 500,
      },
    );
  }
}
