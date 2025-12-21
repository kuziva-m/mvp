<<<<<<< HEAD
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function createClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
}
=======
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
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
