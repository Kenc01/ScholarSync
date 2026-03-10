import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "fallback-secret-change-this-in-env";
const key = new TextEncoder().encode(secretKey);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  if (!parsed) return null;

  parsed.expires = new Date(Date.now() + SESSION_DURATION);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: parsed.expires,
  });
  return res;
}

// Helper to set cookie during login/signup
export async function setSessionCookie(sessionData: any) {
  const expires = new Date(Date.now() + SESSION_DURATION);
  const session = await encrypt({ ...sessionData, expires });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
