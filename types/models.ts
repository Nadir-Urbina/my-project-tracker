import { Timestamp } from "firebase/firestore";

/** Safely convert a Firestore Timestamp or plain {seconds} object to a Date */
export function toDate(value: Timestamp | { seconds: number } | null | undefined): Date | undefined {
  if (!value) return undefined;
  if (typeof (value as Timestamp).toDate === "function") return (value as Timestamp).toDate();
  if ("seconds" in value) return new Date(value.seconds * 1000);
  return undefined;
}

// Status types
export type EntityStatus = "ongoing" | "future" | "cancelled";
export type TaskStatus = "backlog" | "next_action" | "in_progress" | "completed" | "cancelled";
export type Priority = "low" | "medium" | "high";
export type TaskType =
  | "feature"
  | "bug"
  | "ui_ux"
  | "refactor"
  | "documentation"
  | "testing"
  | "follow_up"
  | "research";

// Context - top level grouping (e.g., "Day Job", "Side Business")
export interface Context {
  id: string;
  name: string;
  description: string;
  status: EntityStatus;
  color: string; // hex color
  icon: string; // react-icons icon name
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Project - belongs to a Context
export interface Project {
  id: string;
  contextId: string;
  name: string;
  description: string;
  status: EntityStatus;
  color: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Task - belongs to a Project
export interface Task {
  id: string;
  projectId: string;
  contextId: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  type: TaskType;
  dueDate: Timestamp | null;
  order: number;
  timeSpent: number; // minutes
  completionNotes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp | null;
}

// SubTask - belongs to a Task
export interface SubTask {
  id: string;
  taskId: string;
  projectId: string;
  contextId: string;
  name: string;
  status: TaskStatus;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp | null;
}

// Idea - standalone items that can be converted to Context or Project
export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form data types (without server-generated fields)
export type CreateContextData = Omit<Context, "id" | "createdAt" | "updatedAt">;
export type CreateProjectData = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type CreateTaskData = Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt" | "completionNotes">;
export type CreateSubTaskData = Omit<SubTask, "id" | "createdAt" | "updatedAt" | "completedAt">;
export type CreateIdeaData = Omit<Idea, "id" | "createdAt" | "updatedAt">;

// Status display helpers
export const ENTITY_STATUS_CONFIG: Record<EntityStatus, { label: string; color: string }> = {
  ongoing: { label: "Ongoing", color: "emerald" },
  future: { label: "Future", color: "blue" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "zinc" },
  next_action: { label: "Next Action", color: "blue" },
  in_progress: { label: "In Progress", color: "amber" },
  completed: { label: "Completed", color: "emerald" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "zinc" },
  medium: { label: "Medium", color: "amber" },
  high: { label: "High", color: "red" },
};

export const TASK_TYPE_CONFIG: Record<TaskType, { label: string; color: string; icon: string }> = {
  feature: { label: "New Feature", color: "violet", icon: "LuSparkles" },
  bug: { label: "Bug", color: "red", icon: "LuBug" },
  ui_ux: { label: "UI/UX", color: "pink", icon: "LuPaintbrush" },
  refactor: { label: "Refactor", color: "cyan", icon: "LuRefreshCw" },
  documentation: { label: "Docs", color: "blue", icon: "LuFileText" },
  testing: { label: "Testing", color: "emerald", icon: "LuFlaskConical" },
  follow_up: { label: "Follow Up", color: "amber", icon: "LuServer" },
  research: { label: "Research", color: "zinc", icon: "LuSearch" },
};

// Default context colors for quick selection
export const CONTEXT_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#84cc16", // lime
];
