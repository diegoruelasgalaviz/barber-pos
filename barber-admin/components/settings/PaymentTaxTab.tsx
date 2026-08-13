"use client";

import { useDataStore } from "@/lib/data-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, Select, TextInput, Toggle } from "@/components/ui/Field";
import { RequireRole } from "@/components/RequireRole";

export function PaymentTaxTab() {
  const { paymentTaxSettings, updatePaymentTaxSettings } = useDataStore();

  return (
    <RequireRole roles={["owner", "admin"]}>
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Payments &amp; tax</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Currency">
              <Select value={paymentTaxSettings.currency} onChange={(e) => updatePaymentTaxSettings({ currency: e.target.value })}>
                <option value="USD">USD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </Select>
            </Field>
            <Field label="Tax rate (%)">
              <TextInput
                type="number"
                min={0}
                step={0.01}
                value={paymentTaxSettings.taxRate}
                onChange={(e) => updatePaymentTaxSettings({ taxRate: Number(e.target.value) })}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Accept card payments</p>
            <Toggle checked={paymentTaxSettings.acceptsCard} onChange={(v) => updatePaymentTaxSettings({ acceptsCard: v })} label="Accept card" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Accept cash</p>
            <Toggle checked={paymentTaxSettings.acceptsCash} onChange={(v) => updatePaymentTaxSettings({ acceptsCash: v })} label="Accept cash" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Tipping enabled</p>
            <Toggle checked={paymentTaxSettings.tippingEnabled} onChange={(v) => updatePaymentTaxSettings({ tippingEnabled: v })} label="Tipping enabled" />
          </div>
          {paymentTaxSettings.tippingEnabled && (
            <Field label="Default tip suggestions (%)">
              <div className="flex gap-2">
                {paymentTaxSettings.defaultTipPercents.map((pct) => (
                  <span key={pct} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700">
                    {pct}%
                  </span>
                ))}
              </div>
            </Field>
          )}
        </CardBody>
      </Card>
    </RequireRole>
  );
}
