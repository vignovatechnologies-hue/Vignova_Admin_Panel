"use client";

import { usePathname } from "next/navigation";
import RequireAuth from "@/components/RequireAuth/RequireAuth";

export default function AppShell({ children }) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname?.startsWith("/reset-password")) {
    return children;
  }
  return <RequireAuth>{children}</RequireAuth>;
}
