"use client";

import { format } from "date-fns";
import { LuCircleCheck, LuArrowRight, LuActivity } from "react-icons/lu";

interface WelcomeBarProps {
  completedToday: number;
  nextActionCount: number;
  inProgressCount: number;
}

export default function WelcomeBar({
  completedToday,
  nextActionCount,
  inProgressCount,
}: WelcomeBarProps) {
  const today = new Date();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Good {getGreeting()},
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {format(today, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-4">
          <Stat
            icon={<LuCircleCheck className="h-4 w-4 text-emerald-500" />}
            label="Done today"
            value={completedToday}
          />
          <Stat
            icon={<LuArrowRight className="h-4 w-4 text-blue-500" />}
            label="Next actions"
            value={nextActionCount}
          />
          <Stat
            icon={<LuActivity className="h-4 w-4 text-amber-500" />}
            label="In progress"
            value={inProgressCount}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
      {icon}
      <div>
        <p className="text-lg font-bold leading-none text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
