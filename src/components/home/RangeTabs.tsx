import { ranges, type Range } from "@/lib/demo-data";

export function RangeTabs({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="inline-flex rounded-full border bg-card p-1">
      {ranges.map((r) => (
        <button key={r.id} onClick={() => onChange(r.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition sm:px-4 ${value === r.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
          {r.label}
        </button>
      ))}
    </div>
  );
}
