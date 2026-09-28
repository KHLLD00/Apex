import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,description,is_active")
      .order("name");
    if (error) throw error;
    return NextResponse.json({ categories: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load categories." }, { status: 401 });
  }
}
