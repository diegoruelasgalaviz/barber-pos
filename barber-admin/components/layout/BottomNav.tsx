"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { MenuIcon } from "@/components/icons";

// Quick-access tab bar for small screens: today's schedule, customer lookup,
// and inventory quick-check are one tap away; everything else lives behind
// "More" (opened via the same drawer used by the topbar hamburger).
export function BottomNav({ onMore }: { onMore: () => void }) {
  const pathname = usePathname();
  const priorityItems = NAV_ITEMS.filter((item) => item.mobilePriority);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-zinc-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
      {priorityItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
              active ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={onMore}
        className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500"
      >
        <MenuIcon className="h-5 w-5" />
        More
      </button>
    </nav>
  );
}
