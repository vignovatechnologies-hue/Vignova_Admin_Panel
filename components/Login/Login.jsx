"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ShieldCheck, ShieldCheck as AdminIcon, Eye } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import "./Login.css";

export default function Login() {
  const router = useRouter();
  const { signIn, sendPasswordReset, signOut } = useAuth();

  const [loginType, setLoginType] = useState("admin"); // "admin" | "employee"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setLoading(false);
      setError("Incorrect email or password. Please try again.");
      return;
    }

    // Confirm the account's real role matches the tab they signed in on.
    const { data: { session } } = await supabase.auth.getSession();
    const { data: empRow } = await supabase
      .from("employees")
      .select("role_type")
      .eq("auth_user_id", session?.user?.id)
      .single();

    setLoading(false);

    if (!empRow || empRow.role_type !== loginType) {
      await signOut();
      setError(
        loginType === "admin"
          ? "This account is not an Admin account. Use the Employee tab instead."
          : "This account is an Admin account. Use the Admin tab instead."
      );
      return;
    }

    router.push("/");
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setResetSent(true);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-card__brand">
          <div className="login-card__logo">V</div>
          <div>
            <p className="login-card__brand-name">VIGNOVA</p>
            <p className="login-card__brand-sub">MANAGEMENT</p>
          </div>
        </div>

        {mode === "login" ? (
          <>
            <h1 className="login-card__title">Sign in</h1>
            <div className="login-card__tabs">
              <button
                type="button"
                className={`login-card__tab ${loginType === "admin" ? "login-card__tab--active" : ""}`}
                onClick={() => { setLoginType("admin"); setError(""); }}
              >
                <AdminIcon size={14} /> Admin
              </button>
              <button
                type="button"
                className={`login-card__tab ${loginType === "employee" ? "login-card__tab--active" : ""}`}
                onClick={() => { setLoginType("employee"); setError(""); }}
              >
                <Eye size={14} /> Employee
              </button>
            </div>
            <p className="login-card__subtitle">
              {loginType === "admin"
                ? "Sign in with your Admin account."
                : "Sign in with your Employee account."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email</label>
                <div className="login-input">
                  <Mail size={15} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@vignova.in"
                  />
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="login-input">
                  <Lock size={15} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <p className="login-card__error">{error}</p>}

              <button className="btn btn--primary login-card__submit" type="submit" disabled={loading}>
                <LogIn size={15} /> {loading ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                className="login-card__link"
                onClick={() => { setMode("forgot"); setError(""); }}
              >
                Forgot password?
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="login-card__title">Reset password</h1>
            <p className="login-card__subtitle">
              Enter your email and we'll send you a password reset link.
            </p>

            {resetSent ? (
              <div className="login-card__success">
                <ShieldCheck size={18} />
                <p>Check your inbox for a password reset link.</p>
              </div>
            ) : (
              <form onSubmit={handleForgot}>
                <div className="field">
                  <label>Email</label>
                  <div className="login-input">
                    <Mail size={15} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@vignova.in"
                    />
                  </div>
                </div>

                {error && <p className="login-card__error">{error}</p>}

                <button className="btn btn--primary login-card__submit" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}

            <button
              type="button"
              className="login-card__link"
              onClick={() => { setMode("login"); setError(""); setResetSent(false); }}
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
