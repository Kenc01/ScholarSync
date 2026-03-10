import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/vapi"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith("/api/vapi"));

  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (session && (path === "/sign-in" || path === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
