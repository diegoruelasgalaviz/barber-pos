"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DAY_NAMES } from "@/lib/utils";
import { RequireRole } from "@/components/RequireRole";

export function BusinessProfileTab() {
  const { businessProfile, updateBusinessProfile } = useDataStore();
  const [form, setForm] = useState(businessProfile);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function save() {
    updateBusinessProfile(form);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Business info</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field label="Business name">
            <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Phone">
              <TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Email">
              <TextInput value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
          </div>
          <Field label="Website">
            <TextInput value={form.website} onChange={(e) => set("website", e.target.value)} />
          </Field>
          <Field label="Street address">
            <TextInput value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="City">
              <TextInput value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State">
              <TextInput value={form.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
            <Field label="ZIP">
              <TextInput value={form.zip} onChange={(e) => set("zip", e.target.value)} />
            </Field>
          </div>
          <RequireRole roles={["owner", "admin"]} fallback={null}>
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={save}>Save changes</Button>
              {saved && <span className="text-xs text-emerald-600 dark:text-emerald-400">Saved</span>}
            </div>
          </RequireRole>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Business hours</p>
        </CardHeader>
        <CardBody className="space-y-2">
          {DAY_NAMES.map((name, i) => {
            const hours = form.hours[i];
            return (
              <div key={name} className="flex items-center justify-between gap-3 text-sm">
                <span className="w-24 shrink-0 text-zinc-600 dark:text-zinc-300">{name}</span>
                {hours.closed ? (
                  <span className="text-zinc-400">Closed</span>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {hours.start} – {hours.end}
                  </span>
                )}
              </div>
            );
          })}
          <p className="pt-1 text-xs text-zinc-400">Edit hours per staff member under Staff for individual schedules.</p>
        </CardBody>
      </Card>
    </div>
  );
}
