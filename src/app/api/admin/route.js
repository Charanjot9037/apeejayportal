import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { connectDB } from '@/lib/db';
import user from '@/models/user';
import { generateTemporaryPassword } from '@/lib/generatePassword';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const students = body.students;

    if (!Array.isArray(students)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Students must be an array.',
        },
        { status: 400 },
      );
    }

    if (students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No students provided.',
        },
        { status: 400 },
      );
    }

    const invalidStudents = [];

    const cleanedStudents = students.map((student, index) => {
      const name = student.name?.toString().trim();

      const email = student.email?.toString().trim().toLowerCase();

      const errors = [];

      if (!name) {
        errors.push('Name is required');
      }

      if (!email) {
        errors.push('Email is required');
      } else if (!emailRegex.test(email)) {
        errors.push('Invalid email');
      }

      if (errors.length > 0) {
        invalidStudents.push({
          row: index + 1,
          name: name || '',
          email: email || '',
          errors,
        });
      }

      return {
        name,
        email,
      };
    });

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Some students contain invalid data.',
          invalidStudents,
        },
        { status: 400 },
      );
    }

    const emailMap = new Map();

    cleanedStudents.forEach((student) => {
      emailMap.set(student.email, student);
    });

    const uniqueStudents = Array.from(emailMap.values());

    const emails = uniqueStudents.map((student) => student.email);

    const existingUsers = await user
      .find({
        email: { $in: emails },
      })
      .select('email');

    const existingEmailSet = new Set(
      existingUsers.map((user) => user.email.toLowerCase()),
    );

    const alreadyExists = [];

    const newStudents = [];

    uniqueStudents.forEach((student) => {
      if (existingEmailSet.has(student.email)) {
        alreadyExists.push({
          name: student.name,
          email: student.email,
        });
      } else {
        newStudents.push(student);
      }
    });

    const studentsToInsert = [];

    const credentials = [];

    for (const student of newStudents) {
      const temporaryPassword = generateTemporaryPassword();

      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      studentsToInsert.push({
        name: student.name,
        email: student.email,
        password: hashedPassword,
        role: 'student',
        refreshToken: null,
        provider: 'credentials',
        googleId: null,
        image: '',
      });

      credentials.push({
        name: student.name,
        email: student.email,
        temporaryPassword,
      });
    }

    let insertedStudents = [];

    if (studentsToInsert.length > 0) {
      insertedStudents = await user.insertMany(studentsToInsert, {
        ordered: false,
      });
    }

    return NextResponse.json(
      {
        success: true,

        message: 'Bulk import completed successfully.',

        summary: {
          totalReceived: students.length,
          uniqueRecords: uniqueStudents.length,
          imported: insertedStudents.length,
          alreadyExists: alreadyExists.length,
          invalid: invalidStudents.length,
        },

        alreadyExists,

        credentials,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Bulk import error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to import students.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
