"use client";

import { useDataStore } from "@/lib/data-store";
import { useAuth } from "@/lib/auth-context";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { RequireRole } from "@/components/RequireRole";
import type { Role } from "@/lib/types";

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full access to every module, including billing and role management.",
  admin: "Manages staff, services, inventory, and settings; cannot change owner accounts.",
  staff: "Can manage their own schedule, customers, and view inventory levels.",
};

export function UsersRolesTab() {
  const { staff, updateStaff } = useDataStore();
  const { user } = useAuth();

  return (
    <RequireRole roles={["owner"]} fallback={<p className="text-sm text-zinc-500">Only owners can manage user roles.</p>}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">User &amp; role management</p>
          </CardHeader>
          <CardBody className="space-y-3">
            {(["owner", "admin", "staff"] as Role[]).map((r) => (
              <p key={r} className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">{r}:</span> {ROLE_DESCRIPTIONS[r]}
              </p>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {staff.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: s.color }}>
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {s.name} {s.email === user?.email && <span className="text-xs text-zinc-400">(you)</span>}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.email}</p>
                    </div>
                  </div>
                  <Select
                    value={s.role}
                    onChange={(e) => updateStaff(s.id, { role: e.target.value as Role })}
                    className="w-32"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </Select>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </RequireRole>
  );
}
