"use client";

import { useState } from "react";
import Link from "next/link";
import { LuActivity } from "react-icons/lu";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { PriorityBadge, TaskTypeBadge } from "@/components/ui/Badge";
import { TaskStatusSelect } from "@/components/ui/StatusSelect";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { Task, Project, TaskStatus } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { updateTask } from "@/services/firestore";
import { celebrateTaskCompletion } from "@/lib/confetti";

interface InProgressWidgetProps {
  tasks: Task[];
  projects: Project[];
}

export default function InProgressWidget({
  tasks,
  projects,
}: InProgressWidgetProps) {
  const { user } = useAuth();
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const getProjectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name || "Unknown";

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!user) return;
    if (status === "completed") {
      setCompletingTaskId(taskId);
      return;
    }
    await updateTask(user.uid, taskId, { status });
  };

  const handleComplete = async (notes: string) => {
    if (!user || !completingTaskId) return;
    await updateTask(user.uid, completingTaskId, { status: "completed", completionNotes: notes });
    setCompletingTaskId(null);
    celebrateTaskCompletion();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <LuActivity className="h-4 w-4 text-amber-500" />
            In Progress
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {tasks.length}
            </span>
          </span>
        </CardTitle>
      </CardHeader>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No tasks in progress
        </p>
      ) : (
        <div className="space-y-1.5">
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/projects/${task.projectId}/tasks/${task.id}`}
                  className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                >
                  {task.name}
                </Link>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {getProjectName(task.projectId)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {task.type && <TaskTypeBadge type={task.type} />}
                <PriorityBadge priority={task.priority} />
                <TaskStatusSelect
                  value={task.status}
                  onChange={(s) => handleStatusChange(task.id, s)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <CompletionNotesDialog
        open={!!completingTaskId}
        onClose={() => setCompletingTaskId(null)}
        onConfirm={handleComplete}
        taskName={completingTaskId ? tasks.find((t) => t.id === completingTaskId)?.name : undefined}
      />
    </Card>
  );
}
