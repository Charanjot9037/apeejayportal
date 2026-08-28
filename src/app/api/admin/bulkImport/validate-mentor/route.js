// /api/admin/bulkImport/validate-mentor/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { authenticateUser } from "@/lib/authentication";
import Mentor from "@/models/mentor";

export async function POST(request) {
  try {
    await connectDB();

    // =========================
    // AUTHENTICATION
    // =========================
    const auth = await authenticateUser();

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

    // =========================
    // REQUEST BODY
    // =========================
    const { students, mentors } = await request.json();

    if (!Array.isArray(students)) {
      return NextResponse.json(
        {
          success: false,
          message: "Students must be an array.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(mentors)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentors must be an array.",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // 1. VALIDATE STUDENTS
    // =====================================================

    // Get unique student emails
    const studentEmails = [
      ...new Set(
        students
          .map((student) =>
            student.email?.trim().toLowerCase(),
          )
          .filter(Boolean),
      ),
    ];

    // Find existing users with these emails
    const existingStudents = await User.find({
      email: { $in: studentEmails },
    }).select("name email role status");

    const studentMap = new Map(
      existingStudents.map((student) => [
        student.email.trim().toLowerCase(),
        student,
      ]),
    );

    // Count duplicate emails inside uploaded file
    const emailCount = {};

    students.forEach((student) => {
      const email = student.email
        ?.trim()
        .toLowerCase();

      if (email) {
        emailCount[email] =
          (emailCount[email] || 0) + 1;
      }
    });

    const studentResults = students.map((student) => {
      const email =
        student.email?.trim().toLowerCase() || "";

      const name =
        student.name?.trim() || "";

      const foundStudent = studentMap.get(email);

      const errors = [];

      // Empty email
      if (!email) {
        errors.push("Student email is required");
      }

      // Duplicate inside Excel
      if (email && emailCount[email] > 1) {
        errors.push("Duplicate student email");
      }

      // Already exists in database
      if (foundStudent) {
        errors.push(
          `Student email "${student.email}" already exists`,
        );
      }

      return {
        email: student.email,
        name: student.name,

        exists: !!foundStudent,

        isDuplicate:
          email && emailCount[email] > 1,

        isValid:
          errors.length === 0,

        errors,
      };
    });

    // =====================================================
    // 2. VALIDATE MENTORS
    // =====================================================

    // Unique mentor emails
    // Multiple students can have the same mentor.
    const mentorEmails = [
      ...new Set(
        mentors
          .map((mentor) =>
            mentor.email?.trim().toLowerCase(),
          )
          .filter(Boolean),
      ),
    ];

    // Find active mentor users
    const existingMentors = await User.find({
      email: { $in: mentorEmails },
      role: "mentor",
      status: "active",
    }).select("name email");

    const mentorMap = new Map(
      existingMentors.map((mentor) => [
        mentor.email.trim().toLowerCase(),
        mentor,
      ]),
    );

    const mentorResults = mentors.map((mentor) => {
      const email =
        mentor.email?.trim().toLowerCase() || "";

      const name =
        mentor.name?.trim().toLowerCase() || "";

      const foundMentor = mentorMap.get(email);

      const errors = [];

      // Mentor does not exist
      if (!foundMentor) {
        errors.push(
          `Mentor email "${mentor.email}" does not exist`,
        );
      }

      // Mentor name doesn't match
      else if (
        foundMentor.name?.trim().toLowerCase() !==
        name
      ) {
        errors.push(
          "Mentor name does not match the email",
        );
      }

      return {
        email: mentor.email,
        name: mentor.name,

        exists: !!foundMentor,

        nameMatches: foundMentor
          ? foundMentor.name
              ?.trim()
              .toLowerCase() === name
          : false,

        isValid: errors.length === 0,

        errors,
      };
    });

    // =====================================================
    // 3. RETURN RESULTS
    // =====================================================

    return NextResponse.json({
      success: true,

      students: studentResults,

      mentors: mentorResults,
    });
  } catch (error) {
    console.error(
      "VALIDATE_MENTORS_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to validate students and mentors.",
      },
      { status: 500 },
    );
  }
}