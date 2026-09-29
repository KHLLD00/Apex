import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const [{ data: settings }, { data: categories }] = await Promise.all([
      supabase.from("site_settings").select("hero_image_url").eq("id", true).maybeSingle(),
      supabase.from("categories").select("id,name,slug,image_url").order("name"),
    ]);
    return NextResponse.json({ heroImageUrl: settings?.hero_image_url ?? null, categories: categories ?? [] });
  } catch {
    return NextResponse.json({ error: "Unable to load website images." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const form = await request.formData();
    const type = String(form.get("type") ?? "");
    const categoryId = String(form.get("categoryId") ?? "");
    const file = form.get("file");

    if (!(file instanceof File) || !TYPES.has(file.type)) return NextResponse.json({ error: "Use JPG, PNG, WebP or AVIF." }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    if (type !== "hero" && type !== "category") return NextResponse.json({ error: "Invalid image type." }, { status: 400 });

    let folder = "site/hero";
    if (type === "category") {
      const { data: category } = await supabase.from("categories").select("id,slug").eq("id", categoryId).single();
      if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
      folder = `site/categories/${category.slug}`;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const url = publicUrl.publicUrl;

    if (type === "hero") {
      const { error } = await supabase.from("site_settings").upsert({ id: true, hero_image_url: url });
      if (error) throw error;
    } else {
      const { error } = await supabase.from("categories").update({ image_url: url }).eq("id", categoryId);
      if (error) throw error;
    }

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload image." }, { status: 400 });
  }
}
