"use client";

import Link from "next/link";
import { LuFolder } from "react-icons/lu";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { Project, Task, Context } from "@/types/models";

interface ProjectOverviewWidgetProps {
  projects: Project[];
  tasks: Task[];
  contexts: Context[];
}

export default function ProjectOverviewWidget({
  projects,
  tasks,
  contexts,
}: ProjectOverviewWidgetProps) {
  const activeProjects = projects.filter((p) => p.status === "ongoing");

  const getContextName = (contextId: string) =>
    contexts.find((c) => c.id === contextId)?.name || "";

  const getTaskStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const completed = projectTasks.filter((t) => t.status === "completed").length;
    return { total: projectTasks.length, completed };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <LuFolder className="h-4 w-4 text-zinc-500" />
            Active Projects
            <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {activeProjects.length}
            </span>
          </span>
        </CardTitle>
      </CardHeader>

      {activeProjects.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No active projects
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {activeProjects.map((project) => {
            const stats = getTaskStats(project.id);
            const progress =
              stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-lg border border-zinc-100 p-3 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                    {project.name}
                  </span>
                </div>
                <p className="mb-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {getContextName(project.contextId)}
                </p>
                <div className="mb-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {stats.completed}/{stats.total} tasks
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
