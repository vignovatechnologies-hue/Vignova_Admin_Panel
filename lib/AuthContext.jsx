"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null); // row from `employees`
  const [loading, setLoading] = useState(true);

  const loadEmployee = useCallback(async (authUserId) => {
    if (!authUserId) {
      setEmployee(null);
      return;
    }
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error) {
      console.error("Failed to load employee record:", error.message);
      setEmployee(null);
      return;
    }
    setEmployee(data);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      await loadEmployee(session?.user?.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadEmployee(session?.user?.id);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadEmployee]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await loadEmployee(data.user?.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmployee(null);
  };

  const sendPasswordReset = async (email) => {
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error?.message || null };
  };

  const value = {
    employee,
    loading,
    isAdmin: employee?.role_type === "admin",
    isAuthenticated: !!employee,
    signIn,
    signOut,
    sendPasswordReset,
    refreshEmployee: () => supabase.auth.getSession().then(({ data: { session } }) => loadEmployee(session?.user?.id)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
