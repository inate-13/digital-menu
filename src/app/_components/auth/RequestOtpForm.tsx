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
  setMessage(null); // Clear messages on submit

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

    // parse JSON as unknown and then narrow
    const jsonRaw: unknown = await res.json().catch(() => null);
    const json =
      jsonRaw && typeof jsonRaw === "object" ? (jsonRaw as { error?: string } | null) : null;

    if (!res.ok) {
      setError(json?.error ?? "Failed to request code. Try again.");
      return;
    }

    // Generic success message
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-700">Email Address</span>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@example.com"
          // Shadcn-style input classes
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </label>

      {/* Message and Error Styles */}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
          {message}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Primary Button with integrated loading spinner (visual) */}
        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className={`
            inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 py-2 
            bg-blue-600 text-white hover:bg-blue-700 transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            cooldown > 0 ? `Resend (${cooldown}s)` : "Send Verification Code"
          )}
        </button>

        {cooldown > 0 && (
          // Clean visual feedback for cooldown
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
            Wait for code
          </div>
        )}
      </div>
    </form>
  );
}