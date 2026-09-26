import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request:Request) {


  const url = new URL(request.url);



  // Get accessToken from cookies
  const cookieHeader = request.headers.get("cookie");

  const accessToken = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")
    .slice(1)
    .join("=");



  // No access token
  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    // JWT secret
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
     

      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const encodedSecret = new TextEncoder().encode(secret);

    // Verify JWT signature + expiration
    const { payload } = await jwtVerify(
      accessToken,
      encodedSecret
    );



    // Token is valid
    return NextResponse.next();

  } catch (error) {
  


    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/mentor-dashboard/:path*",
    "/student/:path*",
    "/profile/:path*",
    "/help/:path*"
  ],
};