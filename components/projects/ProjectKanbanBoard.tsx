"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { LuFolder, LuPencil, LuTrash2 } from "react-icons/lu";
import { EntityStatusBadge } from "@/components/ui/Badge";
import {
  Project,
  EntityStatus,
  ENTITY_STATUS_CONFIG,
} from "@/types/models";

// ============ Types ============

const STATUS_ORDER: EntityStatus[] = ["ongoing", "future", "cancelled"];

const STATUS_BORDER_COLORS: Record<EntityStatus, string> = {
  ongoing: "#10b981",
  future: "#3b82f6",
  cancelled: "#ef4444",
};

interface ProjectKanbanBoardProps {
  projects: Project[];
  taskCounts: Record<string, { total: number; completed: number }>;
  onStatusChange: (
    projectId: string,
    newStatus: EntityStatus,
    newOrder: number
  ) => Promise<void>;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

// ============ Draggable Project Card ============

interface KanbanProjectCardProps {
  project: Project;
  taskCount: number;
  completedTaskCount: number;
  onEdit: () => void;
  onDelete: () => void;
  isDragOverlay?: boolean;
}

function KanbanProjectCard({
  project,
  taskCount,
  completedTaskCount,
  onEdit,
  onDelete,
  isDragOverlay = false,
}: KanbanProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const progress =
    taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab rounded-lg border bg-white p-3 transition-shadow active:cursor-grabbing dark:bg-zinc-900 ${
        isDragOverlay
          ? "kanban-drag-overlay border-blue-300 ring-2 ring-blue-500/30 dark:border-blue-700"
          : isDragging
            ? "border-zinc-200 opacity-40 dark:border-zinc-800"
            : "border-zinc-200 hover:shadow-sm dark:border-zinc-800"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <LuFolder
            className="h-4 w-4 shrink-0"
            style={{ color: project.color }}
          />
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
            onClick={(e) => {
              if (isDragging || isDragOverlay) e.preventDefault();
            }}
          >
            {project.name}
          </Link>
        </div>
        <EntityStatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mb-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        {completedTaskCount}/{taskCount} tasks completed
      </p>

      {!isDragOverlay && (
        <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <LuPencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Column ============

interface ColumnProps {
  status: EntityStatus;
  projects: Project[];
  taskCounts: Record<string, { total: number; completed: number }>;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

function Column({
  status,
  projects,
  taskCounts,
  onEditProject,
  onDeleteProject,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = ENTITY_STATUS_CONFIG[status];
  const projectIds = projects.map((p) => p.id);

  return (
    <div
      className={`flex min-w-[300px] flex-1 flex-col rounded-xl transition-colors ${
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
            {projects.length}
          </span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className="kanban-column flex-1 space-y-2 overflow-y-auto px-2 pb-2 pt-1"
        style={{ minHeight: "200px", maxHeight: "calc(100vh - 260px)" }}
      >
        <SortableContext
          items={projectIds}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => {
            const counts = taskCounts[project.id] || {
              total: 0,
              completed: 0,
            };
            return (
              <KanbanProjectCard
                key={project.id}
                project={project}
                taskCount={counts.total}
                completedTaskCount={counts.completed}
                onEdit={() => onEditProject(project)}
                onDelete={() => onDeleteProject(project.id)}
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
}

// ============ Board ============

function computeColumns(
  projects: Project[]
): Record<EntityStatus, Project[]> {
  const columns: Record<EntityStatus, Project[]> = {
    ongoing: [],
    future: [],
    cancelled: [],
  };
  for (const project of projects) {
    if (columns[project.status]) {
      columns[project.status].push(project);
    }
  }
  for (const status of STATUS_ORDER) {
    columns[status].sort((a, b) => a.order - b.order);
  }
  return columns;
}

function computeNewOrder(projects: Project[], dropIndex: number): number {
  if (projects.length === 0) return 0;
  if (dropIndex === 0) return projects[0].order - 1;
  if (dropIndex >= projects.length)
    return projects[projects.length - 1].order + 1;
  return (projects[dropIndex - 1].order + projects[dropIndex].order) / 2;
}

export default function ProjectKanbanBoard({
  projects,
  taskCounts,
  onStatusChange,
  onEditProject,
  onDeleteProject,
}: ProjectKanbanBoardProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [localColumns, setLocalColumns] = useState<Record<
    EntityStatus,
    Project[]
  > | null>(null);

  const columns = useMemo(() => computeColumns(projects), [projects]);
  const displayColumns = localColumns ?? columns;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findProjectColumn = useCallback(
    (
      projectId: string,
      cols: Record<EntityStatus, Project[]>
    ): EntityStatus | null => {
      for (const status of STATUS_ORDER) {
        if (cols[status].some((p) => p.id === projectId)) {
          return status;
        }
      }
      return null;
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find((p) => p.id === event.active.id);
    if (project) {
      setActiveProject(project);
      setLocalColumns({ ...columns });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !localColumns) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findProjectColumn(activeId, localColumns);
    const overColumn: EntityStatus | null = STATUS_ORDER.includes(
      overId as EntityStatus
    )
      ? (overId as EntityStatus)
      : findProjectColumn(overId, localColumns);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setLocalColumns((prev) => {
      if (!prev) return prev;
      const newCols = { ...prev };
      const project = newCols[activeColumn].find((p) => p.id === activeId);
      if (!project) return prev;

      newCols[activeColumn] = newCols[activeColumn].filter(
        (p) => p.id !== activeId
      );

      const overIndex = newCols[overColumn].findIndex((p) => p.id === overId);
      const insertIndex =
        overIndex >= 0 ? overIndex : newCols[overColumn].length;

      newCols[overColumn] = [...newCols[overColumn]];
      newCols[overColumn].splice(insertIndex, 0, project);

      return newCols;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over || !localColumns) {
      setLocalColumns(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const targetColumn: EntityStatus | null = STATUS_ORDER.includes(
      overId as EntityStatus
    )
      ? (overId as EntityStatus)
      : findProjectColumn(overId, localColumns);

    if (!targetColumn) {
      setLocalColumns(null);
      return;
    }

    const columnProjects = localColumns[targetColumn];
    const projectIndex = columnProjects.findIndex((p) => p.id === activeId);
    const projectsWithout = columnProjects.filter((p) => p.id !== activeId);
    const newOrder = computeNewOrder(
      projectsWithout,
      projectIndex >= 0 ? projectIndex : projectsWithout.length
    );

    setLocalColumns(null);

    const project = projects.find((p) => p.id === activeId);
    if (project && (project.status !== targetColumn || project.order !== newOrder)) {
      await onStatusChange(activeId, targetColumn, newOrder);
    }
  };

  const handleDragCancel = () => {
    setActiveProject(null);
    setLocalColumns(null);
  };

  const activeCounts = activeProject
    ? taskCounts[activeProject.id] || { total: 0, completed: 0 }
    : { total: 0, completed: 0 };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            projects={displayColumns[status] || []}
            taskCounts={taskCounts}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProject ? (
          <KanbanProjectCard
            project={activeProject}
            taskCount={activeCounts.total}
            completedTaskCount={activeCounts.completed}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
