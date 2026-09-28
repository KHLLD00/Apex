import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return { user, supabase: createAdminClient() };
}
