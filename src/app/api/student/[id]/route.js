import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import User from "@/models/user";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Find mentor
    const mentor = await Student.findById(id);

    if (!mentor) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }

    // Get User ID from Mentor
    const userId = mentor.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found for this mentor" },
        { status: 404 },
      );
    }

    // Update User status
    const user = await User.findByIdAndUpdate(
      userId,
      { status: "inactive" },
      { new: true },
    );
console.log(user);
    if (!user) {
      return NextResponse.json(
        { message: "Associated user not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Mentor deactivated successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DEACTIVATE_MENTOR_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to deactivate mentor" },
      { status: 500 },
    );
  }
}
