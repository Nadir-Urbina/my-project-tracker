"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TASK_STATUS_CONFIG, TaskStatus, Task } from "@/types/models";
import KanbanCard from "./KanbanCard";

const STATUS_BORDER_COLORS: Record<TaskStatus, string> = {
  backlog: "#a1a1aa",
  next_action: "#3b82f6",
  in_progress: "#f59e0b",
  completed: "#10b981",
  cancelled: "#ef4444",
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  projectMap?: Record<string, string>;
}

export default function KanbanColumn({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  projectMap,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = TASK_STATUS_CONFIG[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={`flex min-w-[272px] flex-col rounded-xl transition-colors ${
        isOver
          ? "bg-blue-50/70 dark:bg-blue-950/20"
          : "bg-zinc-50 dark:bg-zinc-900/50"
      }`}
    >
      <div
        className="rounded-t-xl border-t-2 px-3 py-2.5"
        style={{ borderColor: STATUS_BORDER_COLORS[status] }}
      >
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {config.label}
          <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className="kanban-column flex-1 space-y-2 overflow-y-auto px-2 pb-2 pt-1"
        style={{ minHeight: "200px", maxHeight: "calc(100vh - 260px)" }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              projectName={projectMap?.[task.projectId]}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
