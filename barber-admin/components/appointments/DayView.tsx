"use client";

import { useDataStore } from "@/lib/data-store";
import { AppointmentCard } from "./AppointmentCard";
import type { Appointment } from "@/lib/types";

export function DayView({
  date,
  staffFilter,
  onSelect,
}: {
  date: string;
  staffFilter: string | "all";
  onSelect: (a: Appointment) => void;
}) {
  const { appointments } = useDataStore();
  const dayAppointments = appointments
    .filter((a) => a.date === date && (staffFilter === "all" || a.staffId === staffFilter))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (dayAppointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No appointments scheduled for this day.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {dayAppointments.map((a) => (
        <AppointmentCard key={a.id} appointment={a} onClick={() => onSelect(a)} />
      ))}
    </div>
  );
}
