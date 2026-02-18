"use client";

import { LuTrash2 } from "react-icons/lu";
import { SubTask } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { updateSubTask, deleteSubTask } from "@/services/firestore";

interface SubTaskItemProps {
  subtask: SubTask;
}

export default function SubTaskItem({ subtask }: SubTaskItemProps) {
  const { user } = useAuth();
  const isCompleted = subtask.status === "completed";

  const toggleComplete = async () => {
    if (!user) return;
    await updateSubTask(user.uid, subtask.id, {
      status: isCompleted ? "backlog" : "completed",
    });
  };

  const handleDelete = async () => {
    if (!user) return;
    await deleteSubTask(user.uid, subtask.id);
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <button
        onClick={toggleComplete}
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-zinc-300 hover:border-blue-400 dark:border-zinc-600"
        }`}
      >
        {isCompleted && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm ${
          isCompleted
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {subtask.name}
      </span>
      <button
        onClick={handleDelete}
        className="rounded p-1 text-zinc-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:text-red-400"
      >
        <LuTrash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
