"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 12) {
      setMessage("Use at least 12 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);

    const { error } = await createClient().auth.updateUser({
      password,
    });

    setMessage(error ? error.message : "Password updated.");

    if (!error) {
      setPassword("");
      setConfirm("");
    }

    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mp-form">
      <h3>Change password</h3>

      <label>
        New password
        <input
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <label>
        Confirm new password
        <input
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>

      <button type="submit" disabled={busy} className="mp-primary">
        {busy ? "Updating…" : "Update password"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}