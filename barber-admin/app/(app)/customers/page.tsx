"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/Field";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Badge } from "@/components/ui/Badge";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { formatDateMedium } from "@/lib/utils";

export default function CustomersPage() {
  const { customers, appointments, addCustomer } = useDataStore();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...customers].sort((a, b) => a.firstName.localeCompare(b.firstName));
    if (!q) return sorted;
    return sorted.filter((c) => `${c.firstName} ${c.lastName} ${c.phone} ${c.email}`.toLowerCase().includes(q));
  }, [customers, query]);

  function visitCount(customerId: string) {
    return appointments.filter((a) => a.customerId === customerId && a.status === "completed").length;
  }

  function lastVisit(customerId: string) {
    const visits = appointments
      .filter((a) => a.customerId === customerId && a.status === "completed")
      .sort((a, b) => b.date.localeCompare(a.date));
    return visits[0]?.date;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Customers</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{customers.length} total customers</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add customer
        </Button>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <TextInput className="pl-9" placeholder="Search by name, phone, or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="hidden grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-medium text-zinc-500 sm:grid dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Visits</div>
          <div className="col-span-3">Last visit</div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/customers/${c.id}`}
              className="grid grid-cols-1 gap-2 px-4 py-3 hover:bg-zinc-50 sm:grid-cols-12 sm:items-center dark:hover:bg-zinc-900/60"
            >
              <div className="col-span-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {c.firstName} {c.lastName}
                </p>
                {c.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-400">
                <p>{c.phone}</p>
                <p className="truncate">{c.email}</p>
              </div>
              <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-300">{visitCount(c.id)} completed</div>
              <div className="col-span-3 text-sm text-zinc-500 dark:text-zinc-400">
                {lastVisit(c.id) ? formatDateMedium(lastVisit(c.id)!) : "No visits yet"}
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <p className="px-4 py-8 text-center text-sm text-zinc-500">No customers match your search.</p>}
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add customer">
        <CustomerForm
          onCancel={() => setAddOpen(false)}
          onSubmit={(values) => {
            addCustomer(values);
            setAddOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
