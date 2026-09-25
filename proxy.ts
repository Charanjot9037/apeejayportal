import { NextResponse } from "next/server";

export default function proxy(request: Request) {
  console.log("🔥🔥🔥 PROXY RUNNING 🔥🔥🔥");

  const url = new URL(request.url);
  console.log("PATH:", url.pathname);

  // Read accessToken cookie
  const accessToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];

  console.log("Access token exists:", !!accessToken);

  // No access token → send user to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};