import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { MOODS, ENERGY_LABELS, SUGGESTED_TAGS, type EntryInput, type MoodId } from "@/lib/store";

interface Props {
  initial?: EntryInput;
  submitLabel: string;
  onSubmit: (v: EntryInput) => void;
  onCancel?: () => void;
  error?: string | null;
}

export function CheckinForm({ initial, submitLabel, onSubmit, onCancel, error }: Props) {
  const [mood, setMood] = useState<MoodId | undefined>(initial?.mood);
  const [energy, setEnergy] = useState<number | undefined>(initial?.energy);
  const [note, setNote] = useState(initial?.note ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase().slice(0, 30);
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setTagDraft("");
  };
  const toggleTag = (t: string) => (tags.includes(t) ? setTags(tags.filter((x) => x !== t)) : addTag(t));
  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ mood, energy, note: note.trim() || undefined, tags });
      }}
      className="space-y-7"
    >
      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium">
          How does today feel? <span className="text-xs font-normal text-muted-foreground">optional</span>
        </legend>
        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Mood">
          {MOODS.map((m) => {
            const on = mood === m.id;
            return (
              <button
                type="button"
                key={m.id}
                role="radio"
                aria-checked={on}
                data-testid={`button-mood-${m.id}`}
                onClick={() => setMood(on ? undefined : m.id)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border px-1 py-3 transition-all ${
                  on ? "border-primary bg-card shadow-md" : "border-transparent bg-muted/60 hover:bg-card"
                }`}
              >
                <span
                  className={`h-9 w-9 rounded-full transition-transform ${on ? "scale-110" : "group-hover:scale-105"}`}
                  style={{ background: `hsl(${m.color})`, boxShadow: on ? `0 0 0 4px hsl(${m.color} / .3)` : undefined }}
                />
                <span className="text-xs font-medium sm:text-sm">{m.label}</span>
                <span className="hidden text-[11px] text-muted-foreground sm:block">{m.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium">
          Energy <span className="text-xs font-normal text-muted-foreground">{energy ? ENERGY_LABELS[energy] : "optional"}</span>
        </legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Energy from 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = energy === n;
            return (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={on}
                aria-label={`${n} of 5, ${ENERGY_LABELS[n]}`}
                data-testid={`button-energy-${n}`}
                onClick={() => setEnergy(on ? undefined : n)}
                className={`flex flex-1 flex-col items-center justify-end gap-1.5 rounded-2xl border py-3 transition-colors ${
                  on ? "border-primary bg-card" : "border-transparent bg-muted/60 hover:bg-card"
                }`}
              >
                <span className="flex h-8 items-end gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((b) => (
                    <span
                      key={b}
                      className="w-1.5 rounded-full"
                      style={{ height: `${b * 6}px`, background: b <= n ? "hsl(var(--primary))" : "hsl(var(--border))" }}
                    />
                  ))}
                </span>
                <span className="font-data text-xs">{n}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="note" className="mb-2 flex items-baseline justify-between text-sm font-medium">
          Anything you want to set down? <span className="text-xs font-normal text-muted-foreground">optional</span>
        </label>
        <textarea
          id="note"
          data-testid="input-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="A word, a sentence, or nothing at all."
          className="w-full resize-y rounded-2xl border border-input bg-card px-4 py-3 text-[15px] placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="tag" className="mb-2 flex items-baseline justify-between text-sm font-medium">
          Tags <span className="text-xs font-normal text-muted-foreground">optional</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[...new Set([...SUGGESTED_TAGS, ...tags])].map((t) => {
            const on = tags.includes(t);
            return (
              <button
                type="button"
                key={t}
                aria-pressed={on}
                data-testid={`button-tag-${t.replace(/\s+/g, "-")}`}
                onClick={() => toggleTag(t)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                  on ? "border-secondary-border bg-secondary text-secondary-foreground" : "bg-card/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {on && <X className="h-3 w-3" aria-hidden />}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            id="tag"
            data-testid="input-tag"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={onTagKey}
            placeholder="Your own tag"
            className="min-w-0 flex-1 rounded-full border border-input bg-card px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            data-testid="button-add-tag"
            onClick={() => addTag(tagDraft)}
            disabled={!tagDraft.trim()}
            className="inline-flex items-center gap-1 rounded-full border bg-card px-3 text-sm disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          data-testid="button-save-checkin"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" data-testid="button-cancel-checkin" onClick={onCancel} className="rounded-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
            Not now
          </button>
        )}
      </div>
    </form>
  );
}
