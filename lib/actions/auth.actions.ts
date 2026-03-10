"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/database/mongoose";
import User from "@/database/models/user.model";
import { setSessionCookie } from "@/lib/auth";

// Standard User Signup
export async function signup(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Missing required fields" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  await connectToDatabase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { error: "An account with this email already exists" };
  }

  // Use 12 rounds for better security (slightly slower but harder to crack)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Auto-promote ONLY the master admin email
  const role = email === 'keith.admin.study@gmail.com' ? "admin" : "user";

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    status: "active"
  });

  await setSessionCookie({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
  });

  redirect("/");
}

// Special Admin Signup (Hidden Page)
export async function adminSignup(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const secretKey = formData.get("secretKey") as string;

  // IMPORTANT: Move this to process.env.ADMIN_SECRET in production
  const ADMIN_SECRET = process.env.ADMIN_SECRET || "scholar-admin-2024";

  if (!email || !password || !firstName || !lastName || !secretKey) {
    return { error: "Missing required fields" };
  }

  if (secretKey !== ADMIN_SECRET) {
    return { error: "Invalid Admin Secret Key" };
  }

  if (password.length < 8) {
    return { error: "Admin password must be at least 8 characters long" };
  }

  await connectToDatabase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
    status: "active"
  });

  await setSessionCookie({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
  });

  redirect("/admin");
}

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password" };
  }

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Generic error message to prevent email enumeration
    return { error: "Invalid email or password" };
  }

  // BAN CHECK
  if (user.status === "banned") {
    return { error: "This account has been suspended for security reasons." };
  }

  await setSessionCookie({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
  });

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/sign-in");
}
