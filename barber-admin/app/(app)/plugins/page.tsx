"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Field";
import { PluginConfigModal } from "@/components/plugins/PluginConfigModal";
import { RequireRole } from "@/components/RequireRole";
import type { Plugin } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<Plugin["category"], string> = {
  marketing: "Marketing",
  loyalty: "Loyalty",
  booking: "Booking",
  payments: "Payments",
};

export default function PluginsPage() {
  const { plugins, togglePlugin } = useDataStore();
  const [configTarget, setConfigTarget] = useState<Plugin | null>(null);

  return (
    <RequireRole roles={["owner", "admin"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Plugins</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enable optional add-ons like loyalty, SMS marketing, and booking widgets — none of this is baked into core flows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.map((p) => (
            <Card key={p.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{p.name}</p>
                    <Badge className="mt-1">{CATEGORY_LABEL[p.category]}</Badge>
                  </div>
                  <Toggle checked={p.enabled} onChange={() => togglePlugin(p.id)} label={`Toggle ${p.name}`} />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{p.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      p.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400",
                    )}
                  >
                    {p.enabled ? (p.configured ? "Active" : "Enabled — needs setup") : "Disabled"}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setConfigTarget(p)}>
                    Configure
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <PluginConfigModal plugin={configTarget} onClose={() => setConfigTarget(null)} />
      </div>
    </RequireRole>
  );
}
