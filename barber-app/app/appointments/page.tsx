"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { useBooking } from "@/lib/booking-context";
import { BARBERS, SERVICES } from "@/lib/mock-data";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PAYMENT_STATUS_LABEL, formatDateLong, formatTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

function AppointmentsList() {
  const { user } = useAuth();
  const { appointmentsForCustomer } = useBooking();
  const appointments = user ? appointmentsForCustomer(user.id) : [];

  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = appointments
    .filter((a) => a.status !== "upcoming")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">My Appointments</h1>
        <Link href="/book">
          <Button size="sm">Book Again</Button>
        </Link>
      </div>

      <Section title="Upcoming">
        {upcoming.length === 0 ? (
          <EmptyState />
        ) : (
          upcoming.map((apt) => <AppointmentRow key={apt.id} appointment={apt} />)
        )}
      </Section>

      <Section title="Past & Cancelled">
        {past.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No past appointments yet.</p>
        ) : (
          past.map((apt) => <AppointmentRow key={apt.id} appointment={apt} />)
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const service = SERVICES.find((s) => s.id === appointment.serviceId);
  const barber = BARBERS.find((b) => b.id === appointment.barberId);

  return (
    <Card>
      <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{service?.name ?? "Service"}</p>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {formatDateLong(appointment.date)} · {formatTime(appointment.startTime)} with {barber?.name ?? "Barber"}
          </p>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {PAYMENT_STATUS_LABEL[appointment.paymentStatus]}
        </p>
      </CardBody>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardBody className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        No upcoming appointments.{" "}
        <Link href="/book" className="font-medium underline">
          Book one now
        </Link>
        .
      </CardBody>
    </Card>
  );
}

export default function AppointmentsPage() {
  return (
    <RequireAuth>
      <AppointmentsList />
    </RequireAuth>
  );
}
