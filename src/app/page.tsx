import { getCurrentUser } from "../server/auth/getCurrentUser";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Digital Menu Management",
};

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      {/* <header className="w-full flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">DigitalMenu</h1>
        <Link
          href="/auth"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </header> */}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold leading-tight">
            Transform Your Menu into a Beautiful Digital Experience
          </h2>

          <p className="mt-4 text-gray-600">
            Create dishes, categories, QR menus & share instantly with customers.
          </p>

          <Link
            href="/auth"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-10 md:mt-0">
          <Image
            src="/landing-menu.png"
            width={400}
            height={300}
            alt="Digital menu illustration"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>
    </main>
  );
}
