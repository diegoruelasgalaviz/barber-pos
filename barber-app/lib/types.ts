// Shared domain types for the barber-app customer-facing booking surface.
// These mirror the shapes returned by the real barber-backend API
// (see lib/api.ts, lib/catalog-context.tsx and lib/booking-context.tsx).

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface Barber {
  id: string;
  name: string;
  title: string;
  color: string;
  photoInitials: string;
  serviceIds: string[];
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type PaymentMethod = "online" | "cash";

export type PaymentStatus = "paid" | "pending" | "due-at-shop";

export interface Appointment {
  id: string;
  customerId: string | null; // null for guest bookings
  guestName?: string;
  guestContact?: string;
  barberId: string;
  serviceId: string;
  date: string; // ISO date (yyyy-mm-dd)
  startTime: string; // HH:mm
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  discountId?: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  code: string;
  expiresAt: string; // ISO date
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}
