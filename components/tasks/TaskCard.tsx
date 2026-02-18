"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LuPencil, LuTrash2, LuCalendar, LuClock } from "react-icons/lu";
import { PriorityBadge, TaskTypeBadge } from "@/components/ui/Badge";
import { TaskStatusSelect } from "@/components/ui/StatusSelect";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { Task, TaskStatus, toDate } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { updateTask } from "@/services/firestore";

interface TaskCardProps {
  task: Task;
  subtaskCount?: number;
  completedSubtaskCount?: number;
  onEdit: () => void;
  onDelete: () => void;
  showProject?: boolean;
  projectName?: string;
}

export default function TaskCard({
  task,
  subtaskCount = 0,
  completedSubtaskCount = 0,
  onEdit,
  onDelete,
  showProject = false,
  projectName,
}: TaskCardProps) {
  const { user } = useAuth();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const handleStatusChange = async (status: TaskStatus) => {
    if (!user) return;
    if (status === "completed") {
      setShowCompletionDialog(true);
      return;
    }
    await updateTask(user.uid, task.id, { status });
  };

  const handleComplete = async (notes: string) => {
    if (!user) return;
    await updateTask(user.uid, task.id, { status: "completed", completionNotes: notes });
    setShowCompletionDialog(false);
  };

  const dueDate = toDate(task.dueDate);
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "completed";

  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <Link
            href={`/projects/${task.projectId}/tasks/${task.id}`}
            className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
          >
            {task.name}
          </Link>
          {showProject && projectName && (
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              {projectName}
            </p>
          )}
        </div>
        <TaskStatusSelect value={task.status} onChange={handleStatusChange} />
      </div>

      {task.description && (
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 md:line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
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

        {task.timeSpent > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
            <LuClock className="h-3 w-3" />
            {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
          </span>
        )}

        {subtaskCount > 0 && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {completedSubtaskCount}/{subtaskCount} subtasks
          </span>
        )}
      </div>

      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <LuPencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <CompletionNotesDialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        onConfirm={handleComplete}
        taskName={task.name}
      />
    </div>
  );
}
