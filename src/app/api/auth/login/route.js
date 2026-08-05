import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { email, password } = body;


    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }


    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }


    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isPasswordMatch) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }


    // Create tokens
    const accessToken = createAccessToken(user);

    const refreshToken = createRefreshToken(user);

//etho sida token add kr deo cookies ch 

    user.refreshToken = refreshToken;
    await user.save();


    return NextResponse.json(
      {
        message: "Login successful",
        accessToken,//remove from here also
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
      }
    );


  } catch (error) {

    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }
}