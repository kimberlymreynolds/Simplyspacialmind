import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { ENERGY_LABELS, moodOf, type Entry } from "@/lib/store";

export function EntryCard({ entry, onEdit, onDelete }: { entry: Entry; onEdit?: () => void; onDelete?: () => void }) {
  const mood = moodOf(entry.mood);
  const d = new Date(entry.createdAt);
  return (
    <article data-testid={`card-entry-${entry.id}`} className="group relative flex gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="mt-1 h-10 w-10 shrink-0 rounded-full"
        style={{ background: mood ? `hsl(${mood.color})` : "repeating-linear-gradient(45deg, hsl(var(--muted)), hsl(var(--muted)) 4px, hsl(var(--border)) 4px, hsl(var(--border)) 6px)" }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-lg">{mood ? mood.label : "No mood noted"}</h3>
          <time dateTime={entry.createdAt} className="font-data text-xs text-muted-foreground">
            {format(d, "EEE d MMM · h:mm a")}
          </time>
          {entry.updatedAt && <span className="text-[11px] text-muted-foreground">edited</span>}
        </div>
        {entry.energy && (
          <p className="mt-1 text-sm text-muted-foreground">
            Energy <span className="font-data">{entry.energy}/5</span> · {ENERGY_LABELS[entry.energy]}
          </p>
        )}
        {entry.note && <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{entry.note}</p>}
        {entry.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
            {entry.tags.map((t) => (
              <li key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{t}</li>
            ))}
          </ul>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
          {onEdit && (
            <button onClick={onEdit} aria-label="Edit check-in" data-testid={`button-edit-${entry.id}`} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} aria-label="Delete check-in" data-testid={`button-delete-${entry.id}`} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
