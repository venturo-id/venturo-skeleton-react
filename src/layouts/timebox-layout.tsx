import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from './core';

import { merge } from 'es-toolkit';
import { useMemo, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/shared/ui/iconify';
import { KanbanAddTaskModal } from 'src/module/timebox/features/tasks/components';
import { useAuthContext } from 'src/module/core/features/auth/hooks/use-auth-context';
import { useProjects, useInboxProject } from 'src/module/timebox/features/projects/hooks';
import { ProjectCreateDialog } from 'src/module/timebox/features/projects/components/project-create-dialog';
import { TimeboxSidebar, SidebarProvider, type ProjectTreeItemData } from 'src/module/timebox/components/sidebar';

import { _account } from './nav-config-account';
import { Searchbar } from './components/searchbar';
import { MenuButton } from './components/menu-button';
import { AccountDrawer } from './components/account-drawer';
import { SettingsButton } from './components/settings-button';
import { MainSection, HeaderSection, LayoutSection } from './core';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export interface TimeboxLayoutProps extends LayoutBaseProps {
  layoutQuery?: 'lg' | 'xl' | 'md';
  headerProps?: HeaderSectionProps;
  mainProps?: MainSectionProps;
  sidebarData?: {
    userName?: string;
    userAvatar?: string | null;
    userEmail?: string;
    inboxCount?: number;
  };
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function TimeboxLayout({
  sx,
  cssVars,
  children,
  layoutQuery = 'lg',
  headerProps,
  mainProps,
  sidebarData = {},
}: TimeboxLayoutProps) {
  const theme = useTheme();

  // Fetch projects data
  const { data: projects = [], favorites: favoriteProjects = [], refetch } = useProjects({
    refetchInterval: 60000, // Refetch every minute
  });

  // Get inbox project for default task creation
  const { inboxProject } = useInboxProject();

  // Auth context for logout
  const { signOut } = useAuthContext();

  const { userName, userAvatar, userEmail, inboxCount = 0 } = sidebarData;

  // Create project dialog state
  const createProjectDialog = useBoolean();

  // Create task dialog state
  const createTaskDialog = useBoolean();

  // Handle project created - refetch projects
  const handleProjectCreated = useCallback(() => {
    refetch();
    createProjectDialog.onFalse();
  }, [refetch, createProjectDialog]);

  // Handle task created - close dialog
  const handleTaskCreated = useCallback(() => {
    createTaskDialog.onFalse();
  }, [createTaskDialog]);

  // Transform projects to ProjectTreeItemData format
  const projectTreeData = useMemo(() =>
    projects
      .filter((p) => !p.isInbox && !p.isArchived && !p.teamId)
      .map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        icon: project.icon ?? null,
        taskCount: project._count?.tasks ?? 0,
        completedCount: project._count?.completedTasks ?? 0,
        isFavorite: project.isFavorite,
        path: paths.timebox.projectDetail(project.id),
      })),
  [projects]);

  // Transform favorite projects to ProjectTreeItemData format
  const favoriteTreeData = useMemo(() =>
    favoriteProjects
      .filter((p) => !p.isInbox && !p.isArchived)
      .map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        icon: project.icon ?? null,
        taskCount: project._count?.tasks ?? 0,
        completedCount: project._count?.completedTasks ?? 0,
        isFavorite: project.isFavorite,
        path: paths.timebox.projectDetail(project.id),
      })),
  [favoriteProjects]);

  // Group projects by teams
  const teamTreeData = useMemo(() => {
    const teams: Record<string, ProjectTreeItemData[]> = {};

    projects
      .filter((p) => !p.isInbox && !p.isArchived && p.teamId)
      .forEach((project) => {
        const teamId = project.teamId ?? 'uncategorized';
        if (!teams[teamId]) {
          teams[teamId] = [];
        }

        teams[teamId].push({
          id: project.id,
          name: project.name,
          color: project.color,
          icon: project.icon ?? null,
          taskCount: project._count?.tasks ?? 0,
          completedCount: project._count?.completedTasks ?? 0,
          isFavorite: project.isFavorite,
          path: paths.timebox.projectDetail(project.id),
          teamId: project.teamId ?? null,
        });
      });

    return teams;
  }, [projects]);

  // Render header
  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderBottomStyle: 'dashed',
          borderBottomWidth: 1,
          borderBottomColor: 'divider',
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: (
        <>
          {/* Mobile menu button */}
          <MenuButton
            sx={{
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            }}
          />

          {/* Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Iconify icon="solar:file-check-bold-duotone" width={24} sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 700 }}>
                Timebox
              </Typography>
            </Box>
          </Box>
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {/* Searchbar */}
          <Searchbar />

          {/* Settings button */}
          <SettingsButton />

          {/* Account drawer */}
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation
        {...headerProps}
        slots={{ ...headerSlots, ...headerProps?.slots }}
        slotProps={merge(headerSlotProps, headerProps?.slotProps ?? {})}
        sx={headerProps?.sx}
      />
    );
  };

  // Render sidebar
  const renderSidebar = () => (
    <SidebarProvider>
      <Box
        sx={{
          width: 280,
          height: '100%',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: theme.zIndex.drawer - 1,
          display: { xs: 'none', [layoutQuery]: 'flex' },
        }}
      >
        <TimeboxSidebar
          userName={userName}
          userAvatar={userAvatar}
          userEmail={userEmail}
          inboxCount={inboxCount}
          projects={projectTreeData}
          favoriteProjects={favoriteTreeData}
          teamProjects={{}}
          showAddTeam={false}
          onAddTask={createTaskDialog.onTrue}
          onAddProject={createProjectDialog.onTrue}
          onAddTeam={undefined}
          onSearch={() => {
            // Will be implemented with Search palette
            console.log('Search clicked');
          }}
          onLogout={signOut}
        />
      </Box>
    </SidebarProvider>
  );

  // Render footer
  const renderFooter = () => null;

  // Render main content
  const renderMain = () => (
    <MainSection
      sx={{
        pl: { xs: 0, [layoutQuery]: '280px' }, // Account for sidebar width
        transition: theme.transitions.create(['padding-left'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.shorter,
        }),
        ...mainProps?.sx,
      }}
    >
      {children}
    </MainSection>
  );

  return (
    <>
      <LayoutSection
        headerSection={renderHeader()}
        sidebarSection={renderSidebar()}
        footerSection={renderFooter()}
        cssVars={cssVars}
        sx={[
          {
            '& .MuiContainer-root': {
              maxWidth: { xs: '100%', md: '100%', lg: '100%' },
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {renderMain()}
      </LayoutSection>

      {/* Create Project Dialog */}
      <ProjectCreateDialog
        open={createProjectDialog.value}
        onClose={createProjectDialog.onFalse}
        onCreated={handleProjectCreated}
      />

      {/* Create Task Dialog */}
      <KanbanAddTaskModal
        open={createTaskDialog.value}
        onClose={createTaskDialog.onFalse}
        onCreated={handleTaskCreated}
        defaultProjectId={inboxProject?.id}
      />
    </>
  );
}
