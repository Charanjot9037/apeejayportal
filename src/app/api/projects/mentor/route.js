// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import Project from '@/models/projects';
// import Student from '@/models/student';
// import { authenticateUser } from '@/lib/authentication';

// export async function GET(request) {
//   try {
//     await connectDB();

//     const auth = await authenticateUser();

//     if (!auth.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: auth.message,
//         },
//         {
//           status: auth.status,
//         },
//       );
//     }

//     const user = auth.user;

//     if (user.role !== 'mentor') {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Access denied. Mentors only are allowed.',
//         },
//         {
//           status: 403,
//         },
//       );
//     }

//     // =========================================
//     // GET ONLY PROJECTS OF LOGGED-IN MENTOR
//     // =========================================

//     const projects = await Project.find({
//       $or: [{ mentor: auth.user._id }, { mentor2: auth.user._id }],
//     })
//       .populate({
//         path: 'student',
//         select: 'name email',
//       })
//       .sort({ createdAt: -1 })
//       .lean();

//     // =========================================
//     // GET STUDENT USER IDS
//     // =========================================

//     const studentUserIds = projects
//       .map((project) => project.student?._id)
//       .filter(Boolean);

//     // =========================================
//     // GET STUDENT ACADEMIC DETAILS
//     // =========================================

//     const studentProfiles = await Student.find({
//       userId: {
//         $in: studentUserIds,
//       },
//     }).select(
//       'userId department program rollNumber specialization academicBatch',
//     );

//     // =========================================
//     // CREATE USER ID -> STUDENT PROFILE MAP
//     // =========================================

//     const profileMap = {};

//     studentProfiles.forEach((student) => {
//       profileMap[student.userId.toString()] = student;
//     });

//     // =========================================
//     // MERGE PROJECT + STUDENT DETAILS
//     // =========================================

//     const enrichedProjects = projects.map((project) => {
//       const studentId = project.student?._id?.toString();

//       const profile = studentId ? profileMap[studentId] : null;

//       return {
//         ...project,

//         student: project.student
//           ? {
//               ...project.student,

//               department: profile?.department || '',

//               program: profile?.program || '',

//               rollNumber: profile?.rollNumber || '',

//               specialization: profile?.specialization || '',

//               academicBatch: profile?.academicBatch || '',
//             }
//           : null,

//         // Semester belongs to Project
//         semester: project.semester || '',
//       };
//     });

//     // =========================================
//     // RESPONSE
//     // =========================================

//     return NextResponse.json({
//       success: true,
//       projects: enrichedProjects,
//     });
//   } catch (error) {
//     console.error('MENTOR_PROJECTS_GET_ERROR:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch mentor's projects.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Project from "@/models/projects";
import Student from "@/models/student";
import User from "@/models/user";

import { authenticateUser } from "@/lib/authentication";

// =====================================================
// GET - ALL PROJECTS OF LOGGED-IN MENTOR
// =====================================================

export async function GET(request) {
  try {
    await connectDB();

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    const user = auth.user;

    if (user.role !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Mentors only are allowed.",
        },
        {
          status: 403,
        },
      );
    }

    // =========================================
    // GET ONLY PROJECTS OF LOGGED-IN MENTOR
    // =========================================

    const projects = await Project.find({
      $or: [{ mentor: auth.user._id }, { mentor2: auth.user._id }],
    })
      .populate({
        path: "student",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .lean();

    // =========================================
    // GET STUDENT USER IDS
    // =========================================

    const studentUserIds = projects
      .map((project) => project.student?._id)
      .filter(Boolean);

    // =========================================
    // GET STUDENT ACADEMIC DETAILS
    // =========================================

    const studentProfiles = await Student.find({
      userId: {
        $in: studentUserIds,
      },
    }).select(
      "userId department program rollNumber specialization academicBatch",
    );

    // =========================================
    // CREATE USER ID -> STUDENT PROFILE MAP
    // =========================================

    const profileMap = {};

    studentProfiles.forEach((student) => {
      profileMap[student.userId.toString()] = student;
    });

    // =========================================
    // MERGE PROJECT + STUDENT DETAILS
    // =========================================

    const enrichedProjects = projects.map((project) => {
      const studentId = project.student?._id?.toString();

      const profile = studentId ? profileMap[studentId] : null;

      return {
        ...project,

        student: project.student
          ? {
              ...project.student,

              department: profile?.department || "",
              program: profile?.program || "",
              rollNumber: profile?.rollNumber || "",
              specialization: profile?.specialization || "",
              academicBatch: profile?.academicBatch || "",
            }
          : null,

        // Semester belongs to Project
        semester: project.semester || "",
      };
    });

    return NextResponse.json({
      success: true,
      projects: enrichedProjects,
    });
  } catch (error) {
    console.error("MENTOR_PROJECTS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch mentor's projects.",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// POST - FILTER PROJECTS OF LOGGED-IN MENTOR
// =====================================================

export async function POST(request) {
  try {
    await connectDB();

    // ===================================================
    // AUTHENTICATION
    // ===================================================

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    const user = auth.user;

    // ===================================================
    // MENTOR ONLY
    // ===================================================

    if (user.role !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Mentors only are allowed.",
        },
        {
          status: 403,
        },
      );
    }

    // ===================================================
    // GET FILTERS
    // ===================================================

    const filters = await request.json();

    console.log("MENTOR FILTERS:", filters);

    const { program = "", semester = "", academicYear = "" } = filters || {};

    // ===================================================
    // BUILD PROJECT QUERY
    // IMPORTANT:
    // First restrict projects to logged-in mentor
    // ===================================================

    const projectQuery = {
      $or: [{ mentor: user._id }, { mentor2: user._id }],
    };

    // ===================================================
    // SEMESTER FILTER
    // Semester belongs directly to Project
    // ===================================================

    if (semester) {
      projectQuery.semester = {
        $in: [String(semester), Number(semester)],
      };
    }

    // ===================================================
    // GET PROJECTS
    // ===================================================

    let projects = await Project.find(projectQuery)
      .populate({
        path: "student",
        select: "name email",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    // ===================================================
    // GET STUDENT USER IDS
    // ===================================================

    const studentUserIds = projects
      .map((project) => project.student?._id)
      .filter(Boolean);

    // ===================================================
    // GET STUDENT PROFILES
    // ===================================================

    const studentProfiles = await Student.find({
      userId: {
        $in: studentUserIds,
      },
    }).select(
      "userId department program rollNumber specialization academicBatch",
    );

    // ===================================================
    // CREATE PROFILE MAP
    // ===================================================

    const profileMap = {};

    studentProfiles.forEach((student) => {
      profileMap[student.userId.toString()] = student;
    });

    // ===================================================
    // FILTER BY PROGRAM + ACADEMIC YEAR
    // ===================================================

    projects = projects.filter((project) => {
      const studentId = project.student?._id?.toString();

      const profile = studentId ? profileMap[studentId] : null;

      // -----------------------------------------------
      // PROGRAM
      // -----------------------------------------------

      if (program) {
        const projectProgram = String(profile?.program || "")
          .trim()
          .toLowerCase();

        const selectedProgram = String(program).trim().toLowerCase();

        if (projectProgram !== selectedProgram) {
          return false;
        }
      }

      // -----------------------------------------------
      // ACADEMIC YEAR
      // Student field = academicBatch
      // -----------------------------------------------

      if (academicYear) {
        const projectAcademicYear = String(profile?.academicBatch || "")
          .trim()
          .toLowerCase();

        const selectedAcademicYear = String(academicYear).trim().toLowerCase();

        if (projectAcademicYear !== selectedAcademicYear) {
          return false;
        }
      }

      return true;
    });

    // ===================================================
    // MERGE STUDENT PROFILE
    // Same structure as GET
    // ===================================================

    const enrichedProjects = projects.map((project) => {
      const studentId = project.student?._id?.toString();

      const profile = studentId ? profileMap[studentId] : null;

      return {
        ...project,

        student: project.student
          ? {
              ...project.student,

              department: profile?.department || "",
              program: profile?.program || "",
              rollNumber: profile?.rollNumber || "",
              specialization: profile?.specialization || "",
              academicBatch: profile?.academicBatch || "",
            }
          : null,

        semester: project.semester || "",
      };
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    return NextResponse.json(
      {
        success: true,
        projects: enrichedProjects,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("MENTOR_PROJECTS_POST_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to filter mentor's projects.",
      },
      {
        status: 500,
      },
    );
  }
}
