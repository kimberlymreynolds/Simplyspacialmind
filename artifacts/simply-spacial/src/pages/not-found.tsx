import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function NotFound() {
  usePageMeta("Not found", "This page doesn't exist in Simply Spacial.");
  return (
    <div className="py-16 text-center">
      <p className="font-data text-xs uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="font-display mt-3 text-5xl">This room is empty.</h1>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">The page you looked for isn't here. Nothing is lost.</p>
      <Link href="/" data-testid="link-back-home" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Back to today</Link>
    </div>
  );
}
