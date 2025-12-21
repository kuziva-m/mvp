// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Pass through everything - Authentication is disabled for Admin Panel
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the _next/static, _next/image and favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
