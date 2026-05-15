"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { Task, toDate } from "@/types/models";
import { useTheme } from "@/contexts/ThemeContext";
import { LuTrendingUp } from "react-icons/lu";

interface Props {
  tasks: Task[];
}

export default function TaskCreationTrendWidget({ tasks }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, periodTotal } = useMemo(() => {
    const today = startOfDay(new Date());
    const start = subDays(today, 13);
    const days = eachDayOfInterval({ start, end: today });

    const countByDay: Record<string, number> = {};
    for (const task of tasks) {
      const createdAt = toDate(task.createdAt);
      if (!createdAt) continue;
      const dayStart = startOfDay(createdAt);
      if (dayStart < start) continue;
      const key = format(dayStart, "yyyy-MM-dd");
      countByDay[key] = (countByDay[key] || 0) + 1;
    }

    const data = days.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      return { day: format(day, "MMM d"), date: key, count: countByDay[key] || 0 };
    });

    const periodTotal = Object.values(countByDay).reduce((a, b) => a + b, 0);
    return { data, periodTotal };
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
        <p style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, margin: 0 }}>
          {payload[0].value} created
        </p>
      </div>
    );
  };

  const axisColor = isDark ? "#52525b" : "#a1a1aa";
  const gradientId = "taskCreationGradient";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuTrendingUp className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Tasks Created (14 days)
          </h2>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {periodTotal} this period
        </span>
      </div>

      <div className="h-[148px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.25 : 0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
