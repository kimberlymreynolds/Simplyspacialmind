export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="17" cy="21" r="14" fill="hsl(var(--accent))" />
      <circle cx="25" cy="17" r="11" fill="hsl(var(--secondary))" opacity="0.9" />
      <path d="M11 24c3 3 9 4 13 0" stroke="hsl(var(--primary))" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="11" r="2.6" fill="hsl(var(--primary))" />
    </svg>
  );
}

export function Blob({ className = "", tone = "accent" }: { className?: string; tone?: "accent" | "secondary" | "mood" }) {
  const fill = tone === "accent" ? "hsl(var(--accent))" : tone === "secondary" ? "hsl(var(--secondary))" : "hsl(var(--mood-steady) / .5)";
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path fill={fill} d="M43.5,-61.3C55.4,-52.2,63.2,-37.9,68.2,-22.6C73.2,-7.3,75.4,9.1,70.3,23.1C65.2,37.1,52.8,48.7,38.7,57.2C24.6,65.7,8.7,71.1,-7.6,72C-23.9,72.9,-40.6,69.4,-52.6,59.6C-64.6,49.8,-71.9,33.7,-73.4,17.5C-74.9,1.3,-70.6,-15,-62.1,-28C-53.6,-41,-40.9,-50.8,-27.6,-59.4C-14.3,-68,-0.3,-75.4,13.7,-74.6C27.7,-73.8,31.6,-70.4,43.5,-61.3Z" transform="translate(100 100)" />
    </svg>
  );
}
