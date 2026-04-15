"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuFolderOpen,
  LuListChecks,
  LuLightbulb,
  LuChevronLeft,
  LuChevronRight,
  LuCircleDot,
  LuUser,
} from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { Context } from "@/types/models";

interface SidebarProps {
  contexts: Context[];
}

const NAV_ITEMS = [
  { href: "/", icon: LuLayoutDashboard, label: "Dashboard" },
  { href: "/contexts", icon: LuFolderOpen, label: "Contexts" },
  { href: "/tasks", icon: LuListChecks, label: "Tasks" },
  { href: "/ideas", icon: LuLightbulb, label: "Ideas" },
];

export default function Sidebar({ contexts }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo area */}
      <div className="flex h-14 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
        <img src="/icon-192x192.png" alt="FolioGTD" className="h-8 w-8 shrink-0 rounded-lg" />
        {!collapsed && (
          <span className="ml-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            FolioGTD
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Contexts list */}
        {contexts.length > 0 && (
          <div className="mt-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Contexts
              </p>
            )}
            <div className="space-y-0.5">
              {contexts
                .filter((c) => c.status === "ongoing")
                .map((ctx) => {
                  const active = pathname === `/contexts/${ctx.id}`;
                  return (
                    <Link
                      key={ctx.id}
                      href={`/contexts/${ctx.id}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                      }`}
                      title={collapsed ? ctx.name : undefined}
                    >
                      <LuCircleDot
                        className="h-4 w-4 shrink-0"
                        style={{ color: ctx.color }}
                      />
                      {!collapsed && (
                        <span className="truncate">{ctx.name}</span>
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
        {/* Profile link */}
        <Link
          href="/profile"
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/profile"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
          }`}
          title={collapsed ? "Profile" : undefined}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user?.email?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="truncate text-xs font-medium">
                {user?.displayName || "Profile"}
              </div>
              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email}
              </div>
            </div>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <LuChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <LuChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
