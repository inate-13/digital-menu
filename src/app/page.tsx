/* eslint-disable @typescript-eslint/no-unsafe-assignment, react/no-unescaped-entities, @typescript-eslint/no-unsafe-call,   @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
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
    <main className="min-h-auto flex flex-col bg-white">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-16 px-4 py-16 md:py-32 lg:flex-row lg:justify-between">
        {/* Text Content */}
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-5xl font-extrabold leading-snug tracking-tighter sm:text-4xl md:text-5xl">
            Transform Your Menu into a{" "}
            <span className="text-primary-600 dark:text-primary-500">
              Beautiful Digital Experience
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-700 md:text-2xl font-light">
            Create dishes, categories, QR menus & share instantly with customers.
            Manage your restaurants offerings seamlessly.
          </p>

          <Link
            href="/auth"
            className="inline-block mt-10 px-10 py-4 text-xl font-bold transition-all duration-300 rounded-xl shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50"
          >
            Start Managing Your Menu
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Sign up takes less than 30 seconds.
          </p>
        </div>

        {/* Image Content */}
        <div className="mt-16 w-full max-w-lg lg:mt-0">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-transform duration-500 hover:scale-[1.02] border-8 border-gray-100/50">
            <Image
              src="/landing-menu.png"
              width={800}
              height={600}
              alt="Digital menu illustration on a phone screen"
              className="object-cover w-full h-auto"
              priority
            />
            {/* Added a subtle overlay for better aesthetic depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5 opacity-50 pointer-events-none" />
          </div>
        </div>
      </section>
      {/* Visual Separator */}
      <div className="w-full h-px bg-gray-100" />
    </main>
  );
}