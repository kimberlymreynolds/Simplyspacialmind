import { useEffect, type ReactNode } from "react";
import { Hand, Wind, Footprints } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PageHeader } from "@/components/page-header";
import { Grounding } from "@/components/tools/grounding";
import { Breathing } from "@/components/tools/breathing";
import { TaskStarter } from "@/components/tools/task-starter";

function ToolSection({ id, icon, title, sub, tint, children }: { id: string; icon: ReactNode; title: string; sub: string; tint: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-8 overflow-hidden rounded-[2rem] border bg-card/75 shadow-sm">
      <div className={`flex items-center gap-3 px-6 py-4 md:px-8 ${tint}`}>
        {icon}
        <div>
          <h2 id={`${id}-h`} className="font-display text-2xl">{title}</h2>
          <p className="text-sm opacity-75">{sub}</p>
        </div>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

export default function Tools() {
  usePageMeta("Tools", "Guided 5-4-3-2-1 grounding, paced breathing and a tiny-step task starter. Use any, in any order.");

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Tools" title={<>Small things that<br />help a little.</>}>
        Pick one, skip around, stop whenever. These are practical supports, not treatment.
      </PageHeader>
      <nav aria-label="Jump to tool" className="mb-8 flex flex-wrap gap-2">
        {[["grounding", "Grounding"], ["breathing", "Breathing"], ["task", "Tiny step"]].map(([id, l]) => (
          <a key={id} href={`#${id}`} data-testid={`link-jump-${id}`} className="rounded-full border bg-card px-4 py-1.5 text-sm hover:bg-muted">{l}</a>
        ))}
      </nav>
      <div className="space-y-8">
        <ToolSection id="grounding" icon={<Hand className="h-6 w-6" aria-hidden />} title="5-4-3-2-1 grounding" sub="Use your senses to land back here" tint="bg-accent text-accent-foreground">
          <Grounding />
        </ToolSection>
        <ToolSection id="breathing" icon={<Wind className="h-6 w-6" aria-hidden />} title="Paced breathing" sub="Comfortable, unhurried, yours to stop" tint="bg-secondary text-secondary-foreground">
          <Breathing />
        </ToolSection>
        <ToolSection id="task" icon={<Footprints className="h-6 w-6" aria-hidden />} title="Tiny-step starter" sub="For when starting is the hard part" tint="bg-[hsl(var(--mood-steady)/.35)]">
          <TaskStarter />
        </ToolSection>
      </div>
    </div>
  );
}
