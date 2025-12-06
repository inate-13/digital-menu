"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SkeletonRect } from "./Skeleton"; // Assuming Skeleton is accessible here
import LoadingButton from "./LoadingButton"; // Use the LoadingButton utility

export default function Header() {
  const pathname = usePathname();
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json = await res.json();
        setMe(json.ok ? json.user : null);
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Restaurants", href: "/restaurants" },
    // { name: "Dishes", href: "/dishes" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
          Digital<span className="text-orange-600">Menu</span>
        </Link>

        {/* Desktop Nav and Auth */}
        <div className="hidden md:flex items-center gap-6">
          {loading ? (
            <div className="flex items-center gap-4">
              <SkeletonRect className="w-16 h-4" />
              <SkeletonRect className="w-20 h-4" />
              <SkeletonRect className="w-14 h-4" />
              <SkeletonRect className="w-24 h-8 rounded-lg" />
            </div>
          ) : me ? (
            <>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                    isActive(item.href)
                      ? "text-blue-600 border-b-2 border-blue-600 py-1"
                      : "text-gray-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">
                  {me.fullName || me.email}
                  </p>
                  <p className="text-xs text-gray-500">Account</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                  {(me.fullName || me.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                </div>
              <button
                onClick={handleLogout}
                className="h-8 px-4 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="h-8 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={() => setOpen((x) => !x)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100 border-t" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {loading ? (
            <div className="space-y-3">
              <SkeletonRect className="w-3/4 h-5" />
              <SkeletonRect className="w-1/2 h-5" />
              <SkeletonRect className="w-2/3 h-5" />
            </div>
          ) : me ? (
            <>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <LoadingButton
                onClick={handleLogout}
                className="mt-3 w-full h-10 bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </LoadingButton>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}