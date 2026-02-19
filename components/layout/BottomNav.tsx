"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuFolderOpen,
  LuListChecks,
  LuLightbulb,
} from "react-icons/lu";

const NAV_ITEMS = [
  { href: "/", icon: LuLayoutDashboard, label: "Dashboard" },
  { href: "/contexts", icon: LuFolderOpen, label: "Contexts" },
  { href: "/tasks", icon: LuListChecks, label: "Tasks" },
  { href: "/ideas", icon: LuLightbulb, label: "Ideas" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+1rem)] md:hidden">
      <nav className="mx-4 flex items-center justify-around gap-1 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium transition-all ${
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
