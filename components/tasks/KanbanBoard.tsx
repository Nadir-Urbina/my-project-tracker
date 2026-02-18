"use client";

import { useState, useMemo, useCallback } from "react";
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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/types/models";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

interface KanbanBoardProps {
  tasks: Task[];
  statusOrder: TaskStatus[];
  onTaskStatusChange: (
    taskId: string,
    newStatus: TaskStatus,
    newOrder: number
  ) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  projectMap?: Record<string, string>;
}

function computeColumns(
  tasks: Task[],
  statusOrder: TaskStatus[]
): Record<TaskStatus, Task[]> {
  const columns = {} as Record<TaskStatus, Task[]>;
  for (const status of statusOrder) {
    columns[status] = [];
  }
  for (const task of tasks) {
    if (columns[task.status]) {
      columns[task.status].push(task);
    }
  }
  // Sort each column by order
  for (const status of statusOrder) {
    columns[status].sort((a, b) => a.order - b.order);
  }
  return columns;
}

function computeNewOrder(tasks: Task[], dropIndex: number): number {
  if (tasks.length === 0) return 0;
  if (dropIndex === 0) return tasks[0].order - 1;
  if (dropIndex >= tasks.length) return tasks[tasks.length - 1].order + 1;
  return (tasks[dropIndex - 1].order + tasks[dropIndex].order) / 2;
}

export default function KanbanBoard({
  tasks,
  statusOrder,
  onTaskStatusChange,
  onEditTask,
  onDeleteTask,
  projectMap,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localColumns, setLocalColumns] = useState<Record<
    TaskStatus,
    Task[]
  > | null>(null);

  const columns = useMemo(
    () => computeColumns(tasks, statusOrder),
    [tasks, statusOrder]
  );

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

  const findTaskColumn = useCallback(
    (taskId: string, cols: Record<TaskStatus, Task[]>): TaskStatus | null => {
      for (const status of statusOrder) {
        if (cols[status].some((t) => t.id === taskId)) {
          return status;
        }
      }
      return null;
    },
    [statusOrder]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setLocalColumns({ ...columns });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !localColumns) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findTaskColumn(activeId, localColumns);
    // overId could be a status (column) or a task id
    const overColumn: TaskStatus | null =
      statusOrder.includes(overId as TaskStatus)
        ? (overId as TaskStatus)
        : findTaskColumn(overId, localColumns);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setLocalColumns((prev) => {
      if (!prev) return prev;
      const newCols = { ...prev };
      const task = newCols[activeColumn].find((t) => t.id === activeId);
      if (!task) return prev;

      newCols[activeColumn] = newCols[activeColumn].filter(
        (t) => t.id !== activeId
      );

      // Find the index to insert at
      const overIndex = newCols[overColumn].findIndex((t) => t.id === overId);
      const insertIndex =
        overIndex >= 0 ? overIndex : newCols[overColumn].length;

      newCols[overColumn] = [...newCols[overColumn]];
      newCols[overColumn].splice(insertIndex, 0, task);

      return newCols;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !localColumns) {
      setLocalColumns(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine the target column
    const targetColumn: TaskStatus | null = statusOrder.includes(
      overId as TaskStatus
    )
      ? (overId as TaskStatus)
      : findTaskColumn(overId, localColumns);

    if (!targetColumn) {
      setLocalColumns(null);
      return;
    }

    const columnTasks = localColumns[targetColumn];
    const taskIndex = columnTasks.findIndex((t) => t.id === activeId);
    const tasksWithout = columnTasks.filter((t) => t.id !== activeId);
    const newOrder = computeNewOrder(tasksWithout, taskIndex >= 0 ? taskIndex : tasksWithout.length);

    setLocalColumns(null);

    const task = tasks.find((t) => t.id === activeId);
    if (task && (task.status !== targetColumn || task.order !== newOrder)) {
      await onTaskStatusChange(activeId, targetColumn, newOrder);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setLocalColumns(null);
  };

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
        {statusOrder.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={displayColumns[status] || []}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            projectMap={projectMap}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragOverlay
            projectName={projectMap?.[activeTask.projectId]}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
