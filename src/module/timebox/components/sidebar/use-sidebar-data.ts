import type { ProjectTreeItemData } from './types';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
// Mock Data (will be replaced with real API calls)
// ----------------------------------------------------------------------

const MOCK_PROJECTS: ProjectTreeItemData[] = [
  {
    id: '1',
    name: 'Work Project',
    color: '#3B82F6',
    icon: '💼',
    taskCount: 12,
    completedCount: 5,
    isFavorite: true,
    path: paths.timebox.projectDetail('1'),
    children: [
      {
        id: '1-1',
        name: 'Backend Tasks',
        color: '#3B82F6',
        icon: '⚙️',
        taskCount: 5,
        completedCount: 3,
        path: paths.timebox.projectDetail('1-1'),
      },
      {
        id: '1-2',
        name: 'Frontend Tasks',
        color: '#3B82F6',
        icon: '🎨',
        taskCount: 7,
        completedCount: 2,
        path: paths.timebox.projectDetail('1-2'),
      },
    ],
  },
  {
    id: '2',
    name: 'Personal Project',
    color: '#22C55E',
    icon: '🏠',
    taskCount: 8,
    completedCount: 2,
    isFavorite: false,
    path: paths.timebox.projectDetail('2'),
  },
  {
    id: '3',
    name: 'Learning',
    color: '#FFAB00',
    icon: '📚',
    taskCount: 15,
    completedCount: 10,
    isFavorite: true,
    path: paths.timebox.projectDetail('3'),
  },
];

const MOCK_FAVORITE_PROJECTS: ProjectTreeItemData[] = MOCK_PROJECTS.filter((p) => p.isFavorite);

const MOCK_TEAM_PROJECTS: Record<string, ProjectTreeItemData[]> = {
  'Engineering Team': [
    {
      id: 'team-1',
      name: 'Sprint 1',
      color: '#8E33FF',
      icon: '🚀',
      taskCount: 20,
      completedCount: 15,
      path: paths.timebox.projectDetail('team-1'),
    },
    {
      id: 'team-2',
      name: 'Sprint 2',
      color: '#8E33FF',
      icon: '🎯',
      taskCount: 18,
      completedCount: 8,
      path: paths.timebox.projectDetail('team-2'),
    },
  ],
};

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

/**
 * Hook to get sidebar data
 * This will be replaced with real API calls in Phase 3
 */
export function useSidebarData() {
  // TODO: Replace with real API calls
  // const { data: projects } = useProjects();
  // const { data: favorites } = useFavoriteProjects();
  // const { data: teamProjects } = useTeamProjects();

  return useMemo(
    () => ({
      projects: MOCK_PROJECTS,
      favoriteProjects: MOCK_FAVORITE_PROJECTS,
      teamProjects: MOCK_TEAM_PROJECTS,
      inboxCount: 12, // TODO: Get from real API
    }),
    []
  );
}

/**
 * Hook to get project tree item data from a Project entity
 * This will be used when real project data is available
 */
export function toProjectTreeItem(project: {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  _count?: {
    tasks?: number;
    completedTasks?: number;
  };
  isFavorite?: boolean;
  sections?: Array<{
    id: string;
    name: string;
    tasks?: Array<{ id: string }>;
  }>;
}): ProjectTreeItemData {
  const taskCount = project._count?.tasks ?? 0;
  const completedCount = project._count?.completedTasks ?? 0;

  // Convert sections to children
  const children = project.sections?.map((section) => ({
    id: section.id,
    name: section.name,
    color: project.color,
    icon: project.icon,
    taskCount: section.tasks?.length ?? 0,
    completedCount: 0, // TODO: Calculate from completed tasks
    path: paths.timebox.projectDetail(section.id),
  }));

  return {
    id: project.id,
    name: project.name,
    color: project.color,
    icon: project.icon || undefined,
    taskCount,
    completedCount,
    isFavorite: project.isFavorite,
    path: paths.timebox.projectDetail(project.id),
    children: children && children.length > 0 ? children : undefined,
  };
}
