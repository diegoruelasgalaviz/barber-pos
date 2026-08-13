"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBooking } from "@/lib/booking-context";
import { BARBERS, DISCOUNTS, SERVICES, generateTimeSlots } from "@/lib/mock-data";
import type { Appointment, PaymentMethod } from "@/lib/types";
import { addDaysIso, cn, formatCurrency, formatDateLong, formatTime, todayIso } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";

const STEPS_GUEST = ["Service", "Barber", "Date & Time", "Your Info", "Payment", "Confirm"];
const STEPS_ACCOUNT = ["Service", "Barber", "Date & Time", "Payment", "Confirm"];

const UPCOMING_DAYS = Array.from({ length: 7 }, (_, i) => addDaysIso(todayIso(), i));

export function BookingWizard() {
  const { user, status } = useAuth();
  const { addAppointment } = useBooking();
  const steps = status === "authenticated" ? STEPS_ACCOUNT : STEPS_GUEST;

  const [stepIndex, setStepIndex] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(UPCOMING_DAYS[0]);
  const [time, setTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [discountId, setDiscountId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId), [serviceId]);
  const barber = useMemo(() => BARBERS.find((b) => b.id === barberId), [barberId]);
  const discount = useMemo(() => DISCOUNTS.find((d) => d.id === discountId), [discountId]);
  const eligibleBarbers = useMemo(
    () => (serviceId ? BARBERS.filter((b) => b.serviceIds.includes(serviceId)) : BARBERS),
    [serviceId],
  );
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const total = service ? service.price - (discount ? (service.price * discount.percentOff) / 100 : 0) : 0;

  // Maps the step label at stepIndex to the underlying case, since the guest
  // flow has an extra "Your Info" step that the account flow skips.
  const currentStep = steps[stepIndex];

  const canProceed = (() => {
    switch (currentStep) {
      case "Service":
        return !!serviceId;
      case "Barber":
        return !!barberId;
      case "Date & Time":
        return !!date && !!time;
      case "Your Info":
        return guestName.trim().length > 1 && guestContact.trim().length > 3;
      case "Payment":
        return !!paymentMethod;
      default:
        return true;
    }
  })();

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleConfirm = () => {
    if (!service || !barber || !date || !time || !paymentMethod) return;
    const appointment = addAppointment({
      customerId: user?.id ?? null,
      guestName: status === "authenticated" ? undefined : guestName,
      guestContact: status === "authenticated" ? undefined : guestContact,
      barberId: barber.id,
      serviceId: service.id,
      date,
      startTime: time,
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "paid" : "due-at-shop",
      discountId: discount?.id,
    });
    setConfirmedAppointment(appointment);
  };

  if (confirmedAppointment && service && barber) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/10">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Appointment confirmed</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          We&apos;ll see you {formatDateLong(confirmedAppointment.date)} at {formatTime(confirmedAppointment.startTime)}.
        </p>
        <Card className="mt-6 text-left">
          <CardBody className="space-y-2 text-sm">
            <Row label="Service" value={service.name} />
            <Row label="Barber" value={barber.name} />
            <Row label="Date" value={formatDateLong(confirmedAppointment.date)} />
            <Row label="Time" value={formatTime(confirmedAppointment.startTime)} />
            <Row
              label="Payment"
              value={
                confirmedAppointment.paymentMethod === "online"
                  ? "Paid online"
                  : "Cash — pay at the shop"
              }
            />
            {discount && <Row label="Discount" value={`${discount.title} (-${discount.percentOff}%)`} />}
            <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardBody>
        </Card>
        <div className="mt-6 flex justify-center gap-3">
          {status === "authenticated" ? (
            <Link href="/appointments">
              <Button>View My Appointments</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button>Create an account</Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ol className="mb-8 flex flex-wrap items-center gap-2 text-xs font-medium">
        {steps.map((step, i) => (
          <li
            key={step}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5",
              i === stepIndex
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : i < stepIndex
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
            )}
          >
            {i < stepIndex ? "✓" : i + 1}. {step}
          </li>
        ))}
      </ol>

      {currentStep === "Service" && (
        <StepCard title="Choose a service">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  serviceId === s.id
                    ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{s.name}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(s.price)}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{s.description}</p>
                <p className="mt-1 text-xs text-zinc-400">{s.durationMinutes} min</p>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {currentStep === "Barber" && (
        <StepCard title="Choose a barber">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {eligibleBarbers.map((b) => (
              <button
                key={b.id}
                onClick={() => setBarberId(b.id)}
                className={cn(
                  "flex flex-col items-center rounded-xl border p-4 text-center transition-colors",
                  barberId === b.id
                    ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
                )}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: b.color }}
                >
                  {b.photoInitials}
                </span>
                <span className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">{b.name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{b.title}</span>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {currentStep === "Date & Time" && (
        <StepCard title="Pick a date and time">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {UPCOMING_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-2 text-sm font-medium",
                  date === d
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300",
                )}
              >
                {formatDateLong(d).split(",")[0]}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium",
                  time === t
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300",
                )}
              >
                {formatTime(t)}
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {currentStep === "Your Info" && (
        <StepCard title="Your contact info">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Jamie Rivera" />
            </Field>
            <Field label="Phone or email">
              <TextInput
                value={guestContact}
                onChange={(e) => setGuestContact(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </Field>
          </div>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Want appointment history and member discounts?{" "}
            <Link href="/register" className="font-medium underline">
              Create an account
            </Link>{" "}
            instead.
          </p>
        </StepCard>
      )}

      {currentStep === "Payment" && (
        <StepCard title="Payment method">
          {status === "authenticated" && DISCOUNTS.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">Apply a discount (optional)</p>
              <div className="flex flex-wrap gap-2">
                {DISCOUNTS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDiscountId(discountId === d.id ? null : d.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      discountId === d.id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    {d.title} · {d.percentOff}% off
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => setPaymentMethod("online")}
              className={cn(
                "rounded-xl border p-4 text-left",
                paymentMethod === "online"
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800",
              )}
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-50">Pay online</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Card payment, charged now.</p>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "rounded-xl border p-4 text-left",
                paymentMethod === "cash"
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800",
              )}
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-50">Pay at the shop</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Cash payment when you arrive.</p>
            </button>
          </div>
          {service && (
            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              <span>Total due{discount ? " (after discount)" : ""}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          )}
        </StepCard>
      )}

      {currentStep === "Confirm" && service && barber && (
        <StepCard title="Review and confirm">
          <div className="space-y-2 text-sm">
            <Row label="Service" value={`${service.name} (${service.durationMinutes} min)`} />
            <Row label="Barber" value={barber.name} />
            <Row label="Date" value={formatDateLong(date)} />
            <Row label="Time" value={time ? formatTime(time) : "—"} />
            {status !== "authenticated" && <Row label="Name" value={guestName} />}
            {status !== "authenticated" && <Row label="Contact" value={guestContact} />}
            <Row label="Payment" value={paymentMethod === "online" ? "Pay online" : "Pay at shop (cash)"} />
            {discount && <Row label="Discount" value={`${discount.title} (-${discount.percentOff}%)`} />}
            <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </StepCard>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          Back
        </Button>
        {currentStep === "Confirm" ? (
          <Button onClick={handleConfirm}>Confirm Appointment</Button>
        ) : (
          <Button onClick={goNext} disabled={!canProceed}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        {children}
      </CardBody>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  );
}
