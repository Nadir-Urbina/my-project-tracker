"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuPencil, LuTrash2, LuCalendar } from "react-icons/lu";
import { PriorityBadge, TaskTypeBadge } from "@/components/ui/Badge";
import { Task, toDate } from "@/types/models";

interface KanbanCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isDragOverlay?: boolean;
  projectName?: string;
}

export default function KanbanCard({
  task,
  onEdit,
  onDelete,
  isDragOverlay = false,
  projectName,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = toDate(task.dueDate);
  const isOverdue =
    dueDate && dueDate < new Date() && task.status !== "completed";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab rounded-lg border bg-white p-2.5 transition-shadow active:cursor-grabbing dark:bg-zinc-900 ${
        isDragOverlay
          ? "kanban-drag-overlay border-blue-300 ring-2 ring-blue-500/30 dark:border-blue-700"
          : isDragging
            ? "border-zinc-200 opacity-40 dark:border-zinc-800"
            : "border-zinc-200 hover:shadow-sm dark:border-zinc-800"
      }`}
    >
      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}`}
        className="block text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
        onClick={(e) => {
          if (isDragging || isDragOverlay) e.preventDefault();
        }}
      >
        {task.name}
      </Link>
      {projectName && (
        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
          {projectName}
        </p>
      )}

      {task.description && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 md:line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {task.type && <TaskTypeBadge type={task.type} />}
        <PriorityBadge priority={task.priority} />
        {dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs ${
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <LuCalendar className="h-3 w-3" />
            {format(dueDate, "MMM d")}
          </span>
        )}
      </div>

      {!isDragOverlay && (
        <div className="mt-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <LuPencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
