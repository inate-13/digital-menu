import { redirect } from "next/navigation";
import { getCurrentUser } from "../../server/auth/getCurrentUser";
import { prisma } from "../../server/prisma-client";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  if (!user.fullName || !user.country) {
    redirect("/auth/onboarding");
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Link href="/restaurants/new" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Create Restaurant
          </Link>
        </div>
      </div>

      <section>
        {restaurants.length === 0 ? (
          <div className="rounded-md border p-6 text-center">
            <p className="text-gray-600">You don’t have any restaurants yet.</p>
            <Link href="/restaurants/new" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
              Create your first restaurant
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <div key={r.id} className="border rounded-md p-4">
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-600">{r.location}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/restaurants/${r.id}`} className="text-sm px-3 py-1 border rounded-md">
                    Manage
                  </Link>
                  <Link href={`/menu/${r.id}`} className="text-sm px-3 py-1 bg-green-600 text-white rounded-md">
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
