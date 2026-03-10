"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink } from "lucide-react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
              <label htmlFor="email-address" className="block text-sm font-medium text-[#212a3b] mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#212a3b] focus:ring-[#212a3b] sm:text-sm outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
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
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-[#212a3b] py-3 px-4 text-sm font-bold text-white hover:bg-[#3d485e] focus:outline-none focus:ring-2 focus:ring-[#212a3b] focus:ring-offset-2 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? "Creating account..." : "Sign up"}
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
