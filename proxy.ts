import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request:Request) {
  console.log("🔥 PROXY RUNNING");

  const cookieHeader = request.headers.get("cookie");

  const accessToken = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")
    .slice(1)
    .join("=");

  // No token
  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET missing");
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_ACCESS_SECRET
    );

    const { payload } = await jwtVerify(
      accessToken,
      secret
    );

    console.log("Authenticated user:", payload.id);
    console.log("Role:", payload.role);

    // Authorization
    if (payload.role !== "admin") {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();

  } catch (error) {
    console.error("INVALID ACCESS TOKEN:", error);

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};