import { Droplets, BatteryFull, CloudSun } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { fmt, type Room } from "@/lib/demo-data";

export function RoomCard({ room, spark, i }: { room: Room; spark: { v: number }[]; i: number }) {
  return (
    <article className="panel group relative overflow-hidden p-5 transition hover:-translate-y-0.5 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, ["--c" as string]: room.color }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">{room.name}</h3>
        {room.exterior ? <CloudSun className="size-4 text-cool" /> : <span className="size-2.5 rounded-full" style={{ background: room.color, boxShadow: `0 0 12px ${room.color}` }} />}
      </div>
      <p className="tabular mt-3 font-display text-4xl font-semibold">{fmt(room.temp)}<span className="text-lg text-muted-foreground">°C</span></p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
        {room.humidity != null && <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1"><Droplets className="size-3 text-cool" />{fmt(room.humidity)}%</span>}
        {room.battery != null && <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1"><BatteryFull className="size-3 text-eco" />{room.battery}%</span>}
      </div>
      <div className="pointer-events-none -mx-5 -mb-5 mt-3 h-14 opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`s-${room.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={room.color} stopOpacity={0.4} />
                <stop offset="1" stopColor={room.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={room.color} strokeWidth={2} fill={`url(#s-${room.id})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
