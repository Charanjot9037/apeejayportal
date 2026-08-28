// app/api/mentors/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mentor from "@/models/mentor";
import { authenticateUser } from "@/lib/authentication";
import User from "@/models/user";
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

    const mentor1 = await Mentor.findOne({ userId: auth.user._id });

    if (auth.user.role !== "mentor" || mentor1.designation !== "Engineer") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to validate mentors.",
        },
        { status: 403 },
      );
    }
    const body = await req.json();
    const { department } = body;

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department is required",
        },
        { status: 400 },
      );
    }

    const mentors = await Mentor.find({
      department: {
        $regex: `^${department}$`,
        $options: "i",
      },
    })
      .populate({
        path: "userId",
        select: "name email status",
      })
      .select("userId mobileNumber department designation");

    return NextResponse.json({
      success: true,
      mentors,
    });
  } catch (error) {
    console.error("Fetch mentors error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch mentors",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      mentorId,
      name,
      email,
      mobileNumber,
      department,
      designation,
      status,
    } = body;

    if (!mentorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor ID is required",
        },
        { status: 400 },
      );
    }

    // Find mentor
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          message: "Mentor not found",
        },
        { status: 404 },
      );
    }

    // -----------------------------
    // UPDATE USER
    // -----------------------------

    const user = await User.findByIdAndUpdate(
      mentor.userId,
      {
        name,
        email: email?.toLowerCase(),
        status,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Associated user not found",
        },
        { status: 404 },
      );
    }

    // -----------------------------
    // UPDATE MENTOR
    // -----------------------------

    await Mentor.findByIdAndUpdate(
      mentorId,
      {
        mobileNumber,
        department,
        designation,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    // -----------------------------
    // GET UPDATED MENTOR
    // -----------------------------

    const updatedMentor = await Mentor.findById(mentorId).populate({
      path: "userId",
      select: "name email status",
    });

    return NextResponse.json({
      success: true,
      message: "Mentor updated successfully",
      mentor: updatedMentor,
    });
  } catch (error) {
    console.error("UPDATE_MENTOR_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update mentor",
      },
      { status: 500 },
    );
  }
}
