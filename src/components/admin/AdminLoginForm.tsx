"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminBrand from "@/components/admin/AdminBrand";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="mp-login">
      <div className="mp-login-art">
        <AdminBrand href="/" />
        <p>Architecture · Interiors · Project delivery</p>
      </div>

      <div className="mp-login-side">
        <form className="mp-login-card mp-form" onSubmit={login}>
          <AdminBrand href="/" />
          <p className="mp-eyebrow">PRIVATE ADMINISTRATION</p>
          <h1>Welcome back.</h1>
          <p className="mp-muted">
            Sign in to manage Meppeplin Decor Hub.
          </p>

          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="mp-primary" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {error && (
            <p role="alert" className="mp-error">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}