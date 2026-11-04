import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="rise mb-10">
      <p className="font-data text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      {children && <div className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">{children}</div>}
    </header>
  );
}
