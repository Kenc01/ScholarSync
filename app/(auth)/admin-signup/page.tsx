"use client";

import React, { useState } from "react";
import Link from "next/link";
import { adminSignup } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, Key } from "lucide-react";

export default function AdminSignUpPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await adminSignup(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212a3b] p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f3e4c7] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-[#663820]" size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#212a3b]">Admin Registration</h2>
          <p className="mt-2 text-[#3d485e]">Create a management account</p>
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
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#663820] focus:ring-[#663820] sm:text-sm outline-none transition-all bg-gray-50"
                placeholder="Admin"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#212a3b] mb-1">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#663820] focus:ring-[#663820] sm:text-sm outline-none transition-all bg-gray-50"
                placeholder="User"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-[#212a3b] mb-1">Admin Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#663820] focus:ring-[#663820] sm:text-sm outline-none transition-all bg-gray-50"
                placeholder="admin@scholarsync.com"
              />
            </div>

            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-[#212a3b] mb-1 flex items-center gap-2">
                <Key size={14} className="text-[#663820]" /> Admin Secret Key
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                className="block w-full rounded-xl border border-[#f3e4c7] px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#663820] focus:ring-[#663820] sm:text-sm outline-none transition-all bg-[#fdfcf6] font-mono"
                placeholder="Enter Secret Key"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#212a3b] mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-[#212a3b] placeholder-gray-400 focus:border-[#663820] focus:ring-[#663820] sm:text-sm outline-none transition-all bg-gray-50 pr-12"
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

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-[#663820] py-4 px-4 text-sm font-bold text-white hover:bg-[#7a4528] focus:outline-none focus:ring-2 focus:ring-[#663820] focus:ring-offset-2 transition-all disabled:opacity-50 shadow-xl"
          >
            {loading ? "Verifying..." : "Initialize Admin Account"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-black/5">
          <Link href="/sign-in" className="text-sm font-bold text-[#212a3b] hover:text-[#663820] transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
