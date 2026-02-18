"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

interface Breadcrumb {
  label: string;
  href?: string;
}

function useBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [{ label: "Dashboard", href: "/" }];

  if (segments.length === 0) return crumbs;

  if (segments[0] === "contexts") {
    crumbs.push({ label: "Contexts", href: "/contexts" });
    if (segments[1]) {
      crumbs.push({ label: "Context Details" });
    }
  } else if (segments[0] === "tasks") {
    crumbs.push({ label: "Tasks" });
  } else if (segments[0] === "projects") {
    crumbs.push({ label: "Project Details" });
    if (segments[2] === "tasks" && segments[3]) {
      crumbs.push({ label: "Task Details" });
    }
  }

  return crumbs;
}

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4 md:px-6 dark:border-zinc-800 dark:bg-zinc-950">
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
    </header>
  );
}
