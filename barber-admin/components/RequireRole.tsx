"use client";

import type { Role } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function RequireRole({
  roles,
  children,
  fallback,
}: {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasRole } = useAuth();
  if (!hasRole(...roles)) {
    return (
      fallback ?? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          You don&apos;t have permission to view this section. Ask an owner or admin for access.
        </div>
      )
    );
  }
  return <>{children}</>;
}
