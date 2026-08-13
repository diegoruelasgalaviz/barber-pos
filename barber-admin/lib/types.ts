// Shared domain types for the barber-admin POS admin surface.
// These mirror the shapes returned by the real barber-backend API
// (see lib/api.ts and lib/data-store.tsx).

export type Role = "owner" | "admin" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  tags: string[];
  createdAt: string; // ISO date
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  category: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  color: string; // used for calendar chips
  serviceIds: string[];
  workingHours: WorkingHours;
  active: boolean;
}

export interface WorkingHours {
  // 0 = Sunday ... 6 = Saturday
  [dayOfWeek: number]: { start: string; end: string; closed: boolean };
}

export interface Appointment {
  id: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string; // ISO date (yyyy-mm-dd)
  startTime: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  unitCost: number;
  unitPrice: number;
  supplier: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  delta: number;
  reason: string;
  createdAt: string;
}

export interface BusinessProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  hours: WorkingHours;
}

export interface NotificationPrefs {
  emailReminders: boolean;
  smsReminders: boolean;
  reminderLeadHours: number;
  newBookingAlerts: boolean;
  lowStockAlerts: boolean;
}

export interface PaymentTaxSettings {
  currency: string;
  taxRate: number;
  acceptsCard: boolean;
  acceptsCash: boolean;
  tippingEnabled: boolean;
  defaultTipPercents: number[];
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: "marketing" | "loyalty" | "booking" | "payments";
  enabled: boolean;
  configured: boolean;
}
