// src/app/auth/page.tsx (Server Component)

import AuthPageClient from "../auth/AuthPageClient";

export const metadata = {
  title: "Sign in — Digital Menu",
};

export default function Page() {
  return <AuthPageClient />;
}
