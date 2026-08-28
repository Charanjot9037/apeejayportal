
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import Projects from "@/models/projects";

import { authenticateUser } from "@/lib/authentication";

export async function GET() {
  try {
    await connectDB();

    // =========================================================
    // 1. AUTHENTICATE LOGGED-IN USER
    // =========================================================

    const auth = await authenticateUser();

    if (!auth?.success || !auth?.user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: auth?.message || "Unauthorized",
        },
        { status: auth?.status || 401 }
      );
    }

    // =========================================================
    // 2. GET LOGGED-IN USER
    // =========================================================

    const user = await User.findById(auth.user._id).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 3. USER MUST HAVE MENTOR ROLE
    // =========================================================

    if (user.role?.trim().toLowerCase() !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // =========================================================
    // 4. FIND MENTOR PROFILE
    // =========================================================

    const mentor = await Mentor.findOne({
      userId: user._id,
    }).lean();

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor profile not found",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 5. CHECK HOD DESIGNATION
    // =========================================================

    if (
      mentor.designation?.trim().toLowerCase() !== "hod"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HODs can access this dashboard",
        },
        { status: 403 }
      );
    }

    // =========================================================
    // 6. GET HOD DEPARTMENT
    // =========================================================

    const department = mentor.department?.trim();

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "HOD department not found",
        },
        { status: 400 }
      );
    }

    const normalizedDepartment =
      department.toLowerCase();

    console.log("=================================");
    console.log("HOD:", user.name);
    console.log("HOD DEPARTMENT:", department);
    console.log("=================================");

    // =========================================================
    // 7. GET ALL STUDENTS OF HOD DEPARTMENT
    // =========================================================

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
    }).lean();

    console.log(
      "DEPARTMENT STUDENTS:",
      students.length
    );

    console.log(
      "STUDENT PROFILES:",
      students.map((student) => ({
        studentId: String(student._id),
        userId: student.userId
          ? String(student.userId)
          : null,
        name: student.fullName,
        department: student.department,
      }))
    );

    // =========================================================
    // 8. GET STUDENT USER IDS
    //
    // Student.userId === Projects.student
    //
    // Student collection:
    //
    // _id    -> Student document ID
    // userId -> User document ID
    //
    // Projects collection:
    //
    // student -> User document ID
    // =========================================================

    const studentUserIds = students
      .map((student) => student.userId)
      .filter(Boolean);

    console.log(
      "STUDENT USER IDS:",
      studentUserIds.map((id) => String(id))
    );

    // =========================================================
    // 9. GET MENTORS OF SAME DEPARTMENT
    // =========================================================

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
        select: "name email",
      })
      .select(
        "userId mobileNumber department designation"
      )
      .lean();

    console.log(
      "DEPARTMENT MENTORS:",
      mentors.length
    );

    // =========================================================
    // 10. GET PROJECTS
    //
    // IMPORTANT:
    //
    // Projects.student contains User._id
    //
    // Therefore:
    //
    // Student.userId
    //       ↓
    // Projects.student
    //
    // Only projects belonging to students from the
    // HOD's department will be returned.
    // =========================================================

    let rawProjects = [];

    if (studentUserIds.length > 0) {
      rawProjects = await Projects.find({
        student: {
          $in: studentUserIds,
        },
      })
        .populate({
          path: "student",
          select: "name email",
        })
        .populate({
          path: "mentor",
          select: "name email role",
        })
        .populate({
          path: "mentor2",
          select: "name email role",
        })
        .lean();
    }

    console.log(
      "DEPARTMENT PROJECTS:",
      rawProjects.length
    );

    console.log(
      "PROJECT STUDENT MATCHES:",
      rawProjects.map((project) => ({
        projectId: String(project._id),
        title: project.title,

        projectStudentUserId:
          project.student?._id
            ? String(project.student._id)
            : null,

        matchedStudent:
          students.find(
            (student) =>
              String(student.userId) ===
              String(project.student?._id)
          )?.fullName || null,
      }))
    );

    // =========================================================
    // 11. CREATE STUDENT MAP
    //
    // Key = Student.userId
    //
    // Project.student = User._id
    //
    // Therefore both can be matched directly.
    // =========================================================

    const studentMap = new Map();

    students.forEach((student) => {
      if (student.userId) {
        studentMap.set(
          String(student.userId),
          student
        );
      }
    });

    // =========================================================
    // 12. FORMAT PROJECTS
    // =========================================================

    const projects = rawProjects.map((project) => {
      // =======================================================
      // PROJECT STUDENT USER ID
      // =======================================================

      const projectStudentUserId =
        project.student?._id
          ? String(project.student._id)
          : null;

      // =======================================================
      // FIND STUDENT PROFILE
      // =======================================================

      const studentProfile =
        projectStudentUserId
          ? studentMap.get(projectStudentUserId)
          : null;

      // =======================================================
      // STUDENT NAME
      // =======================================================

      const studentName =
        project.student?.name ||
        studentProfile?.fullName ||
        "Unknown Student";

      // =======================================================
      // STUDENT EMAIL
      // =======================================================

      const studentEmail =
        project.student?.email || "";

      // =======================================================
      // MENTOR NAME
      // =======================================================

      let mentorName = "Not Assigned";

      if (
        project.mentor &&
        typeof project.mentor === "object"
      ) {
        mentorName =
          project.mentor.name ||
          "Unknown Mentor";
      }

      // =======================================================
      // SECOND MENTOR
      // =======================================================

      let mentor2Name = "Not Assigned";

      if (
        project.mentor2 &&
        typeof project.mentor2 === "object"
      ) {
        mentor2Name =
          project.mentor2.name ||
          "Unknown Mentor";
      }

      // =======================================================
      // APPROVAL DATE
      // =======================================================

      let approvalDate = "-";

      if (project.mentorReviewedAt) {
        approvalDate = new Date(
          project.mentorReviewedAt
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      // =======================================================
      // RETURN PROJECT
      // =======================================================

      return {
        // -----------------------------------------------------
        // IDs
        // -----------------------------------------------------

        _id: String(project._id),

        id: String(project._id),

        // -----------------------------------------------------
        // PROJECT
        // -----------------------------------------------------

        projectTitle:
          project.title || "-",

        title:
          project.title || "-",

        subtitle:
          project.subtitle || "",

        description:
          project.description || "",

        techStack:
          Array.isArray(project.techStack)
            ? project.techStack
            : [],

        projectType:
          project.projectType || "",

        semester:
          project.semester || "",

        githubLink:
          project.githubLink || "",

        liveLink:
          project.liveLink || "",

        // -----------------------------------------------------
        // STUDENT
        // -----------------------------------------------------

        student: studentName,

        studentId:
          studentProfile?._id
            ? String(studentProfile._id)
            : null,

        studentUserId:
          projectStudentUserId,

        email:
          studentEmail,

        rollNo:
          studentProfile?.rollNumber || "-",

        department:
          studentProfile?.department ||
          department,

        program:
          studentProfile?.program || "",

        specialization:
          studentProfile?.specialization || "",

        academicBatch:
          studentProfile?.academicBatch || "",

        currentSemester:
          project.semester || "",

        // -----------------------------------------------------
        // MENTORS
        // -----------------------------------------------------

        mentor:
          mentorName,

        mentor2:
          mentor2Name,

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        status:
          project.status || "-",

        mentorComment:
          project.mentorComment || "",

        mentorReviewedAt:
          project.mentorReviewedAt || null,

        approvalDate,

        // -----------------------------------------------------
        // OTHER PROJECT DATA
        // -----------------------------------------------------

        teamMembers:
          project.teamMembers || null,

        mentorReviews:
          Array.isArray(project.mentorReviews)
            ? project.mentorReviews
            : [],

        projectImages:
          Array.isArray(project.projectImages)
            ? project.projectImages
            : [],

        synopsisFile:
          project.synopsisFile || null,

        reportFile:
          project.reportFile || null,

        presentationFile:
          project.presentationFile || null,

        presentationFile2:
          project.presentationFile2 || null,

        synopsisFile2:
          project.synopsisFile2 || null,

        reportFile2:
          project.reportFile2 || null,

        createdAt:
          project.createdAt || null,

        updatedAt:
          project.updatedAt || null,
      };
    });

    // =========================================================
    // 13. PROJECT STATISTICS
    // =========================================================

    const pendingReviews =
      projects.filter((project) => {
        const status =
          project.status
            ?.trim()
            .toLowerCase();

        return (
          status === "pending approval" ||
          status === "pending" ||
          status === "in review"
        );
      }).length;

    const mentorVerified =
      projects.filter((project) => {
        const status =
          project.status
            ?.trim()
            .toLowerCase();

        return (
          status === "approved" ||
          status === "verified" ||
          status === "mentor verified"
        );
      }).length;

    // =========================================================
    // 14. RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        // -----------------------------------------------------
        // HOD
        // -----------------------------------------------------

        hod: {
          name: user.name,
          email: user.email,
          department,
          designation: mentor.designation,
        },

        // -----------------------------------------------------
        // STATISTICS
        // -----------------------------------------------------

        statistics: {
          students: students.length,
          mentors: mentors.length,
          projects: projects.length,
          pendingReviews,
          mentorVerified,
        },

        // -----------------------------------------------------
        // DATA
        // -----------------------------------------------------

        students,

        mentors,

        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "HOD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch HOD data",
      },
      {
        status: 500,
      }
    );
  }
}


