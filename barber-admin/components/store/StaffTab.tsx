"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StaffFormModal } from "./StaffFormModal";
import { PlusIcon } from "@/components/icons";
import type { StaffMember } from "@/lib/types";
import { RequireRole } from "@/components/RequireRole";

export function StaffTab() {
  const { staff, services } = useDataStore();
  const [modalTarget, setModalTarget] = useState<StaffMember | "new" | null>(null);

  return (
    <div className="space-y-4">
      <RequireRole
        roles={["owner", "admin"]}
        fallback={<p className="text-sm text-zinc-500">Contact an owner or admin to manage staff.</p>}
      >
        <div className="flex justify-end">
          <Button onClick={() => setModalTarget("new")}>
            <PlusIcon className="h-4 w-4" />
            Add staff member
          </Button>
        </div>
      </RequireRole>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <Card key={s.id}>
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.title}</p>
                  </div>
                </div>
                {!s.active && <Badge>Inactive</Badge>}
              </div>
              <div className="flex flex-wrap gap-1">
                {s.serviceIds.slice(0, 4).map((id) => {
                  const svc = services.find((sv) => sv.id === id);
                  return svc ? <Badge key={id}>{svc.name}</Badge> : null;
                })}
                {s.serviceIds.length > 4 && <Badge>+{s.serviceIds.length - 4} more</Badge>}
              </div>
              <RequireRole roles={["owner", "admin"]} fallback={null}>
                <Button size="sm" variant="outline" onClick={() => setModalTarget(s)}>
                  Edit
                </Button>
              </RequireRole>
            </CardBody>
          </Card>
        ))}
      </div>

      {modalTarget && (
        <StaffFormModal
          open={!!modalTarget}
          onClose={() => setModalTarget(null)}
          staffMember={modalTarget === "new" ? undefined : modalTarget}
        />
      )}
    </div>
  );
}
