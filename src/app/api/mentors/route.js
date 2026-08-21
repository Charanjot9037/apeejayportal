// app/api/mentors/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mentor from "@/models/mentor";

export async function POST(req) {
  try {
    await connectDB();

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
        select: "name email",
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
