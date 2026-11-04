import { useSyncExternalStore } from "react";

export const MOODS = [
  { id: "heavy", label: "Heavy", hint: "weighed down", color: "var(--mood-heavy)" },
  { id: "low", label: "Low", hint: "a bit flat", color: "var(--mood-low)" },
  { id: "steady", label: "Steady", hint: "okay, even", color: "var(--mood-steady)" },
  { id: "bright", label: "Bright", hint: "lighter today", color: "var(--mood-bright)" },
  { id: "radiant", label: "Radiant", hint: "really good", color: "var(--mood-radiant)" },
] as const;
export type MoodId = (typeof MOODS)[number]["id"];

export const ENERGY_LABELS = ["", "Running on empty", "Low battery", "Some in the tank", "Fairly charged", "Full battery"];

export const SUGGESTED_TAGS = ["sensory overload", "masking", "rested", "hyperfocus", "social", "quiet day", "meds taken", "outside", "burnout", "proud"];

export interface Entry {
  id: string;
  createdAt: string;
  updatedAt?: string;
  mood?: MoodId;
  energy?: number;
  note?: string;
  tags: string[];
}

export interface Settings {
  quietMode: boolean;
  breathingPace: "gentle" | "even";
  timerMinutes: number;
}

const ENTRIES_KEY = "simply-spacial:entries:v1";
const SETTINGS_KEY = "simply-spacial:settings:v1";
const DEFAULT_SETTINGS: Settings = { quietMode: false, breathingPace: "gentle", timerMinutes: 5 };

export class StorageError extends Error {}

function read<T>(key: string, fallback: T): { value: T; error: string | null } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { value: fallback, error: null };
    return { value: JSON.parse(raw) as T, error: null };
  } catch {
    return { value: fallback, error: "Saved data in this browser could not be read." };
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new StorageError("This browser would not let us save. Storage may be full, disabled, or in a private window.");
  }
}

const e = read<Entry[]>(ENTRIES_KEY, []);
const s = read<Partial<Settings>>(SETTINGS_KEY, {});
let state = {
  entries: Array.isArray(e.value) ? e.value : [],
  settings: { ...DEFAULT_SETTINGS, ...s.value } as Settings,
  loadError: e.error || s.error,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function setEntries(next: Entry[]) {
  write(ENTRIES_KEY, next);
  state = { ...state, entries: next };
  emit();
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export type EntryInput = Omit<Entry, "id" | "createdAt" | "updatedAt">;

export const actions = {
  addEntry(input: EntryInput): Entry {
    const entry: Entry = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setEntries([entry, ...state.entries]);
    return entry;
  },
  updateEntry(id: string, input: EntryInput) {
    setEntries(state.entries.map((x) => (x.id === id ? { ...x, ...input, updatedAt: new Date().toISOString() } : x)));
  },
  deleteEntry(id: string) {
    setEntries(state.entries.filter((x) => x.id !== id));
  },
  updateSettings(patch: Partial<Settings>) {
    const next = { ...state.settings, ...patch };
    write(SETTINGS_KEY, next);
    state = { ...state, settings: next };
    emit();
  },
  clearAll() {
    try {
      localStorage.removeItem(ENTRIES_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch {
      throw new StorageError("We could not clear storage in this browser. Try clearing site data from browser settings.");
    }
    state = { entries: [], settings: { ...DEFAULT_SETTINGS }, loadError: null };
    emit();
  },
};

export function useStore() {
  return useSyncExternalStore(subscribe, () => state);
}

export function isEmptyEntry(i: EntryInput) {
  return !i.mood && !i.energy && !i.note?.trim() && i.tags.length === 0;
}

export const moodOf = (id?: MoodId) => MOODS.find((m) => m.id === id);
