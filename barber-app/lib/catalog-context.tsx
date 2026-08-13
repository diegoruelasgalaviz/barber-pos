"use client";

// Live services / barbers / discounts catalog, fetched from barber-backend.
// Replaces the static SERVICES / BARBERS / DISCOUNTS lists that used to
// live in mock-data.ts.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Barber, Discount, Service } from "./types";
import { api } from "./api";

interface StaffDto {
  id: string;
  name: string;
  title: string;
  color: string;
  photoInitials: string;
  serviceIds: string[];
  active: boolean;
}

interface CatalogContextValue {
  services: Service[];
  barbers: Barber[];
  discounts: Discount[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    api.get<Service[]>("/api/services").then(setServices).catch(() => {});
    api
      .get<StaffDto[]>("/api/staff")
      .then((staff) =>
        setBarbers(
          staff
            .filter((s) => s.active)
            .map((s) => ({
              id: s.id,
              name: s.name,
              title: s.title,
              color: s.color,
              photoInitials: s.photoInitials,
              serviceIds: s.serviceIds,
            })),
        ),
      )
      .catch(() => {});
    api.get<Discount[]>("/api/discounts").then(setDiscounts).catch(() => {});
  }, []);

  const value = useMemo(() => ({ services, barbers, discounts }), [services, barbers, discounts]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
