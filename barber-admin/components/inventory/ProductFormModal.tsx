"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useDataStore } from "@/lib/data-store";

export function ProductFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProduct } = useDataStore();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [stock, setStock] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [unitCost, setUnitCost] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addProduct({ name, sku, category, supplier, stock, lowStockThreshold, unitCost, unitPrice });
    onClose();
    setName("");
    setSku("");
    setCategory("");
    setSupplier("");
    setStock(0);
    setLowStockThreshold(5);
    setUnitCost(0);
    setUnitPrice(0);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Product name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="SKU">
            <TextInput value={sku} onChange={(e) => setSku(e.target.value)} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Styling, Tools…" />
          </Field>
          <Field label="Supplier">
            <TextInput value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Starting stock">
            <TextInput type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </Field>
          <Field label="Low stock threshold">
            <TextInput type="number" min={0} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unit cost ($)">
            <TextInput type="number" min={0} step={0.01} value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} />
          </Field>
          <Field label="Retail price ($, 0 = not sold)">
            <TextInput type="number" min={0} step={0.01} value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add product</Button>
        </div>
      </form>
    </Modal>
  );
}
