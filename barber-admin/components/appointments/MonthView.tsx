"use client";

import { useDataStore } from "@/lib/data-store";
import { addDaysIso, cn, DAY_SHORT, startOfMonthIso, startOfWeekIso, todayIso } from "@/lib/utils";

export function MonthView({
  date,
  staffFilter,
  onSelectDay,
}: {
  date: string;
  staffFilter: string | "all";
  onSelectDay: (day: string) => void;
}) {
  const { appointments } = useDataStore();
  const monthStart = startOfMonthIso(date);
  const gridStart = startOfWeekIso(monthStart);
  const currentMonth = date.slice(0, 7);
  const today = todayIso();

  const days = Array.from({ length: 42 }, (_, i) => addDaysIso(gridStart, i));

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
        {DAY_SHORT.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = day.slice(0, 7) === currentMonth;
          const dayAppointments = appointments.filter(
            (a) => a.date === day && (staffFilter === "all" || a.staffId === staffFilter),
          );
          const isToday = day === today;

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex h-20 flex-col items-start gap-1 border-b border-r border-zinc-100 p-1.5 text-left last:border-r-0 dark:border-zinc-800/60",
                !inMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday && "bg-zinc-900 font-semibold text-white dark:bg-white dark:text-zinc-900",
                  !isToday && inMonth && "text-zinc-700 dark:text-zinc-300",
                  !isToday && !inMonth && "text-zinc-300 dark:text-zinc-700",
                )}
              >
                {Number(day.slice(8, 10))}
              </span>
              {dayAppointments.length > 0 && (
                <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {dayAppointments.length} appt{dayAppointments.length > 1 ? "s" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
