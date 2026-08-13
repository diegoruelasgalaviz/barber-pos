"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { CalendarControls, type CalendarView } from "@/components/appointments/CalendarControls";
import { DayView } from "@/components/appointments/DayView";
import { WeekView } from "@/components/appointments/WeekView";
import { MonthView } from "@/components/appointments/MonthView";
import { BookingModal } from "@/components/appointments/BookingModal";
import { AppointmentDetailModal } from "@/components/appointments/AppointmentDetailModal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/Card";
import { PlusIcon } from "@/components/icons";
import { addDaysIso, todayIso } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export default function AppointmentsPage() {
  const { appointments, staff } = useDataStore();
  const [view, setView] = useState<CalendarView>("day");
  const [date, setDate] = useState(todayIso());
  const [staffFilter, setStaffFilter] = useState<string | "all">("all");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const today = todayIso();
  const todayCount = appointments.filter((a) => a.date === today).length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const inProgressCount = appointments.filter((a) => a.status === "in-progress" && a.date === today).length;
  const completedToday = appointments.filter((a) => a.status === "completed" && a.date === today).length;

  function step(delta: number) {
    if (view === "day") setDate(addDaysIso(date, delta));
    else if (view === "week") setDate(addDaysIso(date, delta * 7));
    else {
      const d = new Date(`${date}T00:00:00`);
      d.setMonth(d.getMonth() + delta);
      setDate(d.toISOString().slice(0, 10));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Appointments</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage bookings and today&apos;s schedule.</p>
        </div>
        <Button onClick={() => setBookingOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          New appointment
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Today" value={String(todayCount)} hint="appointments" />
        <StatCard label="In progress" value={String(inProgressCount)} hint="right now" />
        <StatCard label="Completed today" value={String(completedToday)} />
        <StatCard label="Pending" value={String(pendingCount)} hint="need confirmation" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CalendarControls
          view={view}
          onViewChange={setView}
          date={date}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToday={() => setDate(todayIso())}
        />
        <Select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="w-full sm:w-56">
          <option value="all">All barbers</option>
          {staff.filter((s) => s.active).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      {view === "day" && <DayView date={date} staffFilter={staffFilter} onSelect={setSelected} />}
      {view === "week" && (
        <WeekView
          date={date}
          staffFilter={staffFilter}
          onSelect={setSelected}
          onSelectDay={(day) => {
            setDate(day);
            setView("day");
          }}
        />
      )}
      {view === "month" && (
        <MonthView
          date={date}
          staffFilter={staffFilter}
          onSelectDay={(day) => {
            setDate(day);
            setView("day");
          }}
        />
      )}

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaultDate={date} />
      <AppointmentDetailModal appointment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
