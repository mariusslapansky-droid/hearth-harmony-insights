import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/home/AppShell";
import { days, defaultSchedule, fmt } from "@/lib/demo-data";
import { Pencil, Check } from "lucide-react";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Program încălzire — Monitorizare casă" },
      { name: "description", content: "Programul săptămânal al termostatului, pe trepte orare." },
      { property: "og:title", content: "Program încălzire — Monitorizare casă" },
      { property: "og:description", content: "Setează temperatura pe ore pentru fiecare zi a săptămânii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Program,
});

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return (h ?? 0) * 60 + (m ?? 0); };

function Program() {
  const [sched, setSched] = useState(defaultSchedule);
  const [edit, setEdit] = useState(false);
  const today = 3; // Joi
  const nowMin = 20 * 60 + 31;
  const update = (d: number, s: number, key: "time" | "temp", v: string) =>
    setSched((x) => x.map((day, i) => (i !== d ? day : day.map((st, j) => (j !== s ? st : { ...st, [key]: key === "temp" ? Number(v) : v })))));

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Termostat Living</p>
          <h1 className="mt-1 text-3xl font-semibold">Program săptămânal</h1>
        </div>
        <button onClick={() => setEdit(!edit)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${edit ? "bg-eco text-background" : "bg-gradient-heat text-primary-foreground shadow-heat"}`}>
          {edit ? <><Check className="size-4" /> Salvează</> : <><Pencil className="size-4" /> Modifică programul</>}
        </button>
      </div>
      <div className="grid gap-3">
        {sched.map((steps, d) => {
          const active = d === today ? steps.reduce((a, s, j) => (toMin(s.time) <= nowMin ? j : a), -1) : -1;
          return (
            <div key={d} className={`panel grid grid-cols-[80px_minmax(0,1fr)] items-center gap-3 p-4 sm:grid-cols-[120px_minmax(0,1fr)] ${d === today ? "ring-1 ring-primary/40" : ""}`}>
              <div>
                <p className="font-display font-semibold">{days[d]}</p>
                {d === today && <p className="text-xs font-semibold text-primary">Azi</p>}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((s, j) => {
                  const warm = s.temp >= 22;
                  return (
                    <div key={j} className={`rounded-2xl px-3 py-2.5 transition ${j === active ? "bg-gradient-heat text-primary-foreground shadow-heat" : "bg-secondary/60"}`}>
                      {edit ? (
                        <div className="flex gap-1.5">
                          <input type="time" value={s.time} onChange={(e) => update(d, j, "time", e.target.value)} className="w-full min-w-0 rounded-lg border bg-background px-1.5 py-1 text-sm" />
                          <input type="number" step="0.5" value={s.temp} onChange={(e) => update(d, j, "temp", e.target.value)} className="w-16 rounded-lg border bg-background px-1.5 py-1 text-sm" />
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`tabular text-sm ${j === active ? "" : "text-muted-foreground"}`}>{s.time}</span>
                          <span className={`tabular font-display text-lg font-semibold ${j === active ? "" : warm ? "text-heat" : "text-cool"}`}>{fmt(s.temp)}°</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
