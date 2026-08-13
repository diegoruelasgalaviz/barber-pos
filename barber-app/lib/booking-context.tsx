"use client";

// Backed by the real barber-backend API (see lib/api.ts). The backend's
// Appointment model uses a richer status set (pending/confirmed/in-progress/
// completed/cancelled/no-show, shared with barber-admin) — mapStatus below
// collapses that down to the simplified customer-facing status this app
// displays (upcoming/completed/cancelled).

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Appointment, AppointmentStatus, PaymentMethod, PaymentStatus } from "./types";
import { api } from "./api";

interface AppointmentApiDto {
  id: string;
  customerId: string | null;
  guestName: string | null;
  guestContact: string | null;
  staffId: string;
  serviceId: string;
  date: string;
  startTime: string;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  discountId: string | null;
  createdAt: string;
}

function mapStatus(status: string): AppointmentStatus {
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "no-show") return "cancelled";
  return "upcoming"; // pending, confirmed, in-progress
}

function fromApi(dto: AppointmentApiDto): Appointment {
  return {
    id: dto.id,
    customerId: dto.customerId,
    guestName: dto.guestName ?? undefined,
    guestContact: dto.guestContact ?? undefined,
    barberId: dto.staffId,
    serviceId: dto.serviceId,
    date: dto.date,
    startTime: dto.startTime,
    status: mapStatus(dto.status),
    paymentMethod: dto.paymentMethod,
    paymentStatus: dto.paymentStatus,
    discountId: dto.discountId ?? undefined,
    createdAt: dto.createdAt,
  };
}

interface BookingContextValue {
  appointments: Appointment[];
  addAppointment: (
    appointment: Omit<Appointment, "id" | "createdAt" | "status"> & { durationMinutes?: number },
  ) => Promise<Appointment>;
  appointmentsForCustomer: (customerId: string) => Appointment[];
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api
      .get<AppointmentApiDto[]>("/api/appointments")
      .then((dtos) => setAppointments(dtos.map(fromApi)))
      .catch(() => {});
  }, []);

  const addAppointment = useCallback<BookingContextValue["addAppointment"]>(async (input) => {
    const dto = await api.post<AppointmentApiDto>("/api/appointments", {
      customerId: input.customerId,
      guestName: input.guestName,
      guestContact: input.guestContact,
      staffId: input.barberId,
      serviceId: input.serviceId,
      date: input.date,
      startTime: input.startTime,
      durationMinutes: input.durationMinutes,
      status: "pending",
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      discountId: input.discountId,
    });
    const appointment = fromApi(dto);
    setAppointments((prev) => [appointment, ...prev]);
    return appointment;
  }, []);

  const appointmentsForCustomer = useCallback(
    (customerId: string) => appointments.filter((a) => a.customerId === customerId),
    [appointments],
  );

  const value = useMemo(
    () => ({ appointments, addAppointment, appointmentsForCustomer }),
    [appointments, addAppointment, appointmentsForCustomer],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
