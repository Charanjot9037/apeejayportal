import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import User from "@/models/user";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Find student first so we can get the userId
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }

    // Get User ID from Student collection
    const userId = student.userId;

    // Delete Student
    await Student.findByIdAndDelete(id);

    // Delete associated User
    if (userId) {
      await User.findByIdAndDelete(userId);
    }

    return NextResponse.json(
      {
        message: "Student and associated user deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE_STUDENT_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete student" },
      { status: 500 },
    );
  }
}
