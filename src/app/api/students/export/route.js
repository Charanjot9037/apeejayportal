// import { NextResponse } from "next/server";
// import ExcelJS from "exceljs";
// import { PassThrough } from "stream";

// import { connectDB } from "@/lib/db";
// import User from "@/models/user";

// export const runtime = "nodejs";

// export async function GET(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);

//     const search =
//       searchParams.get("search")?.trim() || "";

//     const department =
//       searchParams.get("department") || "all";

//     const skill =
//       searchParams.get("skill") || "all";

//     // ============================================
//     // USER FILTER
//     // ============================================

//     const match = {
//       role: "student",
//     };

//     if (search) {
//       const regex = new RegExp(
//         escapeRegex(search),
//         "i"
//       );

//       match.$or = [
//         { name: regex },
//         { email: regex },
//         { category: regex },
//       ];
//     }

//     if (department !== "all") {
//       match.category = department;
//     }

//     // ============================================
//     // GET USERS + PROJECTS
//     // ============================================

//     const pipeline = [
//       {
//         $match: match,
//       },

//       {
//         $lookup: {
//           from: "projects",
//           localField: "_id",
//           foreignField: "student",
//           as: "projects",
//         },
//       },

//       // ==========================================
//       // SKILL FILTER
//       // ==========================================

//       ...(skill !== "all"
//         ? [
//             {
//               $match: {
//                 "projects.techStack": {
//                   $regex: new RegExp(
//                     `^${escapeRegex(skill)}$`,
//                     "i"
//                   ),
//                 },
//               },
//             },
//           ]
//         : []),

//       // ==========================================
//       // ONLY REQUIRED DATA
//       // ==========================================

//       {
//         $project: {
//           name: 1,
//           email: 1,
//           category: 1,

//           projects: {
//             $map: {
//               input: "$projects",
//               as: "project",
//               in: {
//                 techStack:
//                   "$$project.techStack",

//                 semester:
//                   "$$project.semester",
//               },
//             },
//           },
//         },
//       },
//     ];

//     const cursor = User.aggregate(
//       pipeline
//     ).cursor({
//       batchSize: 100,
//     });

//     // ============================================
//     // EXCEL
//     // ============================================

//     const stream = new PassThrough();

//     const workbook =
//       new ExcelJS.stream.xlsx.WorkbookWriter({
//         stream,
//         useStyles: true,
//         useSharedStrings: true,
//       });

//     const worksheet =
//       workbook.addWorksheet("Students");

//     worksheet.columns = [
//       {
//         header: "Student Name",
//         key: "name",
//         width: 28,
//       },
//       {
//         header: "Email",
//         key: "email",
//         width: 35,
//       },
//       {
//         header: "Department",
//         key: "department",
//         width: 25,
//       },
//       {
//         header: "Skills",
//         key: "skills",
//         width: 50,
//       },
//       {
//         header: "Semester",
//         key: "semester",
//         width: 15,
//       },
//     ];

//     worksheet.getRow(1).font = {
//       bold: true,
//     };

//     worksheet.getRow(1).commit();

//     // ============================================
//     // WRITE STUDENTS
//     // ============================================

//     for await (const student of cursor) {
//       const projects = Array.isArray(
//         student.projects
//       )
//         ? student.projects
//         : [];

//       // Collect all skills from projects
//       const skills = [
//         ...new Set(
//           projects.flatMap((project) =>
//             Array.isArray(project.techStack)
//               ? project.techStack
//               : []
//           )
//         ),
//       ];

//       // Collect semesters
//       const semesters = [
//         ...new Set(
//           projects
//             .map((project) => project.semester)
//             .filter(Boolean)
//         ),
//       ];

//       worksheet
//         .addRow({
//           name: student.name || "",

//           email: student.email || "",

//           department:
//             student.category || "",

//           skills: skills.join(", "),

//           semester: semesters.join(", "),
//         })
//         .commit();
//     }

//     await worksheet.commit();
//     await workbook.commit();

//     // ============================================
//     // DOWNLOAD
//     // ============================================

//     return new NextResponse(
//       new ReadableStream({
//         start(controller) {
//           stream.on("data", (chunk) => {
//             controller.enqueue(chunk);
//           });

//           stream.on("end", () => {
//             controller.close();
//           });

//           stream.on("error", (error) => {
//             controller.error(error);
//           });
//         },
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type":
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

//           "Content-Disposition":
//             'attachment; filename="student-profiles.xlsx"',
//         },
//       }
//     );
//   } catch (error) {
//     console.error(
//       "STUDENT_EXPORT_ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         message:
//           "Failed to export students",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// function escapeRegex(value) {
//   return value.replace(
//     /[.*+?^${}()|[\]\\]/g,
//     "\\$&"
//   );
// }
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const department =
      searchParams.get("department") || "all";

    const skill =
      searchParams.get("skill") || "all";

    // ==================================================
    // USER FILTER
    // ==================================================

    const userMatch = {
      role: "student",
    };

    // ==================================================
    // AGGREGATION
    // ==================================================

    const pipeline = [
      // -----------------------------------------------
      // 1. ONLY STUDENT USERS
      // -----------------------------------------------

      {
        $match: userMatch,
      },

      // -----------------------------------------------
      // 2. JOIN USER WITH STUDENT PROFILE
      // User._id → Student.userId
      // -----------------------------------------------

      {
        $lookup: {
          from: "students",

          localField: "_id",

          foreignField: "userId",

          as: "studentProfile",
        },
      },

      // -----------------------------------------------
      // 3. ONE STUDENT PROFILE
      // -----------------------------------------------

      {
        $unwind: {
          path: "$studentProfile",

          preserveNullAndEmptyArrays: false,
        },
      },

      // -----------------------------------------------
      // 4. SEARCH
      // -----------------------------------------------

      ...(search
        ? [
            {
              $match: {
                $or: [
                  // User name
                  {
                    name: {
                      $regex:
                        escapeRegex(search),

                      $options: "i",
                    },
                  },

                  // User email
                  {
                    email: {
                      $regex:
                        escapeRegex(search),

                      $options: "i",
                    },
                  },

                  // Student name
                  {
                    "studentProfile.fullName": {
                      $regex:
                        escapeRegex(search),

                      $options: "i",
                    },
                  },

                  // Department
                  {
                    "studentProfile.department": {
                      $regex:
                        escapeRegex(search),

                      $options: "i",
                    },
                  },

                  // Skills
                  {
                    "studentProfile.skills": {
                      $regex:
                        escapeRegex(search),

                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      // -----------------------------------------------
      // 5. DEPARTMENT FILTER
      // -----------------------------------------------

      ...(department !== "all"
        ? [
            {
              $match: {
                "studentProfile.department":
                  department,
              },
            },
          ]
        : []),

      // -----------------------------------------------
      // 6. SKILL FILTER
      // -----------------------------------------------

      ...(skill !== "all"
        ? [
            {
              $match: {
                "studentProfile.skills": {
                  $regex: new RegExp(
                    `^${escapeRegex(skill)}$`,
                    "i"
                  ),
                },
              },
            },
          ]
        : []),

      // -----------------------------------------------
      // 7. ONLY REQUIRED FIELDS
      // -----------------------------------------------

      {
        $project: {
          _id: 0,

          // FROM USER
          name: 1,

          email: 1,

          // FROM STUDENT
          department:
            "$studentProfile.department",

          skills:
            "$studentProfile.skills",

          semester:
            "$studentProfile.currentSemester",
        },
      },
    ];

    // ==================================================
    // MONGODB CURSOR
    // ==================================================

    const cursor = User.aggregate(
      pipeline
    ).cursor({
      batchSize: 100,
    });

    // ==================================================
    // EXCEL STREAM
    // ==================================================

    const stream = new PassThrough();

    const workbook =
      new ExcelJS.stream.xlsx.WorkbookWriter({
        stream,

        useStyles: true,

        useSharedStrings: true,
      });

    const worksheet =
      workbook.addWorksheet("Students");

    // ==================================================
    // EXCEL COLUMNS
    // ==================================================

    worksheet.columns = [
      {
        header: "Student Name",

        key: "name",

        width: 28,
      },

      {
        header: "Email",

        key: "email",

        width: 35,
      },

      {
        header: "Department",

        key: "department",

        width: 25,
      },

      {
        header: "Skills",

        key: "skills",

        width: 50,
      },

      {
        header: "Semester",

        key: "semester",

        width: 15,
      },
    ];

    // ==================================================
    // HEADER
    // ==================================================

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).commit();

    // ==================================================
    // WRITE STUDENTS
    // ==================================================

    for await (const student of cursor) {
      const skills = Array.isArray(
        student.skills
      )
        ? [
            ...new Set(
              student.skills
                .filter(Boolean)
                .map((item) =>
                  String(item).trim()
                )
            ),
          ].join(", ")
        : "";

      worksheet
        .addRow({
          // User collection
          name: student.name || "",

          // User collection
          email: student.email || "",

          // Student collection
          department:
            student.department || "",

          // Student collection
          skills,

          // Student collection
          semester:
            student.semester || "",
        })
        .commit();
    }

    // ==================================================
    // COMPLETE WORKBOOK
    // ==================================================

    await worksheet.commit();

    await workbook.commit();

    // ==================================================
    // DOWNLOAD
    // ==================================================

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          stream.on("data", (chunk) => {
            controller.enqueue(chunk);
          });

          stream.on("end", () => {
            controller.close();
          });

          stream.on("error", (error) => {
            controller.error(error);
          });
        },
      }),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            'attachment; filename="student-profiles.xlsx"',
        },
      }
    );
  } catch (error) {
    console.error(
      "STUDENT_EXPORT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to export students",
      },
      {
        status: 500,
      }
    );
  }
}

// ==================================================
// ESCAPE REGEX
// ==================================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}