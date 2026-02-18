import {
  ENTITY_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
  PRIORITY_CONFIG,
  TASK_TYPE_CONFIG,
  EntityStatus,
  TaskStatus,
  Priority,
  TaskType,
} from "@/types/models";

const COLOR_MAP: Record<string, string> = {
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color = "zinc", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        COLOR_MAP[color] || COLOR_MAP.zinc
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  const config = ENTITY_STATUS_CONFIG[status];
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = TASK_STATUS_CONFIG[status];
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = PRIORITY_CONFIG[priority];
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function TaskTypeBadge({ type }: { type: TaskType }) {
  const config = TASK_TYPE_CONFIG[type];
  return <Badge color={config.color}>{config.label}</Badge>;
}
