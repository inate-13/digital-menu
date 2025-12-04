"use client";

import React, { useState } from "react";
import RequestOtpForm from "../_components/auth/RequestOtpForm";
import VerifyOtpForm from "../_components/auth/VerifyOtpForm";

export default function AuthPageClient() {
  const [email, setEmail] = useState<string | null>(null);
  const [stage, setStage] = useState<"request" | "verify">("request");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Sign in / Sign up</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your email and we'll send a verification code.
        </p>

        {stage === "request" && (
          <RequestOtpForm
            onRequested={(e) => {
              setEmail(e);
              setStage("verify");
            }}
          />
        )}

        {stage === "verify" && email && (
          <VerifyOtpForm
            email={email}
            onBack={() => setStage("request")}
            onSuccess={() => {
              window.location.href = "/";
            }}
          />
        )}
      </div>
    </main>
  );
}
