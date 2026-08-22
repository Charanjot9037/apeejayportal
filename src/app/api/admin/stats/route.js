import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

import Student from '@/models/student';
import Mentor from '@/models/mentor';
import Project from '@/models/projects';
export async function GET() {
  try {
    await connectDB();

    const [studentCount, mentorCount, projectCount] = await Promise.all([
      Student.countDocuments(),
      Mentor.countDocuments(),
      Project.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        students: studentCount,
        mentors: mentorCount,
        projects: projectCount,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard statistics',
      },
      { status: 500 },
    );
  }
}
