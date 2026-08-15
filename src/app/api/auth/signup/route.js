import { connectDB } from '@/lib/db';
import User from '../../../../models/user';
import bcrypt from 'bcrypt';
import { createRefreshToken, createAccessToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();

    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 },
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name, // Optional if your schema requires it
    });

    // Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({
      message: 'Signup successful',
      user: {
        id: user._id,
        email: user.email,
      },
    });

    // Access Token Cookie
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
      path: '/',
    });

    // Refresh Token Cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
