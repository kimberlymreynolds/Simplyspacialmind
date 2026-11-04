import { useState } from "react";
import { HardDrive, CloudOff, Users, ShieldAlert } from "lucide-react";
import { actions, useStore, type Settings as S } from "@/lib/store";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PageHeader } from "@/components/page-header";
import { SupportDialog } from "@/components/support-dialog";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  usePageMeta("Settings", "Quiet mode, breathing pace, and how your data is stored — only in this browser.");
  const { settings, entries } = useStore();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const update = (patch: Partial<S>) => {
    try {
      actions.updateSettings(patch);
      setMsg(null);
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
  };
  const clear = () => {
    try {
      actions.clearAll();
      setMsg({ kind: "ok", text: "Everything has been cleared from this browser." });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Make it yours.">Adjust how things move and learn exactly where your words live.</PageHeader>

      {msg && (
        <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${msg.kind === "err" ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-primary/30 bg-primary/5 text-primary"}`}>
          {msg.text}
        </p>
      )}

      <div className="space-y-8">
        <section aria-labelledby="comfort-h" className="rounded-[2rem] border bg-card/75 p-6 md:p-8">
          <h2 id="comfort-h" className="font-display mb-5 text-2xl">Comfort</h2>
          <div className="flex items-start justify-between gap-6">
            <label htmlFor="quiet" className="cursor-pointer">
              <span className="block font-medium">Quiet mode</span>
              <span className="block text-sm text-muted-foreground">Turns off drifting shapes and transitions. Your system's reduced-motion setting is always respected too.</span>
            </label>
            <Switch id="quiet" data-testid="switch-quiet" checked={settings.quietMode} onCheckedChange={(v) => update({ quietMode: v })} />
          </div>
          <div className="mt-6 border-t pt-6">
            <p className="font-medium">Breathing pace</p>
            <div className="mt-3 flex gap-1 rounded-full bg-muted p-1 text-sm sm:max-w-sm" role="radiogroup" aria-label="Breathing pace">
              {(["gentle", "even"] as const).map((p) => (
                <button key={p} role="radio" aria-checked={settings.breathingPace === p} data-testid={`button-setting-pace-${p}`} onClick={() => update({ breathingPace: p })}
                  className={`flex-1 rounded-full px-3 py-1.5 ${settings.breathingPace === p ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                  {p === "gentle" ? "Longer out (4 · 6)" : "Even (4 · 4)"}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="privacy-h" className="rounded-[2rem] border bg-card/75 p-6 md:p-8">
          <h2 id="privacy-h" className="font-display mb-5 text-2xl">Your data</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              [HardDrive, "Stored only in this browser", "Check-ins live in this browser's local storage on this device. Nothing is sent anywhere."],
              [CloudOff, "Not synced or backed up", "Another device or browser won't see it. Clearing site data removes it for good."],
              [Users, "Shared device?", "Anyone using this browser profile can open this page and read your entries."],
              [ShieldAlert, "Honest saving", "If the browser refuses to save, you'll see an error — never a false success."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof HardDrive;
              return (
                <li key={t as string} className="flex gap-3">
                  <I className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span><span className="block font-medium">{t as string}</span><span className="text-sm text-muted-foreground">{d as string}</span></span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-entry-count">
              {entries.length === 0 ? "No check-ins stored right now." : `${entries.length} ${entries.length === 1 ? "check-in" : "check-ins"} stored in this browser.`}
            </p>
            <AlertDialog>
              <AlertDialogTrigger data-testid="button-clear-all" className="rounded-full border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5">
                Clear all data
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-2xl font-medium">Clear everything?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all check-ins and preferences from this browser. There's no backup, so it can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-clear" className="rounded-full">Keep my data</AlertDialogCancel>
                  <AlertDialogAction data-testid="button-confirm-clear" onClick={clear} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        <section aria-labelledby="about-h" className="rounded-[2rem] bg-secondary/60 p-6 md:p-8">
          <h2 id="about-h" className="font-display mb-3 text-2xl">What this is, and isn't</h2>
          <p className="max-w-2xl leading-relaxed text-secondary-foreground">
            Simply Spacial offers everyday wellness support. It does not diagnose, treat, or replace professional care, and it is not a crisis service.
          </p>
          <div className="mt-5 max-w-sm"><SupportDialog /></div>
        </section>
      </div>
    </div>
  );
}
