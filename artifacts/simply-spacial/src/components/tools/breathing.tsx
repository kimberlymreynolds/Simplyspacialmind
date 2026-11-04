import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { actions, useStore } from "@/lib/store";

export function Breathing() {
  const { settings } = useStore();
  const pattern = settings.breathingPace === "gentle" ? { in: 4, out: 6 } : { in: 4, out: 4 };
  const cycle = pattern.in + pattern.out;
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      last.current = null;
      return;
    }
    const id = window.setInterval(() => {
      const now = performance.now();
      if (last.current != null) setElapsed((e) => e + (now - last.current!) / 1000);
      last.current = now;
    }, 100);
    return () => window.clearInterval(id);
  }, [running]);

  const t = elapsed % cycle;
  const inhaling = t < pattern.in;
  const phaseLeft = Math.ceil(inhaling ? pattern.in - t : cycle - t);
  const progress = inhaling ? t / pattern.in : 1 - (t - pattern.in) / pattern.out;
  const scale = 0.55 + 0.45 * (elapsed === 0 ? 0 : progress);
  const rounds = Math.floor(elapsed / cycle);

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
      <div className="relative mx-auto flex aspect-square w-56 items-center justify-center sm:w-64">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
        <div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,hsl(var(--accent)),hsl(var(--secondary)))]"
          style={{ transform: `scale(${scale})`, transition: "transform 100ms linear" }}
        />
        <div className="relative text-center" aria-live="polite">
          <p className="font-display text-3xl">{elapsed === 0 ? "Ready" : !running ? "Paused" : inhaling ? "Breathe in" : "Breathe out"}</p>
          {elapsed > 0 && <p className="font-data mt-1 text-sm text-foreground/70" aria-hidden>{phaseLeft}</p>}
        </div>
      </div>
      <div>
        <p className="text-[17px] leading-relaxed">
          In through your nose for <span className="font-data">{pattern.in}</span>, out slowly for <span className="font-data">{pattern.out}</span>. No holding, no counting required — just follow the shape.
        </p>
        <div className="mt-4 flex gap-1 rounded-full bg-muted p-1 text-sm" role="radiogroup" aria-label="Pace">
          {(["gentle", "even"] as const).map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={settings.breathingPace === p}
              data-testid={`button-pace-${p}`}
              onClick={() => {
                try {
                  actions.updateSettings({ breathingPace: p });
                } catch {
                  /* settings fail silently here; surfaced on settings page */
                }
                setElapsed(0);
              }}
              className={`flex-1 rounded-full px-3 py-1.5 ${settings.breathingPace === p ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              {p === "gentle" ? "Longer out (4 · 6)" : "Even (4 · 4)"}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button data-testid="button-breath-toggle" onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
          </button>
          <button data-testid="button-breath-reset" onClick={() => { setRunning(false); setElapsed(0); }} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm">
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
        {rounds > 0 && <p className="mt-3 font-data text-xs text-muted-foreground">{rounds} {rounds === 1 ? "breath" : "breaths"} this session</p>}
        <p className="mt-5 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-sm text-secondary-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          If you feel dizzy, lightheaded or uncomfortable, stop and breathe normally. Nothing here needs to be done right.
        </p>
      </div>
    </div>
  );
}
