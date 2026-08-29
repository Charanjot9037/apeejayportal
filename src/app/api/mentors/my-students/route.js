import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/authentication";
import User from "@/models/user";
import Student from "@/models/student";
export async function GET() {
  try {
    const auth = await authenticateUser();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }
    const user = auth.user._id;

    const Students = await User.find({ mentorId: user, role: "student" });
    const userIds = Students.map((student) => student._id);

    const studentDetails = await Student.find({
      userId: { $in: userIds },
    }).populate("userId");

    return NextResponse.json({
      success: true,
      studentDetails,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "failed to fetch" },
      { status: 500 },
    );
  }
}
