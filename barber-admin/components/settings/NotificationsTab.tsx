"use client";

import { useDataStore } from "@/lib/data-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, Select, Toggle } from "@/components/ui/Field";

export function NotificationsTab() {
  const { notificationPrefs, updateNotificationPrefs } = useDataStore();

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Notification preferences</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Email reminders</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Send appointment reminders by email</p>
          </div>
          <Toggle checked={notificationPrefs.emailReminders} onChange={(v) => updateNotificationPrefs({ emailReminders: v })} label="Email reminders" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">SMS reminders</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Send appointment reminders by text message</p>
          </div>
          <Toggle checked={notificationPrefs.smsReminders} onChange={(v) => updateNotificationPrefs({ smsReminders: v })} label="SMS reminders" />
        </div>
        <Field label="Reminder lead time">
          <Select
            value={notificationPrefs.reminderLeadHours}
            onChange={(e) => updateNotificationPrefs({ reminderLeadHours: Number(e.target.value) })}
            className="max-w-xs"
          >
            <option value={1}>1 hour before</option>
            <option value={2}>2 hours before</option>
            <option value={24}>24 hours before</option>
            <option value={48}>48 hours before</option>
          </Select>
        </Field>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">New booking alerts</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Notify staff when a new appointment is booked</p>
          </div>
          <Toggle checked={notificationPrefs.newBookingAlerts} onChange={(v) => updateNotificationPrefs({ newBookingAlerts: v })} label="New booking alerts" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Low stock alerts</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Notify managers when inventory hits its threshold</p>
          </div>
          <Toggle checked={notificationPrefs.lowStockAlerts} onChange={(v) => updateNotificationPrefs({ lowStockAlerts: v })} label="Low stock alerts" />
        </div>
      </CardBody>
    </Card>
  );
}
