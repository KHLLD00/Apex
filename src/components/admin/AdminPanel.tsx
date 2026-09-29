"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatNaira } from "@/lib/utils";
import ProductImages from "@/components/admin/ProductImages";
import SiteImages from "@/components/admin/SiteImages";

type Product = {
  id: string; name: string; brand: string; slug: string; sku: string;
  price: number; sale_price: number | null; stock_quantity: number;
  is_featured: boolean; is_bestseller: boolean; is_new: boolean; is_active: boolean;
  category_id: string | null;
};
type Category = { id: string; name: string };
type Coupon = {
  id: string; code: string; discount_type: "percentage" | "fixed"; discount_value: number;
  minimum_order_value: number; maximum_discount: number | null; usage_limit: number | null;
  usage_count: number; expires_at: string | null; is_active: boolean;
};
type Order = {
  id: string; order_number: string; created_at: string; customer_name: string;
  total: number; payment_status: string; order_status: string;
  order_items: { product_name: string; variant_name: string | null; quantity: number; total_price: number }[];
};

const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";
const button = "rounded-lg border px-3 py-2 text-sm disabled:opacity-50";

export default function AdminPanel() {
  const [tab, setTab] = useState<"overview"|"products"|"orders"|"coupons">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name:"", brand:"", slug:"", sku:"", price:"", sale_price:"", stock_quantity:"0",
    category_id:"", description:"", is_featured:false, is_bestseller:false, is_new:true
  });
  const [couponForm, setCouponForm] = useState({
    code:"", discount_type:"percentage", discount_value:"10", minimum_order_value:"0",
    maximum_discount:"", usage_limit:"", expires_at:""
  });

  async function loadProducts() {
    const [p,c] = await Promise.all([
      fetch("/api/admin/products"), fetch("/api/admin/categories")
    ]);
    const pd = await p.json(); const cd = await c.json();
    if (p.ok) setProducts(pd.products ?? []);
    if (c.ok) setCategories(cd.categories ?? []);
  }

  async function loadOrders() {
    const r = await fetch("/api/admin/orders"); const d = await r.json();
    if (r.ok) setOrders(d.orders ?? []);
  }

  async function loadCoupons() {
    const r = await fetch("/api/admin/coupons"); const d = await r.json();
    if (r.ok) setCoupons(d.coupons ?? []);
  }

  useEffect(() => {
    loadProducts(); loadOrders(); loadCoupons();
  }, []);

  async function createProduct(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    const r = await fetch("/api/admin/products", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(productForm)
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setMessage(d.error ?? "Unable to create product."); return; }
    setMessage("Product created.");
    setProductForm({name:"",brand:"",slug:"",sku:"",price:"",sale_price:"",stock_quantity:"0",category_id:"",description:"",is_featured:false,is_bestseller:false,is_new:true});
    loadProducts();
  }

  async function updateProduct(id: string, updates: Record<string, unknown>) {
    const r = await fetch("/api/admin/products", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id,...updates})
    });
    const d = await r.json();
    if (!r.ok) { setMessage(d.error ?? "Unable to update product."); return; }
    setProducts(current => current.map(p => p.id === id ? {...p,...d.product} : p));
    setMessage("Product updated.");
  }

  async function createCoupon(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    const r = await fetch("/api/admin/coupons", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(couponForm)
    });
    const d = await r.json(); setLoading(false);
    if (!r.ok) { setMessage(d.error ?? "Unable to create coupon."); return; }
    setMessage("Coupon created.");
    setCouponForm({code:"",discount_type:"percentage",discount_value:"10",minimum_order_value:"0",maximum_discount:"",usage_limit:"",expires_at:""});
    loadCoupons();
  }

  async function updateCoupon(id: string, updates: Record<string, unknown>) {
    const r = await fetch("/api/admin/coupons", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id,...updates})
    });
    const d = await r.json();
    if (!r.ok) { setMessage(d.error ?? "Unable to update coupon."); return; }
    setCoupons(current => current.map(c => c.id === id ? {...c,...d.coupon} : c));
    setMessage("Coupon updated.");
  }

  async function updateOrder(id: string, value: string) {
    const r = await fetch("/api/admin/orders/"+id, {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({order_status:value})
    });
    const d = await r.json();
    if (!r.ok) { setMessage(d.error ?? "Unable to update order."); return; }
    setOrders(current => current.map(o => o.id === id ? {...o,...d.order} : o));
    setMessage("Order updated.");
  }

  return (
    <div className="mt-8 space-y-6">
      <nav className="flex flex-wrap gap-2">
        {(["overview","products","orders","coupons"] as const).map(item => (
          <button key={item} className={`${button} ${tab===item ? "bg-black text-white" : ""}`} onClick={() => setTab(item)}>
            {item[0].toUpperCase()+item.slice(1)}
          </button>
        ))}
      </nav>

      {message && <p className="rounded-lg border px-4 py-3 text-sm">{message}</p>}

      {tab==="overview" && (
        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Orders" value={orders.length}/>
          <Metric label="Active products" value={products.filter(p=>p.is_active).length}/>
          <Metric label="Pending orders" value={orders.filter(o=>o.order_status==="pending").length}/>
          <Metric label="Paid order value" value={formatNaira(orders.filter(o=>o.payment_status==="paid").reduce((s,o)=>s+Number(o.total),0))}/>
          <div className="md:col-span-4 rounded-2xl border p-5">
            <h2 className="font-semibold">Low stock</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {products.filter(p=>p.is_active && p.stock_quantity<=3).slice(0,12).map(p =>
                <div key={p.id} className="flex justify-between rounded-lg border p-3 text-sm"><span>{p.name}</span><strong>{p.stock_quantity}</strong></div>
              )}
              {!products.some(p=>p.is_active && p.stock_quantity<=3) && <p className="text-sm opacity-60">No low-stock products.</p>}
            </div>
          </div>
        </section>
      )}

      {tab==="products" && (
        <section className="space-y-6">
          <SiteImages />
          <form onSubmit={createProduct} className="grid gap-4 rounded-2xl border p-5 md:grid-cols-2">
            <h2 className="md:col-span-2 font-semibold">Add product</h2>
            {[
              ["name","Name"],["brand","Brand"],["slug","Slug"],["sku","SKU"],["price","Price (₦)"],["sale_price","Sale price (₦)"],["stock_quantity","Stock"]
            ].map(([key,label]) => (
              <label key={key} className="text-sm">{label}<input className={input} required={!["sale_price"].includes(key)} value={(productForm as any)[key]} onChange={e=>setProductForm({...productForm,[key]:e.target.value})}/></label>
            ))}
            <label className="text-sm">Category<select className={input} value={productForm.category_id} onChange={e=>setProductForm({...productForm,category_id:e.target.value})}><option value="">Uncategorized</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="text-sm md:col-span-2">Description<textarea className={input} rows={3} value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}/></label>
            <div className="flex flex-wrap gap-4 text-sm md:col-span-2">
              {(["is_featured","is_bestseller","is_new"] as const).map(key=><label key={key}><input type="checkbox" checked={productForm[key]} onChange={e=>setProductForm({...productForm,[key]:e.target.checked})}/> {key.replace("is_","")}</label>)}
            </div>
            <button disabled={loading} className="rounded-lg bg-black px-4 py-2 text-sm text-white md:w-fit">{loading ? "Saving…" : "Create product"}</button>
          </form>

          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[850px] text-sm">
              <thead><tr className="border-b text-left"><th className="p-3">Product</th><th>Price</th><th>Stock</th><th>Flags</th><th>Active</th></tr></thead>
              <tbody>{products.map(p=><tr key={p.id} className="border-b last:border-0">
                <td className="p-3"><div className="font-medium">{p.name}</div><div className="text-xs opacity-60">{p.sku}</div><ProductImages productId={p.id}/></td>
                <td>{formatNaira(Number(p.sale_price ?? p.price))}</td>
                <td><input className="w-20 rounded border px-2 py-1" type="number" min="0" value={p.stock_quantity} onChange={e=>updateProduct(p.id,{stock_quantity:Number(e.target.value)})}/></td>
                <td className="space-x-2">
                  <button className={button} onClick={()=>updateProduct(p.id,{is_featured:!p.is_featured})}>{p.is_featured?"Featured":"Feature"}</button>
                  <button className={button} onClick={()=>updateProduct(p.id,{is_bestseller:!p.is_bestseller})}>{p.is_bestseller?"Best seller":"Best seller"}</button>
                </td>
                <td><button className={button} onClick={()=>updateProduct(p.id,{is_active:!p.is_active})}>{p.is_active?"Active":"Hidden"}</button></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {tab==="orders" && (
        <section className="space-y-3">
          {orders.map(o=><article key={o.id} className="rounded-2xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="font-semibold">{o.order_number}</h2><p className="text-sm opacity-60">{o.customer_name} · {new Date(o.created_at).toLocaleString()}</p></div>
              <strong>{formatNaira(Number(o.total))}</strong>
            </div>
            <div className="mt-3 text-sm">{o.order_items.map((item,i)=><div key={i}>{item.quantity} × {item.product_name}{item.variant_name ? ` — ${item.variant_name}` : ""}</div>)}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="text-xs">Order status<select className={input} value={o.order_status} onChange={e=>updateOrder(o.id,e.target.value)}><option>pending</option><option>processing</option><option>shipped</option><option>delivered</option><option>cancelled</option></select></label>
              <div className="text-xs"><span className="block opacity-60">Payment</span><span className="mt-1 block rounded-lg border px-3 py-2">{o.payment_status}</span></div>
            </div>
          </article>)}
          {!orders.length && <p className="rounded-2xl border p-6 text-sm opacity-60">No orders yet.</p>}
        </section>
      )}

      {tab==="coupons" && (
        <section className="space-y-6">
          <form onSubmit={createCoupon} className="grid gap-4 rounded-2xl border p-5 md:grid-cols-3">
            <h2 className="md:col-span-3 font-semibold">Create coupon</h2>
            <label className="text-sm">Code<input className={input} required value={couponForm.code} onChange={e=>setCouponForm({...couponForm,code:e.target.value})}/></label>
            <label className="text-sm">Type<select className={input} value={couponForm.discount_type} onChange={e=>setCouponForm({...couponForm,discount_type:e.target.value})}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></label>
            <label className="text-sm">Discount value<input className={input} type="number" min="0" required value={couponForm.discount_value} onChange={e=>setCouponForm({...couponForm,discount_value:e.target.value})}/></label>
            <label className="text-sm">Minimum order<input className={input} type="number" min="0" value={couponForm.minimum_order_value} onChange={e=>setCouponForm({...couponForm,minimum_order_value:e.target.value})}/></label>
            <label className="text-sm">Maximum discount<input className={input} type="number" min="0" value={couponForm.maximum_discount} onChange={e=>setCouponForm({...couponForm,maximum_discount:e.target.value})}/></label>
            <label className="text-sm">Usage limit<input className={input} type="number" min="1" value={couponForm.usage_limit} onChange={e=>setCouponForm({...couponForm,usage_limit:e.target.value})}/></label>
            <label className="text-sm">Expires<input className={input} type="datetime-local" value={couponForm.expires_at} onChange={e=>setCouponForm({...couponForm,expires_at:e.target.value})}/></label>
            <button disabled={loading} className="rounded-lg bg-black px-4 py-2 text-sm text-white md:w-fit">{loading?"Saving…":"Create coupon"}</button>
          </form>
          <div className="grid gap-3 md:grid-cols-2">
            {coupons.map(c=><article key={c.id} className="rounded-2xl border p-5">
              <div className="flex justify-between"><strong>{c.code}</strong><button className={button} onClick={()=>updateCoupon(c.id,{is_active:!c.is_active})}>{c.is_active?"Active":"Disabled"}</button></div>
              <p className="mt-2 text-sm">{c.discount_type==="percentage"?`${c.discount_value}% off`:formatNaira(Number(c.discount_value))+" off"} · minimum {formatNaira(Number(c.minimum_order_value))}</p>
              <p className="mt-1 text-xs opacity-60">Used {c.usage_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</p>
            </article>)}
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({label,value}:{label:string;value:string|number}) {
  return <div className="rounded-2xl border p-5"><p className="text-sm opacity-60">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
