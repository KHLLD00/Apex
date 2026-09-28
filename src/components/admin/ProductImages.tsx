"use client";

import { useEffect, useState } from "react";

type ImageRow = { id:string; image_url:string; alt_text:string; sort_order:number };

export default function ProductImages({productId}:{productId:string}) {
  const [images,setImages]=useState<ImageRow[]>([]);
  const [file,setFile]=useState<File|null>(null);
  const [altText,setAltText]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);

  async function load() {
    const r=await fetch(`/api/admin/images?productId=${productId}`);
    const d=await r.json();
    if(r.ok) setImages(d.images??[]);
  }

  useEffect(()=>{load()},[productId]);

  async function upload() {
    if(!file) return;
    setLoading(true); setMessage("");
    const form=new FormData();
    form.append("productId",productId);
    form.append("file",file);
    form.append("altText",altText);
    const r=await fetch("/api/admin/images",{method:"POST",body:form});
    const d=await r.json();
    setLoading(false);
    if(!r.ok){setMessage(d.error??"Upload failed.");return;}
    setMessage("Image uploaded.");
    setFile(null); setAltText("");
    const input=document.getElementById(`image-${productId}`) as HTMLInputElement|null;
    if(input) input.value="";
    load();
  }

  async function remove(image:ImageRow) {
    if(!window.confirm("Delete this product image?")) return;
    const r=await fetch("/api/admin/images",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:image.id,image_url:image.image_url})});
    const d=await r.json();
    if(!r.ok){setMessage(d.error??"Delete failed.");return;}
    setImages(current=>current.filter(item=>item.id!==image.id));
    setMessage("Image deleted.");
  }

  return <div className="mt-3 rounded-xl border p-3">
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
      <input id={`image-${productId}`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>setFile(e.target.files?.[0]??null)} className="text-xs"/>
      <input value={altText} onChange={e=>setAltText(e.target.value)} placeholder="Alt text" className="rounded-lg border px-3 py-2 text-xs"/>
      <button type="button" disabled={!file||loading} onClick={upload} className="rounded-lg bg-black px-3 py-2 text-xs text-white disabled:opacity-50">{loading?"Uploading…":"Upload"}</button>
    </div>
    {message && <p className="mt-2 text-xs opacity-70">{message}</p>}
    <div className="mt-3 flex flex-wrap gap-2">
      {images.map(image=><div key={image.id} className="relative w-24">
        <img src={image.image_url} alt={image.alt_text} className="h-20 w-24 rounded-lg border object-cover"/>
        <button type="button" onClick={()=>remove(image)} className="mt-1 w-full rounded border px-2 py-1 text-[11px]">Delete</button>
      </div>)}
      {!images.length && <p className="text-xs opacity-50">No images yet.</p>}
    </div>
  </div>;
}
