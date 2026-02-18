"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createContext, updateContext } from "@/services/firestore";
import { Context, EntityStatus, CONTEXT_COLORS } from "@/types/models";
import Button from "@/components/ui/Button";

interface ContextFormProps {
  context?: Context;
  onComplete: () => void;
  existingCount: number;
}

export default function ContextForm({
  context,
  onComplete,
  existingCount,
}: ContextFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(context?.name || "");
  const [description, setDescription] = useState(context?.description || "");
  const [status, setStatus] = useState<EntityStatus>(context?.status || "ongoing");
  const [color, setColor] = useState(context?.color || CONTEXT_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      if (context) {
        await updateContext(user.uid, context.id, {
          name,
          description,
          status,
          color,
        });
      } else {
        await createContext(user.uid, {
          name,
          description,
          status,
          color,
          icon: "folder",
          order: existingCount,
        });
      }
      onComplete();
    } catch (err) {
      console.error("Error saving context:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., Day Job, Side Business"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What is this context about?"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EntityStatus)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="ongoing">Ongoing</option>
          <option value="future">Future</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Color
        </label>
        <div className="flex gap-2">
          {CONTEXT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition-all ${
                color === c
                  ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Saving..." : context ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
