"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { DISCOUNTS } from "@/lib/mock-data";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateMedium } from "@/lib/utils";

function DiscountsList() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Special Discounts</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Member-only offers. Apply a code during the payment step when booking.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DISCOUNTS.map((d) => (
          <Card key={d.id}>
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{d.title}</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {d.percentOff}% off
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{d.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <code className="rounded bg-zinc-100 px-2 py-1 text-xs font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {d.code}
                </code>
                <span className="text-xs text-zinc-400">Expires {formatDateMedium(d.expiresAt)}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/book">
          <Button>Book & Apply a Discount</Button>
        </Link>
      </div>
    </div>
  );
}

export default function DiscountsPage() {
  return (
    <RequireAuth>
      <DiscountsList />
    </RequireAuth>
  );
}
