"use client";

// In-memory data store for the admin app. This stands in for the
// barber-backend API, which has no endpoints implemented yet. All reads
// and writes here are local to the browser session (seeded from
// lib/mock-data.ts) so every module can share one consistent, mutable
// "database" without needing a real backend. Swapping this out for real
// API calls later should only require changing the functions below.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
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
import {
  APPOINTMENTS,
  BUSINESS_PROFILE,
  CUSTOMERS,
  NOTIFICATION_PREFS,
  PAYMENT_TAX_SETTINGS,
  PLUGINS,
  PRODUCTS,
  SERVICES,
  STAFF,
} from "./mock-data";

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

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

  addAppointment: (input: Omit<Appointment, "id" | "createdAt" | "status"> & { status?: AppointmentStatus }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;

  addCustomer: (input: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;

  addStaff: (input: Omit<StaffMember, "id">) => StaffMember;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;

  addService: (input: Omit<Service, "id">) => Service;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;

  adjustStock: (productId: string, delta: number, reason: string) => void;
  addProduct: (input: Omit<Product, "id">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;

  updateBusinessProfile: (patch: Partial<BusinessProfile>) => void;
  updateNotificationPrefs: (patch: Partial<NotificationPrefs>) => void;
  updatePaymentTaxSettings: (patch: Partial<PaymentTaxSettings>) => void;
  togglePlugin: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(BUSINESS_PROFILE);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(NOTIFICATION_PREFS);
  const [paymentTaxSettings, setPaymentTaxSettings] = useState<PaymentTaxSettings>(PAYMENT_TAX_SETTINGS);
  const [plugins, setPlugins] = useState<Plugin[]>(PLUGINS);

  const addAppointment = useCallback<DataStoreValue["addAppointment"]>((input) => {
    const appt: Appointment = {
      ...input,
      id: makeId("appt"),
      status: input.status ?? "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAppointments((prev) => [...prev, appt]);
    return appt;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const updateAppointment = useCallback((id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const addCustomer = useCallback<DataStoreValue["addCustomer"]>((input) => {
    const customer: Customer = {
      ...input,
      id: makeId("cust"),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [...prev, customer]);
    return customer;
  }, []);

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addStaff = useCallback<DataStoreValue["addStaff"]>((input) => {
    const member: StaffMember = { ...input, id: makeId("staff") };
    setStaff((prev) => [...prev, member]);
    return member;
  }, []);

  const updateStaff = useCallback((id: string, patch: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addService = useCallback<DataStoreValue["addService"]>((input) => {
    const service: Service = { ...input, id: makeId("svc") };
    setServices((prev) => [...prev, service]);
    return service;
  }, []);

  const updateService = useCallback((id: string, patch: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const adjustStock = useCallback((productId: string, delta: number, _reason: string) => {
    void _reason;
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  }, []);

  const addProduct = useCallback<DataStoreValue["addProduct"]>((input) => {
    const product: Product = { ...input, id: makeId("prod") };
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const updateBusinessProfile = useCallback((patch: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateNotificationPrefs = useCallback((patch: Partial<NotificationPrefs>) => {
    setNotificationPrefs((prev) => ({ ...prev, ...patch }));
  }, []);

  const updatePaymentTaxSettings = useCallback((patch: Partial<PaymentTaxSettings>) => {
    setPaymentTaxSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const togglePlugin = useCallback((id: string) => {
    setPlugins((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
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

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore(): DataStoreValue {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within a DataStoreProvider");
  return ctx;
}
