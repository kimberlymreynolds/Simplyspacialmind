import { useState } from "react";
import { Link } from "wouter";
import { isToday } from "date-fns";
import { ArrowRight, Wind, Hand, Footprints } from "lucide-react";
import { actions, isEmptyEntry, useStore, type EntryInput } from "@/lib/store";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CheckinForm } from "@/components/checkin-form";
import { EntryCard } from "@/components/entry-card";
import { Blob } from "@/components/logo";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up. That's okay.";
  if (h < 12) return "Morning. No rush.";
  if (h < 18) return "Afternoon. Take your time.";
  return "Evening. You made it here.";
}

export default function Home() {
  usePageMeta("Today", "Your daily space. An optional mood and energy check-in, with nothing you have to do.");
  const { entries } = useStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const today = entries.filter((e) => isToday(new Date(e.createdAt)));

  const save = (v: EntryInput) => {
    if (isEmptyEntry(v)) {
      setError("Nothing to save yet — that's fine. Pick anything, or just close this.");
      return;
    }
    try {
      actions.addEntry(v);
      setError(null);
      setSaved(true);
      setOpen(false);
      setFormKey((k) => k + 1);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <section className="relative mb-12">
        <Blob className="drift pointer-events-none absolute -right-10 -top-16 h-56 w-56 opacity-70 md:h-72 md:w-72" />
        <Blob tone="secondary" className="drift pointer-events-none absolute right-24 top-20 h-28 w-28 opacity-80 [animation-delay:-3s]" />
        <div className="relative rise">
          <p className="font-data text-xs uppercase tracking-[0.2em] text-primary">
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-5xl leading-[1.02] md:text-7xl">{greeting()}</h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
            This is your space. Check in if you'd like to, use a tool if something feels loud, or just look around. None of it is required.
          </p>
        </div>
      </section>

      <section aria-labelledby="checkin-h" className="rise mb-12 rounded-[2rem] border bg-card/70 p-6 shadow-sm backdrop-blur md:p-8 [animation-delay:120ms]">
        {!open ? (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="checkin-h" className="font-display text-2xl md:text-3xl">
                {saved ? "Noted. Thank you for checking in." : today.length ? "Want to add another moment?" : "Want to note how today feels?"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Every part is optional. One tap is a complete check-in.</p>
            </div>
            <button
              data-testid="button-open-checkin"
              onClick={() => { setOpen(true); setSaved(false); }}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
            >
              Check in <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <div>
            <h2 id="checkin-h" className="font-display mb-6 text-2xl md:text-3xl">A small check-in</h2>
            <CheckinForm key={formKey} submitLabel="Keep this" onSubmit={save} onCancel={() => { setOpen(false); setError(null); }} error={error} />
          </div>
        )}
      </section>

      <section aria-labelledby="tools-h" className="mb-12">
        <h2 id="tools-h" className="font-display mb-4 text-2xl">If something feels loud</h2>
        <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr]">
          {[
            { href: "/tools#grounding", icon: Hand, title: "Come back to the room", sub: "5-4-3-2-1 grounding", cls: "bg-accent text-accent-foreground sm:row-span-2 sm:min-h-[200px]" },
            { href: "/tools#breathing", icon: Wind, title: "Slow breathing", sub: "follow a soft shape", cls: "bg-secondary text-secondary-foreground" },
            { href: "/tools#task", icon: Footprints, title: "One tiny step", sub: "five gentle minutes", cls: "bg-[hsl(var(--mood-steady)/.35)]" },
          ].map(({ href, icon: Icon, title, sub, cls }) => (
            <Link key={href} href={href} data-testid={`link-tool-${sub.split(" ")[0]}`} className={`group flex flex-col justify-between gap-6 rounded-3xl p-5 transition-transform hover:-translate-y-1 ${cls}`}>
              <Icon className="h-6 w-6" aria-hidden />
              <span>
                <span className="font-display block text-xl">{title}</span>
                <span className="text-sm opacity-75">{sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="today-h">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="today-h" className="font-display text-2xl">Today so far</h2>
          {entries.length > 0 && (
            <Link href="/journal" data-testid="link-journal" className="text-sm text-primary underline-offset-4 hover:underline">
              Open journal
            </Link>
          )}
        </div>
        {today.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-card/40 p-8 text-center">
            <p className="font-display text-xl">A blank page, and that's allowed.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Nothing logged today. There's no streak to keep and nothing to catch up on.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {today.map((e) => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
