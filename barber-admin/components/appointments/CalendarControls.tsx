"use client";

import { cn, formatDateLong, formatDateMedium } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export type CalendarView = "day" | "week" | "month";

export function CalendarControls({
  view,
  onViewChange,
  date,
  onPrev,
  onNext,
  onToday,
}: {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800">
          <button onClick={onPrev} aria-label="Previous" className="rounded-l-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button onClick={onNext} aria-label="Next" className="rounded-r-lg border-l border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <Button size="sm" variant="outline" onClick={onToday}>
          Today
        </Button>
        <h2 className="hidden text-sm font-medium text-zinc-700 sm:block dark:text-zinc-300">
          {view === "day" ? formatDateLong(date) : formatDateMedium(date)}
        </h2>
      </div>
      <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
        {(["day", "week", "month"] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              view === v ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
