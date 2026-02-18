"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuFolderOpen,
  LuListChecks,
} from "react-icons/lu";

const NAV_ITEMS = [
  { href: "/", icon: LuLayoutDashboard, label: "Dashboard" },
  { href: "/contexts", icon: LuFolderOpen, label: "Contexts" },
  { href: "/tasks", icon: LuListChecks, label: "Tasks" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
