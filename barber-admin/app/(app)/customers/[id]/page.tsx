"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDataStore } from "@/lib/data-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { ChevronLeftIcon } from "@/components/icons";
import { appointmentEndTime } from "@/lib/scheduling";
import { formatDateLong, formatTime } from "@/lib/utils";

export default function CustomerProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { customers, appointments, services, staff, updateCustomer } = useDataStore();
  const [editOpen, setEditOpen] = useState(false);

  const customer = customers.find((c) => c.id === params.id);

  if (!customer) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
          <ChevronLeftIcon className="h-4 w-4" /> Back
        </button>
        <p className="text-sm text-zinc-500">Customer not found.</p>
      </div>
    );
  }

  const history = appointments
    .filter((a) => a.customerId === customer.id)
    .sort((a, b) => (a.date === b.date ? b.startTime.localeCompare(a.startTime) : b.date.localeCompare(a.date)));

  const totalSpent = history
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.price ?? 0), 0);

  return (
    <div className="space-y-5">
      <Link href="/customers" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        <ChevronLeftIcon className="h-4 w-4" /> All customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {customer.firstName} {customer.lastName}
          </h1>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {customer.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {customer.tags.length === 0 && <span className="text-sm text-zinc-400">No tags</span>}
          </div>
        </div>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          Edit customer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Contact info</p>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{customer.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{customer.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Customer since</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{formatDateLong(customer.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Lifetime spend</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">${totalSpent.toFixed(2)}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Notes</p>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{customer.notes || "No notes on file."}</p>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Appointment history</p>
            </CardHeader>
            <CardBody className="p-0">
              {history.length === 0 ? (
                <p className="p-4 text-sm text-zinc-500">No appointments yet.</p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {history.map((a) => {
                    const service = services.find((s) => s.id === a.serviceId);
                    const staffMember = staff.find((s) => s.id === a.staffId);
                    return (
                      <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{service?.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatDateLong(a.date)} · {formatTime(a.startTime)}–{formatTime(appointmentEndTime(a))} · {staffMember?.name}
                          </p>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit customer">
        <CustomerForm
          initial={customer}
          submitLabel="Save changes"
          onCancel={() => setEditOpen(false)}
          onSubmit={(values) => {
            updateCustomer(customer.id, values);
            setEditOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
