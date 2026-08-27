import { connectDB } from "@/lib/db";
import User from "../../../../models/user";
import Mentor from "@/models/mentor";
import { authenticateUser } from "@/lib/authentication";
import bcrypt from "bcrypt";

import { generateTemporaryPassword } from "@/lib/generatePassword";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const auth = await authenticateUser();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        {
          status: auth.status,
        },
      );
    }
    const adminuser = auth.user;
    if (adminuser.role != "mentor") {
      return NextResponse.json(
        { success: false, messgae: "not authorized" },
        { status: 403 },
      );
    }
    const { name, email, mobileNumber, department, designation } =
      await req.json();

    if (!name || !email || !mobileNumber || !department || !designation) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        {
          status: 400,
        },
      );
    }

    const mentorPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(mentorPassword, 10);
    const role = designation.toLowerCase() === "Engineer" ? "admin" : "mentor";
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
    });

    const mentor = await Mentor.create({
      userId: user._id,
      mobileNumber,
      department,
      designation,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Mentor created successfully.",
      },
      {
        status: 201,
      },
    );

    return response;
  } catch (error) {
    console.error("Create mentor error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
