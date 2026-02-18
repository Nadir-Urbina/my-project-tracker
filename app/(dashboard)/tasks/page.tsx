"use client";

import { useState, useMemo } from "react";
import { LuListChecks } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useContexts, useProjects, useTasks } from "@/hooks/useFirestore";
import { deleteTask, updateTask } from "@/services/firestore";
import { Task, TASK_STATUS_CONFIG, TaskStatus } from "@/types/models";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useIsMobile } from "@/hooks/useIsMobile";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { useToast } from "@/components/ui/Toast";
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

export default function AllTasksPage() {
  const { user } = useAuth();
  const { data: contexts } = useContexts();
  const { data: projects } = useProjects();
  const { data: allTasks, loading } = useTasks();
  const { toast } = useToast();
  const [view, setView] = useLocalStorage<"list" | "kanban">("allTasksView", "list");
  const isMobile = useIsMobile();
  const effectiveView = isMobile ? "list" : view;

  const [selectedContextId, setSelectedContextId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [pendingCompletion, setPendingCompletion] = useState<{
    taskId: string;
    newOrder: number;
  } | null>(null);

  // Filter projects by selected context
  const filteredProjects = useMemo(() => {
    if (!selectedContextId) return projects;
    return projects.filter((p) => p.contextId === selectedContextId);
  }, [projects, selectedContextId]);

  // Filter tasks by selected context and/or project
  const filteredTasks = useMemo(() => {
    let tasks = allTasks;
    if (selectedContextId) {
      tasks = tasks.filter((t) => t.contextId === selectedContextId);
    }
    if (selectedProjectId) {
      tasks = tasks.filter((t) => t.projectId === selectedProjectId);
    }
    return tasks;
  }, [allTasks, selectedContextId, selectedProjectId]);

  // Map projectId -> project name for display
  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of projects) {
      map[p.id] = p.name;
    }
    return map;
  }, [projects]);

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

  const handleContextFilterChange = (contextId: string) => {
    setSelectedContextId(contextId);
    setSelectedProjectId("");
  };

  const groupedTasks = STATUS_ORDER.reduce(
    (acc, status) => {
      const statusTasks = filteredTasks.filter((t) => t.status === status);
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
          <div className="flex items-center gap-3">
            <LuListChecks className="h-6 w-6 shrink-0 text-zinc-700 dark:text-zinc-300" />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              All Tasks
            </h1>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {filteredTasks.length}
            </span>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedContextId}
            onChange={(e) => handleContextFilterChange(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="">All Contexts</option>
            {contexts.map((ctx) => (
              <option key={ctx.id} value={ctx.id}>
                {ctx.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="">All Projects</option>
            {filteredProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {allTasks.length === 0
              ? "No tasks yet. Create tasks from within a project."
              : "No tasks match the selected filters."}
          </p>
        </div>
      ) : effectiveView === "kanban" ? (
        <KanbanBoard
          tasks={filteredTasks}
          statusOrder={STATUS_ORDER}
          onTaskStatusChange={handleTaskStatusChange}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowForm(true);
          }}
          onDeleteTask={(taskId) => setDeletingTaskId(taskId)}
          projectMap={projectMap}
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
                      showProject
                      projectName={projectMap[task.projectId]}
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
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            projectId={editingTask.projectId}
            contextId={editingTask.contextId}
            existingCount={0}
            onComplete={() => {
              setShowForm(false);
              setEditingTask(undefined);
            }}
          />
        )}
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
            ? allTasks.find((t) => t.id === pendingCompletion.taskId)?.name
            : undefined
        }
      />
    </div>
  );
}
