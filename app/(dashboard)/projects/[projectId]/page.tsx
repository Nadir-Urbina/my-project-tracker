"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LuPlus, LuFolder, LuChevronDown } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, useTasks } from "@/hooks/useFirestore";
import { deleteTask, updateTask } from "@/services/firestore";
import { Task, TASK_STATUS_CONFIG, TaskStatus } from "@/types/models";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useIsMobile } from "@/hooks/useIsMobile";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { useToast } from "@/components/ui/Toast";
import { EntityStatusBadge } from "@/components/ui/Badge";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import ViewToggle from "@/components/ui/ViewToggle";

const STATUS_ORDER: TaskStatus[] = [
  "in_progress",
  "next_action",
  "backlog",
  "completed",
  "cancelled",
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { data: tasks, loading } = useTasks(projectId);
  const { toast } = useToast();
  const [view, setView] = useLocalStorage<"list" | "kanban">("projectView", "list");
  const isMobile = useIsMobile();
  const effectiveView = isMobile ? "list" : view;
  const [showDescription, setShowDescription] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [pendingCompletion, setPendingCompletion] = useState<{
    taskId: string;
    newOrder: number;
  } | null>(null);

  const project = projects.find((p) => p.id === projectId);

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: TaskStatus,
    newOrder: number
  ) => {
    if (!user) return;
    if (newStatus === "completed") {
      setPendingCompletion({ taskId, newOrder });
      return;
    }
    await updateTask(user.uid, taskId, { status: newStatus, order: newOrder });
  };

  const handleKanbanComplete = async (notes: string) => {
    if (!user || !pendingCompletion) return;
    await updateTask(user.uid, pendingCompletion.taskId, {
      status: "completed",
      order: pendingCompletion.newOrder,
      completionNotes: notes,
    });
    setPendingCompletion(null);
  };

  const handleDelete = async () => {
    if (!user || !deletingTaskId) return;
    await deleteTask(user.uid, deletingTaskId);
    setDeletingTaskId(null);
    toast("Task deleted");
  };

  const groupedTasks = STATUS_ORDER.reduce(
    (acc, status) => {
      const statusTasks = tasks.filter((t) => t.status === status);
      if (statusTasks.length > 0) {
        acc[status] = statusTasks;
      }
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

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
            {project && (
              <LuFolder className="h-6 w-6 shrink-0" style={{ color: project.color }} />
            )}
            <h1 className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {project?.name || "Project"}
            </h1>
            {project && <EntityStatusBadge status={project.status} />}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            <Button onClick={() => setShowForm(true)}>
              <LuPlus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
        {project?.description && (
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="mt-2 flex items-center gap-1 text-left text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <LuChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${showDescription ? "rotate-0" : "-rotate-90"}`}
            />
            <span className={showDescription ? "" : "line-clamp-1"}>
              {project.description}
            </span>
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to start tracking your work"
          action={{ label: "Create Task", onClick: () => setShowForm(true) }}
        />
      ) : effectiveView === "kanban" ? (
        <KanbanBoard
          tasks={tasks}
          statusOrder={STATUS_ORDER}
          onTaskStatusChange={handleTaskStatusChange}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowForm(true);
          }}
          onDeleteTask={(taskId) => setDeletingTaskId(taskId)}
        />
      ) : (
        <div className="space-y-6">
          {STATUS_ORDER.map((status) => {
            const statusTasks = groupedTasks[status];
            if (!statusTasks) return null;
            return (
              <div key={status}>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {TASK_STATUS_CONFIG[status].label}
                  <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {statusTasks.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => {
                        setEditingTask(task);
                        setShowForm(true);
                      }}
                      onDelete={() => setDeletingTaskId(task.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          task={editingTask}
          projectId={projectId}
          contextId={project?.contextId || ""}
          existingCount={tasks.length}
          onComplete={() => {
            setShowForm(false);
            setEditingTask(undefined);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task and all its sub-tasks?"
      />

      <CompletionNotesDialog
        open={!!pendingCompletion}
        onClose={() => setPendingCompletion(null)}
        onConfirm={handleKanbanComplete}
        taskName={
          pendingCompletion
            ? tasks.find((t) => t.id === pendingCompletion.taskId)?.name
            : undefined
        }
      />
    </div>
  );
}
