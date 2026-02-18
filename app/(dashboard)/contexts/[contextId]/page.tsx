"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LuPlus, LuCircleDot, LuChevronDown } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useContexts, useProjects, useTasks } from "@/hooks/useFirestore";
import { deleteProject, updateProject } from "@/services/firestore";
import { Project, EntityStatus } from "@/types/models";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useIsMobile } from "@/hooks/useIsMobile";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { EntityStatusBadge } from "@/components/ui/Badge";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectKanbanBoard from "@/components/projects/ProjectKanbanBoard";
import ViewToggle from "@/components/ui/ViewToggle";

export default function ContextDetailPage() {
  const { contextId } = useParams<{ contextId: string }>();
  const { user } = useAuth();
  const { data: contexts } = useContexts();
  const { data: projects, loading } = useProjects(contextId);
  const { data: tasks } = useTasks();
  const { toast } = useToast();
  const [view, setView] = useLocalStorage<"list" | "kanban">("contextView", "list");
  const isMobile = useIsMobile();
  const effectiveView = isMobile ? "list" : view;
  const [showDescription, setShowDescription] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const context = contexts.find((c) => c.id === contextId);

  const getTaskCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId).length;

  const getCompletedTaskCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId && t.status === "completed").length;

  const taskCounts = projects.reduce(
    (acc, p) => {
      acc[p.id] = {
        total: getTaskCount(p.id),
        completed: getCompletedTaskCount(p.id),
      };
      return acc;
    },
    {} as Record<string, { total: number; completed: number }>
  );

  const handleStatusChange = async (
    projectId: string,
    newStatus: EntityStatus,
    newOrder: number
  ) => {
    if (!user) return;
    await updateProject(user.uid, projectId, { status: newStatus, order: newOrder });
  };

  const handleDelete = async () => {
    if (!user || !deletingProjectId) return;
    await deleteProject(user.uid, deletingProjectId);
    setDeletingProjectId(null);
    toast("Project deleted");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {context && (
              <LuCircleDot className="h-6 w-6 shrink-0" style={{ color: context.color }} />
            )}
            <h1 className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {context?.name || "Context"}
            </h1>
            {context && <EntityStatusBadge status={context.status} />}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <Button onClick={() => setShowForm(true)}>
              <LuPlus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        {context?.description && (
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="mt-2 flex items-center gap-1 text-left text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <LuChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${showDescription ? "rotate-0" : "-rotate-90"}`}
            />
            <span className={showDescription ? "" : "line-clamp-1"}>
              {context.description}
            </span>
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project in this context"
          action={{ label: "Create Project", onClick: () => setShowForm(true) }}
        />
      ) : effectiveView === "kanban" ? (
        <ProjectKanbanBoard
          projects={projects}
          taskCounts={taskCounts}
          onStatusChange={handleStatusChange}
          onEditProject={(project) => {
            setEditingProject(project);
            setShowForm(true);
          }}
          onDeleteProject={(projectId) => setDeletingProjectId(projectId)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={getTaskCount(project.id)}
              completedTaskCount={getCompletedTaskCount(project.id)}
              onEdit={() => {
                setEditingProject(project);
                setShowForm(true);
              }}
              onDelete={() => setDeletingProjectId(project.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProject(undefined);
        }}
        title={editingProject ? "Edit Project" : "New Project"}
      >
        <ProjectForm
          project={editingProject}
          contextId={contextId}
          existingCount={projects.length}
          onComplete={() => {
            setShowForm(false);
            setEditingProject(undefined);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingProjectId}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All tasks within it will also be deleted."
      />
    </div>
  );
}
