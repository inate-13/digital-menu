// src/components/auth/RequestOtpForm.tsx
"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onRequested?: (email: string) => void;
};

export default function RequestOtpForm({ onRequested }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((s) => {
          if (s <= 1) {
            clearInterval(timer);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Failed to request code. Try again.");
        setLoading(false);
        return;
      }

      // Generic success message (avoid email enumeration)
      setMessage("If that email exists, a verification code was sent. Check your inbox.");
      setCooldown(60); // 60 seconds cooldown before resend
      if (onRequested) onRequested(email);
    } catch (err) {
      console.error("request-code error", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Sending…" : cooldown > 0 ? `Resend (${cooldown}s)` : "Send code"}
        </button>

        {cooldown > 0 && (
          <button
            type="button"
            disabled
            className="text-sm text-gray-500"
            aria-disabled
          >
            Please wait
          </button>
        )}
      </div>

      {message && <div className="text-sm text-green-600">{message}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  );
}
