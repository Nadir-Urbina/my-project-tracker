"use client";

import { useEffect, useMemo, useState } from "react";
import { onSnapshot, Query, DocumentData } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import {
  Context,
  Project,
  Task,
  SubTask,
  TaskStatus,
} from "@/types/models";
import {
  contextsQuery,
  projectsQuery,
  tasksQuery,
  tasksByStatusQuery,
  recentlyCompletedTasksQuery,
  subtasksQuery,
} from "@/services/firestore";

interface UseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

function useCollection<T>(
  query: Query<DocumentData> | null
): UseCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [query]);

  return { data, loading, error };
}

// ============ HOOKS ============

export function useContexts(): UseCollectionResult<Context> {
  const { user } = useAuth();
  const query = useMemo(
    () => (user ? contextsQuery(user.uid) : null),
    [user]
  );
  return useCollection<Context>(query);
}

export function useProjects(contextId?: string): UseCollectionResult<Project> {
  const { user } = useAuth();
  const query = useMemo(
    () => (user ? projectsQuery(user.uid, contextId) : null),
    [user, contextId]
  );
  return useCollection<Project>(query);
}

export function useTasks(projectId?: string): UseCollectionResult<Task> {
  const { user } = useAuth();
  const query = useMemo(
    () => (user ? tasksQuery(user.uid, projectId) : null),
    [user, projectId]
  );
  return useCollection<Task>(query);
}

export function useTasksByStatus(status: TaskStatus): UseCollectionResult<Task> {
  const { user } = useAuth();
  const query = useMemo(
    () => (user ? tasksByStatusQuery(user.uid, status) : null),
    [user, status]
  );
  return useCollection<Task>(query);
}

export function useRecentlyCompletedTasks(days: number = 7): UseCollectionResult<Task> {
  const { user } = useAuth();
  const query = useMemo(() => {
    if (!user) return null;
    const since = new Date();
    since.setDate(since.getDate() - days);
    return recentlyCompletedTasksQuery(user.uid, since);
  }, [user, days]);
  return useCollection<Task>(query);
}

export function useSubTasks(taskId: string): UseCollectionResult<SubTask> {
  const { user } = useAuth();
  const query = useMemo(
    () => (user && taskId ? subtasksQuery(user.uid, taskId) : null),
    [user, taskId]
  );
  return useCollection<SubTask>(query);
}
