import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/home/AppShell";
import { Thermostat } from "@/components/home/Thermostat";
import { RoomCard } from "@/components/home/RoomCard";
import { TempChart, Legend } from "@/components/home/TempChart";
import { rooms, series, fmt, val } from "@/lib/demo-data";
import { Flame, Gauge, Droplets } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monitorizare casă — temperatură și termostat" },
      { name: "description", content: "Vezi temperatura din fiecare cameră și controlează termostatul de oriunde." },
      { property: "og:title", content: "Monitorizare casă" },
      { property: "og:description", content: "Temperatură, umiditate și încălzire inteligentă într-un singur loc." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const data = useMemo(() => series("24h"), []);
  const inside = rooms.filter((r) => !r.exterior);
  const avg = inside.reduce((s, r) => s + r.temp, 0) / inside.length;
  const heatHours = data.filter((p) => p.heating).length * 0.5;
  const stats = [
    { icon: Gauge, label: "Medie interior", value: `${fmt(avg)}°C`, cls: "text-cool" },
    { icon: Flame, label: "Încălzire azi", value: `${fmt(heatHours)} h`, cls: "text-heat" },
    { icon: Droplets, label: "Umiditate exterior", value: "89%", cls: "text-eco" },
  ];
  return (
    <AppShell>
      <div className="mb-6 animate-fade-up">
        <p className="text-sm text-muted-foreground">Bună seara 👋</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Casa ta, la confort perfect.</h1>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Thermostat />
        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="panel min-w-0 p-4">
                <s.icon className={`size-5 ${s.cls}`} />
                <p className="tabular mt-3 font-display text-xl font-semibold sm:text-2xl">{s.value}</p>
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <section className="panel min-w-0 flex-1 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Ultimele 24 de ore</h2>
              <Legend kind="temp" />
            </div>
            <TempChart data={data} range="24h" kind="temp" />
          </section>
        </div>
      </div>
      <h2 className="mb-3 mt-8 text-xl font-semibold">Camere</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {rooms.map((r, i) => (
          <RoomCard key={r.id} room={r} i={i} spark={data.filter((_, k) => k % 3 === 0).map((p) => ({ v: val(p, r.id) }))} />
        ))}
      </div>
    </AppShell>
  );
}
