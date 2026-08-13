"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/icons";
import { ServiceFormModal } from "./ServiceFormModal";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/lib/types";
import { RequireRole } from "@/components/RequireRole";

export function ServicesTab() {
  const { services, removeService } = useDataStore();
  const [modalTarget, setModalTarget] = useState<Service | "new" | null>(null);

  const byCategory = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <RequireRole roles={["owner", "admin"]} fallback={null}>
        <div className="flex justify-end">
          <Button onClick={() => setModalTarget("new")}>
            <PlusIcon className="h-4 w-4" />
            Add service
          </Button>
        </div>
      </RequireRole>

      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{category}</h3>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.durationMinutes} min</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(s.price)}</span>
                    <RequireRole roles={["owner", "admin"]} fallback={null}>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setModalTarget(s)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10" onClick={() => removeService(s.id)}>
                          Remove
                        </Button>
                      </div>
                    </RequireRole>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {modalTarget && (
        <ServiceFormModal open={!!modalTarget} onClose={() => setModalTarget(null)} service={modalTarget === "new" ? undefined : modalTarget} />
      )}
    </div>
  );
}
