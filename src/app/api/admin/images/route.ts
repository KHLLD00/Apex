import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = new Set(["image/jpeg","image/png","image/webp","image/avif"]);

export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId) return NextResponse.json({ error: "Product ID is required." }, { status: 400 });

    const { data, error } = await supabase
      .from("product_images")
      .select("id,product_id,image_url,alt_text,sort_order,created_at")
      .eq("product_id", productId)
      .order("sort_order")
      .order("created_at");

    if (error) throw error;
    return NextResponse.json({ images: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load images." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const form = await request.formData();
    const productId = String(form.get("productId") ?? "");
    const altText = String(form.get("altText") ?? "").trim();
    const file = form.get("file");

    if (!productId || !(file instanceof File)) {
      return NextResponse.json({ error: "Product and image file are required." }, { status: 400 });
    }
    if (!TYPES.has(file.type)) {
      return NextResponse.json({ error: "Use JPG, PNG, WebP or AVIF images." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabase
      .from("products").select("id,slug").eq("id", productId).single();
    if (productError || !product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${product.slug}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const { count } = await supabase.from("product_images").select("id", { count: "exact", head: true }).eq("product_id", productId);

    const { data: image, error: imageError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: publicUrl.publicUrl,
        alt_text: altText || product.slug.replace(/-/g, " "),
        sort_order: count ?? 0,
      })
      .select("id,product_id,image_url,alt_text,sort_order,created_at")
      .single();

    if (imageError) {
      await supabase.storage.from(BUCKET).remove([path]);
      throw imageError;
    }

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const id = String(body.id ?? "");
    const imageUrl = String(body.image_url ?? "");

    if (!id || !imageUrl) return NextResponse.json({ error: "Image ID and URL are required." }, { status: 400 });

    const marker = `/${BUCKET}/`;
    const markerIndex = imageUrl.indexOf(marker);
    const storagePath = markerIndex >= 0 ? decodeURIComponent(imageUrl.slice(markerIndex + marker.length).split("?")[0]) : "";

    const { error: dbError } = await supabase.from("product_images").delete().eq("id", id);
    if (dbError) throw dbError;

    if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
