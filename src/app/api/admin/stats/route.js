import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

import Student from '@/models/student';
import Mentor from '@/models/mentor';
import Project from '@/models/projects';

export async function GET() {
  try {
    await connectDB();

    const [studentCount, mentorCount, projectCount, projectsByDepartment] =
      await Promise.all([
        Student.countDocuments(),
        Mentor.countDocuments(),
        Project.countDocuments(),

        Project.aggregate([
          // Project.student contains User._id
          {
            $lookup: {
              from: 'students',
              localField: 'student',
              foreignField: 'userId',
              as: 'studentData',
            },
          },

          // Convert studentData array to object
          {
            $unwind: {
              path: '$studentData',
              preserveNullAndEmptyArrays: true,
            },
          },

          // Group projects by student's department
          {
            $group: {
              _id: '$studentData.department',
              count: {
                $sum: 1,
              },
            },
          },

          // Sort by number of projects
          {
            $sort: {
              count: -1,
            },
          },
        ]),
      ]);

    // Convert aggregation result into a clean object
    const departmentProjects = {};

    projectsByDepartment.forEach((item) => {
      const department = item._id?.trim();

      if (department) {
        departmentProjects[department] = item.count;
      }
    });

    return NextResponse.json({
      success: true,

      data: {
        students: studentCount,
        mentors: mentorCount,
        projects: projectCount,

        // Dynamic departments
        projectDepartments: departmentProjects,
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
