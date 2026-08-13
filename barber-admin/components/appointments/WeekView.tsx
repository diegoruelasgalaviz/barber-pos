"use client";

import { useDataStore } from "@/lib/data-store";
import { addDaysIso, cn, DAY_SHORT, formatTime, startOfWeekIso, todayIso } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import type { Appointment } from "@/lib/types";

export function WeekView({
  date,
  staffFilter,
  onSelect,
  onSelectDay,
}: {
  date: string;
  staffFilter: string | "all";
  onSelect: (a: Appointment) => void;
  onSelectDay: (day: string) => void;
}) {
  const { appointments } = useDataStore();
  const start = startOfWeekIso(date);
  const days = Array.from({ length: 7 }, (_, i) => addDaysIso(start, i));
  const today = todayIso();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const dayAppointments = appointments
          .filter((a) => a.date === day && (staffFilter === "all" || a.staffId === staffFilter))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const dow = new Date(`${day}T00:00:00`).getDay();
        const isToday = day === today;

        return (
          <div key={day} className="rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex w-full items-center justify-between rounded-t-lg border-b border-zinc-200 px-2.5 py-2 text-left dark:border-zinc-800",
                isToday && "bg-zinc-900 dark:bg-white",
              )}
            >
              <span className={cn("text-xs font-medium", isToday ? "text-white dark:text-zinc-900" : "text-zinc-500 dark:text-zinc-400")}>
                {DAY_SHORT[dow]}
              </span>
              <span className={cn("text-xs font-semibold", isToday ? "text-white dark:text-zinc-900" : "text-zinc-700 dark:text-zinc-300")}>
                {Number(day.slice(8, 10))}
              </span>
            </button>
            <div className="min-h-[3.5rem] space-y-1 p-1.5">
              {dayAppointments.length === 0 && <p className="px-1 py-2 text-center text-[11px] text-zinc-300 dark:text-zinc-700">—</p>}
              {dayAppointments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onSelect(a)}
                  className="block w-full rounded-md border border-zinc-100 px-1.5 py-1 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                >
                  <p className="truncate text-[11px] font-medium text-zinc-700 dark:text-zinc-300">{formatTime(a.startTime)}</p>
                  <div className="mt-0.5">
                    <StatusBadge status={a.status} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
