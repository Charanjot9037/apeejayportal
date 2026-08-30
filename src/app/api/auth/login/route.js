import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import Student from "@/models/student";
import Mentor from "@/models/mentor";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    // Find user
   const user = await User.findOne({
     email: email.toLowerCase(),
     status: "active",
   });


    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Check password
    // const isPasswordMatch = await bcrypt.compare(password, user.password);

    // if (!isPasswordMatch) {
    //   return NextResponse.json(
    //     {
    //       message: "Invalid email or password",
    //     },
    //     { status: 401 },
    //   );
    // }

    // ==========================================
    // Student / Mentor data
    // ==========================================

    let studentId = null;
    let designation = null;
    let department = null;
    let program = null;
    let profileImage = null;
    let academicBatch = null;
    let mentorDepartment=null;
    // Fetch Student only for student role
    if (user.role === "student") {
      const student = await Student.findOne({
        userId: user._id,
      });

      studentId = student?._id || null;
      department = student?.department || null;
      program = student?.program || null;
      academicBatch = student?.academicBatch || null;
      profileImage = student?.profileImage || null;
    }

    // Fetch Mentor only for mentor/admin role
    if (user.role === "mentor") {
      const mentor = await Mentor.findOne({
        userId: user._id,
      }).select("designation department");

      designation = mentor?.designation || null;
      mentorDepartment=mentor?.department || null;
    }

    // ==========================================
    // Generate tokens
    // ==========================================

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // ==========================================
    // Response
    // ==========================================

    const response = NextResponse.json(
      {
        message: "Login successful",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,

          // Student data
          studentId,
          department,
          profileImage,
          program,
          // Mentor/Admin designation
          designation,
          mentorDepartment,
          academicBatch,
        },
      },
      {
        status: 200,
      },
    );

    // Access Token
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    // Refresh Token
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
