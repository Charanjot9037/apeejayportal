import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Mentor from "@/models/mentor";
import { generateTemporaryPassword } from "@/lib/generatePassword";
import { authenticateUser } from "@/lib/authentication";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const students = body.students;
    const auth = await authenticateUser();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const user = auth.user;

    if (user.role !== "mentor") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. admin is only are allowed.",
        },
        {
          status: 403,
        },
      );
    }

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status },
      );
    }

    // =========================
    // AUTHORIZATION
    // =========================
    const mentor = await Mentor.findOne({
      userId: auth.user._id,
    });

    if (
      auth.user.role !== "mentor" ||
      !mentor ||
      mentor.designation !== "Engineer"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to validate mentors.",
        },
        { status: 403 },
      );
    }
    if (!Array.isArray(students)) {
      return NextResponse.json(
        {
          success: false,
          message: "Students must be an array.",
        },
        { status: 400 },
      );
    }

    if (students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No students provided.",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // 2. Clean Excel data
    // -----------------------------

    const invalidStudents = [];

    const cleanedStudents = students.map((student, index) => {
      const name = student.name?.toString().trim();
      const email = student.email?.toString().trim().toLowerCase();

      const guidename = student.guidename?.toString().trim();
      const guideemail = student.guideemail?.toString().trim().toLowerCase();

      const errors = [];

      if (!name) {
        errors.push("Student name is required.");
      }

      if (!email) {
        errors.push("Student email is required.");
      } else if (!emailRegex.test(email)) {
        errors.push("Invalid student email.");
      }

      if (!guidename) {
        errors.push("Guide name is required.");
      }

      if (!guideemail) {
        errors.push("Guide email is required.");
      } else if (!emailRegex.test(guideemail)) {
        errors.push("Invalid guide email.");
      }

      if (errors.length > 0) {
        invalidStudents.push({
          row: index + 1,
          name: name || "",
          email: email || "",
          guidename: guidename || "",
          guideemail: guideemail || "",
          errors,
        });
      }

      return {
        row: index + 1,
        name,
        email,
        guidename,
        guideemail,
      };
    });

    // Stop if Excel data itself is invalid
    if (invalidStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some rows contain invalid data.",
          invalidStudents,
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // 3. Remove duplicate student emails
    // -----------------------------

    const emailMap = new Map();

    cleanedStudents.forEach((student) => {
      if (!emailMap.has(student.email)) {
        emailMap.set(student.email, student);
      }
    });

    const uniqueStudents = Array.from(emailMap.values());

    const emails = uniqueStudents.map((student) => student.email);

    // -----------------------------
    // 4. Check existing students
    // -----------------------------

    const existingUsers = await User.find({
      email: { $in: emails },
    }).select("_id name email role");

    const existingEmailSet = new Set(
      existingUsers.map((user) => user.email.toLowerCase()),
    );

    const alreadyExists = [];
    const newStudents = [];

    uniqueStudents.forEach((student) => {
      if (existingEmailSet.has(student.email)) {
        alreadyExists.push({
          row: student.row,
          name: student.name,
          email: student.email,
          errors: ["Student email already exists."],
        });
      } else {
        newStudents.push(student);
      }
    });

    // -----------------------------
    // 5. Get all guide emails
    // -----------------------------

    const guideEmails = [
      ...new Set(newStudents.map((student) => student.guideemail)),
    ];

    // Get ALL users with those guide emails
    const guideUsers = await User.find({
      email: { $in: guideEmails },
    }).select("_id name email role");

    // -----------------------------
    // 6. Create mentor lookup
    // -----------------------------

    const mentorUserMap = new Map();

    guideUsers.forEach((user) => {
      mentorUserMap.set(user.email.toLowerCase(), user);
    });

    // -----------------------------
    // 7. Validate every student
    // -----------------------------

    const validStudents = [];
    const invalidGuides = [];

    newStudents.forEach((student) => {
      const guideEmail = student.guideemail;

      // --------------------------------
      // Case 1: Guide email doesn't exist
      // --------------------------------

      const guideUser = mentorUserMap.get(guideEmail);

      if (!guideUser) {
        invalidGuides.push({
          row: student.row,
          name: student.name,
          email: student.email,
          guidename: student.guidename,
          guideemail: student.guideemail,
          errors: [
            `Guide email "${student.guideemail}" does not exist in the User collection.`,
          ],
        });

        return;
      }

      // --------------------------------
      // Case 2: Email exists but isn't mentor
      // --------------------------------

      if (guideUser.role !== "mentor") {
        invalidGuides.push({
          row: student.row,
          name: student.name,
          email: student.email,
          guidename: student.guidename,
          guideemail: student.guideemail,
          errors: [
            `Guide email "${student.guideemail}" belongs to a user with role "${guideUser.role}", not "mentor".`,
          ],
        });

        return;
      }

      // --------------------------------
      // Case 3: Guide name doesn't match
      // --------------------------------

      const excelGuideName = student.guidename?.trim().toLowerCase();

      const databaseGuideName = guideUser.name?.trim().toLowerCase();

      if (excelGuideName !== databaseGuideName) {
        invalidGuides.push({
          row: student.row,
          name: student.name,
          email: student.email,
          guidename: student.guidename,
          guideemail: student.guideemail,
          errors: [
            `Guide name does not match. Excel: "${student.guidename}", Database: "${guideUser.name}".`,
          ],
        });

        return;
      }

      // --------------------------------
      // Everything is valid
      // --------------------------------

      validStudents.push({
        ...student,
        mentorId: guideUser._id,
      });
    });

    // -----------------------------
    // 8. Create users
    // -----------------------------

    const studentsToInsert = [];
    const credentials = [];

    for (const student of validStudents) {
      const temporaryPassword = generateTemporaryPassword();

      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      studentsToInsert.push({
        name: student.name,
        email: student.email,
        password: hashedPassword,
        role: "student",
        mentorId: student.mentorId,
      });

      credentials.push({
        name: student.name,
        email: student.email,
        password: temporaryPassword,
      });
    }

    // -----------------------------
    // 9. Insert valid students
    // -----------------------------

    let insertedStudents = [];

    if (studentsToInsert.length > 0) {
      try {
        insertedStudents = await User.insertMany(studentsToInsert, {
          ordered: false,
        });
      } catch (insertError) {
        console.error("INSERT ERROR:", insertError);

        // Handle duplicate email specifically
        if (insertError.code === 11000) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Some students could not be imported because duplicate data already exists.",
              error: insertError.message,
              alreadyExists,
              invalidStudents,
              invalidGuides,
            },
            { status: 400 },
          );
        }

        throw insertError;
      }
    }

    // -----------------------------
    // 10. Final response
    // -----------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Bulk import completed.",

        summary: {
          totalReceived: students.length,
          uniqueRecords: uniqueStudents.length,

          imported: insertedStudents.length,

          alreadyExists: alreadyExists.length,

          invalidStudentData: invalidStudents.length,

          invalidGuides: invalidGuides.length,
        },

        alreadyExists,

        invalidStudents,

        invalidGuides,

        credentials,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("BULK IMPORT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to import students.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
