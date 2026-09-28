import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const [orders, products, lowStock, revenue] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("products").select("id,name,stock_quantity").eq("is_active", true).lte("stock_quantity", 3).order("stock_quantity"),
      supabase.from("orders").select("total").eq("payment_status", "paid"),
    ]);

    if (orders.error || products.error || lowStock.error || revenue.error) {
      throw orders.error ?? products.error ?? lowStock.error ?? revenue.error;
    }

    const totalRevenue = (revenue.data ?? []).reduce((sum, row) => sum + Number(row.total), 0);

    return NextResponse.json({
      metrics: {
        totalOrders: orders.count ?? 0,
        activeProducts: products.count ?? 0,
        pendingOrders: 0,
        revenue: totalRevenue,
      },
      lowStock: lowStock.data ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load dashboard." }, { status: 401 });
  }
}
