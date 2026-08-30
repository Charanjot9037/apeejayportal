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
    console.log("filters : ",filters);

    const {
      program,
      semester,
      specialization,
      status,
      mentor,
    } = filters || {};


  

console.log(program,specialization,semester);
    // =========================================================
    // 3. AUTHENTICATE LOGGED-IN USER
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



    if (user.role?.trim().toLowerCase() !== "mentor") {
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
        }
      );
    }



    const designation =
      mentorProfile.designation?.trim().toLowerCase();

    if (designation !== "hod") {
      return NextResponse.json(
        {
          success: false,
          message: "Only HODs can access this dashboard",
        },
        {
          status: 403,
        }
      );
    }



    const department =
      mentorProfile.department?.trim();

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
console.log("teacher dep",department);
    const normalizedDepartment =
      department.toLowerCase();


// 9. BUILD STUDENT FILTER
//
// These filters belong to Student collection:
//
// department
// program
// currentSemester
// specialization
// =========================================================

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


if (specialization) {
  studentConditions.push({
    $expr: {
      $eq: [
        {
          $toLower: {
            $trim: {
              input: {
                $ifNull: [
                  "$specialization",
                  "",
                ],
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




const students =
  await Student.find(studentQuery)
    .select("userId fullName program specialization")
    .lean();

console.log(
  "FILTERED STUDENTS:",
  students
);



const studentUserIds = students
  .map(
    (student) => student.userId
  )
  .filter(Boolean);



const mentorCount = await Mentor.countDocuments({
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
      $in: [
        String(semester),
        Number(semester),
      ],
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

  console.log(
    "PROJECT QUERY:",
    JSON.stringify(
      projectQuery,
      null,
      2
    )
  );


rawProjects = await Projects.find(projectQuery)
  .select(
    "_id title subtitle semester student mentor status mentorReviewedAt createdAt updatedAt"
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



  
      console.log(
  "RAW PROJECTS:",
  rawProjects
);

  



    let pendingReviews = 0;
    let mentorVerified = 0;

    rawProjects.forEach((project) => {
      const projectStatus =
        project.status
          ?.trim()
          .toLowerCase();

      if (
        projectStatus === "pending approval" ||
        projectStatus === "in review"
      ) {
        pendingReviews++;
      }

      if (projectStatus === "approved") {
        mentorVerified++;
      }
    });


    const projects = rawProjects.map(
      (project) => {
        let approvalDate = "-";

        if (project.mentorReviewedAt) {
          approvalDate = new Date(
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
          // IDs
          _id: String(project._id),
          id: String(project._id),

          // PROJECT
          projectTitle:
            project.title || "-",

          title:
            project.title || "-",

          subtitle:
            project.subtitle || "",

          semester:
            project.semester || "",

          // STUDENT
          student:
            project.student?.name ||
            "Unknown Student",


          // MENTOR
          mentor:
            project.mentor?.name ||
            "Not Assigned",


          // STATUS
          status:
            project.status || "-",

          // APPROVAL
          approvalDate,

        };
      }
    );
console.log("projects: ",projects);
    // =========================================================
    // 17. RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        statistics: {
      students: students.length,
      mentors: mentorCount,
      projects: projects.length,
      pendingReviews,
      mentorVerified,
    },


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