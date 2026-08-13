"use client";

import { useDataStore } from "@/lib/data-store";
import { StatusBadge } from "@/components/ui/Badge";
import { appointmentEndTime } from "@/lib/scheduling";
import { formatTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export function AppointmentCard({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  const { customers, services, staff } = useDataStore();
  const customer = customers.find((c) => c.id === appointment.customerId);
  const service = services.find((s) => s.id === appointment.serviceId);
  const staffMember = staff.find((s) => s.id === appointment.staffId);

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <span className="h-full w-1 shrink-0 self-stretch rounded-full" style={{ backgroundColor: staffMember?.color ?? "#a1a1aa" }} />
      <div className="w-16 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <div>{formatTime(appointment.startTime)}</div>
        <div className="text-zinc-400">{formatTime(appointmentEndTime(appointment))}</div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {customer ? `${customer.firstName} ${customer.lastName}` : "Unknown customer"}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {service?.name} · {staffMember?.name}
        </p>
      </div>
      <StatusBadge status={appointment.status} />
    </button>
  );
}
