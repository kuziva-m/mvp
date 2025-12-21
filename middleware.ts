import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Initialize Supabase Client
  const { supabase, response } = createClient(request);

  // 2. Get Hostname (e.g. "pizza-shop.localhost:3000" or "demo.mvpagency.com")
  const hostname = request.headers.get("host") || "";

  // Define base domain (e.g. localhost:3000 or yourdomain.com)
  // We strip port numbers to make logic cleaner
  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const cleanHostname = hostname
    .replace(`.${baseDomain}`, "")
    .replace(`.${baseDomain.split(":")[0]}`, "");

  // 3. Detect Subdomain
  // If the hostname is NOT the main domain, it's a subdomain.
  const isSubdomain =
    hostname !== "localhost:3000" &&
    hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
    !hostname.startsWith("www.");

  if (isSubdomain) {
    // Rewrite the URL to render the public site page
    // Example: pizza.localhost:3000 -> /public-sites/pizza
    const subdomain = hostname.split(".")[0];
    console.log(
      `[Middleware] Rewriting subdomain ${subdomain} to /public-sites/${subdomain}`
    );
    return NextResponse.rewrite(
      new URL(`/public-sites/${subdomain}`, request.url)
    );
  }

  // 4. Admin Authentication Check
  // Only check auth if accessing /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 5. Return the response (which includes any updated cookies)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, .svg, .png, .jpg)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
