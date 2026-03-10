import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// Define route patterns
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/admin-signup"];
const ADMIN_ROUTES = ["/admin"];
const API_VAPI_PREFIX = "/api/vapi";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Determine route type
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith(API_VAPI_PREFIX);
  const isAdminRoute = ADMIN_ROUTES.some(route => path.startsWith(route));

  // 2. Get and verify session
  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  // 3. Security Logic
  
  // If user is logged in and tries to access auth pages, send them to library
  if (session && (path === "/sign-in" || path === "/sign-up" || path === "/admin-signup")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If route is private and no session exists
  if (!isPublicRoute && !session) {
    const searchParams = new URLSearchParams(req.nextUrl.search);
    searchParams.set("from", path);
    return NextResponse.redirect(new URL(`/sign-in?${searchParams.toString()}`, req.nextUrl));
  }

  // Strict Admin Check
  if (isAdminRoute && session?.role !== "admin") {
    console.warn(`Unauthorized admin access attempt by: ${session?.email || 'Unknown'}`);
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
