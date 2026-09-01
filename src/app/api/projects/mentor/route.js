import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/projects';
import Student from '@/models/student';
import { authenticateUser } from '@/lib/authentication';

export async function GET(request) {
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

    if (user.role !== 'mentor') {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. Mentors only are allowed.',
        },
        {
          status: 403,
        },
      );
    }

    // =========================================
    // GET ONLY PROJECTS OF LOGGED-IN MENTOR
    // =========================================

    const projects = await Project.find({
      $or: [{ mentor: auth.user._id }, { mentor2: auth.user._id }],
    })
      .populate({
        path: 'student',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .lean();

    // =========================================
    // GET STUDENT USER IDS
    // =========================================

    const studentUserIds = projects
      .map((project) => project.student?._id)
      .filter(Boolean);

    // =========================================
    // GET STUDENT ACADEMIC DETAILS
    // =========================================

    const studentProfiles = await Student.find({
      userId: {
        $in: studentUserIds,
      },
    }).select(
      'userId department program rollNumber specialization academicBatch',
    );

    // =========================================
    // CREATE USER ID -> STUDENT PROFILE MAP
    // =========================================

    const profileMap = {};

    studentProfiles.forEach((student) => {
      profileMap[student.userId.toString()] = student;
    });

    // =========================================
    // MERGE PROJECT + STUDENT DETAILS
    // =========================================

    const enrichedProjects = projects.map((project) => {
      const studentId = project.student?._id?.toString();

      const profile = studentId ? profileMap[studentId] : null;

      return {
        ...project,

        student: project.student
          ? {
              ...project.student,

              department: profile?.department || '',

              program: profile?.program || '',

              rollNumber: profile?.rollNumber || '',

              specialization: profile?.specialization || '',

              academicBatch: profile?.academicBatch || '',
            }
          : null,

        // Semester belongs to Project
        semester: project.semester || '',
      };
    });

    // =========================================
    // RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,
      projects: enrichedProjects,
    });
  } catch (error) {
    console.error('MENTOR_PROJECTS_GET_ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch mentor's projects.",
      },
      {
        status: 500,
      },
    );
  }
}
