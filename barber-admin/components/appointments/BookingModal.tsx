"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useDataStore } from "@/lib/data-store";
import { getAvailableSlots } from "@/lib/scheduling";
import { cn, formatDateLong, formatTime, todayIso } from "@/lib/utils";
import { CheckIcon, SearchIcon } from "@/components/icons";

const STEPS = ["Customer", "Service", "Barber & time", "Confirm"] as const;

export function BookingModal({
  open,
  onClose,
  defaultDate,
  defaultStaffId,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultStaffId?: string;
}) {
  const { customers, services, staff, appointments, addAppointment, addCustomer } = useDataStore();
  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(defaultStaffId ?? null);
  const [date, setDate] = useState(defaultDate ?? todayIso());
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;
  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const selectedStaff = staff.find((s) => s.id === staffId) ?? null;

  const eligibleStaff = useMemo(
    () => staff.filter((s) => s.active && (!serviceId || s.serviceIds.includes(serviceId))),
    [staff, serviceId],
  );

  const slots = useMemo(() => {
    if (!selectedStaff || !selectedService) return [];
    return getAvailableSlots(selectedStaff, date, selectedService.durationMinutes, appointments);
  }, [selectedStaff, selectedService, date, appointments]);

  const filteredCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    if (!q) return customers.slice(0, 6);
    return customers
      .filter((c) => `${c.firstName} ${c.lastName} ${c.phone} ${c.email}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [customers, customerQuery]);

  function reset() {
    setStep(0);
    setCustomerId(null);
    setCustomerQuery("");
    setShowQuickAdd(false);
    setServiceId(null);
    setStaffId(defaultStaffId ?? null);
    setDate(defaultDate ?? todayIso());
    setTime(null);
    setNotes("");
    setDone(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function canProceed(): boolean {
    if (step === 0) return !!customerId;
    if (step === 1) return !!serviceId;
    if (step === 2) return !!staffId && !!time;
    return true;
  }

  function confirmBooking() {
    if (!customerId || !serviceId || !staffId || !time || !selectedService) return;
    addAppointment({
      customerId,
      serviceId,
      staffId,
      date,
      startTime: time,
      durationMinutes: selectedService.durationMinutes,
      notes: notes.trim() || undefined,
      status: "pending",
    });
    setDone(true);
  }

  return (
    <Modal open={open} onClose={handleClose} title="New appointment" wide>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckIcon className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Booked {selectedCustomer?.firstName} {selectedCustomer?.lastName} for {selectedService?.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDateLong(date)} at {time && formatTime(time)} with {selectedStaff?.name}
          </p>
          <Button onClick={handleClose} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <div>
          {/* Step indicator */}
          <div className="mb-5 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    i === step
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : i < step
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800",
                  )}
                >
                  {i < step ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn("hidden text-xs font-medium sm:inline", i === step ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400")}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-3">
              {!showQuickAdd ? (
                <>
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <TextInput
                      className="pl-9"
                      placeholder="Search customers by name or phone…"
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCustomerId(c.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm",
                          customerId === c.id
                            ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                            : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60",
                        )}
                      >
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {c.firstName} {c.lastName}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.phone || c.email}</span>
                      </button>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <p className="px-1 py-2 text-sm text-zinc-500">No matches.</p>
                    )}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowQuickAdd(true)}>
                    + Quick-add new customer
                  </Button>
                </>
              ) : (
                <div>
                  <CustomerForm
                    submitLabel="Add & continue"
                    onCancel={() => setShowQuickAdd(false)}
                    onSubmit={async (values) => {
                      const c = await addCustomer(values);
                      setCustomerId(c.id);
                      setShowQuickAdd(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left",
                    serviceId === s.id
                      ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60",
                  )}
                >
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {s.durationMinutes} min · ${s.price}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Date">
                <TextInput type="date" value={date} onChange={(e) => { setDate(e.target.value); setTime(null); }} />
              </Field>
              <Field label="Barber">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {eligibleStaff.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setStaffId(s.id); setTime(null); }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm",
                        staffId === s.id
                          ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60",
                      )}
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                  {eligibleStaff.length === 0 && (
                    <p className="col-span-full text-sm text-zinc-500">No staff offer this service.</p>
                  )}
                </div>
              </Field>
              {selectedStaff && selectedService && (
                <Field label="Available times">
                  {slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 text-xs font-medium",
                            time === t
                              ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                              : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60",
                          )}
                        >
                          {formatTime(t)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No open slots that day — try another date or barber.</p>
                  )}
                </Field>
              )}
            </div>
          )}

          {step === 3 && selectedCustomer && selectedService && selectedStaff && time && (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <dl className="space-y-1.5">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Customer</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Service</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {selectedService.name} (${selectedService.price})
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Barber</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">{selectedStaff.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">When</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatDateLong(date)}, {formatTime(time)}
                    </dd>
                  </div>
                </dl>
              </div>
              <Field label="Notes (optional)">
                <TextArea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the barber should know…" />
              </Field>
            </div>
          )}

          <div className="mt-5 flex justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}>
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={confirmBooking}>
                Confirm booking
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
