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



    const accessToken = createAccessToken(user);

    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();


    const response = NextResponse.json(
      {
        message: "Login successful",
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


   
    response.cookies.set(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15,
        path: "/",
      }
    );


   
    response.cookies.set(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );


    return response;


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