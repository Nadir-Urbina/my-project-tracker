"use client";

import { useState } from "react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { LuCalendarClock } from "react-icons/lu";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { PriorityBadge, TaskTypeBadge } from "@/components/ui/Badge";
import { TaskStatusSelect } from "@/components/ui/StatusSelect";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { Task, Project, TaskStatus, toDate } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { updateTask } from "@/services/firestore";

interface UpcomingDueWidgetProps {
  tasks: Task[];
  projects: Project[];
}

export default function UpcomingDueWidget({
  tasks,
  projects,
}: UpcomingDueWidgetProps) {
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
  };

  // Filter tasks with due dates in next 5 days (not completed/cancelled)
  const now = new Date();
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(now.getDate() + 5);

  const upcomingTasks = tasks
    .filter((task) => {
      if (task.status === "completed" || task.status === "cancelled") return false;
      const dueDate = toDate(task.dueDate);
      if (!dueDate) return false;
      return dueDate >= now && dueDate <= fiveDaysFromNow;
    })
    .sort((a, b) => {
      const dateA = toDate(a.dueDate);
      const dateB = toDate(b.dueDate);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

  const getDaysUntilDue = (task: Task) => {
    const dueDate = toDate(task.dueDate);
    if (!dueDate) return null;
    const days = differenceInDays(dueDate, now);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  const getDueDateColor = (task: Task) => {
    const dueDate = toDate(task.dueDate);
    if (!dueDate) return "";
    const days = differenceInDays(dueDate, now);
    if (days === 0) return "text-red-600 dark:text-red-400";
    if (days === 1) return "text-orange-600 dark:text-orange-400";
    return "text-amber-600 dark:text-amber-400";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <LuCalendarClock className="h-4 w-4 text-amber-500" />
              Upcoming Due ({upcomingTasks.length})
            </span>
          </CardTitle>
        </CardHeader>
        {upcomingTasks.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-zinc-500 dark:text-zinc-400">
            No tasks due in the next 5 days
          </p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {upcomingTasks.map((task) => {
              const dueDate = toDate(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Link
                      href={`/projects/${task.projectId}/tasks/${task.id}`}
                      className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                    >
                      {task.name}
                    </Link>
                    <TaskStatusSelect
                      value={task.status}
                      onChange={(status) => handleStatusChange(task.id, status)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {getProjectName(task.projectId)}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    {task.type && <TaskTypeBadge type={task.type} />}
                    <PriorityBadge priority={task.priority} />
                    {dueDate && (
                      <>
                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                        <span className={`font-medium ${getDueDateColor(task)}`}>
                          Due {getDaysUntilDue(task)} ({format(dueDate, "MMM d")})
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <CompletionNotesDialog
        open={!!completingTaskId}
        onClose={() => setCompletingTaskId(null)}
        onConfirm={handleComplete}
      />
    </>
  );
}
