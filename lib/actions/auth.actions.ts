"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/database/mongoose";
import User from "@/database/models/user.model";
import { setSessionCookie } from "@/lib/auth";

import OTP from "@/database/models/otp.model";
import { sendOtpEmail } from "@/lib/nodemailer";

// Helper to validate Gmail (supporting + labels)
const isGmail = (email: string) => {
  return /^[a-z0-9](\.?[a-z0-9+])*@gmail\.com$/.test(email.toLowerCase());
};

// Generate a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function requestOtp(email: string) {
  console.log(`\n--- OTP REQUEST START ---`);
  console.log(`Email: ${email}`);
  
  if (!email) return { error: "Email is required" };
  if (!isGmail(email)) return { error: "Please use a valid @gmail.com address." };

  try {
    await connectToDatabase();

    const userExists = await User.findOne({ email });
    if (userExists) return { error: "An account with this email already exists" };

    // Clear any existing OTPs for this email first
    await OTP.deleteMany({ email });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    // CRITICAL: LOG THIS SO YOU CAN SEE IT IN YOUR TERMINAL
    console.log(`>>> VERIFICATION CODE FOR ${email}: [ ${otp} ] <<<`);

    await OTP.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);
    console.log(`[OTP] Email sent successfully to ${email}`);
    console.log(`--- OTP REQUEST END ---\n`);
    return { success: true };
  } catch (err: any) {
    console.error("[OTP] Error:", err.message);
    return { error: err.message || "Failed to send verification code." };
  }
}

// Standard User Signup with OTP
export async function signup(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const otpCode = (formData.get("otp") as string)?.trim();

  if (!email || !password || !firstName || !lastName || !otpCode) {
    return { error: "Missing required fields" };
  }

  if (!isGmail(email)) {
    return { error: "Only @gmail.com addresses are allowed." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  await connectToDatabase();

  // VERIFY OTP
  const otpRecord = await OTP.findOne({ email, otp: otpCode });
  if (!otpRecord) {
    return { error: "Invalid or expired verification code." };
  }

  // Delete OTP after successful verification
  await OTP.deleteOne({ _id: otpRecord._id });

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
