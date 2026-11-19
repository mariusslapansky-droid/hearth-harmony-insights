import { useState } from "react";
import { Minus, Plus, Flame, Snowflake, ShieldCheck } from "lucide-react";
import { fmt } from "@/lib/demo-data";

const MIN = 5, MAX = 30;

export function Thermostat() {
  const [target, setTarget] = useState(23);
  const [mode, setMode] = useState<"program" | "manual">("program");
  const [on, setOn] = useState(true);
  const current = 23.5;
  const heating = on && current < target;
  const pct = (target - MIN) / (MAX - MIN);
  const R = 110, C = 2 * Math.PI * R, arc = C * 0.75;

  return (
    <section className="panel relative overflow-hidden p-6 animate-fade-up">
      <div className={`pointer-events-none absolute inset-0 glow-heat transition-opacity duration-700 ${heating ? "opacity-100" : "opacity-30"}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Living · termostat</p>
          <h2 className="mt-1 text-2xl font-semibold">Climatizare</h2>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${heating ? "bg-gradient-heat text-primary-foreground shadow-heat" : "bg-secondary text-muted-foreground"}`}>
          {heating ? <Flame className="size-3.5" /> : <Snowflake className="size-3.5" />}
          {heating ? "Încălzește" : on ? "Temperatură atinsă" : "Oprit"}
        </span>
      </div>

      <div className="relative mx-auto mt-2 grid size-64 place-items-center">
        <svg viewBox="0 0 260 260" className="absolute inset-0 -rotate-[225deg]">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="var(--cool)" />
              <stop offset="1" stopColor="var(--heat)" />
            </linearGradient>
          </defs>
          <circle cx="130" cy="130" r={R} fill="none" stroke="var(--secondary)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${arc} ${C}`} />
          <circle cx="130" cy="130" r={R} fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${arc * pct} ${C}`} className="transition-all duration-500" />
        </svg>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Țintă</p>
          <p className="tabular font-display text-6xl font-semibold leading-none">{fmt(target)}<span className="text-2xl text-muted-foreground">°</span></p>
          <p className="mt-2 text-sm text-muted-foreground">În cameră <span className="tabular font-semibold text-foreground">{fmt(current)}°</span></p>
        </div>
      </div>

      <div className="relative mt-1 flex items-center justify-center gap-4">
        <button aria-label="Scade" onClick={() => setTarget((t) => Math.max(MIN, +(t - 0.5).toFixed(1)))} className="grid size-12 place-items-center rounded-full bg-secondary transition hover:bg-foreground hover:text-background active:scale-95"><Minus className="size-5" /></button>
        <div className="flex rounded-full bg-secondary p-1">
          {(["program", "manual"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${mode === m ? "bg-foreground text-background" : "text-muted-foreground"}`}>{m}</button>
          ))}
        </div>
        <button aria-label="Crește" onClick={() => setTarget((t) => Math.min(MAX, +(t + 0.5).toFixed(1)))} className="grid size-12 place-items-center rounded-full bg-secondary transition hover:bg-foreground hover:text-background active:scale-95"><Plus className="size-5" /></button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 text-sm">
        <button onClick={() => setOn(!on)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 font-semibold transition ${on ? "border-transparent bg-eco/15 text-eco" : "bg-secondary/50 text-muted-foreground"}`}>
          Încălzire <span>{on ? "Pornită" : "Oprită"}</span>
        </button>
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-cool" /> <span className="truncate">Protecție min. 18,5°</span>
        </div>
      </div>
    </section>
  );
}
