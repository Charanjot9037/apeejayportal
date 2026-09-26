import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { connectDB } from '@/lib/db';
import User from '@/models/user';
import Mentor from '@/models/mentor';

import { generateTemporaryPassword } from '@/lib/generatePassword';
import { authenticateUser } from '@/lib/authentication';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedDepartments = [
  'Information Technology',
  'Management',
  'Engineering',
];

const allowedDesignations = [
  'assistant_professor',
  'HOD',
  'Dean',
  'Director',
  'Engineer',
];

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const records = body.students;
    const role = body.role;

    console.log('========== BULK IMPORT ==========');
    console.log('Role:', role);
    console.log('Records received:', records?.length);

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status || 401,
        },
      );
    }

    const user = auth.user;

    console.log('Authenticated user:', {
      id: user._id,
      role: user.role,
    });

    // =====================================================
    // AUTHORIZATION
    // =====================================================

    if (user.role !== 'mentor') {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access denied. Only authorized mentors can perform bulk import.',
        },
        {
          status: 403,
        },
      );
    }

    const loggedInMentor = await Mentor.findOne({
      userId: user._id,
    });

    if (!loggedInMentor) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mentor profile was not found for the logged-in user.',
        },
        {
          status: 403,
        },
      );
    }

    if (loggedInMentor.designation !== 'Engineer') {
      return NextResponse.json(
        {
          success: false,
          message:
            'Only an Engineer mentor is authorized to perform bulk import.',
        },
        {
          status: 403,
        },
      );
    }

    // =====================================================
    // VALIDATE ROLE
    // =====================================================

    if (!['student', 'mentor'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid import role.',
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // VALIDATE ARRAY
    // =====================================================

    if (!Array.isArray(records)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Import data must be an array.',
        },
        {
          status: 400,
        },
      );
    }

    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No ${role} records provided.`,
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // MENTOR IMPORT
    // =====================================================

    if (role === 'mentor') {
      return await importMentors(records);
    }

    // =====================================================
    // STUDENT IMPORT
    // =====================================================

    return await importStudents(records);
  } catch (error) {
    console.error('========== BULK IMPORT ERROR ==========');
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to import records.',
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// =========================================================
// MENTOR IMPORT
// =========================================================

async function importMentors(mentors) {
  console.log('========== MENTOR IMPORT ==========');

  const invalidMentors = [];

  // =====================================================
  // CLEAN + VALIDATE MENTORS
  // =====================================================

  const cleanedMentors = mentors.map((mentor, index) => {
    const name = mentor.name?.toString().trim() || '';

    const email = mentor.email?.toString().trim().toLowerCase() || '';

    const mobileNumber = mentor.mobileNumber?.toString().trim() || '';

    const department = mentor.department?.toString().trim() || '';

    const designation = mentor.designation?.toString().trim() || '';

    const errors = [];

    if (!name) {
      errors.push('Mentor name is required.');
    }

    if (!email) {
      errors.push('Mentor email is required.');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid mentor email.');
    }

    if (!mobileNumber) {
      errors.push('Mobile number is required.');
    }

    if (!department) {
      errors.push('Department is required.');
    } else if (!allowedDepartments.includes(department)) {
      errors.push(
        `Invalid department. Allowed values: ${allowedDepartments.join(', ')}`,
      );
    }

    if (!designation) {
      errors.push('Designation is required.');
    } else if (!allowedDesignations.includes(designation)) {
      errors.push(
        `Invalid designation. Allowed values: ${allowedDesignations.join(
          ', ',
        )}`,
      );
    }

    if (errors.length > 0) {
      invalidMentors.push({
        row: index + 2,
        name,
        email,
        mobileNumber,
        department,
        designation,
        errors,
      });
    }

    return {
      row: index + 2,
      name,
      email,
      mobileNumber,
      department,
      designation,
    };
  });

  console.log('Cleaned mentors:', cleanedMentors);
  console.log('Invalid mentors:', invalidMentors);

  // =====================================================
  // STOP IF INVALID
  // =====================================================

  if (invalidMentors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Some mentor rows contain invalid data.',
        invalidMentors,
      },
      {
        status: 400,
      },
    );
  }

  // =====================================================
  // REMOVE DUPLICATES FROM FILE
  // =====================================================

  const emailMap = new Map();

  for (const mentor of cleanedMentors) {
    if (!emailMap.has(mentor.email)) {
      emailMap.set(mentor.email, mentor);
    }
  }

  const uniqueMentors = Array.from(emailMap.values());

  console.log('Unique mentors:', uniqueMentors);

  const emails = uniqueMentors.map((mentor) => mentor.email);

  // =====================================================
  // CHECK EXISTING USERS
  // =====================================================

  const existingUsers = await User.find({
    email: {
      $in: emails,
    },
  }).select('_id name email role');

  console.log('Existing users:', existingUsers);

  const existingEmailSet = new Set(
    existingUsers.map((existingUser) => existingUser.email.toLowerCase()),
  );

  const alreadyExists = [];
  const newMentors = [];

  for (const mentor of uniqueMentors) {
    if (existingEmailSet.has(mentor.email)) {
      alreadyExists.push({
        row: mentor.row,
        name: mentor.name,
        email: mentor.email,
        errors: ['Mentor email already exists.'],
      });
    } else {
      newMentors.push(mentor);
    }
  }

  const importedMentors = [];
  const credentials = [];

  for (const mentorData of newMentors) {
    try {
      console.log('Creating mentor:', mentorData.email);

      const temporaryPassword = generateTemporaryPassword();

      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      // =================================================
      // USER ROLE
      // =================================================

      const userRole =
        mentorData.designation.toLowerCase() === 'engineer'
          ? 'admin'
          : 'mentor';

      // =================================================
      // CREATE USER
      // =================================================

      const createdUser = await User.create({
        name: mentorData.name,
        email: mentorData.email,
        password: hashedPassword,
        role: userRole,
      });

      console.log('USER CREATED:', {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      });

      // =================================================
      // CREATE MENTOR PROFILE
      // =================================================

      const createdMentor = await Mentor.create({
        userId: createdUser._id,
        mobileNumber: mentorData.mobileNumber,
        department: mentorData.department,
        designation: mentorData.designation,
      });

      console.log('MENTOR PROFILE CREATED:', {
        id: createdMentor._id,
        userId: createdMentor.userId,
        mobileNumber: createdMentor.mobileNumber,
        department: createdMentor.department,
        designation: createdMentor.designation,
      });

      // =================================================
      // SAVE RESULT
      // =================================================

      importedMentors.push({
        userId: createdUser._id,
        mentorId: createdMentor._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        mobileNumber: createdMentor.mobileNumber,
        department: createdMentor.department,
        designation: createdMentor.designation,
      });

      // =================================================
      // SAVE TEMPORARY CREDENTIALS
      // =================================================

      credentials.push({
        name: mentorData.name,
        email: mentorData.email,
        password: temporaryPassword,
      });
    } catch (error) {
      console.error(`Failed to create mentor ${mentorData.email}:`, error);

      throw error;
    }
  }

  console.log('Successfully imported mentors:', importedMentors);

  // =====================================================
  // RESPONSE
  // =====================================================

  return NextResponse.json(
    {
      success: true,

      message: 'Bulk mentor import completed.',

      summary: {
        totalReceived: mentors.length,
        uniqueRecords: uniqueMentors.length,
        imported: importedMentors.length,
        alreadyExists: alreadyExists.length,
        invalidMentors: invalidMentors.length,
      },

      importedMentors,
      alreadyExists,
      invalidMentors,
      credentials,
    },
    {
      status: 201,
    },
  );
}

// =========================================================
// STUDENT IMPORT
// =========================================================

async function importStudents(students) {
  const invalidStudents = [];

  // =====================================================
  // CLEAN + VALIDATE STUDENTS
  // =====================================================

  const cleanedStudents = students.map((student, index) => {
    const name = student.name?.toString().trim() || '';

    const email = student.email?.toString().trim().toLowerCase() || '';

    const guidename = student.guidename?.toString().trim() || '';

    const guideemail =
      student.guideemail?.toString().trim().toLowerCase() || '';

    const errors = [];

    if (!name) {
      errors.push('Student name is required.');
    }

    if (!email) {
      errors.push('Student email is required.');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid student email.');
    }

    if (!guidename) {
      errors.push('Guide name is required.');
    }

    if (!guideemail) {
      errors.push('Guide email is required.');
    } else if (!emailRegex.test(guideemail)) {
      errors.push('Invalid guide email.');
    }

    if (errors.length > 0) {
      invalidStudents.push({
        row: index + 2,
        name,
        email,
        guidename,
        guideemail,
        errors,
      });
    }

    return {
      row: index + 2,
      name,
      email,
      guidename,
      guideemail,
    };
  });

  // =====================================================
  // STOP IF INVALID
  // =====================================================

  if (invalidStudents.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Some student rows contain invalid data.',
        invalidStudents,
      },
      {
        status: 400,
      },
    );
  }

  // =====================================================
  // REMOVE DUPLICATES
  // =====================================================

  const emailMap = new Map();

  for (const student of cleanedStudents) {
    if (!emailMap.has(student.email)) {
      emailMap.set(student.email, student);
    }
  }

  const uniqueStudents = Array.from(emailMap.values());

  const emails = uniqueStudents.map((student) => student.email);

  // =====================================================
  // CHECK EXISTING USERS
  // =====================================================

  const existingUsers = await User.find({
    email: {
      $in: emails,
    },
  }).select('_id name email role');

  const existingEmailSet = new Set(
    existingUsers.map((existingUser) => existingUser.email.toLowerCase()),
  );

  const alreadyExists = [];
  const newStudents = [];

  for (const student of uniqueStudents) {
    if (existingEmailSet.has(student.email)) {
      alreadyExists.push({
        row: student.row,
        name: student.name,
        email: student.email,
        errors: ['Student email already exists.'],
      });
    } else {
      newStudents.push(student);
    }
  }

  // =====================================================
  // FIND GUIDES
  // =====================================================

  const guideEmails = [
    ...new Set(newStudents.map((student) => student.guideemail)),
  ];

  const guideUsers = await User.find({
    email: {
      $in: guideEmails,
    },
  }).select('_id name email role');

  const mentorUserMap = new Map();

  for (const guideUser of guideUsers) {
    mentorUserMap.set(guideUser.email.toLowerCase(), guideUser);
  }

  // =====================================================
  // VALIDATE GUIDES
  // =====================================================

  const validStudents = [];
  const invalidGuides = [];

  for (const student of newStudents) {
    const guideUser = mentorUserMap.get(student.guideemail);

    if (!guideUser) {
      invalidGuides.push({
        row: student.row,
        name: student.name,
        email: student.email,
        guidename: student.guidename,
        guideemail: student.guideemail,
        errors: [`Guide email "${student.guideemail}" does not exist.`],
      });

      continue;
    }

    if (guideUser.role !== 'mentor') {
      invalidGuides.push({
        row: student.row,
        name: student.name,
        email: student.email,
        guidename: student.guidename,
        guideemail: student.guideemail,
        errors: [
          `Guide email "${student.guideemail}" does not belong to a mentor.`,
        ],
      });

      continue;
    }

    const excelGuideName = student.guidename?.trim().toLowerCase();

    const databaseGuideName = guideUser.name?.trim().toLowerCase();

    if (excelGuideName !== databaseGuideName) {
      invalidGuides.push({
        row: student.row,
        name: student.name,
        email: student.email,
        guidename: student.guidename,
        guideemail: student.guideemail,
        errors: [
          `Guide name does not match. Excel: "${student.guidename}", Database: "${guideUser.name}".`,
        ],
      });

      continue;
    }

    validStudents.push({
      ...student,
      mentorId: guideUser._id,
    });
  }

  // =====================================================
  // CREATE STUDENTS
  // =====================================================

  const studentsToInsert = [];
  const credentials = [];

  for (const student of validStudents) {
    const temporaryPassword = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    studentsToInsert.push({
      name: student.name,
      email: student.email,
      password: hashedPassword,
      role: 'student',
      mentorId: student.mentorId,
    });

    credentials.push({
      name: student.name,
      email: student.email,
      password: temporaryPassword,
    });
  }

  // =====================================================
  // INSERT STUDENTS
  // =====================================================

  let insertedStudents = [];

  if (studentsToInsert.length > 0) {
    try {
      insertedStudents = await User.insertMany(studentsToInsert, {
        ordered: false,
      });
    } catch (insertError) {
      console.error('STUDENT INSERT ERROR:', insertError);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to insert students.',
          error: insertError.message,
          alreadyExists,
          invalidStudents,
          invalidGuides,
        },
        {
          status: 500,
        },
      );
    }
  }

  // =====================================================
  // RESPONSE
  // =====================================================

  return NextResponse.json(
    {
      success: true,

      message: 'Bulk student import completed.',

      summary: {
        totalReceived: students.length,
        uniqueRecords: uniqueStudents.length,
        imported: insertedStudents.length,
        alreadyExists: alreadyExists.length,
        invalidStudentData: invalidStudents.length,
        invalidGuides: invalidGuides.length,
      },

      alreadyExists,
      invalidStudents,
      invalidGuides,
      credentials,
    },
    {
      status: 201,
    },
  );
}
