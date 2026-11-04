import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const TOTAL = 5 * 60;

export function TaskStarter() {
  const [task, setTask] = useState("");
  const [step, setStep] = useState("");
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const endAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const r = Math.max(0, Math.round((endAt.current! - Date.now()) / 1000));
      setLeft(r);
      if (r === 0) setRunning(false);
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");
  const finished = left === 0;
  const pct = 1 - left / TOTAL;

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5">
        <div>
          <label htmlFor="task" className="mb-2 block text-sm font-medium">The thing that feels big</label>
          <input id="task" data-testid="input-task" value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. Reply to that email" className="w-full rounded-2xl border border-input bg-card px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div>
          <label htmlFor="step" className="mb-2 block text-sm font-medium">The smallest next action</label>
          <input id="step" data-testid="input-step" value={step} onChange={(e) => setStep(e.target.value)} placeholder="e.g. Open the email. That's it." className="w-full rounded-2xl border border-input bg-card px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <p className="mt-2 text-xs text-muted-foreground">Smaller than feels reasonable. If it still feels heavy, make it smaller again.</p>
        </div>
        {(task || step) && (
          <div className="rise rounded-2xl border-l-4 border-primary bg-card p-4">
            {task && <p className="text-sm text-muted-foreground">Toward: {task}</p>}
            {step && <p className="font-display mt-1 text-xl">Just: {step}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center rounded-3xl bg-muted/60 p-6 text-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - pct)} />
          </svg>
          <p className="font-data absolute inset-0 flex items-center justify-center text-3xl" role="timer" aria-live="off" data-testid="text-timer">
            {mm}:{ss}
          </p>
        </div>
        <p className="mt-3 min-h-[2.5rem] text-sm text-muted-foreground" aria-live="polite">
          {finished ? "Five minutes. You can stop here, or keep going if it feels okay." : running ? "Only this. Nothing else is due right now." : "A gentle five minutes. Stopping early still counts."}
        </p>
        <div className="mt-3 flex gap-2">
          <button data-testid="button-timer-toggle" disabled={finished} onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40">
            {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            {running ? "Pause" : left < TOTAL ? "Resume" : "Start 5 minutes"}
          </button>
          <button data-testid="button-timer-reset" onClick={() => { setRunning(false); setLeft(TOTAL); }} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm">
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
