"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LuArrowLeft, LuPencil, LuTrash2, LuCalendar, LuClock, LuChevronDown } from "react-icons/lu";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, useProjects, useSubTasks } from "@/hooks/useFirestore";
import { deleteTask, updateTask } from "@/services/firestore";
import { TaskStatus, toDate } from "@/types/models";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CompletionNotesDialog from "@/components/ui/CompletionNotesDialog";
import { useToast } from "@/components/ui/Toast";
import { TaskStatusBadge, PriorityBadge, TaskTypeBadge } from "@/components/ui/Badge";
import { TaskStatusSelect } from "@/components/ui/StatusSelect";
import TaskForm from "@/components/tasks/TaskForm";
import SubTaskItem from "@/components/tasks/SubTaskItem";
import SubTaskForm from "@/components/tasks/SubTaskForm";

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: tasks } = useTasks(projectId);
  const { data: projects } = useProjects();
  const { data: subtasks, loading } = useSubTasks(taskId);
  const { toast } = useToast();
  const [showDescription, setShowDescription] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const task = tasks.find((t) => t.id === taskId);
  const project = projects.find((p) => p.id === projectId);

  const handleStatusChange = async (status: TaskStatus) => {
    if (!user || !task) return;
    if (status === "completed") {
      setShowCompletionDialog(true);
      return;
    }
    await updateTask(user.uid, task.id, { status });
  };

  const handleComplete = async (notes: string) => {
    if (!user || !task) return;
    await updateTask(user.uid, task.id, { status: "completed", completionNotes: notes });
    setShowCompletionDialog(false);
  };

  const handleDelete = async () => {
    if (!user || !task) return;
    await deleteTask(user.uid, task.id);
    toast("Task deleted");
    router.push(`/projects/${projectId}`);
  };

  if (loading || !task) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  const dueDate = toDate(task.dueDate);
  const completedSubtasks = subtasks.filter((s) => s.status === "completed").length;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back button */}
      <button
        onClick={() => router.push(`/projects/${projectId}`)}
        className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <LuArrowLeft className="h-4 w-4" />
        Back to {project?.name || "Project"}
      </button>

      {/* Task header */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {task.name}
          </h1>
          <div className="flex items-center gap-2">
            <TaskStatusSelect value={task.status} onChange={handleStatusChange} />
            <button
              onClick={() => setShowEditForm(true)}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <LuPencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <LuTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="mb-4 flex items-center gap-1 text-left text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <LuChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${showDescription ? "rotate-0" : "-rotate-90"}`}
            />
            <span className={showDescription ? "" : "line-clamp-1"}>
              {task.description}
            </span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {task.type && <TaskTypeBadge type={task.type} />}
          <PriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />

          {dueDate && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <LuCalendar className="h-3.5 w-3.5" />
              Due {format(dueDate, "MMM d, yyyy")}
            </span>
          )}

          {task.timeSpent > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <LuClock className="h-3.5 w-3.5" />
              {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
            </span>
          )}
        </div>
      </div>

      {/* Sub-tasks */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Sub-tasks
            {subtasks.length > 0 && (
              <span className="ml-2 text-xs font-normal text-zinc-400">
                {completedSubtasks}/{subtasks.length} completed
              </span>
            )}
          </h2>
        </div>

        {subtasks.length > 0 && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {subtasks.map((subtask) => (
              <SubTaskItem key={subtask.id} subtask={subtask} />
            ))}
          </div>
        )}

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <SubTaskForm
            taskId={taskId}
            projectId={projectId}
            contextId={task.contextId}
            existingCount={subtasks.length}
          />
        </div>
      </div>

      <Modal
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Edit Task"
      >
        <TaskForm
          task={task}
          projectId={projectId}
          contextId={task.contextId}
          existingCount={0}
          onComplete={() => setShowEditForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task and all its sub-tasks?"
      />

      <CompletionNotesDialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        onConfirm={handleComplete}
        taskName={task?.name}
      />
    </div>
  );
}
