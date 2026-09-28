import { createClient } from "./server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

export async function isAdminUser() {
  const user = await getCurrentUser();
  return Boolean(user?.app_metadata?.role === "admin");
}
