"use client";

import {
  EntityStatus,
  TaskStatus,
  ENTITY_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
} from "@/types/models";

interface StatusSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Record<T, { label: string; color: string }>;
  className?: string;
}

function StatusSelect<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: StatusSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 ${className}`}
    >
      {(Object.entries(options) as [T, { label: string }][]).map(
        ([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        )
      )}
    </select>
  );
}

export function EntityStatusSelect({
  value,
  onChange,
  className,
}: {
  value: EntityStatus;
  onChange: (value: EntityStatus) => void;
  className?: string;
}) {
  return (
    <StatusSelect
      value={value}
      onChange={onChange}
      options={ENTITY_STATUS_CONFIG}
      className={className}
    />
  );
}

export function TaskStatusSelect({
  value,
  onChange,
  className,
}: {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
  className?: string;
}) {
  return (
    <StatusSelect
      value={value}
      onChange={onChange}
      options={TASK_STATUS_CONFIG}
      className={className}
    />
  );
}
