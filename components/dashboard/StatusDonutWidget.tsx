"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Task, TaskStatus, TASK_STATUS_CONFIG } from "@/types/models";
import { useTheme } from "@/contexts/ThemeContext";
import { LuChartPie } from "react-icons/lu";

const STATUS_COLORS: Record<TaskStatus, string> = {
  in_progress: "#f59e0b",
  next_action: "#3b82f6",
  backlog: "#71717a",
  completed: "#10b981",
  cancelled: "#f87171",
};

const STATUS_ORDER: TaskStatus[] = ["in_progress", "next_action", "backlog", "completed", "cancelled"];

interface Props {
  tasks: Task[];
}

export default function StatusDonutWidget({ tasks }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const data = useMemo(() => {
    const counts: Partial<Record<TaskStatus, number>> = {};
    for (const task of tasks) {
      counts[task.status] = (counts[task.status] || 0) + 1;
    }
    return STATUS_ORDER.filter((s) => counts[s]).map((status) => ({
      name: TASK_STATUS_CONFIG[status].label,
      value: counts[status]!,
      status,
    }));
  }, [tasks]);

  const total = tasks.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: isDark ? "#18181b" : "#fff",
          border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`,
          borderRadius: 8,
          padding: "6px 12px",
          boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ color: isDark ? "#e4e4e7" : "#18181b", fontSize: 12, margin: 0 }}>
          {payload[0].name}:{" "}
          <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <LuChartPie className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Task Status
        </h2>
      </div>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No tasks yet
        </p>
      ) : (
        <div className="flex items-center gap-5">
          <div className="relative h-[148px] w-[148px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {total}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                tasks
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            {data.map((entry) => (
              <div
                key={entry.status}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[entry.status] }}
                  />
                  <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
