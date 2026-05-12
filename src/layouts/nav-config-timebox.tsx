import type { NavSectionProps } from 'src/shared/ui/nav-section';
import type { NavItemDataProps } from 'src/shared/ui/nav-section/types';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { Iconify, type IconifyName } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface TimeboxNavConfigOptions {
  inboxCount?: number;
  showProjects?: boolean;
  showFavorites?: boolean;
}

// ----------------------------------------------------------------------
// Icons
// ----------------------------------------------------------------------

const ICONS = {
  inbox: 'solar:add-folder-bold' as const,
  today: 'solar:calendar-date-bold' as const,
  upcoming: 'solar:double-alt-arrow-right-bold-duotone' as const,
  filters: 'solar:tag-horizontal-bold-duotone' as const,
  completed: 'solar:file-check-bold-duotone' as const,
  projects: 'solar:add-folder-bold' as const,
  search: 'solar:clock-circle-outline' as const,
  add: 'solar:add-circle-bold' as const,
  help: 'solar:double-alt-arrow-right-bold-duotone' as const,
};

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

function NavIcon({ icon }: { icon: IconifyName }) {
  return <Iconify icon={icon} width={22} />;
}

// ----------------------------------------------------------------------
// Navigation Items
// ----------------------------------------------------------------------

/**
 * Get overview navigation items (Inbox, Today, Upcoming, etc.)
 */
function getOverviewItems(t: (key: string) => string, options: TimeboxNavConfigOptions): NavItemDataProps[] {
  const { inboxCount = 0 } = options;

  return [
    {
      title: t('inbox'),
      path: paths.timebox.inbox,
      icon: <NavIcon icon={ICONS.inbox} />,
      ...(inboxCount > 0 && { info: inboxCount.toString() }),
    },
    {
      title: t('today'),
      path: paths.timebox.today,
      icon: <NavIcon icon={ICONS.today} />,
    },
    {
      title: t('upcoming'),
      path: paths.timebox.upcoming,
      icon: <NavIcon icon={ICONS.upcoming} />,
    },
  ];
}

/**
 * Get organization navigation items (Filters & Labels, Completed, Search)
 */
function getOrganizationItems(t: (key: string) => string): NavItemDataProps[] {
  return [
    {
      title: t('filtersLabels'),
      path: paths.timebox.filtersLabels,
      icon: <NavIcon icon={ICONS.filters} />,
    },
    {
      title: t('completed'),
      path: paths.timebox.completed,
      icon: <NavIcon icon={ICONS.completed} />,
    },
  ];
}

/**
 * Get project list navigation items (dynamic based on projects)
 */
function getProjectItems(
  t: (key: string) => string,
  projects: Array<{ id: string; name: string; color: string; taskCount?: number; isFavorite?: boolean }>
): NavItemDataProps[] {
  return projects.map((project) => ({
    title: project.name,
    path: paths.timebox.projectDetail(project.id),
    icon: <NavIcon icon={ICONS.projects} />,
    ...(project.taskCount !== undefined && { info: project.taskCount.toString() }),
  }));
}

/**
 * Get favorite projects navigation items
 */
function getFavoriteProjectItems(
  t: (key: string) => string,
  favorites: Array<{ id: string; name: string; color: string; taskCount?: number }>
): NavItemDataProps[] {
  return favorites.map((project) => ({
    title: project.name,
    path: paths.timebox.projectDetail(project.id),
    icon: <NavIcon icon={ICONS.projects} />,
    ...(project.taskCount !== undefined && { info: project.taskCount.toString() }),
  }));
}

/**
 * Get bottom action items (Add Project, Add Team, Help)
 */
function getBottomActionItems(t: (key: string) => string): NavItemDataProps[] {
  return [
    {
      title: t('addProject'),
      path: '#',
      icon: <NavIcon icon={ICONS.add} />,
    },
    {
      title: t('addTeam'),
      path: '#',
      icon: <NavIcon icon={ICONS.add} />,
    },
    {
      title: t('help'),
      path: '#',
      icon: <NavIcon icon={ICONS.help} />,
    },
  ];
}

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

/**
 * Hook to get Timebox navigation configuration
 *
 * @param options - Navigation options
 * @returns Navigation sections array
 */
export function useTimeboxNavData(options: TimeboxNavConfigOptions = {}): NavSectionProps['data'] {
  const { t } = useTranslate('timebox.nav');

  return useMemo(() => {
    const sections: NavSectionProps['data'] = [
      // Overview section
      {
        subheader: t('overview'),
        items: getOverviewItems(t, options),
      },
      // Organization section
      {
        subheader: t('organization'),
        items: getOrganizationItems(t),
      },
    ];

    return sections;
  }, [t, options]);
}

/**
 * Hook to get Timebox navigation with project list
 *
 * @param options - Navigation options including projects
 * @returns Navigation sections array with projects
 */
export function useTimeboxNavDataWithProjects(options: {
  inboxCount?: number;
  projects?: Array<{
    id: string;
    name: string;
    color: string;
    taskCount?: number;
    isFavorite?: boolean;
  }>;
  favorites?: Array<{
    id: string;
    name: string;
    color: string;
    taskCount?: number;
  }>;
  showProjects?: boolean;
  showFavorites?: boolean;
}): NavSectionProps['data'] {
  const { t } = useTranslate('timebox.nav');
  const { projects = [], favorites = [], showProjects = true, showFavorites = true, ...otherOptions } = options;

  return useMemo(() => {
    const sections: NavSectionProps['data'] = [];

    // Overview section
    sections.push({
      subheader: t('overview'),
      items: getOverviewItems(t, otherOptions),
    });

    // Organization section
    sections.push({
      subheader: t('organization'),
      items: getOrganizationItems(t),
    });

    // Favorites section (if any)
    if (showFavorites && favorites.length > 0) {
      sections.push({
        subheader: t('favorites'),
        items: getFavoriteProjectItems(t, favorites),
      });
    }

    // Projects section
    if (showProjects && projects.length > 0) {
      sections.push({
        subheader: t('projects'),
        items: getProjectItems(t, projects),
      });
    }

    // Bottom actions
    sections.push({
      items: getBottomActionItems(t),
    });

    return sections;
  }, [t, projects, favorites, showProjects, showFavorites, otherOptions]);
}

// ----------------------------------------------------------------------
// Static Navigation (for reference)
// ----------------------------------------------------------------------

/**
 * Static Timebox navigation items (without dynamic project list)
 * Can be used as fallback or for menu structure reference
 */
export const TIMEBOX_NAV_ITEMS: NavItemDataProps[] = [
  {
    title: 'timebox.nav.inbox',
    path: paths.timebox.inbox,
    icon: <NavIcon icon={ICONS.inbox} />,
  },
  {
    title: 'timebox.nav.today',
    path: paths.timebox.today,
    icon: <NavIcon icon={ICONS.today} />,
  },
  {
    title: 'timebox.nav.upcoming',
    path: paths.timebox.upcoming,
    icon: <NavIcon icon={ICONS.upcoming} />,
  },
  {
    title: 'timebox.nav.filtersLabels',
    path: paths.timebox.filtersLabels,
    icon: <NavIcon icon={ICONS.filters} />,
  },
  {
    title: 'timebox.nav.completed',
    path: paths.timebox.completed,
    icon: <NavIcon icon={ICONS.completed} />,
  },
];
