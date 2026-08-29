import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import { authenticateUser } from "@/lib/authentication";
import User from "@/models/user";
export async function PATCH(req) {
  try {
    await connectDB();
    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    const user = auth.user;

    if (user.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Students only are allowed.",
        },
        {
          status: 403,
        },
      );
    }

    const userId = user._id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const { section, data } = await req.json();

    if (!section || !data) {
      return NextResponse.json(
        {
          success: false,
          message: "Section and data are required",
        },
        {
          status: 400,
        },
      );
    }

    let updateData = {};
    switch (section) {
      case "profile":
        updateData = {
          profileImage: data.profileImage,
        };
        break;
      case "personal":
        updateData = {
          fullName: data.fullName,
          phone: data.phone,
          gender: data.gender,
          address: data.address,
        };
        break;
      case "skills":
        updateData = {
          skills: data.technicalSkills || [],
          interests: data.interests || [],
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
            {
              status: 400,
            },
          );
        }

        if (!data.academicBatch) {
          return NextResponse.json(
            {
              success: false,
              message: "Academic batch is required",
            },
            {
              status: 400,
            },
          );
        }

        const lastYear = Number(data.academicBatch) + duration;

        updateData = {
          department: data.department,
          program: data.program,
          specialization: data.specialization || "",
          rollNumber: data.rollNumber,
          academicBatch: data.academicBatch,
          lastYear: String(lastYear),
        };

        break;
      }
      case "onlineProfiles":
        updateData = {
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
        };
        break;

      // =========================
      // RESUME
      // =========================

      case "resume":
        updateData = {
          resume: data.resume || "",
          resumeName: data.resumeName || "",
        };
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid profile section",
          },
          {
            status: 400,
          },
        );
    }
    let updatedUser = null;
    if (section === "personal" && data.email) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            email: data.email,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }
    if (section === "personal" && data.fullName) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name: data.fullName,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }
    const profile = await Student.findOneAndUpdate(
      { userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate({
        path: "userId",
        select: "email",
      })
      .lean();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Student profile not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${section} updated successfully`,

        profile,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Edit student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update student profile",
      },
      {
        status: 500,
      },
    );
  }
}
