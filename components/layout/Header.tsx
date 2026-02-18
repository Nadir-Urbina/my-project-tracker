"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { useContexts, useProjects, useTasks } from "@/hooks/useFirestore";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface Breadcrumb {
  label: string;
  href?: string;
}

function useBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const { data: contexts } = useContexts();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();

  const crumbs: Breadcrumb[] = [{ label: "Dashboard", href: "/" }];

  if (segments.length === 0) return crumbs;

  // /contexts or /contexts/[contextId]
  if (segments[0] === "contexts") {
    crumbs.push({ label: "Contexts", href: "/contexts" });
    if (segments[1]) {
      const contextId = segments[1];
      const context = contexts.find((c) => c.id === contextId);
      crumbs.push({
        label: context?.name || "Context",
        href: `/contexts/${contextId}`
      });
    }
  }

  // /tasks
  else if (segments[0] === "tasks") {
    crumbs.push({ label: "Tasks" });
  }

  // /ideas
  else if (segments[0] === "ideas") {
    crumbs.push({ label: "Ideas" });
  }

  // /projects/[projectId] or /projects/[projectId]/tasks/[taskId]
  else if (segments[0] === "projects") {
    const projectId = segments[1];
    const project = projects.find((p) => p.id === projectId);

    if (project) {
      // Find the context this project belongs to
      const context = contexts.find((c) => c.id === project.contextId);

      // Add context breadcrumb
      if (context) {
        crumbs.push({
          label: context.name,
          href: `/contexts/${context.id}`
        });
      }

      // Add project breadcrumb
      crumbs.push({
        label: project.name,
        href: `/projects/${projectId}`
      });

      // /projects/[projectId]/tasks/[taskId]
      if (segments[2] === "tasks" && segments[3]) {
        const taskId = segments[3];
        const task = tasks.find((t) => t.id === taskId);
        crumbs.push({
          label: task?.name || "Task"
        });
      }
    } else {
      // Fallback if project not found yet (loading)
      crumbs.push({ label: "Project" });
      if (segments[2] === "tasks" && segments[3]) {
        crumbs.push({ label: "Task" });
      }
    }
  }

  return crumbs;
}

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <LuChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
      <ThemeToggle />
    </header>
  );
}
