"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSession() {
      try {
        // use cache: "no-store" to ensure we get fresh session data on navigation/redirects
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          setStatus("authenticated");
        } else {
          setSession(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        setSession(null);
        setStatus("unauthenticated");
      }
    }
    fetchSession();
  }, [pathname]); // Re-fetch when the user navigates (e.g., after redirect from login)

  return { session, status };
}
