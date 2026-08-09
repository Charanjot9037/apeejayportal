import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";

export async function PATCH(req) {
  try {
    await connectDB();

    const { section, data, userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!section || !data) {
      return NextResponse.json(
        {
          success: false,
          message: "Section and data are required",
        },
        { status: 400 }
      );
    }

    let updateData = {};

    switch (section) {
 

      case "skills":
        updateData = {
          skills: data.skills,
          interests: data.interests,
        };
        break;

 case "academic": {
  const programDuration = {
    MBA: 2,
    MCA: 2,
    BTECH: 4,
    BCA: 3,
    BBA: 3,
    BCOM: 3,
  };

  const duration = programDuration[data.program];

  if (!duration) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid program",
      },
      { status: 400 }
    );
  }

  if (!data.academicBatch) {
    return NextResponse.json(
      {
        success: false,
        message: "Academic batch is required",
      },
      { status: 400 }
    );
  }

  const lastYear =
    Number(data.academicBatch) + duration;

  updateData = {
    department: data.department,
    program: data.program,
    specialization:data.specialization,
    currentSemester: data.currentSemester,
    rollNumber: data.rollNumber,
    academicBatch: data.academicBatch,
    lastYear: String(lastYear),
  };

  break;
}

      // =========================
      // ONLINE PROFILES
      // =========================

      case "onlineProfiles":
        updateData = {
          linkedin: data.linkedin,
          github: data.github,
          portfolio: data.portfolio,
          resume: data.resume,
        };
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid profile section",
          },
          { status: 400 }
        );
    }

    // =========================
    // UPDATE STUDENT
    // =========================

    const profile = await Student.findOneAndUpdate(
      { userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    // =========================
    // PROFILE NOT FOUND
    // =========================

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Student profile not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // SUCCESS
    // =========================

    return NextResponse.json(
      {
        success: true,
        message: `${section} updated successfully`,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update student profile",
      },
      { status: 500 }
    );
  }
}