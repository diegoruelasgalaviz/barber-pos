"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BusinessProfileTab } from "@/components/store/BusinessProfileTab";
import { StaffTab } from "@/components/store/StaffTab";
import { ServicesTab } from "@/components/store/ServicesTab";
import { RequireRole } from "@/components/RequireRole";

const TABS = [
  { id: "profile", label: "Business profile" },
  { id: "staff", label: "Staff" },
  { id: "services", label: "Service catalog" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StorePage() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <RequireRole roles={["owner", "admin"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Store</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Business profile, staff, and services.</p>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 text-sm font-medium",
                tab === t.id
                  ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-zinc-50"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "profile" && <BusinessProfileTab />}
        {tab === "staff" && <StaffTab />}
        {tab === "services" && <ServicesTab />}
      </div>
    </RequireRole>
  );
}
