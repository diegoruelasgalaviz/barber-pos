"use client";

// Backed by the real barber-backend API (see lib/api.ts). Appointment and
// low-stock events arrive live over SignalR (lib/api.ts API_URL + /hubs/notifications)
// so barber-admin reacts to new bookings without polling the DB.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type {
  Appointment,
  AppointmentStatus,
  BusinessProfile,
  Customer,
  NotificationPrefs,
  PaymentTaxSettings,
  Plugin,
  Product,
  Service,
  StaffMember,
} from "./types";
import { api, API_URL } from "./api";

const EMPTY_BUSINESS_PROFILE: BusinessProfile = {
  name: "", address: "", city: "", state: "", zip: "", phone: "", email: "", website: "", hours: {},
};
const EMPTY_NOTIFICATION_PREFS: NotificationPrefs = {
  emailReminders: false, smsReminders: false, reminderLeadHours: 24, newBookingAlerts: true, lowStockAlerts: true,
};
const EMPTY_PAYMENT_TAX_SETTINGS: PaymentTaxSettings = {
  currency: "USD", taxRate: 0, acceptsCard: true, acceptsCash: true, tippingEnabled: true, defaultTipPercents: [],
};

interface DataStoreValue {
  appointments: Appointment[];
  customers: Customer[];
  staff: StaffMember[];
  services: Service[];
  products: Product[];
  businessProfile: BusinessProfile;
  notificationPrefs: NotificationPrefs;
  paymentTaxSettings: PaymentTaxSettings;
  plugins: Plugin[];
  toast: string | null;

  addAppointment: (input: Omit<Appointment, "id" | "createdAt" | "status"> & { status?: AppointmentStatus }) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;

  addCustomer: (input: Omit<Customer, "id" | "createdAt">) => Promise<Customer>;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;

  addStaff: (input: Omit<StaffMember, "id">) => Promise<StaffMember>;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;

  addService: (input: Omit<Service, "id">) => Promise<Service>;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;

  adjustStock: (productId: string, delta: number, reason: string) => void;
  addProduct: (input: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (id: string, patch: Partial<Product>) => void;

  updateBusinessProfile: (patch: Partial<BusinessProfile>) => void;
  updateNotificationPrefs: (patch: Partial<NotificationPrefs>) => void;
  updatePaymentTaxSettings: (patch: Partial<PaymentTaxSettings>) => void;
  togglePlugin: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(EMPTY_BUSINESS_PROFILE);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(EMPTY_NOTIFICATION_PREFS);
  const [paymentTaxSettings, setPaymentTaxSettings] = useState<PaymentTaxSettings>(EMPTY_PAYMENT_TAX_SETTINGS);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  // Initial load from the backend.
  useEffect(() => {
    api.get<Customer[]>("/api/customers").then(setCustomers).catch(() => {});
    api.get<StaffMember[]>("/api/staff").then(setStaff).catch(() => {});
    api.get<Service[]>("/api/services").then(setServices).catch(() => {});
    api.get<Product[]>("/api/products").then(setProducts).catch(() => {});
    api.get<Appointment[]>("/api/appointments").then(setAppointments).catch(() => {});
    api.get<BusinessProfile>("/api/settings/business-profile").then(setBusinessProfile).catch(() => {});
    api.get<NotificationPrefs>("/api/settings/notifications").then(setNotificationPrefs).catch(() => {});
    api.get<PaymentTaxSettings>("/api/settings/payment-tax").then(setPaymentTaxSettings).catch(() => {});
    api.get<Plugin[]>("/api/plugins").then(setPlugins).catch(() => {});
  }, []);

  // Live updates over WebSockets: a new booking (from barber-app or another
  // admin session) shows up here immediately, no polling / extra DB reads.
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/notifications`)
      .withAutomaticReconnect()
      .build();

    connection.on("newAppointment", (appt: Appointment) => {
      setAppointments((prev) => (prev.some((a) => a.id === appt.id) ? prev : [appt, ...prev]));
      showToast(`New booking: ${appt.date} ${appt.startTime}`);
    });
    connection.on("appointmentUpdated", (appt: Appointment) => {
      setAppointments((prev) => prev.map((a) => (a.id === appt.id ? appt : a)));
    });
    connection.on("lowStock", (product: Product) => {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      showToast(`Low stock: ${product.name} (${product.stock} left)`);
    });

    connection.start().catch(() => {});
    return () => {
      connection.stop();
    };
  }, [showToast]);

  const addAppointment = useCallback<DataStoreValue["addAppointment"]>(async (input) => {
    const appt = await api.post<Appointment>("/api/appointments", {
      ...input,
      status: input.status ?? "pending",
      paymentMethod: "cash",
      paymentStatus: "due-at-shop",
    });
    setAppointments((prev) => [appt, ...prev]);
    return appt;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const current = appointments.find((a) => a.id === id);
    if (!current) return;
    api.put<Appointment>(`/api/appointments/${id}`, { ...current, status }).catch(() => {});
  }, [appointments]);

  const updateAppointment = useCallback((id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    const current = appointments.find((a) => a.id === id);
    if (!current) return;
    api.put<Appointment>(`/api/appointments/${id}`, { ...current, ...patch }).catch(() => {});
  }, [appointments]);

  const addCustomer = useCallback<DataStoreValue["addCustomer"]>(async (input) => {
    const customer = await api.post<Customer>("/api/customers", input);
    setCustomers((prev) => [customer, ...prev]);
    return customer;
  }, []);

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const current = customers.find((c) => c.id === id);
    if (!current) return;
    api.put<Customer>(`/api/customers/${id}`, { ...current, ...patch }).catch(() => {});
  }, [customers]);

  const addStaff = useCallback<DataStoreValue["addStaff"]>(async (input) => {
    const member = await api.post<StaffMember>("/api/staff", input);
    setStaff((prev) => [...prev, member]);
    return member;
  }, []);

  const updateStaff = useCallback((id: string, patch: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    const current = staff.find((s) => s.id === id);
    if (!current) return;
    api.put<StaffMember>(`/api/staff/${id}`, { ...current, ...patch }).catch(() => {});
  }, [staff]);

  const addService = useCallback<DataStoreValue["addService"]>(async (input) => {
    const service = await api.post<Service>("/api/services", input);
    setServices((prev) => [...prev, service]);
    return service;
  }, []);

  const updateService = useCallback((id: string, patch: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    const current = services.find((s) => s.id === id);
    if (!current) return;
    api.put<Service>(`/api/services/${id}`, { ...current, ...patch }).catch(() => {});
  }, [services]);

  const removeService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    api.del(`/api/services/${id}`).catch(() => {});
  }, []);

  const adjustStock = useCallback((productId: string, delta: number, reason: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
    api.post(`/api/products/${productId}/adjustments`, { delta, reason }).catch(() => {});
  }, []);

  const addProduct = useCallback<DataStoreValue["addProduct"]>(async (input) => {
    const product = await api.post<Product>("/api/products", input);
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const current = products.find((p) => p.id === id);
    if (!current) return;
    api.put<Product>(`/api/products/${id}`, { ...current, ...patch }).catch(() => {});
  }, [products]);

  const updateBusinessProfile = useCallback((patch: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => {
      const next = { ...prev, ...patch };
      api.put<BusinessProfile>("/api/settings/business-profile", next).catch(() => {});
      return next;
    });
  }, []);

  const updateNotificationPrefs = useCallback((patch: Partial<NotificationPrefs>) => {
    setNotificationPrefs((prev) => {
      const next = { ...prev, ...patch };
      api.put<NotificationPrefs>("/api/settings/notifications", next).catch(() => {});
      return next;
    });
  }, []);

  const updatePaymentTaxSettings = useCallback((patch: Partial<PaymentTaxSettings>) => {
    setPaymentTaxSettings((prev) => {
      const next = { ...prev, ...patch };
      api.put<PaymentTaxSettings>("/api/settings/payment-tax", next).catch(() => {});
      return next;
    });
  }, []);

  const togglePlugin = useCallback((id: string) => {
    setPlugins((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const nextEnabled = !target.enabled;
      api.put(`/api/plugins/${id}`, { enabled: nextEnabled, configured: target.configured }).catch(() => {});
      return prev.map((p) => (p.id === id ? { ...p, enabled: nextEnabled } : p));
    });
  }, []);

  const value = useMemo<DataStoreValue>(
    () => ({
      appointments,
      customers,
      staff,
      services,
      products,
      businessProfile,
      notificationPrefs,
      paymentTaxSettings,
      plugins,
      toast,
      addAppointment,
      updateAppointmentStatus,
      updateAppointment,
      addCustomer,
      updateCustomer,
      addStaff,
      updateStaff,
      addService,
      updateService,
      removeService,
      adjustStock,
      addProduct,
      updateProduct,
      updateBusinessProfile,
      updateNotificationPrefs,
      updatePaymentTaxSettings,
      togglePlugin,
    }),
    [
      appointments,
      customers,
      staff,
      services,
      products,
      businessProfile,
      notificationPrefs,
      paymentTaxSettings,
      plugins,
      toast,
      addAppointment,
      updateAppointmentStatus,
      updateAppointment,
      addCustomer,
      updateCustomer,
      addStaff,
      updateStaff,
      addService,
      updateService,
      removeService,
      adjustStock,
      addProduct,
      updateProduct,
      updateBusinessProfile,
      updateNotificationPrefs,
      updatePaymentTaxSettings,
      togglePlugin,
    ],
  );

  return (
    <DataStoreContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-zinc-50 dark:text-zinc-900">
          {toast}
        </div>
      )}
    </DataStoreContext.Provider>
  );
}

export function useDataStore(): DataStoreValue {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within a DataStoreProvider");
  return ctx;
}
