import { redirect } from "next/navigation";
import { getCurrentUser, isAdminUser } from "@/lib/supabase/auth";
import AdminSignOut from "@/components/admin/AdminSignOut";
import AdminPanel from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!(await isAdminUser())) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium">Apex Gadgets</p>
          <h1 className="mt-1 text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-sm opacity-70">Signed in as {user.email}</p>
        </div>
        <AdminSignOut />
      </div>
      <AdminPanel />
    </main>
  );
}
