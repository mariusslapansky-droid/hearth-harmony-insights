import { Area, CartesianGrid, ComposedChart, Line, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmt, rooms, type Range, type Point } from "@/lib/demo-data";

type P = Point;

function tick(range: Range) {
  return (t: number) => {
    const d = new Date(t);
    if (range === "24h") return d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    if (range === "1a") return d.toLocaleDateString("ro-RO", { month: "short" });
    return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit" });
  };
}

function heatBands(data: P[]) {
  const out: [number, number][] = [];
  data.forEach((p, i) => {
    if (!p.heating) return;
    const next: number = data[i + 1]?.t ?? p.t;
    const last = out[out.length - 1];
    if (last && last[1] === p.t) last[1] = next; else out.push([p.t, next]);
  });
  return out;
}

export function TempChart({ data, range, kind }: { data: P[]; range: Range; kind: "temp" | "hum" }) {
  const list = kind === "temp" ? rooms : rooms.filter((r) => r.humidity != null);
  const f = tick(range);
  return (
    <div className="h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="t" type="number" domain={["dataMin", "dataMax"]} scale="time" tickFormatter={f} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} minTickGap={40} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
          {kind === "temp" && range !== "1a" && heatBands(data).map(([a, b], i) => <ReferenceArea key={i} x1={a} x2={b} fill="var(--heat)" fillOpacity={0.09} ifOverflow="hidden" />)}
          <Tooltip
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 14, fontSize: 12 }}
            labelFormatter={(t) => new Date(t as number).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" })}
            formatter={(v: number, n) => [`${fmt(v)} ${kind === "temp" ? "°C" : "%"}`, n]}
          />
          {kind === "temp" && <Line dataKey="setpoint" name="Setat" type="stepAfter" stroke="var(--heat)" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
          {list.map((r) =>
            r.exterior ? (
              <Area key={r.id} dataKey={kind === "temp" ? r.id : r.id + "_h"} name={r.name} type="monotone" stroke={r.color} fill={r.color} fillOpacity={0.06} strokeDasharray="3 3" strokeWidth={2} dot={false} isAnimationActive={false} />
            ) : (
              <Line key={r.id} dataKey={kind === "temp" ? r.id : r.id + "_h"} name={r.name} type="monotone" stroke={r.color} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Legend({ kind }: { kind: "temp" | "hum" }) {
  const list = kind === "temp" ? rooms : rooms.filter((r) => r.humidity != null);
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {list.map((r) => (
        <span key={r.id} className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: r.color }} />{r.name}</span>
      ))}
      {kind === "temp" && <span className="inline-flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-heat/30" />Încălzire activă</span>}
    </div>
  );
}
