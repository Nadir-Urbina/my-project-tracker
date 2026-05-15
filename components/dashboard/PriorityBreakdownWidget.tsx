"use client";

import { useMemo } from "react";
import { Task, Priority } from "@/types/models";
import { LuFlag } from "react-icons/lu";

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; bar: string; text: string }
> = {
  high: {
    label: "High",
    bar: "bg-red-500",
    text: "text-red-500 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    bar: "bg-amber-500",
    text: "text-amber-500 dark:text-amber-400",
  },
  low: {
    label: "Low",
    bar: "bg-zinc-400 dark:bg-zinc-500",
    text: "text-zinc-400 dark:text-zinc-500",
  },
};

const PRIORITY_ORDER: Priority[] = ["high", "medium", "low"];

interface Props {
  tasks: Task[];
}

export default function PriorityBreakdownWidget({ tasks }: Props) {
  const { counts, openTotal } = useMemo(() => {
    const openTasks = tasks.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled"
    );
    const counts: Record<Priority, number> = { high: 0, medium: 0, low: 0 };
    for (const task of openTasks) counts[task.priority]++;
    return { counts, openTotal: openTasks.length };
  }, [tasks]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuFlag className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Open by Priority
          </h2>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {openTotal} open
        </span>
      </div>

      {openTotal === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No open tasks
        </p>
      ) : (
        <div className="space-y-5">
          {PRIORITY_ORDER.map((priority) => {
            const count = counts[priority];
            const pct = openTotal > 0 ? (count / openTotal) * 100 : 0;
            const cfg = PRIORITY_CONFIG[priority];
            return (
              <div key={priority}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-medium ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                      {count}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      task{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                    style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
