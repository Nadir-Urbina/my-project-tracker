"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { createSubTask } from "@/services/firestore";

interface SubTaskFormProps {
  taskId: string;
  projectId: string;
  contextId: string;
  existingCount: number;
}

export default function SubTaskForm({
  taskId,
  projectId,
  contextId,
  existingCount,
}: SubTaskFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setLoading(true);

    try {
      await createSubTask(user.uid, {
        taskId,
        projectId,
        contextId,
        name: name.trim(),
        status: "backlog",
        order: existingCount,
      });
      setName("");
    } catch (err) {
      console.error("Error creating subtask:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2">
      <LuPlus className="h-4 w-4 shrink-0 text-zinc-400" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a sub-task..."
        disabled={loading}
        className="flex-1 bg-transparent text-sm text-zinc-700 placeholder-zinc-400 outline-none dark:text-zinc-300 dark:placeholder-zinc-500"
      />
      {name.trim() && (
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Add
        </button>
      )}
    </form>
  );
}
