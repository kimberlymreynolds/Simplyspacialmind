import { LifeBuoy, Phone, MessageSquare, Globe, Siren } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SupportDialog({ compact = false }: { compact?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger
        data-testid="button-open-support"
        className={
          compact
            ? "inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:brightness-95"
            : "flex w-full items-center gap-3 rounded-2xl border border-accent-border bg-accent/70 px-4 py-3 text-left text-sm text-accent-foreground hover:bg-accent"
        }
      >
        <LifeBuoy className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          <span className="font-medium">Need more support?</span>
          {!compact && <span className="block text-xs opacity-80">Crisis lines and urgent help</span>}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium">You deserve real support</DialogTitle>
          <DialogDescription>
            Simply Spacial is a wellness space, not a crisis, diagnosis or treatment service. If things feel like too much, these people can help right now.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <Siren className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
            <p className="text-sm">
              <span className="font-semibold">In immediate danger?</span> Contact your local emergency services (911 in the US) now.
            </p>
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="mb-3 text-sm font-semibold">United States — 988 Suicide &amp; Crisis Lifeline</p>
            <div className="flex flex-wrap gap-2">
              <a data-testid="link-call-988" href="tel:988" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110">
                <Phone className="h-4 w-4" aria-hidden /> Call 988
              </a>
              <a data-testid="link-text-988" href="sms:988" className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
                <MessageSquare className="h-4 w-4" aria-hidden /> Text 988
              </a>
            </div>
          </div>
          <a
            data-testid="link-findahelpline"
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl border bg-background p-4 text-sm hover:bg-muted"
          >
            <Globe className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>
              <span className="font-semibold">Outside the US?</span> Find a free, confidential helpline in your country at findahelpline.com
            </span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
