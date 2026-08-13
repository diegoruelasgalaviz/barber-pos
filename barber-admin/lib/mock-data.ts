import type {
  Appointment,
  AuthUser,
  BusinessProfile,
  Customer,
  NotificationPrefs,
  PaymentTaxSettings,
  Plugin,
  Product,
  Service,
  StaffMember,
  WorkingHours,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const standardHours: WorkingHours = {
  0: { start: "10:00", end: "16:00", closed: true },
  1: { start: "09:00", end: "18:00", closed: false },
  2: { start: "09:00", end: "18:00", closed: false },
  3: { start: "09:00", end: "18:00", closed: false },
  4: { start: "09:00", end: "19:00", closed: false },
  5: { start: "09:00", end: "19:00", closed: false },
  6: { start: "09:00", end: "17:00", closed: false },
};

// ---------------------------------------------------------------------------
// Auth users (mocked accounts, one per role). Password for all is "password".
// ---------------------------------------------------------------------------

export const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "u-owner",
    name: "Dana Reyes",
    email: "owner@fadedlines.com",
    role: "owner",
    avatarColor: "#7c3aed",
    password: "password",
  },
  {
    id: "u-admin",
    name: "Marcus Ohl",
    email: "admin@fadedlines.com",
    role: "admin",
    avatarColor: "#2563eb",
    password: "password",
  },
  {
    id: "u-staff",
    name: "Priya Nandan",
    email: "staff@fadedlines.com",
    role: "staff",
    avatarColor: "#059669",
    password: "password",
  },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES: Service[] = [
  { id: "svc-1", name: "Classic Haircut", durationMinutes: 30, price: 35, category: "Hair" },
  { id: "svc-2", name: "Skin Fade", durationMinutes: 45, price: 45, category: "Hair" },
  { id: "svc-3", name: "Beard Trim", durationMinutes: 20, price: 20, category: "Beard" },
  { id: "svc-4", name: "Hot Towel Shave", durationMinutes: 30, price: 30, category: "Beard" },
  { id: "svc-5", name: "Haircut + Beard Combo", durationMinutes: 60, price: 55, category: "Combo" },
  { id: "svc-6", name: "Kids Haircut", durationMinutes: 25, price: 25, category: "Hair" },
  { id: "svc-7", name: "Hair Color", durationMinutes: 90, price: 85, category: "Color" },
  { id: "svc-8", name: "Line Up", durationMinutes: 15, price: 15, category: "Hair" },
];

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export const STAFF: StaffMember[] = [
  {
    id: "staff-1",
    name: "Marcus Ohl",
    email: "admin@fadedlines.com",
    role: "admin",
    title: "Shop Manager / Senior Barber",
    color: "#2563eb",
    serviceIds: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5", "svc-8"],
    workingHours: standardHours,
    active: true,
  },
  {
    id: "staff-2",
    name: "Priya Nandan",
    email: "staff@fadedlines.com",
    role: "staff",
    title: "Barber",
    color: "#059669",
    serviceIds: ["svc-1", "svc-2", "svc-5", "svc-6", "svc-7", "svc-8"],
    workingHours: standardHours,
    active: true,
  },
  {
    id: "staff-3",
    name: "Jamal Kessler",
    email: "jamal@fadedlines.com",
    role: "staff",
    title: "Barber",
    color: "#dc2626",
    serviceIds: ["svc-1", "svc-3", "svc-4", "svc-5", "svc-8"],
    workingHours: {
      ...standardHours,
      0: { start: "10:00", end: "16:00", closed: true },
      1: { start: "09:00", end: "18:00", closed: true },
    },
    active: true,
  },
  {
    id: "staff-4",
    name: "Lena Fischer",
    email: "lena@fadedlines.com",
    role: "staff",
    title: "Junior Barber",
    color: "#d97706",
    serviceIds: ["svc-1", "svc-3", "svc-6", "svc-8"],
    workingHours: standardHours,
    active: false,
  },
];

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    firstName: "Alex",
    lastName: "Torres",
    email: "alex.torres@example.com",
    phone: "(555) 201-3344",
    notes: "Prefers scissor-over-comb, no clippers on top.",
    tags: ["regular", "VIP"],
    createdAt: isoDateOffset(-210),
  },
  {
    id: "cust-2",
    firstName: "Brianna",
    lastName: "Kim",
    email: "b.kim@example.com",
    phone: "(555) 484-2210",
    notes: "Allergic to certain pomades - check before applying product.",
    tags: ["regular"],
    createdAt: isoDateOffset(-180),
  },
  {
    id: "cust-3",
    firstName: "Carlos",
    lastName: "Mendes",
    email: "carlos.mendes@example.com",
    phone: "(555) 933-1029",
    notes: "",
    tags: ["new"],
    createdAt: isoDateOffset(-9),
  },
  {
    id: "cust-4",
    firstName: "Deja",
    lastName: "Williams",
    email: "deja.w@example.com",
    phone: "(555) 610-7788",
    notes: "Brings her son (Kids Haircut) most visits.",
    tags: ["regular", "family"],
    createdAt: isoDateOffset(-140),
  },
  {
    id: "cust-5",
    firstName: "Ethan",
    lastName: "Brooks",
    email: "ethan.brooks@example.com",
    phone: "(555) 322-9981",
    notes: "",
    tags: [],
    createdAt: isoDateOffset(-60),
  },
  {
    id: "cust-6",
    firstName: "Farrah",
    lastName: "Odom",
    email: "farrah.odom@example.com",
    phone: "(555) 774-5521",
    notes: "Color client - patch test required 48h before appointment.",
    tags: ["color", "VIP"],
    createdAt: isoDateOffset(-300),
  },
  {
    id: "cust-7",
    firstName: "Gavin",
    lastName: "Petit",
    email: "gavin.petit@example.com",
    phone: "(555) 118-4432",
    notes: "",
    tags: ["new"],
    createdAt: isoDateOffset(-3),
  },
  {
    id: "cust-8",
    firstName: "Hana",
    lastName: "Suzuki",
    email: "hana.suzuki@example.com",
    phone: "(555) 663-9012",
    notes: "Books every 3 weeks like clockwork.",
    tags: ["regular"],
    createdAt: isoDateOffset(-260),
  },
];

// ---------------------------------------------------------------------------
// Appointments - spread across last week, today, and next two weeks so the
// day/week/month calendar views all have something to show.
// ---------------------------------------------------------------------------

export const APPOINTMENTS: Appointment[] = [
  // Today
  { id: "appt-1", customerId: "cust-1", staffId: "staff-1", serviceId: "svc-2", date: isoDateOffset(0), startTime: "09:00", durationMinutes: 45, status: "completed", createdAt: isoDateOffset(-5) },
  { id: "appt-2", customerId: "cust-3", staffId: "staff-2", serviceId: "svc-1", date: isoDateOffset(0), startTime: "10:00", durationMinutes: 30, status: "completed", createdAt: isoDateOffset(-2) },
  { id: "appt-3", customerId: "cust-4", staffId: "staff-3", serviceId: "svc-5", date: isoDateOffset(0), startTime: "11:00", durationMinutes: 60, status: "in-progress", createdAt: isoDateOffset(-4) },
  { id: "appt-4", customerId: "cust-6", staffId: "staff-2", serviceId: "svc-7", date: isoDateOffset(0), startTime: "13:00", durationMinutes: 90, status: "confirmed", createdAt: isoDateOffset(-6) },
  { id: "appt-5", customerId: "cust-5", staffId: "staff-1", serviceId: "svc-3", date: isoDateOffset(0), startTime: "14:30", durationMinutes: 20, status: "confirmed", createdAt: isoDateOffset(-1) },
  { id: "appt-6", customerId: "cust-7", staffId: "staff-3", serviceId: "svc-1", date: isoDateOffset(0), startTime: "15:30", durationMinutes: 30, status: "pending", notes: "First-time client, requested Jamal by name.", createdAt: isoDateOffset(0) },
  { id: "appt-7", customerId: "cust-2", staffId: "staff-2", serviceId: "svc-2", date: isoDateOffset(0), startTime: "16:30", durationMinutes: 45, status: "pending", createdAt: isoDateOffset(0) },

  // Yesterday / this week (past)
  { id: "appt-8", customerId: "cust-8", staffId: "staff-1", serviceId: "svc-5", date: isoDateOffset(-1), startTime: "10:00", durationMinutes: 60, status: "completed", createdAt: isoDateOffset(-7) },
  { id: "appt-9", customerId: "cust-2", staffId: "staff-3", serviceId: "svc-4", date: isoDateOffset(-1), startTime: "12:00", durationMinutes: 30, status: "no-show", createdAt: isoDateOffset(-7) },
  { id: "appt-10", customerId: "cust-1", staffId: "staff-2", serviceId: "svc-1", date: isoDateOffset(-2), startTime: "09:30", durationMinutes: 30, status: "completed", createdAt: isoDateOffset(-8) },
  { id: "appt-11", customerId: "cust-5", staffId: "staff-1", serviceId: "svc-8", date: isoDateOffset(-3), startTime: "15:00", durationMinutes: 15, status: "cancelled", notes: "Customer rescheduled to next week.", createdAt: isoDateOffset(-9) },
  { id: "appt-12", customerId: "cust-4", staffId: "staff-2", serviceId: "svc-6", date: isoDateOffset(-4), startTime: "11:30", durationMinutes: 25, status: "completed", createdAt: isoDateOffset(-10) },

  // Tomorrow / rest of this week (future)
  { id: "appt-13", customerId: "cust-3", staffId: "staff-1", serviceId: "svc-2", date: isoDateOffset(1), startTime: "09:00", durationMinutes: 45, status: "confirmed", createdAt: isoDateOffset(-1) },
  { id: "appt-14", customerId: "cust-6", staffId: "staff-2", serviceId: "svc-5", date: isoDateOffset(1), startTime: "10:30", durationMinutes: 60, status: "confirmed", createdAt: isoDateOffset(-2) },
  { id: "appt-15", customerId: "cust-8", staffId: "staff-3", serviceId: "svc-3", date: isoDateOffset(1), startTime: "13:00", durationMinutes: 20, status: "pending", createdAt: isoDateOffset(0) },
  { id: "appt-16", customerId: "cust-7", staffId: "staff-1", serviceId: "svc-1", date: isoDateOffset(2), startTime: "09:30", durationMinutes: 30, status: "confirmed", createdAt: isoDateOffset(0) },
  { id: "appt-17", customerId: "cust-2", staffId: "staff-2", serviceId: "svc-7", date: isoDateOffset(2), startTime: "11:00", durationMinutes: 90, status: "pending", createdAt: isoDateOffset(0) },
  { id: "appt-18", customerId: "cust-1", staffId: "staff-3", serviceId: "svc-4", date: isoDateOffset(3), startTime: "14:00", durationMinutes: 30, status: "confirmed", createdAt: isoDateOffset(-1) },
  { id: "appt-19", customerId: "cust-5", staffId: "staff-1", serviceId: "svc-5", date: isoDateOffset(4), startTime: "10:00", durationMinutes: 60, status: "pending", createdAt: isoDateOffset(0) },
  { id: "appt-20", customerId: "cust-4", staffId: "staff-2", serviceId: "svc-6", date: isoDateOffset(5), startTime: "12:00", durationMinutes: 25, status: "confirmed", createdAt: isoDateOffset(-2) },
  { id: "appt-21", customerId: "cust-3", staffId: "staff-3", serviceId: "svc-8", date: isoDateOffset(7), startTime: "09:00", durationMinutes: 15, status: "confirmed", createdAt: isoDateOffset(-1) },
  { id: "appt-22", customerId: "cust-8", staffId: "staff-1", serviceId: "svc-2", date: isoDateOffset(10), startTime: "15:00", durationMinutes: 45, status: "pending", createdAt: isoDateOffset(0) },
  { id: "appt-23", customerId: "cust-6", staffId: "staff-2", serviceId: "svc-7", date: isoDateOffset(14), startTime: "11:00", durationMinutes: 90, status: "pending", createdAt: isoDateOffset(0) },
];

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const PRODUCTS: Product[] = [
  { id: "prod-1", name: "Matte Pomade 4oz", sku: "POM-MT-4", category: "Styling", stock: 18, lowStockThreshold: 8, unitCost: 4.5, unitPrice: 14, supplier: "GroomCo Supply" },
  { id: "prod-2", name: "Clipper Blade Oil", sku: "OIL-CLP-1", category: "Tools", stock: 5, lowStockThreshold: 6, unitCost: 2.1, unitPrice: 8, supplier: "BarberTech" },
  { id: "prod-3", name: "Disposable Razors (100ct)", sku: "RZR-DISP-100", category: "Consumables", stock: 3, lowStockThreshold: 5, unitCost: 9.0, unitPrice: 0, supplier: "BarberTech" },
  { id: "prod-4", name: "Beard Oil - Sandalwood", sku: "BRD-OIL-SW", category: "Beard Care", stock: 22, lowStockThreshold: 10, unitCost: 5.25, unitPrice: 18, supplier: "GroomCo Supply" },
  { id: "prod-5", name: "Neck Strips (500ct)", sku: "NCK-STR-500", category: "Consumables", stock: 40, lowStockThreshold: 15, unitCost: 6.0, unitPrice: 0, supplier: "ShopSupply Direct" },
  { id: "prod-6", name: "Hair Color Kit - Dark Brown", sku: "CLR-KIT-DB", category: "Color", stock: 4, lowStockThreshold: 5, unitCost: 11.0, unitPrice: 32, supplier: "TintWorks" },
  { id: "prod-7", name: "Sanitizing Solution 32oz", sku: "SAN-SOL-32", category: "Tools", stock: 9, lowStockThreshold: 4, unitCost: 7.75, unitPrice: 0, supplier: "BarberTech" },
  { id: "prod-8", name: "Styling Gel 8oz", sku: "GEL-STY-8", category: "Styling", stock: 14, lowStockThreshold: 8, unitCost: 3.6, unitPrice: 12, supplier: "GroomCo Supply" },
  { id: "prod-9", name: "Straight Razor Blades (10pk)", sku: "RZR-STR-10", category: "Tools", stock: 2, lowStockThreshold: 5, unitCost: 6.4, unitPrice: 0, supplier: "BarberTech" },
  { id: "prod-10", name: "Aftershave Balm 6oz", sku: "AFT-BLM-6", category: "Beard Care", stock: 17, lowStockThreshold: 8, unitCost: 4.0, unitPrice: 15, supplier: "GroomCo Supply" },
];

// ---------------------------------------------------------------------------
// Business profile, notifications, payments/tax, plugins
// ---------------------------------------------------------------------------

export const BUSINESS_PROFILE: BusinessProfile = {
  name: "Faded Lines Barbershop",
  address: "482 Maple Street",
  city: "Austin",
  state: "TX",
  zip: "78701",
  phone: "(512) 555-0142",
  email: "hello@fadedlines.com",
  website: "www.fadedlines.com",
  hours: standardHours,
};

export const NOTIFICATION_PREFS: NotificationPrefs = {
  emailReminders: true,
  smsReminders: true,
  reminderLeadHours: 24,
  newBookingAlerts: true,
  lowStockAlerts: true,
};

export const PAYMENT_TAX_SETTINGS: PaymentTaxSettings = {
  currency: "USD",
  taxRate: 8.25,
  acceptsCard: true,
  acceptsCash: true,
  tippingEnabled: true,
  defaultTipPercents: [15, 20, 25],
};

export const PLUGINS: Plugin[] = [
  {
    id: "plugin-loyalty",
    name: "Loyalty Points",
    description: "Reward repeat customers with points redeemable for discounts or free services.",
    category: "loyalty",
    enabled: true,
    configured: true,
  },
  {
    id: "plugin-sms",
    name: "SMS Marketing",
    description: "Send promotional campaigns and win-back messages to customers via text.",
    category: "marketing",
    enabled: false,
    configured: false,
  },
  {
    id: "plugin-widget",
    name: "Online Booking Widget",
    description: "Embed a self-service booking widget on your website and socials.",
    category: "booking",
    enabled: true,
    configured: false,
  },
  {
    id: "plugin-giftcards",
    name: "Gift Cards",
    description: "Sell and redeem digital gift cards in-store and online.",
    category: "payments",
    enabled: false,
    configured: false,
  },
  {
    id: "plugin-reviews",
    name: "Review Requests",
    description: "Automatically ask customers for a Google review after a completed visit.",
    category: "marketing",
    enabled: false,
    configured: false,
  },
];
