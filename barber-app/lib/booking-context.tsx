"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { Appointment } from "./types";
import { SEED_APPOINTMENTS } from "./mock-data";

const STORE_KEY = "barber_app_appointments";

let cache: Appointment[] | undefined;
const listeners = new Set<() => void>();

function read(): Appointment[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : SEED_APPOINTMENTS;
  } catch {
    return SEED_APPOINTMENTS;
  }
}

function getSnapshot(): Appointment[] {
  if (cache === undefined) cache = read();
  return cache;
}

function getServerSnapshot(): Appointment[] {
  return SEED_APPOINTMENTS;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function write(appointments: Appointment[]) {
  cache = appointments;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(appointments));
  listeners.forEach((l) => l());
}

interface BookingContextValue {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "status">) => Appointment;
  appointmentsForCustomer: (customerId: string) => Appointment[];
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const appointments = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addAppointment = useCallback((input: Omit<Appointment, "id" | "createdAt" | "status">) => {
    const appointment: Appointment = {
      ...input,
      id: `apt-${Date.now()}`,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };
    write([appointment, ...getSnapshot()]);
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
