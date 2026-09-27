import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
      <span className="font-display text-6xl font-bold text-navy-900/10">404</span>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Page not found</h1>
      <p className="max-w-sm text-navy-900/60">The page you're looking for doesn't exist or may have moved.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-electric-500 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-150 hover:bg-electric-600 active:scale-[0.98]"
      >
        Back to Home
      </Link>
    </div>
  );
}
