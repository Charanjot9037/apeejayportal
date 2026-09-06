import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectDB } from '@/lib/db';
import Student from '@/models/student';
import Project from '@/models/projects';
import User from '@/models/user';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid student ID',
        },
        {
          status: 400,
        },
      );
    }

    const student = await Student.findById(id).lean();
    const user = await User.findById(student.userId).select('email').lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found',
        },
        {
          status: 404,
        },
      );
    }

    const projects = await Project.find({
      student: student.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,

        student: {
          _id: student._id,
          userId: student.userId,

          // Personal Information
          fullName: student.fullName,
          phone: student.phone,
          email: user.email,
          gender: student.gender,
          address: student.address,
          profileImage: student.profileImage,

          // Skills
          skills: student.skills || [],
          interests: student.interests || [],

          // Academic Information
          department: student.department || '',
          program: student.program || '',
          rollNumber: student.rollNumber || '',
          academicBatch: student.academicBatch || '',
          lastYear: student.lastYear || '',
          specialization: student.specialization || '',

          // Online Profiles
          linkedin: student.linkedin || '',
          github: student.github || '',
          portfolio: student.portfolio || '',

          // Resume
          resume: student.resume || '',
          resumeName: student.resumeName || '',
        },

        projects: projects || [],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('GET_STUDENT_DATA_ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch student data',
      },
      {
        status: 500,
      },
    );
  }
}
