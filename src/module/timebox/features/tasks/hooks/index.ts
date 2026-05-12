// Tasks data hooks with caching

import type { Task, TaskFormData } from 'src/module/timebox/types';

import { useMemo , useState , useEffect , useCallback } from 'react';

import { toast } from 'src/shared/ui/snackbar';
import { TIMEBOX_STORAGE_KEYS } from 'src/module/timebox/utils/constants';
import {
  storageGet,
  storageSet,
} from 'src/module/timebox/utils/storage.helpers';
import {
  CACHE_DURATION,
  invalidateTasksCache,
} from 'src/module/timebox/utils/cache.helpers';

import * as tasksApi from '../api';

// ----------------------------------------------------------------------
// Cache Types
// ----------------------------------------------------------------------

interface TasksCache {
  [projectId: string]: {
    data: Task[];
    timestamp: number;
  };
}

// ----------------------------------------------------------------------
// Hook: useTasks
// ----------------------------------------------------------------------

/**
 * Fetch tasks for a project with caching
 */
export function useTasks(
  projectId: string,
  options?: { skipCache?: boolean; refetchInterval?: number }
) {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { skipCache = false, refetchInterval } = options || {};

  const fetchTasks = useCallback(
    async (forceRefetch = false) => {
      if (!projectId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        if (!skipCache && !forceRefetch) {
          const cached = storageGet<TasksCache>(TIMEBOX_STORAGE_KEYS.TASKS_CACHE);
          if (cached && cached[projectId]) {
            const projectCache = cached[projectId];
            if (Date.now() - projectCache.timestamp < CACHE_DURATION.SHORT) {
              setData(projectCache.data);
              setIsLoading(false);
              return;
            }
          }
        }

        // Fetch from API
        const tasks = await tasksApi.getTasks(projectId);

        // Update cache
        const existingCache = storageGet<TasksCache>(TIMEBOX_STORAGE_KEYS.TASKS_CACHE) || {};
        const cacheData: TasksCache = {
          ...existingCache,
          [projectId]: {
            data: tasks,
            timestamp: Date.now(),
          },
        };
        storageSet(TIMEBOX_STORAGE_KEYS.TASKS_CACHE, cacheData);

        setData(tasks);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
        toast.error(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, skipCache]
  );

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-refetch
  useEffect(() => {
    const interval = refetchInterval ? setInterval(() => {
      fetchTasks(true);
    }, refetchInterval) : undefined;

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchTasks, refetchInterval]);

  // Mutations
  const createTask = useCallback(
    async (formData: Omit<TaskFormData, 'projectId'>) => {
      if (!projectId) throw new Error('Project ID is required');

      try {
        const newTask = await tasksApi.createTask(projectId, formData);

        // Update local state
        setData((prev) => [...prev, newTask]);

        // Invalidate cache
        invalidateTasksCache();

        toast.success('Task created successfully');
        return newTask;
      } catch (err) {
        const taskError = err instanceof Error ? err : new Error('Failed to create task');
        toast.error(taskError.message);
        throw taskError;
      }
    },
    [projectId]
  );

  const updateTask = useCallback(
    async (taskId: string, formData: Partial<Omit<TaskFormData, 'projectId'>>) => {
      if (!projectId) throw new Error('Project ID is required');

      try {
        const updatedTask = await tasksApi.updateTask(projectId, taskId, formData);

        // Update local state
        setData((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

        // Invalidate cache
        invalidateTasksCache();

        toast.success('Task updated successfully');
        return updatedTask;
      } catch (err) {
        const taskError = err instanceof Error ? err : new Error('Failed to update task');
        toast.error(taskError.message);
        throw taskError;
      }
    },
    [projectId]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!projectId) throw new Error('Project ID is required');

      try {
        await tasksApi.deleteTask(projectId, taskId);

        // Update local state
        setData((prev) => prev.filter((t) => t.id !== taskId));

        // Invalidate cache
        invalidateTasksCache();

        toast.success('Task deleted successfully');
      } catch (err) {
        const taskError = err instanceof Error ? err : new Error('Failed to delete task');
        toast.error(taskError.message);
        throw taskError;
      }
    },
    [projectId]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      if (!projectId) throw new Error('Project ID is required');

      try {
        const updatedTask = await tasksApi.completeTask(projectId, taskId);

        // Update local state
        setData((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

        // Invalidate cache
        invalidateTasksCache();

        toast.success('Task completed successfully');
        return updatedTask;
      } catch (err) {
        const taskError = err instanceof Error ? err : new Error('Failed to complete task');
        toast.error(taskError.message);
        throw taskError;
      }
    },
    [projectId]
  );

  const uncompleteTask = useCallback(
    async (taskId: string) => {
      if (!projectId) throw new Error('Project ID is required');

      try {
        const updatedTask = await tasksApi.uncompleteTask(projectId, taskId);

        // Update local state
        setData((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

        // Invalidate cache
        invalidateTasksCache();

        toast.success('Task uncompleted successfully');
        return updatedTask;
      } catch (err) {
        const taskError = err instanceof Error ? err : new Error('Failed to uncomplete task');
        toast.error(taskError.message);
        throw taskError;
      }
    },
    [projectId]
  );

  const refetch = useCallback(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  // Computed values
  const completedTasks = useMemo(() => data.filter((t) => t.completedAt), [data]);
  const incompleteTasks = useMemo(() => data.filter((t) => !t.completedAt), [data]);
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return data.filter((t) => !t.completedAt && t.dueDate && new Date(t.dueDate) < now);
  }, [data]);

  return {
    data,
    completedTasks,
    incompleteTasks,
    overdueTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    refetch,
  };
}

// ----------------------------------------------------------------------
// Hook: useTask
// ----------------------------------------------------------------------

/**
 * Fetch single task by ID
 */
export function useTask(projectId: string, taskId: string) {
  const [data, setData] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTask() {
      if (!projectId || !taskId) return;

      try {
        setIsLoading(true);
        setError(null);

        const task = await tasksApi.getTaskById(projectId, taskId);
        setData(task);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch task'));
        toast.error(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTask();
  }, [projectId, taskId]);

  return {
    data,
    isLoading,
    error,
  };
}
