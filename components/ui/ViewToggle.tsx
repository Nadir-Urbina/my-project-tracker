"use client";

import { LuList, LuColumns3 } from "react-icons/lu";

interface ViewToggleProps {
  view: "list" | "kanban";
  onChange: (view: "list" | "kanban") => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  const activeClass =
    "rounded-md bg-white px-2 py-1.5 text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100";
  const inactiveClass =
    "rounded-md px-2 py-1.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200";

  return (
    <div className="hidden rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 md:inline-flex dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => onChange("list")}
        className={view === "list" ? activeClass : inactiveClass}
        title="List view"
      >
        <LuList className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange("kanban")}
        className={view === "kanban" ? activeClass : inactiveClass}
        title="Board view"
      >
        <LuColumns3 className="h-4 w-4" />
      </button>
    </div>
  );
}
