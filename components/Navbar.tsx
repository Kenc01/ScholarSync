"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { logout } from "@/lib/actions/auth.actions";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const pathName = usePathname();
  const { session, status } = useSession();

  return (
    <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="ScholarSync"
            width={42}
            height={26}
          />
          <span className="logo-text">ScholarSync</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          <Link
            href="/"
            className={cn(
              "nav-link-base",
              pathName === "/"
                ? "nav-link-active"
                : "text-black hover:opacity-70",
            )}
          >
            Library
          </Link>

          {status === "authenticated" && (
            <Link
              href="/books/new"
              className={cn(
                "nav-link-base",
                pathName.startsWith("/books/new")
                  ? "nav-link-active"
                  : "text-black hover:opacity-70",
              )}
            >
              Add New
            </Link>
          )}

          <div className="flex gap-7.5 items-center">
            {status === "unauthenticated" && (
              <>
                <Link href="/sign-in" className="nav-link-base text-black hover:opacity-70">
                  Sign In
                </Link>
                <Link href="/sign-up" className="px-5 py-2 rounded-full bg-[#212a3b] text-white text-sm font-bold hover:bg-[#3d485e] transition-all">
                  Sign Up
                </Link>
              </>
            )}
            
            {status === "authenticated" && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f3e4c7] flex items-center justify-center text-[#212a3b]">
                    <User size={18} />
                  </div>
                  <span className="nav-user-name">
                    {session?.firstName}
                  </span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
