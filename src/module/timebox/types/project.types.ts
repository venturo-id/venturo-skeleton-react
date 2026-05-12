// Project-specific types and utilities

import type { Project, SortOrder, ProjectViewMode } from './index';

// ----------------------------------------------------------------------
// Project View Mode
// ----------------------------------------------------------------------

export function toggleProjectViewMode(currentMode: ProjectViewMode): ProjectViewMode {
  return currentMode === 'board' ? 'list' : 'board';
}

// ----------------------------------------------------------------------
// Project Utilities
// ----------------------------------------------------------------------

/**
 * Check if project is the special inbox project
 */
export function isInboxProject(project: Project): boolean {
  return project.isInbox;
}

/**
 * Check if project is archived
 */
export function isProjectArchived(project: Project): boolean {
  return project.isArchived;
}

/**
 * Check if project is favorited
 */
export function isProjectFavorite(project: Project): boolean {
  return project.isFavorite;
}

/**
 * Get project display name with icon
 */
export function getProjectDisplayName(project: Project): string {
  const icon = project.icon ? `${project.icon} ` : '';
  return `${icon}${project.name}`;
}

/**
 * Get project completion percentage
 */
export function getProjectCompletion(project: Project): number {
  const total = project._count?.tasks ?? 0;
  const completed = project._count?.completedTasks ?? 0;

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get project status color
 */
export function getProjectStatusColor(project: Project): string {
  if (project.isInbox) return 'primary.main';
  if (project.isArchived) return 'text.disabled';
  return 'grey.500';
}

// ----------------------------------------------------------------------
// Project Sorting
// ----------------------------------------------------------------------

export type ProjectSortBy = 'position' | 'name' | 'createdAt' | 'taskCount';

export function sortProjects(
  projects: Project[],
  sortBy: ProjectSortBy = 'position',
  order: SortOrder = 'asc'
): Project[] {
  const sorted = [...projects].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'taskCount':
        comparison = (a._count?.tasks ?? 0) - (b._count?.tasks ?? 0);
        break;
      default: {
        // Handle unknown sortBy values
        break;
      }
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// ----------------------------------------------------------------------
// Project Filtering
// ----------------------------------------------------------------------

export interface ProjectFilterOptions {
  query?: string;
  teamIds?: string[];
  includeArchived?: boolean;
  includeInbox?: boolean;
  favoritesOnly?: boolean;
}

export function filterProjects(projects: Project[], options: ProjectFilterOptions): Project[] {
  return projects.filter((project) => {
    // Query filter
    if (options.query) {
      const query = options.query.toLowerCase();
      if (!project.name.toLowerCase().includes(query)) return false;
    }

    // Team filter
    if (options.teamIds && options.teamIds.length > 0) {
      if (!project.teamId || !options.teamIds.includes(project.teamId)) return false;
    }

    // Archived filter
    if (options.includeArchived === false) {
      if (project.isArchived) return false;
    }

    // Inbox filter
    if (options.includeInbox === false) {
      if (project.isInbox) return false;
    }

    // Favorites filter
    if (options.favoritesOnly === true) {
      if (!project.isFavorite) return false;
    }

    return true;
  });
}

// ----------------------------------------------------------------------
// Project Grouping
// ----------------------------------------------------------------------

export interface ProjectGroup {
  id: string;
  title: string;
  projects: Project[];
  teamId?: string;
}

export function groupProjectsByTeam(projects: Project[]): ProjectGroup[] {
  const groupsMap = new Map<string, Project[]>();

  projects.forEach((project) => {
    const teamId = project.teamId || 'no_team';
    const existing = groupsMap.get(teamId);

    if (existing) {
      existing.push(project);
    } else {
      groupsMap.set(teamId, [project]);
    }
  });

  return Array.from(groupsMap.entries()).map(([teamId, teamProjects]) => ({
    id: teamId,
    title: teamId === 'no_team' ? 'My Projects' : teamId,
    projects: teamProjects,
    teamId: teamId === 'no_team' ? undefined : teamId,
  }));
}

export function groupProjectsByFavorite(projects: Project[]): {
  favorites: Project[];
  others: Project[];
} {
  return {
    favorites: projects.filter((p) => p.isFavorite),
    others: projects.filter((p) => !p.isFavorite),
  };
}

// ----------------------------------------------------------------------
// Project Color Utilities
// ----------------------------------------------------------------------

/**
 * Get project color for display
 */
export function getProjectColor(project: Project): string {
  return project.color || '#3B82F6';
}

/**
 * Check if project color is light (for text color calculation)
 */
export function isProjectColorLight(color: string): boolean {
  const hex = color.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrast text color for project background
 */
export function getProjectTextColor(project: Project): string {
  return isProjectColorLight(project.color) ? '#000000' : '#FFFFFF';
}

// ----------------------------------------------------------------------
// Project Icon Utilities
// ----------------------------------------------------------------------

export const DEFAULT_PROJECT_ICONS = [
  '📁',
  '📂',
  '🗂️',
  '📋',
  '📌',
  '📎',
  '🏠',
  '🏢',
  '💼',
  '🎯',
  '⭐',
  '🔥',
  '💡',
  '🚀',
  '💻',
  '🎨',
  '📚',
  '🎬',
  '🎵',
  '🏃',
] as const;

export function isProjectIconValid(icon: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^[^\x00-\x7F]*$/.test(icon) && icon.length <= 2;
}
