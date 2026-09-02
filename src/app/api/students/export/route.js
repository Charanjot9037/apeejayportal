import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import User from "@/models/user";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";

    // ============================================================
    // GET STUDENTS
    // ============================================================

    const students = await Student.find(
      department && department !== "all"
        ? { department }
        : {}
    )
      .sort({ createdAt: -1 })
      .lean();

    // ============================================================
    // GET USER INFORMATION
    // Student.userId -> User._id
    // ============================================================

    const userIds = students
      .map((student) => student.userId)
      .filter(Boolean);

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("name email")
      .lean();

    // Create quick lookup
    const userMap = new Map(
      users.map((user) => [
        user._id.toString(),
        user,
      ])
    );

    // ============================================================
    // SEARCH FILTER
    // ============================================================

    const filteredStudents = students.filter((student) => {
      const user = userMap.get(
        student.userId?.toString()
      );

      const studentSkills = Array.isArray(student.skills)
        ? student.skills
        : [];

      const studentInterests = Array.isArray(student.interests)
        ? student.interests
        : [];

      if (!search.trim()) {
        return true;
      }

      const searchValue = search
        .toLowerCase()
        .trim();

      return (
        (student.fullName || "")
          .toLowerCase()
          .includes(searchValue) ||

        (user?.name || "")
          .toLowerCase()
          .includes(searchValue) ||

        (user?.email || "")
          .toLowerCase()
          .includes(searchValue) ||

        (student.program || "")
          .toLowerCase()
          .includes(searchValue) ||

        (student.department || "")
          .toLowerCase()
          .includes(searchValue) ||

        (student.specialization || "")
          .toLowerCase()
          .includes(searchValue) ||

        studentSkills.some((skill) =>
          String(skill)
            .toLowerCase()
            .includes(searchValue)
        ) ||

        studentInterests.some((interest) =>
          String(interest)
            .toLowerCase()
            .includes(searchValue)
        )
      );
    });

    // ============================================================
    // CREATE EXCEL WORKBOOK
    // ============================================================

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
      "Student Profiles"
    );

    // ============================================================
    // COLUMNS
    // ============================================================

    worksheet.columns = [
      {
        header: "Name",
        key: "name",
        width: 22,
      },
      {
        header: "Email",
        key: "email",
        width: 32,
      },
      {
        header: "Department",
        key: "department",
        width: 18,
      },
      {
        header: "Program",
        key: "program",
        width: 15,
      },
      {
        header: "Specialization",
        key: "specialization",
        width: 20,
      },
      {
        header: "Academic Batch",
        key: "academicBatch",
        width: 18,
      },
      {
        header: "Graduation Year",
        key: "lastYear",
        width: 18,
      },
      {
        header: "Roll Number",
        key: "rollNumber",
        width: 16,
      },
      {
        header: "Skills",
        key: "skills",
        width: 40,
      },
      {
        header: "Interests",
        key: "interests",
        width: 35,
      },
      {
        header: "LinkedIn",
        key: "linkedin",
        width: 35,
      },
      {
        header: "GitHub",
        key: "github",
        width: 35,
      },
      {
        header: "Portfolio",
        key: "portfolio",
        width: 40,
      },
    ];

    // ============================================================
    // HEADER STYLE
    // ============================================================

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF064A82",
      },
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.height = 25;

    // ============================================================
    // ADD STUDENTS
    // ============================================================

    filteredStudents.forEach((student) => {
      const user = userMap.get(
        student.userId?.toString()
      );

      worksheet.addRow({
        name:
          student.fullName ||
          user?.name ||
          "",

        email:
          user?.email ||
          "",

        department:
          student.department ||
          "",

        program:
          student.program ||
          "",

        specialization:
          student.specialization ||
          "",

        academicBatch:
          student.academicBatch ||
          "",

        lastYear:
          student.lastYear ||
          "",

        rollNumber:
          student.rollNumber ||
          "",

        skills:
          Array.isArray(student.skills)
            ? student.skills.join(", ")
            : "",

        interests:
          Array.isArray(student.interests)
            ? student.interests.join(", ")
            : "",

        linkedin:
          student.linkedin ||
          "",

        github:
          student.github ||
          "",

        portfolio:
          student.portfolio ||
          "",
      });
    });

    // ============================================================
    // ROW STYLING
    // ============================================================

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        row.alignment = {
          vertical: "middle",
          wrapText: true,
        };

        row.height = 25;
      }
    });

    // ============================================================
    // FREEZE HEADER
    // ============================================================

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // ============================================================
    // GENERATE FILE
    // ============================================================

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="student-profiles.xlsx"',
      },
    });
  } catch (error) {
    console.error(
      "STUDENT_EXPORT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to export students",
      },
      {
        status: 500,
      }
    );
  }
}