"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
    { name: "Dishes", href: "/dishes" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/" className="text-xl font-semibold">
          DigitalMenu
        </Link>

        {/* Desktop Nav */}
        {!loading && (
          <nav className="hidden md:flex items-center gap-6">
            {me ? (
              <>
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm ${
                      isActive(item.href)
                        ? "text-blue-600 font-medium"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <span className="text-sm text-gray-600">{me.fullName || me.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
              >
                Login
              </Link>
            )}
          </nav>
        )}

        {/* Mobile */}
        <button
          className="md:hidden p-2 border rounded"
          onClick={() => setOpen((x) => !x)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-3">
          {!loading && me ? (
            <>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-600 text-white py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="block py-2 bg-blue-600 text-white text-center rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
