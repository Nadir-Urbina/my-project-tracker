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
  LuChevronDown,
  LuCircleDot,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { Context } from "@/types/models";
import WishListModal from "@/components/feedback/WishListModal";

interface SidebarProps {
  contexts: Context[];
}

const NAV_ITEMS = [
  { href: "/", icon: LuLayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: LuListChecks, label: "Tasks" },
  { href: "/ideas", icon: LuLightbulb, label: "Ideas" },
];

const CONTEXT_LIMIT = 7;

export default function Sidebar({ contexts }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showWishList, setShowWishList] = useState(false);
  const [contextsOpen, setContextsOpen] = useState(true);
  const [contextSearch, setContextSearch] = useState("");
  const pathname = usePathname();
  const { user } = useAuth();

  const ongoingContexts = contexts.filter((c) => c.status === "ongoing");
  const filteredContexts = contextSearch
    ? ongoingContexts.filter((c) =>
        c.name.toLowerCase().includes(contextSearch.toLowerCase())
      )
    : ongoingContexts.slice(0, CONTEXT_LIMIT);
  const hasMore = !contextSearch && ongoingContexts.length > CONTEXT_LIMIT;

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

        {/* Feedback section */}
        <div className="mt-6">
          {!collapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Feedback
            </p>
          )}
          <button
            onClick={() => setShowWishList(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            title={collapsed ? "Wish List" : undefined}
          >
            <LuSparkles className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Wish List</span>}
          </button>
        </div>

        {/* Contexts list */}
        {ongoingContexts.length > 0 && (
          <div className="mt-6">
            {!collapsed && (
              <>
                {/* Header row: label + collapse toggle */}
                <button
                  onClick={() => setContextsOpen((o) => !o)}
                  className="mb-1 flex w-full items-center justify-between px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  <span>Contexts</span>
                  <LuChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${contextsOpen ? "" : "-rotate-90"}`}
                  />
                </button>

                {/* Search — only when expanded */}
                {contextsOpen && (
                  <div className="relative mb-1 px-1">
                    <LuSearch className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      value={contextSearch}
                      onChange={(e) => setContextSearch(e.target.value)}
                      placeholder="Search…"
                      className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-1 pl-7 pr-2 text-xs text-zinc-700 placeholder-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder-zinc-600"
                    />
                  </div>
                )}
              </>
            )}

            {/* Context links */}
            {(collapsed || contextsOpen) && (
              <div className="space-y-0.5">
                {filteredContexts.map((ctx) => {
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

                {/* All Contexts link — always shown, or as overflow hint */}
                {!collapsed && (
                  <Link
                    href="/contexts"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      hasMore
                        ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
                    }`}
                  >
                    <LuFolderOpen className="h-4 w-4 shrink-0" />
                    <span>
                      {hasMore
                        ? `All contexts (${ongoingContexts.length})`
                        : "All contexts"}
                    </span>
                  </Link>
                )}
              </div>
            )}
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
          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
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

      <WishListModal open={showWishList} onClose={() => setShowWishList(false)} />
    </aside>
  );
}
