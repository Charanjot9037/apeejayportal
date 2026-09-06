import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import { authenticateUser } from '@/lib/authentication';

import User from '@/models/user';
import Student from '@/models/student';

// =====================================================
// GET - ALL STUDENTS ASSIGNED TO LOGGED-IN MENTOR
// =====================================================

export async function GET() {
  try {
    await connectDB();

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message || 'Authentication required',
        },
        {
          status: auth.status || 401,
        },
      );
    }

    const mentorUserId = auth.user._id;

    console.log('Logged-in mentor:', mentorUserId);

    // ---------------------------------------------------
    // STEP 1: Find students assigned to this mentor
    // Assignment is stored on User.mentorId
    // ---------------------------------------------------

    const assignedStudents = await User.find({
      mentorId: mentorUserId,
      role: 'student',
    }).lean();

    console.log('Assigned students:', assignedStudents.length);

    // ---------------------------------------------------
    // STEP 2: Get their User IDs
    // ---------------------------------------------------

    const userIds = assignedStudents.map((student) => student._id);

    // ---------------------------------------------------
    // STEP 3: Get Student profiles
    // ---------------------------------------------------

    const studentDetails = await Student.find({
      userId: {
        $in: userIds,
      },
    })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log('Student details:', studentDetails.length);

    return NextResponse.json(
      {
        success: true,
        studentDetails,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('MENTOR_STUDENTS_GET_ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch students',
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// POST - FILTER MENTOR'S STUDENTS
// =====================================================

export async function POST(request) {
  try {
    await connectDB();

    // ===================================================
    // AUTHENTICATION
    // ===================================================

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message || 'Authentication required.',
        },
        {
          status: auth.status || 401,
        },
      );
    }

    const mentor = auth.user;

    // ===================================================
    // MENTOR ONLY
    // ===================================================

    if (mentor.role !== 'mentor') {
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

    // ===================================================
    // GET FILTERS FROM FRONTEND
    // ===================================================

    const filters = await request.json();

    console.log('MENTOR STUDENT FILTERS:', filters);

    const {
      department = '',
      program = '',
      specialization = '',
      academicBatch = '',
    } = filters || {};

    // ===================================================
    // STEP 1:
    // Find ONLY students assigned to this mentor
    //
    // IMPORTANT:
    // Your GET API proves that assignment is stored as
    // User.mentorId, NOT Student.mentor
    // ===================================================

    const assignedStudents = await User.find({
      mentorId: mentor._id,
      role: 'student',
    }).select('_id');

    console.log('Assigned students:', assignedStudents.length);

    // ===================================================
    // STEP 2:
    // Extract student User IDs
    // ===================================================

    const userIds = assignedStudents.map((student) => student._id);

    // ===================================================
    // STEP 3:
    // Build Student query
    //
    // At this point the query already contains ONLY
    // students belonging to the logged-in mentor.
    // ===================================================

    const studentQuery = {
      userId: {
        $in: userIds,
      },
    };

    // ===================================================
    // DEPARTMENT FILTER
    // ===================================================

    if (department) {
      studentQuery.department = String(department).trim().toUpperCase();
    }

    // ===================================================
    // PROGRAM FILTER
    // ===================================================

    if (program) {
      studentQuery.program = String(program).trim().toUpperCase();
    }

    // ===================================================
    // SPECIALIZATION FILTER
    // ===================================================

    if (specialization) {
      studentQuery.specialization = String(specialization).trim().toUpperCase();
    }

    // ===================================================
    // ACADEMIC BATCH FILTER
    // ===================================================

    if (academicBatch) {
      studentQuery.academicBatch = String(academicBatch).trim();
    }

    console.log('MENTOR STUDENT QUERY:', studentQuery);

    // ===================================================
    // STEP 4:
    // FETCH FILTERED STUDENTS FROM DATABASE
    // ===================================================

    const students = await Student.find(studentQuery)
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log('Filtered student details:', students.length);

    // ===================================================
    // RESPONSE
    // ===================================================

    return NextResponse.json(
      {
        success: true,
        studentDetails: students,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('MENTOR_STUDENTS_POST_ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to filter mentor's students.",
      },
      {
        status: 500,
      },
    );
  }
}
