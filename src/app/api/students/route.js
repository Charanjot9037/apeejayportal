

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // ------------------------------------------------------------
    // PAGINATION
    // ------------------------------------------------------------

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    // Only 8 students per request
    const limit = 8;

    const skip = (page - 1) * limit;

    // ------------------------------------------------------------
    // TOTAL STUDENT COUNT
    // ------------------------------------------------------------

    const total = await Student.countDocuments({});

    // ------------------------------------------------------------
    // FETCH STUDENTS
    // ------------------------------------------------------------

    const students = await Student.find({})
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(
      `STUDENTS PAGE ${page}:`,
      students
    );

    // ------------------------------------------------------------
    // PAGINATION INFO
    // ------------------------------------------------------------

    const hasMore = skip + students.length < total;

    return NextResponse.json({
      success: true,

      students,

      pagination: {
        page,
        limit,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error(
      "STUDENTS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students.",
      },
      {
        status: 500,
      }
    );
  }
}

