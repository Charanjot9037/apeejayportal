import { NextResponse } from "next/server";

export default function proxy(request: Request) {
  console.log("🔥🔥🔥 PROXY RUNNING 🔥🔥🔥");
  console.log("PATH:", new URL(request.url).pathname);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};