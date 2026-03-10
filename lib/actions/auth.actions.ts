"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/database/mongoose";
import User from "@/database/models/user.model";
import { encrypt } from "@/lib/auth";

// Standard User Signup
export async function signup(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Missing required fields" };
  }

  await connectToDatabase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
    expires,
  });

  (await cookies()).set("session", session, { expires, httpOnly: true });

  redirect("/");
}

// Special Admin Signup (Hidden Page)
export async function adminSignup(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const secretKey = formData.get("secretKey") as string;

  const ADMIN_SECRET = "scholar-admin-2024";

  if (!email || !password || !firstName || !lastName || !secretKey) {
    return { error: "Missing required fields" };
  }

  if (secretKey !== ADMIN_SECRET) {
    return { error: "Invalid Admin Secret Key" };
  }

  await connectToDatabase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
    status: "active"
  });

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
    expires,
  });

  (await cookies()).set("session", session, { expires, httpOnly: true });

  redirect("/admin");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing email or password" };
  }

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid credentials" };
  }

  // BAN CHECK
  if (user.status === "banned") {
    return { error: "Your account has been suspended. Please contact support." };
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
    expires,
  });

  (await cookies()).set("session", session, { expires, httpOnly: true });

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
  redirect("/sign-in");
}
