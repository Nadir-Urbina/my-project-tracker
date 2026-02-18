"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { LuCircleCheck } from "react-icons/lu";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { Task, Project, toDate } from "@/types/models";

interface RecentlyCompletedWidgetProps {
  tasks: Task[];
  projects: Project[];
}

export default function RecentlyCompletedWidget({
  tasks,
  projects,
}: RecentlyCompletedWidgetProps) {
  const getProjectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name || "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <LuCircleCheck className="h-4 w-4 text-emerald-500" />
            Recently Completed
          </span>
        </CardTitle>
      </CardHeader>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No recently completed tasks
        </p>
      ) : (
        <div className="space-y-1.5">
          {tasks.slice(0, 8).map((task) => {
            const completedAt = toDate(task.completedAt);
            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <LuCircleCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <Link
                      href={`/projects/${task.projectId}/tasks/${task.id}`}
                      className="text-sm text-zinc-600 line-through hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                      {task.name}
                    </Link>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {getProjectName(task.projectId)}
                    </p>
                  </div>
                </div>
                {completedAt && (
                  <span className="ml-2 shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDistanceToNow(completedAt, { addSuffix: true })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
