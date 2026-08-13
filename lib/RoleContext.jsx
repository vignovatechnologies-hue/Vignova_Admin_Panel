"use client";

import { useAuth } from "@/lib/AuthContext";

/**
 * Back-compat shim: existing components call useRole(). Now backed by the
 * real Supabase-authenticated employee record instead of a local preview
 * toggle. isAdmin reflects the logged-in user's role_type in `employees`.
 */
export function useRole() {
  const { isAdmin, employee } = useAuth();
  return {
    role: employee?.role_type || "employee",
    isAdmin,
  };
}

