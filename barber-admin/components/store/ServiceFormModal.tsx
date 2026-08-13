"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useDataStore } from "@/lib/data-store";
import type { Service } from "@/lib/types";

export function ServiceFormModal({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service?: Service;
}) {
  const { addService, updateService } = useDataStore();
  const [name, setName] = useState(service?.name ?? "");
  const [category, setCategory] = useState(service?.category ?? "Hair");
  const [duration, setDuration] = useState(service?.durationMinutes ?? 30);
  const [price, setPrice] = useState(service?.price ?? 25);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, category, durationMinutes: duration, price };
    if (service) updateService(service.id, payload);
    else addService(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={service ? "Edit service" : "Add service"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Service name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Category">
          <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Hair, Beard, Color…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Duration (minutes)">
            <TextInput type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
          </Field>
          <Field label="Price ($)">
            <TextInput type="number" min={0} step={0.5} value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{service ? "Save changes" : "Add service"}</Button>
        </div>
      </form>
    </Modal>
  );
}
