import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/home/AppShell";
import { RangeTabs } from "@/components/home/RangeTabs";
import { TempChart, Legend } from "@/components/home/TempChart";
import { rooms, series, fmt, val, type Range } from "@/lib/demo-data";

export const Route = createFileRoute("/istoric")({
  head: () => ({
    meta: [
      { title: "Istoric temperaturi — Monitorizare casă" },
      { name: "description", content: "Grafice de temperatură și umiditate pe 24 ore, 7 zile, 30 zile și 1 an." },
      { property: "og:title", content: "Istoric temperaturi — Monitorizare casă" },
      { property: "og:description", content: "Evoluția temperaturii și umidității din fiecare cameră." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Istoric,
});

function Istoric() {
  const [range, setRange] = useState<Range>("24h");
  const data = useMemo(() => series(range), [range]);
  const stats = rooms.map((r) => {
    const t = data.map((p) => val(p, r.id));
    const h = r.humidity != null ? data.map((p) => val(p, r.id + "_h")) : null;
    return { r, min: Math.min(...t), avg: t.reduce((a, b) => a + b, 0) / t.length, max: Math.max(...t), hmin: h ? Math.min(...h) : null, hmax: h ? Math.max(...h) : null };
  });
  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Analiză</p>
          <h1 className="mt-1 text-3xl font-semibold">Istoric</h1>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>
      <div className="grid gap-5">
        <section className="panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Temperatură (°C)</h2><Legend kind="temp" /></div>
          <TempChart data={data} range={range} kind="temp" />
        </section>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="panel p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Umiditate (%)</h2><Legend kind="hum" /></div>
            <TempChart data={data} range={range} kind="hum" />
          </section>
          <section className="panel overflow-x-auto p-5">
            <h2 className="mb-3 text-lg font-semibold">Statistici</h2>
            <table className="tabular w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2 text-left font-semibold">Cameră</th><th className="text-right font-semibold">Min</th><th className="text-right font-semibold">Medie</th><th className="text-right font-semibold">Max</th><th className="text-right font-semibold">Umid.</th></tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.r.id} className="border-t">
                    <td className="py-3"><span className="mr-2 inline-block size-2 rounded-full" style={{ background: s.r.color }} />{s.r.name}</td>
                    <td className="text-right text-cool">{fmt(s.min)}</td>
                    <td className="text-right font-semibold">{fmt(s.avg)}</td>
                    <td className="text-right text-heat">{fmt(s.max)}</td>
                    <td className="text-right text-muted-foreground">{s.hmin == null ? "–" : `${Math.round(s.hmin)}–${Math.round(s.hmax!)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
