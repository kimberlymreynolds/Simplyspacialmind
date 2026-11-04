import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Sun, BookOpen, Compass, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/lib/store";
import { SupportDialog } from "./support-dialog";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "Today", icon: Sun },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/tools", label: "Tools", icon: Compass },
  { href: "/settings", label: "Settings", icon: SlidersHorizontal },
];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { settings, loadError } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("quiet", settings.quietMode);
  }, [settings.quietMode]);

  return (
    <div className="min-h-[100dvh] md:grid md:grid-cols-[240px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <aside className="hidden md:flex md:sticky md:top-0 md:h-[100dvh] flex-col gap-8 border-r border-sidebar-border/70 bg-sidebar/60 px-5 py-7 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5" data-testid="link-home-logo">
          <Logo />
          <span className="font-display text-xl">Simply Spacial</span>
        </Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = loc === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                data-testid={`link-nav-${label.toLowerCase()}`}
                className={`group flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:-rotate-6" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <SupportDialog />
          <p className="text-xs leading-relaxed text-muted-foreground">
            A wellness space, not diagnosis, treatment or a crisis service.
          </p>
        </div>
      </aside>

      <div className="flex min-h-[100dvh] flex-col pb-24 md:pb-0">
        <header className="flex items-center justify-between px-5 pt-5 md:hidden">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo-mobile">
            <Logo />
            <span className="font-display text-lg">Simply Spacial</span>
          </Link>
          <SupportDialog compact />
        </header>
        {loadError && (
          <div role="alert" className="mx-5 mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm md:mx-10">
            {loadError} Your earlier entries may be unavailable.
          </div>
        )}
        <main id="main" className="flex-1 px-5 py-8 md:px-10 md:py-12">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>

      <nav aria-label="Main" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-full border bg-card/90 p-1.5 shadow-lg backdrop-blur md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = loc === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              data-testid={`link-mobile-nav-${label.toLowerCase()}`}
              className={`flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-medium ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
