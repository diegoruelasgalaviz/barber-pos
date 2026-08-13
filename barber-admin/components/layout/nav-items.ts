import {
  BoxIcon,
  CalendarIcon,
  PuzzleIcon,
  SettingsIcon,
  StoreIcon,
  UsersIcon,
} from "@/components/icons";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof CalendarIcon;
  roles?: Role[]; // undefined = everyone
  mobilePriority?: boolean; // shown in bottom tab bar on small screens
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/appointments", label: "Appointments", icon: CalendarIcon, mobilePriority: true },
  { href: "/customers", label: "Customers", icon: UsersIcon, mobilePriority: true },
  { href: "/inventory", label: "Inventory", icon: BoxIcon, mobilePriority: true },
  { href: "/store", label: "Store", icon: StoreIcon, roles: ["owner", "admin"] },
  { href: "/plugins", label: "Plugins", icon: PuzzleIcon, roles: ["owner", "admin"] },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];
