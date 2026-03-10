"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signup, requestOtp } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink, Mail, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Handle countdown for resending
  React.useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleSendOtp() {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setSendingOtp(true);
    const result = await requestOtp(email);
    setSendingOtp(false);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      setOtpSent(true);
      setCountdown(60); // 60s cooldown
      toast.success("Verification code sent to your Gmail!");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!otpSent) {
      toast.error("Please verify your email first");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfcf6] p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-soft-lg border border-black/5">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-[#212a3b]">Join ScholarSync</h2>
          <p className="mt-2 text-[#3d485e]">Start your study journey today</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[#212a3b] mb-1">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#212a3b] focus:ring-[#212a3b] sm:text-sm outline-none transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#212a3b] mb-1">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#212a3b] focus:ring-[#212a3b] sm:text-sm outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-[#212a3b] mb-1">Gmail address</label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#212a3b] focus:ring-[#212a3b] sm:text-sm outline-none transition-all pr-24"
                  placeholder="you@gmail.com"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold bg-[#212a3b] text-white rounded-lg hover:bg-[#3d485e] disabled:bg-gray-200 disabled:text-gray-400 transition-all min-w-[80px]"
                >
                  {sendingOtp 
                    ? "Sending..." 
                    : countdown > 0 
                      ? `Wait ${countdown}s` 
                      : otpSent 
                        ? "Resend" 
                        : "Send Code"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="otp" className="block text-sm font-medium text-[#212a3b] mb-1">Verification Code</label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full rounded-xl border border-green-200 bg-green-50/30 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm outline-none transition-all tracking-[0.5em] font-mono text-center"
                    placeholder="000000"
                  />
                  <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                </div>
                <p className="mt-1 text-[10px] text-green-600 font-medium">Check your inbox for the 6-digit code</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#212a3b] mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#212a3b] focus:ring-[#212a3b] sm:text-sm outline-none transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#212a3b] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !otpSent}
              className="group relative flex w-full justify-center rounded-xl bg-[#212a3b] py-3 px-4 text-sm font-bold text-white hover:bg-[#3d485e] focus:outline-none focus:ring-2 focus:ring-[#212a3b] focus:ring-offset-2 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? "Creating account..." : "Complete Sign Up"}
            </button>
          </div>
        </form>
        
        <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
          <div className="text-center">
            <p className="text-sm text-[#3d485e]">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-bold text-[#663820] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#3d485e]/60 font-bold">
              Developed by:{" "}
              <Link 
                href="https://keithlar.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#663820] hover:text-[#212a3b] transition-colors inline-flex items-center gap-1 group"
              >
                Keithlar <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
