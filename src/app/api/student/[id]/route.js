// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Student from "@/models/student";
// import User from "@/models/user";

// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     // Find mentor
//     const mentor = await Student.findById(id);

//     if (!mentor) {
//       return NextResponse.json(
//         { message: "Student not found" },
//         { status: 404 },
//       );
//     }

//     // Get User ID from Mentor
//     const userId = mentor.userId;

//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID not found for this mentor" },
//         { status: 404 },
//       );
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { status: "inactive" },
//       { new: true },
//     );
// console.log(user);
//     if (!user) {
//       return NextResponse.json(
//         { message: "Associated user not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Mentor deactivated successfully",
//         user,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("DEACTIVATE_MENTOR_ERROR:", error);

//     return NextResponse.json(
//       { message: "Failed to deactivate mentor" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mentor from "@/models/mentor";
import Student from "@/models/student";
import User from "@/models/user";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Roster title is required" },
        { status: 400 },
      );
    }
    if (title === "Student Roster") {
      const student = await Student.findById(id);

      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 },
        );
      }

      if (!student.userId) {
        return NextResponse.json(
          { message: "User ID not found for this student" },
          { status: 404 },
        );
      }

      const user = await User.findByIdAndUpdate(
        student.userId,
        { status: "inactive" },
        { new: true },
      );

      if (!user) {
        return NextResponse.json(
          { message: "Associated user not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          message: "Student deactivated successfully",
          user,
        },
        { status: 200 },
      );
    }

    if (title === "Mentor Roster") {
      console.log("mentorid", id);
      const mentor = await Mentor.findById(id);

      if (!mentor) {
        return NextResponse.json(
          { message: "Mentor not found" },
          { status: 404 },
        );
      }

      if (!mentor.userId) {
        return NextResponse.json(
          { message: "User ID not found for this mentor" },
          { status: 404 },
        );
      }

      const mentorUserId = mentor.userId;
      const assignedStudent = await User.findOne({
        mentorId: mentorUserId,
        status: "active",
      });

      if (assignedStudent) {
        return NextResponse.json(
          {
            message:
              "This mentor cannot be deactivated because students are still assigned to this mentor.",
            mentorId: mentorUserId,
          },
          { status: 409 },
        );
      }

      const user = await User.findByIdAndUpdate(
        mentorUserId,
        { status: "inactive" },
        { new: true },
      );

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
    }

    // =====================================================
    // INVALID TITLE
    // =====================================================

    return NextResponse.json(
      {
        message: "Invalid roster title",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("DEACTIVATE_USER_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to deactivate user",
      },
      { status: 500 },
    );
  }
}
