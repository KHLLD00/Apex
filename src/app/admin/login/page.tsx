"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.replace("/admin"); router.refresh();
  }

  return <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
    <form onSubmit={submit} className="w-full space-y-5 rounded-2xl border p-6 shadow-sm">
      <div><p className="text-sm font-medium">Apex Gadgets</p><h1 className="mt-1 text-2xl font-semibold">Admin sign in</h1><p className="mt-2 text-sm opacity-70">Authorized staff only.</p></div>
      <label className="block text-sm">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
      <label className="block text-sm">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  </main>;
}
