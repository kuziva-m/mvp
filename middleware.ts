import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // This updates the session and handles route protection
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. / (landing page - allows public access)
     * 5. /login (login page - allows public access)
     * 6. /auth (auth callback routes)
     * 7. /api/webhooks (public webhooks like Stripe/Clay)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|auth|api/webhooks).*)",
  ],
};
