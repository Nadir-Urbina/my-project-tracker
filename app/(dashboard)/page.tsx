"use client";

import {
  useContexts,
  useProjects,
  useTasks,
  useTasksByStatus,
  useRecentlyCompletedTasks,
} from "@/hooks/useFirestore";
import { toDate } from "@/types/models";
import WelcomeBar from "@/components/dashboard/WelcomeBar";
import NextActionsWidget from "@/components/dashboard/NextActionsWidget";
import InProgressWidget from "@/components/dashboard/InProgressWidget";
import UpcomingDueWidget from "@/components/dashboard/UpcomingDueWidget";
import RecentlyCompletedWidget from "@/components/dashboard/RecentlyCompletedWidget";
import ProjectOverviewWidget from "@/components/dashboard/ProjectOverviewWidget";

export default function DashboardPage() {
  const { data: contexts } = useContexts();
  const { data: projects } = useProjects();
  const { data: allTasks } = useTasks();
  const { data: nextActions } = useTasksByStatus("next_action");
  const { data: inProgress } = useTasksByStatus("in_progress");
  const { data: recentlyCompleted } = useRecentlyCompletedTasks(7);

  // Count tasks completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = recentlyCompleted.filter((t) => {
    const completedAt = toDate(t.completedAt);
    return completedAt && completedAt >= today;
  }).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <WelcomeBar
        completedToday={completedToday}
        nextActionCount={nextActions.length}
        inProgressCount={inProgress.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <NextActionsWidget tasks={nextActions} projects={projects} />
        <InProgressWidget tasks={inProgress} projects={projects} />
      </div>

      <UpcomingDueWidget tasks={allTasks} projects={projects} />

      <ProjectOverviewWidget
        projects={projects}
        tasks={allTasks}
        contexts={contexts}
      />

      <RecentlyCompletedWidget
        tasks={recentlyCompleted}
        projects={projects}
      />
    </div>
  );
}
