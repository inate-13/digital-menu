"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Simple responsive header:
 * - Desktop: shows logo left, nav center (optional), user actions right.
 * - Mobile: hamburger toggles a slide-down menu.
 *
 * It calls /api/auth/me (if you implement) or uses a lightweight approach:
 * We fetch /api/auth/me to determine if user is logged in. If not present,
 * show Login button.
 *
 * Replace /api/auth/me later with tRPC as you implement serverside helpers.
 */

type MeResponse = { ok: true; user?: { id: string; fullName?: string; email: string } } | { ok: false };

export default function Header() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json = await res.json();
        if (!mounted) return;
        setMe(json);
      } catch (e) {
        setMe({ ok: false });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      // Reload to reflect logged-out state
      window.location.href = "/";
    } catch (err) {
      console.error("logout failed", err);
      window.location.href = "/";
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-semibold">
              DigitalMenu
            </Link>
          </div>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/menu" className="text-sm hover:underline">
              Explore menus
            </Link>
            <Link href="/pricing" className="text-sm hover:underline">
              Pricing
            </Link>
          </nav>

          {/* right side */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && me?.ok && me.user ? (
              <>
                <span className="text-sm">{me.user.fullName || me.user.email}</span>
                <Link href="/dashboard" className="px-3 py-1 rounded-md border text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">
                Login
              </Link>
            )}
          </div>

          {/* mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Open menu"
              className="inline-flex items-center justify-center p-2 rounded-md border"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {open ? (
                  <path fillRule="evenodd" d="M6 4l8 8M6 12L14 4" clipRule="evenodd" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3">
            <Link href="/menu" className="block py-2">
              Explore menus
            </Link>
            <Link href="/pricing" className="block py-2">
              Pricing
            </Link>

            {!loading && me?.ok && me.user ? (
              <>
                <Link href="/dashboard" className="block py-2">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-md bg-red-600 text-white py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="block py-2 mt-2 rounded-md bg-blue-600 text-white text-center">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
