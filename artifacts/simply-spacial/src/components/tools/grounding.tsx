import { useState } from "react";
import { RotateCcw, SkipForward, ArrowRight } from "lucide-react";

const STEPS = [
  { n: 5, sense: "see", prompt: "Name five things you can see. Colours, edges, light on a surface — anything counts." },
  { n: 4, sense: "feel", prompt: "Notice four things you can feel. Your feet, the chair, fabric, air temperature." },
  { n: 3, sense: "hear", prompt: "Listen for three sounds. Near or far, loud or barely there." },
  { n: 2, sense: "smell", prompt: "Find two things you can smell — or two smells you like, if nothing is around." },
  { n: 1, sense: "taste", prompt: "Notice one thing you can taste, or simply take a sip of water." },
];

export function Grounding() {
  const [step, setStep] = useState(0);
  const [ticks, setTicks] = useState(0);
  const done = step >= STEPS.length;
  const cur = STEPS[step];
  const next = () => {
    setStep((s) => s + 1);
    setTicks(0);
  };
  const reset = () => {
    setStep(0);
    setTicks(0);
  };

  return (
    <div>
      <ol className="mb-6 flex gap-1.5" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : i === step ? "bg-primary/40" : "bg-border"}`}>
            <span className="sr-only">{s.sense} {i < step ? "done" : i === step ? "current" : "upcoming"}</span>
          </li>
        ))}
      </ol>
      <div aria-live="polite" className="min-h-[190px]">
        {done ? (
          <div className="rise">
            <p className="font-display text-3xl">You came back to the room.</p>
            <p className="mt-2 text-muted-foreground">Take a moment if you want one. You can run through it again any time.</p>
          </div>
        ) : (
          <div key={step} className="rise">
            <p className="font-display text-7xl leading-none text-primary">{cur.n}</p>
            <p className="mt-1 font-data text-xs uppercase tracking-[0.2em] text-muted-foreground">things you can {cur.sense}</p>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed">{cur.prompt}</p>
            <div className="mt-4 flex gap-2" aria-label="Optional counter">
              {Array.from({ length: cur.n }).map((_, i) => (
                <button
                  key={i}
                  data-testid={`button-ground-tick-${i}`}
                  aria-label={`Mark ${i + 1}`}
                  aria-pressed={i < ticks}
                  onClick={() => setTicks(i < ticks ? i : i + 1)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${i < ticks ? "scale-95 border-primary bg-primary" : "border-primary/40 hover:border-primary"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {!done && (
          <>
            <button data-testid="button-ground-next" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              {step === STEPS.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button data-testid="button-ground-skip" onClick={next} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm">
              <SkipForward className="h-4 w-4" aria-hidden /> Skip this one
            </button>
          </>
        )}
        <button data-testid="button-ground-reset" onClick={reset} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4" aria-hidden /> {done ? "Start again" : "Reset"}
        </button>
      </div>
    </div>
  );
}
