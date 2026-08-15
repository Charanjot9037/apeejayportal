
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find({})
      .sort({ createdAt: -1 })
      .lean();
      console.log("STUDENTS FROM DATABASE:", students);

    return NextResponse.json({
      success: true,
      students,
    });

  } catch (error) {
    console.error("STUDENTS_GET_ERROR:", error);

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
