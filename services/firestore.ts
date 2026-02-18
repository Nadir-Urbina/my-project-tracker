import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Context,
  Project,
  Task,
  SubTask,
  Idea,
  CreateContextData,
  CreateProjectData,
  CreateTaskData,
  CreateSubTaskData,
  CreateIdeaData,
  TaskStatus,
  CONTEXT_COLORS,
} from "@/types/models";

// Collection references scoped to user
function userCollection(uid: string, collectionName: string) {
  return collection(db, "users", uid, collectionName);
}

function userDoc(uid: string, collectionName: string, docId: string) {
  return doc(db, "users", uid, collectionName, docId);
}

// ============ CONTEXTS ============

export async function createContext(uid: string, data: CreateContextData) {
  const ref = await addDoc(userCollection(uid, "contexts"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContext(
  uid: string,
  contextId: string,
  data: Partial<Omit<Context, "id" | "createdAt">>
) {
  await updateDoc(userDoc(uid, "contexts", contextId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteContext(uid: string, contextId: string) {
  await deleteDoc(userDoc(uid, "contexts", contextId));
}

export function contextsQuery(uid: string) {
  return query(userCollection(uid, "contexts"), orderBy("order", "asc"));
}

// ============ PROJECTS ============

export async function createProject(uid: string, data: CreateProjectData) {
  const ref = await addDoc(userCollection(uid, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  uid: string,
  projectId: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
) {
  await updateDoc(userDoc(uid, "projects", projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(uid: string, projectId: string) {
  await deleteDoc(userDoc(uid, "projects", projectId));
}

export function projectsQuery(uid: string, contextId?: string) {
  const col = userCollection(uid, "projects");
  if (contextId) {
    return query(col, where("contextId", "==", contextId), orderBy("order", "asc"));
  }
  return query(col, orderBy("order", "asc"));
}

// ============ TASKS ============

export async function createTask(uid: string, data: CreateTaskData) {
  const ref = await addDoc(userCollection(uid, "tasks"), {
    ...data,
    completionNotes: "",
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTask(
  uid: string,
  taskId: string,
  data: Partial<Omit<Task, "id" | "createdAt">>
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Auto-set completedAt when marking as completed
  if (data.status === "completed") {
    updateData.completedAt = serverTimestamp();
  } else if (data.status) {
    updateData.completedAt = null;
    updateData.completionNotes = "";
  }

  await updateDoc(userDoc(uid, "tasks", taskId), updateData);
}

export async function deleteTask(uid: string, taskId: string) {
  await deleteDoc(userDoc(uid, "tasks", taskId));
}

export function tasksQuery(uid: string, projectId?: string) {
  const col = userCollection(uid, "tasks");
  if (projectId) {
    return query(col, where("projectId", "==", projectId), orderBy("order", "asc"));
  }
  return query(col, orderBy("order", "asc"));
}

export function tasksByStatusQuery(uid: string, status: TaskStatus) {
  return query(
    userCollection(uid, "tasks"),
    where("status", "==", status),
    orderBy("updatedAt", "desc")
  );
}

export function recentlyCompletedTasksQuery(uid: string, since: Date) {
  return query(
    userCollection(uid, "tasks"),
    where("status", "==", "completed"),
    where("completedAt", ">=", Timestamp.fromDate(since)),
    orderBy("completedAt", "desc")
  );
}

// ============ SUBTASKS ============

export async function createSubTask(uid: string, data: CreateSubTaskData) {
  const ref = await addDoc(userCollection(uid, "subtasks"), {
    ...data,
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSubTask(
  uid: string,
  subtaskId: string,
  data: Partial<Omit<SubTask, "id" | "createdAt">>
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.status === "completed") {
    updateData.completedAt = serverTimestamp();
  } else if (data.status) {
    updateData.completedAt = null;
  }

  await updateDoc(userDoc(uid, "subtasks", subtaskId), updateData);
}

export async function deleteSubTask(uid: string, subtaskId: string) {
  await deleteDoc(userDoc(uid, "subtasks", subtaskId));
}

export function subtasksQuery(uid: string, taskId: string) {
  return query(
    userCollection(uid, "subtasks"),
    where("taskId", "==", taskId),
    orderBy("order", "asc")
  );
}

// ============ IDEAS ============

export async function createIdea(uid: string, data: CreateIdeaData) {
  const ref = await addDoc(userCollection(uid, "ideas"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateIdea(
  uid: string,
  ideaId: string,
  data: Partial<Omit<Idea, "id" | "createdAt">>
) {
  await updateDoc(userDoc(uid, "ideas", ideaId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIdea(uid: string, ideaId: string) {
  await deleteDoc(userDoc(uid, "ideas", ideaId));
}

export function ideasQuery(uid: string) {
  return query(
    userCollection(uid, "ideas"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );
}

// ============ IDEA CONVERSIONS ============

export async function convertIdeaToContext(uid: string, idea: Idea) {
  // Get current context count for order
  const contextsSnapshot = await query(userCollection(uid, "contexts"));

  // Pick a random color
  const randomColor = CONTEXT_COLORS[Math.floor(Math.random() * CONTEXT_COLORS.length)];

  // Create context from idea
  const contextData: CreateContextData = {
    name: idea.title,
    description: idea.description,
    status: "ongoing",
    color: randomColor,
    icon: "LuCircleDot",
    order: 0, // Will be reordered by the UI
  };

  const contextId = await createContext(uid, contextData);

  // Delete the idea
  await deleteIdea(uid, idea.id);

  return contextId;
}

export async function convertIdeaToProject(
  uid: string,
  idea: Idea,
  contextId: string
) {
  // Pick a random color
  const randomColor = CONTEXT_COLORS[Math.floor(Math.random() * CONTEXT_COLORS.length)];

  // Create project from idea
  const projectData: CreateProjectData = {
    contextId,
    name: idea.title,
    description: idea.description,
    status: "ongoing",
    color: randomColor,
    order: 0, // Will be reordered by the UI
  };

  const projectId = await createProject(uid, projectData);

  // Delete the idea
  await deleteIdea(uid, idea.id);

  return projectId;
}
