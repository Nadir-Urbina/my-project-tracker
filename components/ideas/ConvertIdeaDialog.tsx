"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useContexts } from "@/hooks/useFirestore";
import { convertIdeaToProject } from "@/services/firestore";
import { Idea } from "@/types/models";
import Button from "@/components/ui/Button";

interface ConvertIdeaDialogProps {
  idea: Idea;
  onComplete: (contextId: string, projectId: string) => void;
  onCancel: () => void;
}

export default function ConvertIdeaDialog({
  idea,
  onComplete,
  onCancel,
}: ConvertIdeaDialogProps) {
  const { user } = useAuth();
  const { data: contexts } = useContexts();
  const [selectedContextId, setSelectedContextId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedContextId) return;

    setLoading(true);
    try {
      const projectId = await convertIdeaToProject(user.uid, idea, selectedContextId);
      onComplete(selectedContextId, projectId);
    } catch (error) {
      console.error("Error converting idea to project:", error);
    } finally {
      setLoading(false);
    }
  };

  const ongoingContexts = contexts.filter((c) => c.status === "ongoing");

  return (
    <form onSubmit={handleConvert} className="space-y-4">
      <div>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Convert <strong>{idea.title}</strong> into a new project.
        </p>

        <label htmlFor="context" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Select Context
        </label>
        <select
          id="context"
          value={selectedContextId}
          onChange={(e) => setSelectedContextId(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          required
        >
          <option value="">Choose a context...</option>
          {ongoingContexts.map((context) => (
            <option key={context.id} value={context.id}>
              {context.name}
            </option>
          ))}
        </select>
        {ongoingContexts.length === 0 && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            No active contexts available. Create a context first.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !selectedContextId}>
          {loading ? "Converting..." : "Convert to Project"}
        </Button>
      </div>
    </form>
  );
}
