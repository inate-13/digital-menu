// src/components/auth/VerifyOtpForm.tsx
"use client";

import React, { useState } from "react";

type Props = {
  email: string;
  onBack?: () => void;
  // REMOVED: onSuccess?: () => void;
};

export default function VerifyOtpForm({ email, onBack }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function validateCode(val: string) {
    return /^\d{6}$/.test(val);
  }

  async function handleVerify(e?: React.FormEvent) {
  e?.preventDefault();
  setError(null);
  setMessage(null);

  if (!validateCode(code)) {
    setError("Enter the 6-digit code you received.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    // parse JSON as unknown, then safely narrow
    const jsonRaw: unknown = await res.json().catch(() => null);
    const json =
      jsonRaw && typeof jsonRaw === "object"
        ? (jsonRaw as { error?: string; redirect?: string } | null)
        : null;

    if (!res.ok) {
      setError(json?.error ?? "Invalid code. Try again.");
      setLoading(false);
      return;
    }

    setMessage("Verified — signing you in…");

    // Read the redirect URL only if it's a string
    const redirectUrl = typeof json?.redirect === "string" ? json.redirect : "/dashboard";

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 600);
  } catch (err) {
    console.error("verify error", err);
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}

  // ... (omitted return statement for brevity - the form UI remains the same)
  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div>
        <div className="text-sm text-gray-600">Verifying email:</div>
        <div className="font-medium">{email}</div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Verification code</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          value={code}
          onChange={(ev) => setCode(ev.target.value.replace(/[\D]/g, "").slice(0, 6))}
          placeholder="123456"
          className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify & Sign in"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Back
        </button>
      </div>

      {message && <div className="text-sm text-green-600">{message}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  );
}