"use client";

import { useEffect, useState } from "react";

type Category = { id:string; name:string; slug:string; image_url:string|null };

export default function SiteImages() {
  const [hero,setHero]=useState<string|null>(null);
  const [categories,setCategories]=useState<Category[]>([]);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState("");

  async function load() {
    const r=await fetch("/api/admin/site-images");
    const d=await r.json();
    if(r.ok){setHero(d.heroImageUrl??null);setCategories(d.categories??[]);}
  }
  useEffect(()=>{load()},[]);

  async function upload(type:"hero"|"category",file:File,categoryId?:string){
    setLoading(type+(categoryId??""));setMessage("");
    const form=new FormData();form.append("type",type);form.append("file",file);
    if(categoryId)form.append("categoryId",categoryId);
    const r=await fetch("/api/admin/site-images",{method:"POST",body:form});
    const d=await r.json();setLoading("");
    if(!r.ok){setMessage(d.error??"Upload failed.");return;}
    setMessage("Image updated.");await load();
  }

  return <section className="rounded-2xl border p-5">
    <h2 className="font-semibold">Website Images</h2>
    <p className="mt-1 text-sm opacity-60">Change the homepage hero and category artwork without editing code.</p>
    <div className="mt-5 rounded-xl border p-4">
      <h3 className="font-medium">Homepage Hero</h3>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {hero&&<img src={hero} alt="Current hero" className="h-24 w-40 rounded-lg object-cover"/>}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={loading==="hero"} onChange={e=>e.target.files?.[0]&&upload("hero",e.target.files[0])}/>
      </div>
    </div>
    <div className="mt-5">
      <h3 className="font-medium">Category Images</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(c=><div key={c.id} className="rounded-xl border p-3">
          <div className="flex items-center gap-3">{c.image_url&&<img src={c.image_url} alt="" className="h-14 w-14 rounded-lg object-cover"/>}<div><p className="font-medium">{c.name}</p><p className="text-xs opacity-50">{c.slug}</p></div></div>
          <input className="mt-3 w-full text-xs" type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={loading==="category"+c.id} onChange={e=>e.target.files?.[0]&&upload("category",e.target.files[0],c.id)}/>
        </div>)}
      </div>
    </div>
    {message&&<p className="mt-4 text-sm opacity-70">{message}</p>}
  </section>;
}
