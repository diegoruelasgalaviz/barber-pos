"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, Select, TextInput, Checkbox, Toggle } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useDataStore } from "@/lib/data-store";
import { DAY_SHORT } from "@/lib/utils";
import type { Role, StaffMember, WorkingHours } from "@/lib/types";

const DEFAULT_HOURS: WorkingHours = Object.fromEntries(
  Array.from({ length: 7 }, (_, i) => [i, { start: "09:00", end: "18:00", closed: i === 0 }]),
);

const COLORS = ["#2563eb", "#059669", "#dc2626", "#d97706", "#7c3aed", "#0891b2", "#db2777"];

export function StaffFormModal({
  open,
  onClose,
  staffMember,
}: {
  open: boolean;
  onClose: () => void;
  staffMember?: StaffMember;
}) {
  const { services, addStaff, updateStaff } = useDataStore();
  const [name, setName] = useState(staffMember?.name ?? "");
  const [email, setEmail] = useState(staffMember?.email ?? "");
  const [title, setTitle] = useState(staffMember?.title ?? "Barber");
  const [role, setRole] = useState<Role>(staffMember?.role ?? "staff");
  const [color, setColor] = useState(staffMember?.color ?? COLORS[0]);
  const [serviceIds, setServiceIds] = useState<string[]>(staffMember?.serviceIds ?? []);
  const [hours, setHours] = useState<WorkingHours>(staffMember?.workingHours ?? DEFAULT_HOURS);
  const [active, setActive] = useState(staffMember?.active ?? true);

  function toggleService(id: string) {
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function setDay(day: number, patch: Partial<WorkingHours[number]>) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, email, title, role, color, serviceIds, workingHours: hours, active };
    if (staffMember) updateStaff(staffMember.id, payload);
    else addStaff(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={staffMember ? "Edit staff member" : "Add staff member"} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Title">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Barber, Senior Barber…" />
          </Field>
          <Field label="System role">
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </Select>
          </Field>
        </div>

        <Field label="Calendar color">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className="h-7 w-7 rounded-full ring-offset-2"
                style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
              />
            ))}
          </div>
        </Field>

        <Field label="Assigned services">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {services.map((s) => (
              <Checkbox key={s.id} label={s.name} checked={serviceIds.includes(s.id)} onChange={() => toggleService(s.id)} />
            ))}
          </div>
        </Field>

        <Field label="Working hours">
          <div className="space-y-1.5">
            {DAY_SHORT.map((label, i) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className="w-8 shrink-0 text-zinc-500">{label}</span>
                <Toggle checked={!hours[i].closed} onChange={(v) => setDay(i, { closed: !v })} label={`${label} open`} />
                {!hours[i].closed && (
                  <>
                    <TextInput type="time" value={hours[i].start} onChange={(e) => setDay(i, { start: e.target.value })} className="w-28" />
                    <span className="text-zinc-400">to</span>
                    <TextInput type="time" value={hours[i].end} onChange={(e) => setDay(i, { end: e.target.value })} className="w-28" />
                  </>
                )}
              </div>
            ))}
          </div>
        </Field>

        <div className="flex items-center gap-2">
          <Toggle checked={active} onChange={setActive} label="Active" />
          <span className="text-sm text-zinc-600 dark:text-zinc-300">Active (bookable)</span>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{staffMember ? "Save changes" : "Add staff member"}</Button>
        </div>
      </form>
    </Modal>
  );
}
