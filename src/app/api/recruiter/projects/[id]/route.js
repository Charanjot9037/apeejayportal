

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import projects from "@/models/projects";
import Student from "@/models/student";
import Mentor from "@/models/mentor";
import User from "@/models/user";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await projects
      .findOne({
        _id: id,
        status: "Approved",
      })
      .populate({
        path: "student",
        model: User,
        select: "name email profileImage",
      })
      .lean();

    if (!project) {
      return NextResponse.json(
        { message: "Verified project not found" },
        { status: 404 }
      );
    }

    // ================= STUDENT =================

    let studentInfo = null;

    if (project.student?._id) {
      studentInfo = await Student.findOne({
        userId: project.student._id,
      }).lean();
    }

    // ================= MENTOR =================

    let mentorInfo = null;
    let mentor2Info = null;

    if (project.mentor) {
      const mentor = await Mentor.findOne({
        userId: project.mentor,
      }).lean();

      if (mentor) {
        const mentorUser = await User.findById(mentor.userId)
          .select("name email profileImage")
          .lean();

        mentorInfo = {
          _id: mentor._id.toString(),
          userId: mentor.userId?.toString(),
          name: mentorUser?.name || "",
          email: mentorUser?.email || "",
          designation: mentor.designation || "",
        };
      }
    }

    // ================= MENTOR 2 =================

    if (project.mentor2) {
      const mentor = await Mentor.findOne({
        userId: project.mentor2,
      }).lean();

      if (mentor) {
        const mentorUser = await User.findById(mentor.userId)
          .select("name email ")
          .lean();

        mentor2Info = {
          _id: mentor._id.toString(),
          userId: mentor.userId?.toString(),
          name: mentorUser?.name || "",
          email: mentorUser?.email || "",
          designation: mentor.designation || "",
        };
      }
    }
  // ================= TEAM MEMBER =================

let teamMemberInfo = null;

if (project.teamMembers) {
  // teamMembers contains Student._id
  const teamStudent = await Student.findById(
    project.teamMembers
  ).lean();

  console.log("TEAM STUDENT:", teamStudent);

  if (teamStudent) {
    // Student.userId contains User._id
    const teamUser = await User.findById(
      teamStudent.userId
    )
      .select("name email profileImage")
      .lean();

    console.log("TEAM USER:", teamUser);

    if (teamUser) {
      teamMemberInfo = {
        _id: teamUser.teamMembers?._id?.toString() || teamStudent._id.toString(),
        name: teamUser.name || "",
        email: teamUser.email || "",
      };
    }
  }
}
    // ================= RESPONSE =================

    return NextResponse.json({
      success: true,

      project: {
        ...project,

        mentor: mentorInfo,
        mentor2: mentor2Info,
 teamMemberInfo,
       studentInfo: studentInfo
  ? {
      _id: studentInfo._id.toString(), // Student._id
      userId: studentInfo.userId?.toString(), // User._id

      // Name and email from User collection
      name: project.student?.name || "",
      email: project.student?.email || "",

      // Academic information from Student collection
      program: studentInfo.program || "",
      department: studentInfo.department || "",
      specialization: studentInfo.specialization || "",
      semester:
        studentInfo.currentSemester ||
        studentInfo.semester ||
        "",

      profileImage: studentInfo.profileImage || "",
    }
  : null,
      },
     

      viewerRole: "recruiter",
    });
  } catch (error) {
    console.error(
      "RECRUITER_PROJECT_DETAIL_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project details",
      },
      { status: 500 }
    );
  }
}