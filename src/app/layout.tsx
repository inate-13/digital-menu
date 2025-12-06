import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "./_components/ui/Header"; // Assuming this path is correct

export const metadata: Metadata = {
  // Updated metadata for branding and SEO
  title: "Digital Menu Management",
  description: "Create dishes, categories, QR menus & share instantly with customers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// Logic remains untouched
function TRPCReactProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Applying font variable and ensuring smooth font rendering
    <html lang="en" className={`${geist.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gray-50 text-gray-900">
        <TRPCReactProvider>
          <Header />
          {/* Using a semantic main tag for content */}
          <main className="flex-grow">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}