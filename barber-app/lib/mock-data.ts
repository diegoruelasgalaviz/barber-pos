import type { Appointment, Barber, Discount, Service } from "./types";
import { addDaysIso, todayIso } from "./utils";

export const SERVICES: Service[] = [
  { id: "svc-classic", name: "Classic Haircut", description: "Scissor or clipper cut, styled to finish.", durationMinutes: 30, price: 28 },
  { id: "svc-fade", name: "Skin Fade", description: "Precision fade with clean blend.", durationMinutes: 45, price: 35 },
  { id: "svc-beard", name: "Beard Trim & Shape", description: "Line-up and shape with hot towel finish.", durationMinutes: 20, price: 18 },
  { id: "svc-combo", name: "Cut + Beard Combo", description: "Full haircut plus beard trim.", durationMinutes: 60, price: 48 },
  { id: "svc-kids", name: "Kids Haircut", description: "Ages 12 and under.", durationMinutes: 25, price: 20 },
  { id: "svc-hotshave", name: "Hot Towel Shave", description: "Traditional straight razor shave.", durationMinutes: 30, price: 32 },
];

export const BARBERS: Barber[] = [
  { id: "brb-1", name: "Marco Reyes", title: "Owner / Master Barber", color: "#0ea5e9", photoInitials: "MR", serviceIds: ["svc-classic", "svc-fade", "svc-beard", "svc-combo", "svc-hotshave"] },
  { id: "brb-2", name: "Dana Okafor", title: "Senior Barber", color: "#a855f7", photoInitials: "DO", serviceIds: ["svc-classic", "svc-fade", "svc-combo", "svc-kids"] },
  { id: "brb-3", name: "Luis Fernández", title: "Barber", color: "#f97316", photoInitials: "LF", serviceIds: ["svc-classic", "svc-beard", "svc-combo", "svc-hotshave"] },
  { id: "brb-4", name: "Priya Nair", title: "Barber", color: "#22c55e", photoInitials: "PN", serviceIds: ["svc-classic", "svc-fade", "svc-kids"] },
];

export const DISCOUNTS: Discount[] = [
  { id: "disc-1", title: "Loyalty 15% Off", description: "15% off any service for returning members.", percentOff: 15, code: "LOYAL15", expiresAt: addDaysIso(todayIso(), 45) },
  { id: "disc-2", title: "Refer a Friend", description: "10% off your next visit when a friend books.", percentOff: 10, code: "FRIEND10", expiresAt: addDaysIso(todayIso(), 30) },
  { id: "disc-3", title: "Midweek Special", description: "20% off cuts booked Tuesday–Thursday.", percentOff: 20, code: "MIDWEEK20", expiresAt: addDaysIso(todayIso(), 20) },
];

export const MOCK_USERS = [
  {
    id: "cust-1",
    name: "Jordan Blake",
    email: "jordan@example.com",
    password: "password123",
    phone: "(555) 010-2938",
    avatarColor: "#0ea5e9",
  },
];

// Seed appointment history for the mock logged-in customer (cust-1).
export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-seed-1",
    customerId: "cust-1",
    barberId: "brb-1",
    serviceId: "svc-fade",
    date: addDaysIso(todayIso(), 5),
    startTime: "14:00",
    status: "upcoming",
    paymentMethod: "cash",
    paymentStatus: "due-at-shop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt-seed-2",
    customerId: "cust-1",
    barberId: "brb-2",
    serviceId: "svc-combo",
    date: addDaysIso(todayIso(), -10),
    startTime: "11:30",
    status: "completed",
    paymentMethod: "online",
    paymentStatus: "paid",
    discountId: "disc-1",
    createdAt: addDaysIso(todayIso(), -14),
  },
  {
    id: "apt-seed-3",
    customerId: "cust-1",
    barberId: "brb-1",
    serviceId: "svc-classic",
    date: addDaysIso(todayIso(), -30),
    startTime: "09:00",
    status: "completed",
    paymentMethod: "online",
    paymentStatus: "paid",
    createdAt: addDaysIso(todayIso(), -34),
  },
  {
    id: "apt-seed-4",
    customerId: "cust-1",
    barberId: "brb-3",
    serviceId: "svc-beard",
    date: addDaysIso(todayIso(), -3),
    startTime: "16:00",
    status: "cancelled",
    paymentMethod: "cash",
    paymentStatus: "due-at-shop",
    createdAt: addDaysIso(todayIso(), -6),
  },
];

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 19; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
