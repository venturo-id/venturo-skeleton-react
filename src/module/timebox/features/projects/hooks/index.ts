// Projects data hooks with caching

import type { Project, ProjectFormData } from 'src/module/timebox/types';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { toast } from 'src/shared/ui/snackbar';
import { TIMEBOX_STORAGE_KEYS } from 'src/module/timebox/utils/constants';
import {
  getCached,
  setCached,
  CACHE_DURATION,
  invalidateProjectsCache,
} from 'src/module/timebox/utils/cache.helpers';

import * as projectsApi from '../api';

// ----------------------------------------------------------------------
// Hook: useProjects
// ----------------------------------------------------------------------

/**
 * Fetch all projects with caching
 * Uses localStorage for cache persistence
 */
export function useProjects(options?: { skipCache?: boolean; refetchInterval?: number }) {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { skipCache = false, refetchInterval } = options || {};

  const fetchProjects = useCallback(async (forceRefetch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      if (!skipCache && !forceRefetch) {
        const cached = getCached<Project[]>(TIMEBOX_STORAGE_KEYS.PROJECTS_CACHE, {
          duration: CACHE_DURATION.MEDIUM,
        });
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const projects = await projectsApi.getProjects();

      // Update cache
      setCached(TIMEBOX_STORAGE_KEYS.PROJECTS_CACHE, projects);

      setData(projects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast.error(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [skipCache]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Auto-refetch
  useEffect(() => {
    const interval = refetchInterval ? setInterval(() => {
      fetchProjects(true);
    }, refetchInterval) : undefined;

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchProjects, refetchInterval]);

  // Mutations
  const createProject = useCallback(
    async (formData: ProjectFormData) => {
      try {
        const newProject = await projectsApi.createProject(formData);

        // Update local state
        setData((prev) => [...prev, newProject]);

        // Invalidate cache
        invalidateProjectsCache();

        toast.success('Project created successfully');
        return newProject;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create project');
        throw err;
      }
    },
    []
  );

  const updateProject = useCallback(
    async (id: string, formData: Partial<ProjectFormData>) => {
      try {
        const updatedProject = await projectsApi.updateProject(id, formData);

        // Update local state
        setData((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));

        // Invalidate cache
        invalidateProjectsCache();

        toast.success('Project updated successfully');
        return updatedProject;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update project');
        throw err;
      }
    },
    []
  );

  const deleteProject = useCallback(
    async (id: string) => {
      try {
        await projectsApi.deleteProject(id);

        // Update local state
        setData((prev) => prev.filter((p) => p.id !== id));

        // Invalidate cache
        invalidateProjectsCache();

        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete project');
        throw err;
      }
    },
    []
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      try {
        const updatedProject = await projectsApi.toggleProjectFavorite(id);

        // Update local state
        setData((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));

        // Invalidate cache
        invalidateProjectsCache();

        return updatedProject;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to toggle favorite');
        throw err;
      }
    },
    []
  );

  const refetch = useCallback(() => {
    fetchProjects(true);
  }, [fetchProjects]);

  // Computed values
  const favorites = useMemo(() => data.filter((p) => p.isFavorite), [data]);
  const activeProjects = useMemo(() => data.filter((p) => !p.isArchived), [data]);
  const archivedProjects = useMemo(() => data.filter((p) => p.isArchived), [data]);

  return {
    data,
    favorites,
    activeProjects,
    archivedProjects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    toggleFavorite,
    refetch,
  };
}

// ----------------------------------------------------------------------
// Hook: useProject
// ----------------------------------------------------------------------

/**
 * Fetch single project by ID
 */
export function useProject(id: string) {
  const [data, setData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const project = await projectsApi.getProjectById(id);
        setData(project);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch project'));
        toast.error(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  return {
    data,
    isLoading,
    error,
  };
}

// ----------------------------------------------------------------------
// Hook: useInboxProject
// ----------------------------------------------------------------------

/**
 * Fetch the inbox project (special project with is_inbox=true)
 */
export function useInboxProject() {
  const { data: projects, isLoading, error } = useProjects();

  const inboxProject = useMemo(() => {
    if (!projects) return null;
    return projects.find((p) => p.isInbox) || null;
  }, [projects]);

  const inboxCount = useMemo(() => {
    if (!inboxProject) return 0;
    return inboxProject._count?.tasks || 0;
  }, [inboxProject]);

  return {
    inboxProject,
    inboxCount,
    isLoading,
    error,
  };
}
