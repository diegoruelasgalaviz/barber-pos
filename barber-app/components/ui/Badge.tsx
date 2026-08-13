import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/types";
import { STATUS_CLASSES, STATUS_LABEL } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge className={STATUS_CLASSES[status]}>{STATUS_LABEL[status]}</Badge>;
}
