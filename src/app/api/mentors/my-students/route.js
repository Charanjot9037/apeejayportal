import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/authentication';
import User from '@/models/user';
import Student from '@/models/student';

export async function GET() {
  try {
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

    // Logged-in mentor's User ID
    const mentorUserId = auth.user._id;

    console.log('Logged-in mentor:', mentorUserId);

    // Find ONLY students assigned to this mentor
    const assignedStudents = await User.find({
      mentorId: mentorUserId,
      role: 'student',
    }).lean();

    console.log('Assigned students:', assignedStudents.length);

    const userIds = assignedStudents.map((student) => student._id);

    // Get student documents
    const studentDetails = await Student.find({
      userId: {
        $in: userIds,
      },
    })
      .populate('userId')
      .lean();

    console.log('Student details:', studentDetails.length);

    return NextResponse.json({
      success: true,
      studentDetails,
    });
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
