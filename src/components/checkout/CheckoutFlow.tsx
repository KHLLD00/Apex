"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatNaira, NIGERIAN_STATES } from "@/lib/utils";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import Link from "next/link";

type PaymentState = "idle" | "processing" | "success" | "failed";

export function CheckoutFlow() {
  const router = useRouter();
  const { items, appliedCoupon, clearCart } = useCart();
  const [fullName,setFullName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const [state,setState]=useState(""); const [lga,setLga]=useState(""); const [address,setAddress]=useState("");
  const [instructions,setInstructions]=useState(""); const [deliveryMethod,setDeliveryMethod]=useState<"standard"|"express">("standard");
  const [errors,setErrors]=useState<Record<string,string>>({}); const [paymentState,setPaymentState]=useState<PaymentState>("idle");
  const [serverOrder,setServerOrder]=useState<{orderNumber:string;total:number}|null>(null);
  const [errorMessage,setErrorMessage]=useState("");

  if (items.length===0 && paymentState==="idle") return <EmptyState title="Your cart is empty" description="Add a few products before heading to checkout." action={<Button asChild><Link href="/shop">Continue shopping</Link></Button>} />;

  const validate=()=>{const e:Record<string,string>={}; if(!fullName.trim())e.fullName="Enter your full name."; if(!/^\S+@\S+\.\S+$/.test(email))e.email="Enter a valid email address."; if(!/^[0-9+\s]{7,15}$/.test(phone))e.phone="Enter a valid phone number."; if(!state)e.state="Select your state."; if(!lga.trim())e.lga="Enter your LGA."; if(!address.trim())e.address="Enter your delivery address."; setErrors(e); return !Object.keys(e).length;};

  const handlePay=async()=>{if(!validate())return; setPaymentState("processing"); setErrorMessage("");
    try{
      const res=await fetch("/api/orders/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        customer:{fullName,email,phone},delivery:{state,lga,address,instructions,method:deliveryMethod},
        items,couponCode:appliedCoupon?.code ?? null
      })});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Unable to create order.");
      setServerOrder(data.order);
      const payment=await fetch("/api/payment/simulate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:data.order.id,success:true})});
      const paymentData=await payment.json();
      if(!payment.ok) throw new Error(paymentData.error||"Payment could not be completed.");
      setPaymentState("success"); clearCart();
      setTimeout(()=>router.push(`/order-confirmation?order=${data.order.orderNumber}`),500);
    }catch(error){setErrorMessage(error instanceof Error?error.message:"Unable to complete checkout."); setPaymentState("failed");}
  };

  if(paymentState==="processing")return <div className="flex flex-col items-center justify-center gap-4 py-24 text-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-navy-900/15 border-t-electric-500"/><p className="text-navy-900/70">Creating your order and processing payment…</p></div>;
  if(paymentState==="failed")return <div className="flex flex-col items-center justify-center gap-4 rounded-xl2 border border-red-200 bg-red-50 py-16 text-center"><h2 className="font-display text-xl font-semibold text-red-700">Checkout failed</h2><p className="max-w-md text-sm text-red-600/80">{errorMessage||"Your order could not be completed."}</p><Button onClick={()=>setPaymentState("idle")}>Try Again</Button></div>;
  if(paymentState==="success")return <div className="flex flex-col items-center justify-center gap-3 py-24 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</div><h2 className="font-display text-xl font-semibold text-navy-900">Payment successful</h2><p className="text-sm text-navy-900/60">Order {serverOrder?.orderNumber} confirmed. Redirecting…</p></div>;

  return <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
    <div className="flex flex-col gap-10">
      <section><h2 className="font-display text-lg font-semibold text-navy-900">Customer Information</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} error={errors.fullName} className="sm:col-span-2"/>
        <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} error={errors.email}/>
        <Input label="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} error={errors.phone}/>
      </div></section>
      <section><h2 className="font-display text-lg font-semibold text-navy-900">Delivery Information</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Select label="State" placeholder="Select state" value={state} onChange={e=>setState(e.target.value)} error={errors.state} options={NIGERIAN_STATES.map(s=>({label:s,value:s}))}/>
        <Input label="LGA" value={lga} onChange={e=>setLga(e.target.value)} error={errors.lga}/>
        <Input label="Full address" value={address} onChange={e=>setAddress(e.target.value)} error={errors.address} className="sm:col-span-2"/>
        <Input label="Delivery instructions (optional)" value={instructions} onChange={e=>setInstructions(e.target.value)} className="sm:col-span-2"/>
      </div></section>
      <section><h2 className="font-display text-lg font-semibold text-navy-900">Delivery Method</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {[{id:"standard",label:"Standard Delivery",desc:"2–5 business days",price:"Calculated at checkout"},{id:"express",label:"Express Delivery",desc:"24–48 hours (major cities)",price:formatNaira(6500)}].map(o=><button type="button" key={o.id} onClick={()=>setDeliveryMethod(o.id as "standard"|"express")} className={`flex-1 rounded-xl2 border p-4 text-left transition-colors ${deliveryMethod===o.id?"border-electric-500 bg-electric-500/5":"border-navy-900/15 hover:border-navy-900/30"}`}><span className="block text-sm font-medium text-navy-900">{o.label}</span><span className="block text-xs text-navy-900/50">{o.desc}</span><span className="mt-1.5 block text-sm font-semibold text-navy-900">{o.price}</span></button>)}
      </div></section>
      <section><h2 className="font-display text-lg font-semibold text-navy-900">Payment</h2><div className="mt-4 rounded-xl2 border border-navy-900/15 p-4"><p className="text-sm text-navy-900/60">This is a simulated payment for demonstration purposes only. No real card details are collected or processed.</p></div></section>
    </div>
    <aside className="h-fit rounded-xl2 border border-navy-900/10 p-5"><h2 className="font-display text-base font-semibold text-navy-900">Order Summary</h2>
      <p className="mt-4 text-sm text-navy-900/60">{items.length} item{items.length===1?"":"s"} in your cart. Final prices, stock, discounts and delivery are verified securely when you place the order.</p>
      {appliedCoupon&&<p className="mt-3 text-sm text-emerald-700">Coupon: {appliedCoupon.code}</p>}
      <Button size="lg" className="mt-5 w-full" onClick={handlePay}>Place Order & Pay</Button>
    </aside>
  </div>;
}
