import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { generateTemporaryPassword } from "@/lib/generatePassword";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const students = body.students;

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

    const invalidStudents = [];

    const cleanedStudents = students.map((student, index) => {
      const name = student.name?.toString().trim();

      const email = student.email?.toString().trim().toLowerCase();
      const guidename = student.guidename?.toString().trim();

      const guideemail = student.guideemail?.toString().trim().toLowerCase();

      const errors = [];

      if (!name) {
        errors.push("Name is required");
      }

      if (!email) {
        errors.push("Email is required");
      } else if (!emailRegex.test(email)) {
        errors.push("Invalid email");
      } else if (!guidename) {
        errors.push("Guide name is required");
      }

      // Guide email
      else if (!guideemail) {
        errors.push("Guide email is required");
      } else if (!emailRegex.test(guideemail)) {
        errors.push("Invalid guide email");
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
        name,
        email,
        guideemail,
        guidename,
      };
    });

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some students contain invalid data.",
          invalidStudents,
        },
        { status: 400 },
      );
    }

    const emailMap = new Map();

    cleanedStudents.forEach((student) => {
      emailMap.set(student.email, student);
    });

    const uniqueStudents = Array.from(emailMap.values());

    const emails = uniqueStudents.map((student) => student.email);

    const existingUsers = await User.find({
      email: { $in: emails },
    }).select("email");
    console.log(existingUsers);
    const existingEmailSet = new Set(
      existingUsers.map((user) => user.email.toLowerCase()),
    );

    const alreadyExists = [];

    const newStudents = [];

    uniqueStudents.forEach((student) => {
      if (existingEmailSet.has(student.email)) {
        alreadyExists.push({
          name: student.name,
          email: student.email,
        });
      } else {
        newStudents.push(student);
      }
    });

    const studentsToInsert = [];

    const credentials = [];
    const invalidGuides = [];
    const guideEmails = [
      ...new Set(newStudents.map((student) => student.guideemail)),
    ];
    const mentorUsers = await User.find({
      email: { $in: guideEmails },
      role: "mentor",
    }).select("_id name email role");
    // Create lookup by email
    const mentorUserMap = new Map();

    mentorUsers.forEach((mentor) => {
      mentorUserMap.set(mentor.email.toLowerCase(), mentor);
    });

    const validStudents = [];

    newStudents.forEach((student) => {
      const mentorUser = mentorUserMap.get(student.guideemail);

      // Mentor email not found
      if (!mentorUser) {
        invalidGuides.push({
          name: student.name,
          email: student.email,
          guidename: student.guidename,
          guideemail: student.guideemail,
          errors: ["Guide email does not belong to a mentor."],
        });

        return;
      }

      // Compare guide name
      const excelGuideName = student.guidename.trim().toLowerCase();

      const databaseGuideName = mentorUser.name?.trim().toLowerCase();

      if (excelGuideName !== databaseGuideName) {
        invalidGuides.push({
          name: student.name,
          email: student.email,
          guidename: student.guidename,
          guideemail: student.guideemail,
          errors: [
            `Guide name does not match. Excel: "${student.guidename}", Database: "${mentorUser.name}"`,
          ],
        });

        return;
      }

      // Everything is valid
      validStudents.push({
        ...student,

        // User collection mentor _id
        mentorId: mentorUser._id,
      });
    });

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
    }

    let insertedStudents = [];

    if (studentsToInsert.length > 0) {
      insertedStudents = await User.insertMany(studentsToInsert, {
        ordered: false,
      });
    }

    return NextResponse.json(
      {
        success: true,

        message: "Bulk import completed successfully.",

        summary: {
          totalReceived: students.length,
          uniqueRecords: uniqueStudents.length,
          imported: insertedStudents.length,
          alreadyExists: alreadyExists.length,
          invalid: invalidStudents.length,
        },

        alreadyExists,

        credentials,
      },
      { status: 201 },
    );
  } catch (error) {
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
