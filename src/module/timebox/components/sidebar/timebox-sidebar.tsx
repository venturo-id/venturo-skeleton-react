import type { ProjectTreeItemData } from './types';

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { Iconify, type IconifyName } from 'src/shared/ui/iconify';

import { SidebarHeader } from './sidebar-header';
import { QuickAddButton } from './quick-add-button';
import { ProjectTreeSection } from './project-tree-section';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface TimeboxSidebarProps {
  userName?: string;
  userAvatar?: string | null;
  userEmail?: string;
  inboxCount?: number;
  projects?: ProjectTreeItemData[];
  favoriteProjects?: ProjectTreeItemData[];
  teamProjects?: Record<string, ProjectTreeItemData[]>;
  labels?: Array<{ id: string; name: string; color: string }>;
  onAddTask?: () => void;
  onAddProject?: () => void;
  onAddTeam?: () => void;
  onSearch?: () => void;
  onLogout?: () => void;
  collapsedSections?: Set<string>;
  onToggleSection?: (sectionId: string) => void;
  onToggleProjectExpand?: (projectId: string) => void;
  showAddTeam?: boolean;
}

// ----------------------------------------------------------------------
// Helper: Overview Navigation Items
// ----------------------------------------------------------------------

interface OverviewItem {
  id: string;
  title: string;
  path: string;
  icon: IconifyName;
  badge?: string | number;
}

function OverviewNav({ items, onItemClick }: { items: OverviewItem[]; onItemClick?: (path: string) => void }) {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleClick = (path: string) => {
    navigate(path);
    onItemClick?.(path);
  };

  return (
    <Box>
      {items.map((item) => {
        const isSelected = currentPath === item.path;

        return (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => handleClick(item.path)}
            sx={{
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              borderRadius: 1.5,
              transition: (theme) =>
                theme.transitions.create(['background-color'], {
                  duration: theme.transitions.duration.shortest,
                }),
              bgcolor: isSelected ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: isSelected ? 'action.hover' : 'action.hover',
              },
            }}
          >
            <Iconify icon={item.icon} width={22} sx={{ color: isSelected ? 'primary.main' : 'text.primary' }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.primary',
                flex: 1,
              }}
            >
              {item.title}
            </Typography>
            {item.badge && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.disabled',
                  fontWeight: 600,
                }}
              >
                {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function TimeboxSidebar({
  userName,
  userAvatar,
  userEmail,
  inboxCount = 0,
  projects = [],
  favoriteProjects = [],
  teamProjects = {},
  labels = [],
  onAddTask,
  onAddProject,
  onAddTeam,
  onSearch,
  onLogout,
  collapsedSections = new Set(),
  onToggleSection,
  onToggleProjectExpand,
  showAddTeam = false,
}: TimeboxSidebarProps) {
  const { t } = useTranslate('timebox.common');
  const navigate = useNavigate();

  // Overview navigation items
  const overviewItems = useMemo<OverviewItem[]>(
    () => [
      {
        id: 'inbox',
        title: t('inbox'),
        path: paths.timebox.inbox,
        icon: 'solar:add-folder-bold',
        badge: inboxCount,
      },
      {
        id: 'today',
        title: t('today'),
        path: paths.timebox.today,
        icon: 'solar:calendar-date-bold',
      },
      {
        id: 'upcoming',
        title: t('upcoming'),
        path: paths.timebox.upcoming,
        icon: 'solar:double-alt-arrow-right-bold-duotone',
      },
      {
        id: 'filters-labels',
        title: t('filtersLabels'),
        path: paths.timebox.filtersLabels,
        icon: 'solar:tag-horizontal-bold-duotone',
      },
      {
        id: 'completed',
        title: t('completed'),
        path: paths.timebox.completed,
        icon: 'solar:file-check-bold-duotone',
      },
    ],
    [t, inboxCount]
  );

  // Handle project item click
  const handleProjectClick = (data: ProjectTreeItemData) => {
    navigate(data.path);
  };

  // Handle section toggle
  const handleSectionToggle = (sectionId: string) => {
    onToggleSection?.(sectionId);
  };

  // Check if section is collapsed
  const isSectionCollapsed = (sectionId: string) => collapsedSections.has(sectionId);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <SidebarHeader
        userName={userName}
        userAvatar={userAvatar}
        userEmail={userEmail}
        notificationCount={3}
        onHideSidebar={() => {
          // Will be implemented with layout context
          console.log('Hide sidebar');
        }}
      />

      {/* Quick Add Task Button */}
      <QuickAddButton onClick={onAddTask} />

      {/* Search Button */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          onClick={onSearch}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 1.5,
            cursor: 'pointer',
            border: '1px dashed',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}
        >
          <Iconify icon="solar:clock-circle-outline" width={20} sx={{ color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          >
            {t('search')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 'auto',
              color: 'text.disabled',
              fontSize: '0.6875rem',
            }}
          >
            ⌘K
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Overview Section */}
        <Box sx={{ py: 1 }}>
          <OverviewNav items={overviewItems} />
        </Box>

        <Divider />

        {/* Favorites Section */}
        {favoriteProjects.length > 0 && (
          <>
            <ProjectTreeSection
              id="favorites"
              title={t('favorites')}
              items={favoriteProjects}
              expanded={!isSectionCollapsed('favorites')}
              onToggleSection={handleSectionToggle}
              onItemClick={handleProjectClick}
            />
            <Divider />
          </>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <>
            <ProjectTreeSection
              id="projects"
              title={t('projects')}
              items={projects}
              expanded={!isSectionCollapsed('projects')}
              onToggleSection={handleSectionToggle}
              onItemClick={handleProjectClick}
            />
            <Divider />
          </>
        )}

        {/* Teams Section */}
        {Object.entries(teamProjects).map(([teamId, teamProjectsList]) => (
          <ProjectTreeSection
            key={teamId}
            id={`team-${teamId}`}
            title={teamId}
            items={teamProjectsList}
            expanded={!isSectionCollapsed(`team-${teamId}`)}
            onToggleSection={handleSectionToggle}
            onItemClick={handleProjectClick}
          />
        ))}
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ borderTop: `1px solid` }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={onAddProject}
          sx={{
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Iconify icon="solar:add-circle-bold" width={20} sx={{ color: 'text.primary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.primary', flex: 1 }}>
            {t('addProject')}
          </Typography>
        </Stack>

        {showAddTeam && onAddTeam && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={onAddTeam}
            sx={{
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Iconify icon="solar:add-circle-bold" width={20} sx={{ color: 'text.primary' }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.primary', flex: 1 }}>
              {t('addTeam')}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={onLogout}
          sx={{
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Iconify icon="solar:logout-2-bold" width={20} sx={{ color: 'text.primary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.primary', flex: 1 }}>
            {t('logout')}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
