"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDataStore } from "@/lib/data-store";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { PaymentTaxTab } from "@/components/settings/PaymentTaxTab";
import { UsersRolesTab } from "@/components/settings/UsersRolesTab";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TABS = [
  { id: "business", label: "Business" },
  { id: "notifications", label: "Notifications" },
  { id: "payments", label: "Payments & tax" },
  { id: "users", label: "Users & roles" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("business");
  const { businessProfile } = useDataStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure your business, notifications, payments, and team access.</p>
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

      {tab === "business" && (
        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Business profile</p>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{businessProfile.name}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {businessProfile.address}, {businessProfile.city}, {businessProfile.state} {businessProfile.zip}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {businessProfile.phone} · {businessProfile.email}
            </p>
            <Link href="/store">
              <Button variant="outline" size="sm">
                Edit in Store →
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "payments" && <PaymentTaxTab />}
      {tab === "users" && <UsersRolesTab />}
    </div>
  );
}
