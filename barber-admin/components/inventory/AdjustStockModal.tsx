"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useDataStore } from "@/lib/data-store";
import type { Product } from "@/lib/types";

const REASONS = ["Restock delivery", "Damaged/expired", "Used in service", "Inventory correction", "Other"];

export function AdjustStockModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { adjustStock } = useDataStore();
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState(REASONS[0]);

  if (!product) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    const delta = direction === "add" ? Math.abs(amount) : -Math.abs(amount);
    adjustStock(product.id, delta, reason);
    onClose();
  }

  return (
    <Modal open={!!product} onClose={onClose} title={`Adjust stock — ${product.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Current stock: <span className="font-medium text-zinc-900 dark:text-zinc-50">{product.stock}</span>
        </p>
        <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
          {(["add", "remove"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize " +
                (direction === d ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500")
              }
            >
              {d} stock
            </button>
          ))}
        </div>
        <Field label="Quantity">
          <TextInput type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
        </Field>
        <Field label="Reason">
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save adjustment</Button>
        </div>
      </form>
    </Modal>
  );
}
