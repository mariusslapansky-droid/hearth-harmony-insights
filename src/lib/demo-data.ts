export type Room = { id: string; name: string; temp: number; humidity: number | null; battery: number | null; color: string; exterior?: boolean };

export const rooms: Room[] = [
  { id: "dormitor", name: "Dormitor", temp: 19.3, humidity: 62.2, battery: 94, color: "var(--room-1)" },
  { id: "miriam", name: "Miriam", temp: 21.7, humidity: 52.7, battery: 100, color: "var(--room-2)" },
  { id: "briana", name: "Briana", temp: 23.6, humidity: 54.5, battery: 100, color: "var(--room-3)" },
  { id: "living", name: "Living", temp: 23.5, humidity: null, battery: null, color: "var(--room-4)" },
  { id: "exterior", name: "Exterior", temp: 12.5, humidity: 89, battery: null, color: "var(--cool)", exterior: true },
];

export type Range = "24h" | "7z" | "30z" | "1a";
export const ranges: { id: Range; label: string; hours: number; step: number }[] = [
  { id: "24h", label: "24 ore", hours: 24, step: 0.5 },
  { id: "7z", label: "7 zile", hours: 168, step: 3 },
  { id: "30z", label: "30 zile", hours: 720, step: 12 },
  { id: "1a", label: "1 an", hours: 8760, step: 168 },
];

// Deterministic pseudo-random so SSR and client match
function rnd(seed: number) { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }

export function series(range: Range) {
  const r = ranges.find((x) => x.id === range)!;
  const end = new Date("2026-11-19T20:30:00").getTime();
  const pts = [] as Array<Record<string, number>>;
  const n = Math.round(r.hours / r.step);
  for (let i = n; i >= 0; i--) {
    const t = end - i * r.step * 3600e3;
    const h = new Date(t).getHours() + new Date(t).getMinutes() / 60;
    const day = Math.sin(((h - 9) / 24) * Math.PI * 2);
    const season = range === "1a" ? Math.cos(((n - i) / n) * Math.PI * 2) * 8 : 0;
    const heating = (h > 6.5 && h < 7.5) || (h > 17 && h < 22) ? 1 : 0;
    const p: Record<string, number> = { t, heating };
    rooms.forEach((room, k) => {
      const noise = (rnd(i * 7 + k) - 0.5) * 0.6;
      if (room.exterior) p[room.id] = +(room.temp + day * 4 - season + noise * 2).toFixed(1);
      else p[room.id] = +(room.temp + day * 0.8 + heating * 0.6 + noise).toFixed(1);
      if (room.humidity != null) p[room.id + "_h"] = +(room.humidity + day * -4 + noise * 6).toFixed(1);
    });
    p.setpoint = heating ? 23 : 21;
    pts.push(p);
  }
  return pts;
}

export const days = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
export type Step = { time: string; temp: number };
export const defaultSchedule: Step[][] = days.map(() => [
  { time: "06:30", temp: 23 },
  { time: "07:30", temp: 21 },
  { time: "17:00", temp: 23 },
  { time: "22:00", temp: 21 },
]);

export const fmt = (v: number | null | undefined) =>
  v == null ? "–" : v.toLocaleString("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
