"use client";

import { useMemo, useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { AdjustStockModal } from "@/components/inventory/AdjustStockModal";
import { ProductFormModal } from "@/components/inventory/ProductFormModal";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function InventoryPage() {
  const { products } = useDataStore();
  const [query, setQuery] = useState("");
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (lowStockOnly) list = list.filter((p) => p.stock <= p.lowStockThreshold);
    if (q) list = list.filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q));
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, lowStockOnly]);

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.unitCost, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Inventory</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Products, supplies, and stock levels.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="Low stock" value={String(lowStock.length)} accent={lowStock.length > 0 ? "text-amber-600 dark:text-amber-400" : undefined} />
        <StatCard label="Inventory value" value={formatCurrency(totalValue)} hint="at cost" />
      </div>

      {lowStock.length > 0 && (
        <button
          onClick={() => setLowStockOnly((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm",
            "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
          )}
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          <span>
            {lowStock.length} item{lowStock.length > 1 ? "s" : ""} at or below reorder threshold.{" "}
            <span className="underline">{lowStockOnly ? "Show all" : "View low stock"}</span>
          </span>
        </button>
      )}

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <TextInput className="pl-9" placeholder="Search products or SKU…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="hidden grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-medium text-zinc-500 sm:grid dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
          <div className="col-span-4">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2">Retail price</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filtered.map((p) => {
            const low = p.stock <= p.lowStockThreshold;
            return (
              <div key={p.id} className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-12 sm:items-center">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{p.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{p.sku}</p>
                </div>
                <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-300">{p.category}</div>
                <div className="col-span-2">
                  <span className={cn("text-sm font-medium", low ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-50")}>
                    {p.stock}
                  </span>
                  {low && <Badge className="ml-2 border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">Low</Badge>}
                </div>
                <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-300">{p.unitPrice > 0 ? formatCurrency(p.unitPrice) : "Not sold"}</div>
                <div className="col-span-2 flex justify-start sm:justify-end">
                  <Button size="sm" variant="outline" onClick={() => setAdjustTarget(p)}>
                    Adjust stock
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="px-4 py-8 text-center text-sm text-zinc-500">No products match.</p>}
        </div>
      </div>

      <AdjustStockModal product={adjustTarget} onClose={() => setAdjustTarget(null)} />
      <ProductFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
