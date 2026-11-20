import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, LineChart, CalendarClock, Flame } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Acasă", icon: LayoutGrid },
  { to: "/istoric", label: "Istoric", icon: LineChart },
  { to: "/program", label: "Program", icon: CalendarClock },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-12">
      <header className="panel sticky top-3 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-3 py-2 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-heat text-primary-foreground shadow-heat">
            <Flame className="size-4" />
          </span>
          <span className="truncate font-display text-lg font-semibold">Monitorizare casă</span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full bg-secondary/60 p-1 md:flex">
          {nav.map((n) => {
            const on = path === n.to;
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition ${on ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 pr-1 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-eco animate-pulse-ring" />
          <span className="tabular hidden sm:inline">Live · 20:31</span>
        </div>
      </header>
      <main className="mt-6">{children}</main>
      <nav className="panel fixed inset-x-4 bottom-4 z-30 flex justify-around rounded-full p-1.5 md:hidden">
        {nav.map((n) => {
          const on = path === n.to;
          return (
            <Link key={n.to} to={n.to} className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold ${on ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
