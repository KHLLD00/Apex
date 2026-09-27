import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) redirect("/admin/login?error=unauthorized");

  return <main className="mx-auto max-w-6xl px-6 py-12"><h1 className="text-3xl font-semibold">Admin Dashboard</h1><p className="mt-2 opacity-70">Signed in as {user.email}</p><div className="mt-8 rounded-2xl border p-6"><p className="font-medium">Supabase authentication is connected.</p><p className="mt-2 text-sm opacity-70">Authorized admin access confirmed. Product, inventory, coupon and order management will be added in the following backend phases.</p></div></main>;
}
