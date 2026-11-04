import { useMemo, useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { actions, isEmptyEntry, useStore, type Entry, type EntryInput } from "@/lib/store";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PageHeader } from "@/components/page-header";
import { EntryCard } from "@/components/entry-card";
import { CheckinForm } from "@/components/checkin-form";
import { Blob } from "@/components/logo";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Journal() {
  usePageMeta("Journal", "Your own check-ins, kept only in this browser. Edit or remove any of them.");
  const { entries } = useStore();
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, Entry[]>();
    [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach((e) => {
      const k = format(new Date(e.createdAt), "yyyy-MM-dd");
      m.set(k, [...(m.get(k) ?? []), e]);
    });
    return [...m.entries()];
  }, [entries]);

  const saveEdit = (v: EntryInput) => {
    if (!editing) return;
    if (isEmptyEntry(v)) {
      setError("This would leave the entry empty. Delete it instead if you'd rather let it go.");
      return;
    }
    try {
      actions.updateEntry(editing.id, v);
      setEditing(null);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    try {
      actions.deleteEntry(deleting.id);
      setDeleting(null);
    } catch (err) {
      setError((err as Error).message);
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Journal" title="What you've set down.">
        Only the moments you chose to note. Gaps are normal — they just mean you were living.
      </PageHeader>

      {error && !editing && (
        <p role="alert" className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      {groups.length === 0 ? (
        <div className="relative overflow-hidden rounded-[2rem] border bg-card/60 p-10 text-center md:p-16">
          <Blob tone="secondary" className="drift absolute -left-10 -top-10 h-40 w-40 opacity-70" />
          <Blob className="drift absolute -bottom-12 -right-8 h-44 w-44 opacity-60 [animation-delay:-4s]" />
          <div className="relative">
            <p className="font-display text-3xl">Nothing here yet.</p>
            <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
              When you check in, it lands here — and only here, in this browser. There's no right amount.
            </p>
            <Link href="/" data-testid="link-first-checkin" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Go to today
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(([day, list]) => (
            <section key={day} aria-labelledby={`d-${day}`} className="md:grid md:grid-cols-[150px_1fr] md:gap-6">
              <h2 id={`d-${day}`} className="mb-3 md:sticky md:top-8 md:self-start">
                <span className="font-display block text-2xl">{format(new Date(day + "T12:00"), "d MMM")}</span>
                <span className="font-data text-xs uppercase tracking-widest text-muted-foreground">{format(new Date(day + "T12:00"), "EEEE yyyy")}</span>
              </h2>
              <div className="space-y-3 border-l border-dashed pl-4 md:border-0 md:pl-0">
                {list.map((e) => (
                  <EntryCard key={e.id} entry={e} onEdit={() => { setError(null); setEditing(e); }} onDelete={() => setDeleting(e)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setError(null); } }}>
        <DialogContent className="max-h-[90dvh] max-w-xl overflow-y-auto rounded-3xl bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium">Edit check-in</DialogTitle>
            <DialogDescription>{editing && format(new Date(editing.createdAt), "EEEE d MMMM, h:mm a")}</DialogDescription>
          </DialogHeader>
          {editing && (
            <CheckinForm
              key={editing.id}
              initial={{ mood: editing.mood, energy: editing.energy, note: editing.note, tags: editing.tags }}
              submitLabel="Save changes"
              onSubmit={saveEdit}
              onCancel={() => { setEditing(null); setError(null); }}
              error={error}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl font-medium">Let this one go?</AlertDialogTitle>
            <AlertDialogDescription>This check-in will be removed from this browser. It can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete" className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction data-testid="button-confirm-delete" onClick={confirmDelete} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
