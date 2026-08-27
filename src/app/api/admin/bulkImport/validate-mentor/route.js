// /api/admin/validate-mentors/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { authenticateUser } from "@/lib/authentication";
import Mentor from "@/models/mentor";
export async function POST(request) {
  try {
    await connectDB();

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
    const mentor = await Mentor.findOne({ userId: auth.user._id });

    if (auth.user.role !== "mentor" || mentor.designation !== "Engineer") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to validate mentors.",
        },
        { status: 403 },
      );
    }

    const { mentors } = await request.json();

    if (!Array.isArray(mentors)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentors must be an array.",
        },
        { status: 400 },
      );
    }

    // Remove duplicate emails
    const emails = [
      ...new Set(
        mentors
          .map((mentor) => mentor.email?.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    const users = await User.find({
      email: { $in: emails },
      role: "mentor",
    }).select("name email");

    const mentorMap = new Map(
      users.map((mentor) => [mentor.email.toLowerCase(), mentor]),
    );

    const results = mentors.map((mentor) => {
      const email = mentor.email?.trim().toLowerCase();
      const name = mentor.name?.trim();

      const foundMentor = mentorMap.get(email);

      const errors = [];

      if (!foundMentor) {
        errors.push(`Mentor email "${mentor.email}" does not exist`);
      } else if (foundMentor.name.trim().toLowerCase() !== name.toLowerCase()) {
        errors.push(`Mentor name does not match the email`);
      }

      return {
        email: mentor.email,
        name: mentor.name,
        exists: !!foundMentor,
        nameMatches: foundMentor
          ? foundMentor.name.trim().toLowerCase() === name.toLowerCase()
          : false,
        errors,
      };
    });

    return NextResponse.json({
      success: true,
      mentors: results,
    });
  } catch (error) {
    console.error("VALIDATE_MENTORS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to validate mentors.",
      },
      { status: 500 },
    );
  }
}
