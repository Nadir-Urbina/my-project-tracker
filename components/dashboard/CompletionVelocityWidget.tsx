"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { Task, toDate } from "@/types/models";
import { useTheme } from "@/contexts/ThemeContext";
import { LuZap } from "react-icons/lu";

interface Props {
  tasks: Task[];
}

export default function CompletionVelocityWidget({ tasks }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, weekTotal } = useMemo(() => {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({ start: subDays(today, 6), end: today });

    const countByDay: Record<string, number> = {};
    for (const task of tasks) {
      const completedAt = toDate(task.completedAt);
      if (!completedAt) continue;
      const key = format(startOfDay(completedAt), "yyyy-MM-dd");
      countByDay[key] = (countByDay[key] || 0) + 1;
    }

    return {
      data: days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        return {
          day: format(day, "EEE"),
          date: key,
          count: countByDay[key] || 0,
          isToday: key === format(today, "yyyy-MM-dd"),
        };
      }),
      weekTotal: tasks.length,
    };
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
        <p style={{ color: isDark ? "#a1a1aa" : "#71717a", fontSize: 11, margin: "0 0 2px" }}>
          {label}
        </p>
        <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600, margin: 0 }}>
          {payload[0].value} completed
        </p>
      </div>
    );
  };

  const axisColor = isDark ? "#52525b" : "#a1a1aa";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuZap className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Completed (7 days)
          </h2>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {weekTotal} this week
        </span>
      </div>

      <div className="h-[148px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={22}
            margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={
                    entry.isToday
                      ? "#10b981"
                      : entry.count > 0
                      ? "#34d399"
                      : isDark
                      ? "#3f3f46"
                      : "#e4e4e7"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
