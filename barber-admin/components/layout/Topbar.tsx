"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { BellIcon, MenuIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const current = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{current?.label ?? "Dashboard"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        {user && (
          <div
            className="hidden h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white sm:flex md:hidden"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
    </header>
  );
}
