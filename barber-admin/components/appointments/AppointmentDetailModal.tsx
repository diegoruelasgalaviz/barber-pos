"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useDataStore } from "@/lib/data-store";
import { appointmentEndTime } from "@/lib/scheduling";
import { formatCurrency, formatDateLong, formatTime, STATUS_LABEL, STATUS_TRANSITIONS } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export function AppointmentDetailModal({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) {
  const { customers, services, staff, updateAppointmentStatus } = useDataStore();

  if (!appointment) return null;

  const customer = customers.find((c) => c.id === appointment.customerId);
  const service = services.find((s) => s.id === appointment.serviceId);
  const staffMember = staff.find((s) => s.id === appointment.staffId);
  const transitions = STATUS_TRANSITIONS[appointment.status];

  return (
    <Modal open={!!appointment} onClose={onClose} title="Appointment details">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {customer ? `${customer.firstName} ${customer.lastName}` : "Unknown customer"}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{service?.name}</p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-zinc-500">Date</dt>
          <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">{formatDateLong(appointment.date)}</dd>
          <dt className="text-zinc-500">Time</dt>
          <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">
            {formatTime(appointment.startTime)} – {formatTime(appointmentEndTime(appointment))}
          </dd>
          <dt className="text-zinc-500">Barber</dt>
          <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">{staffMember?.name}</dd>
          <dt className="text-zinc-500">Price</dt>
          <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">{service && formatCurrency(service.price)}</dd>
          {customer && (
            <>
              <dt className="text-zinc-500">Phone</dt>
              <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">{customer.phone || "—"}</dd>
            </>
          )}
        </dl>

        {appointment.notes && (
          <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
            {appointment.notes}
          </div>
        )}

        {customer && (
          <Link
            href={`/customers/${customer.id}`}
            onClick={onClose}
            className="inline-block text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            View customer profile →
          </Link>
        )}

        {transitions.length > 0 && (
          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Update status</p>
            <div className="flex flex-wrap gap-2">
              {transitions.map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant={next === "cancelled" || next === "no-show" ? "outline" : "secondary"}
                  onClick={() => {
                    updateAppointmentStatus(appointment.id, next);
                    onClose();
                  }}
                >
                  Mark {STATUS_LABEL[next]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
