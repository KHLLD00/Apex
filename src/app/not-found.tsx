import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
      <span className="font-display text-6xl font-bold text-navy-900/10">404</span>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Page not found</h1>
      <p className="max-w-sm text-navy-900/60">The page you're looking for doesn't exist or may have moved.</p>
      <Button asChild><Link href="/">Back to Home</Link></Button>
    </div>
  );
}
