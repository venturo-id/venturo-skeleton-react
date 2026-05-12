// Inbox View - All tasks from inbox project

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { useTasks } from 'src/module/timebox/features/tasks/hooks';
import { useInboxProject } from 'src/module/timebox/features/projects/hooks';
import { KanbanBoard } from 'src/module/timebox/components/kanban/kanban-board';
import { TaskListView } from 'src/module/timebox/components/list-view/task-list-view';
import { KanbanAddTaskModal } from 'src/module/timebox/features/tasks/components/kanban-add-task-modal';

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

type ViewMode = 'kanban' | 'list';

export function InboxView() {
  const { t } = useTranslate('timebox.tasks');
  const { inboxProject, isLoading: isInboxLoading, error: inboxError } = useInboxProject();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Only fetch tasks if we have the inbox project
  const shouldFetch = !!inboxProject && !isInboxLoading;
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useTasks(
    inboxProject?.id ?? '',
    { skipCache: !shouldFetch }
  );

  const isLoading = isInboxLoading || isTasksLoading;
  const error = inboxError || tasksError;

  // Handle task completion
  const handleToggleComplete = async (taskId: string) => {
    // This would call the API to toggle completion
    console.log('Toggle complete:', taskId);
    // For now, we'll need to implement this in the actual task operations
  };

  const handleEditTask = (task: any) => {
    console.log('Edit task:', task);
    // TODO: Open task detail dialog
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
    // TODO: Open task detail dialog
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleMoveTask = async (taskId: string, targetSectionId: string | null) => {
    console.log('Move task:', taskId, 'to section:', targetSectionId);
    // TODO: Implement move API call
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Typography variant="body2" color="error">
          {error.message}
        </Typography>
      </Box>
    );
  }

  // No inbox project found
  if (!inboxProject) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          textAlign: 'center',
        }}
      >
        <Iconify icon="solar:add-folder-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No Inbox Project
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          The inbox project will be automatically created when you set up Timebox.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify icon="solar:inbox-bold" width={24} sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t('inbox')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {inboxProject._count?.tasks ?? 0} tasks
            </Typography>
          </Box>
        </Stack>

        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setViewMode(newValue as ViewMode);
            }
          }}
          sx={{
            bgcolor: 'action.hover',
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.75,
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                boxShadow: 1,
              },
            },
          }}
        >
          <ToggleButton value="list" sx={{ gap: 0.5 }}>
            <Iconify icon="solar:list-bold" width={16} />
            List
          </ToggleButton>
          <ToggleButton value="kanban" sx={{ gap: 0.5 }}>
            <Iconify icon="solar:chat-round-dots-bold" width={16} />
            Board
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {viewMode === 'kanban' ? (
          <KanbanBoard
            project={inboxProject}
            tasks={tasks ?? []}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onTaskClick={handleTaskClick}
            onMoveTask={handleMoveTask}
            onAddTask={handleAddTask}
          />
        ) : (
          <TaskListView
            project={inboxProject}
            tasks={tasks ?? []}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        )}
      </Box>

      {/* Floating Add Button */}
      <KanbanAddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultProjectId={inboxProject.id}
        onCreated={(task) => {
          console.log('Task created:', task);
          // The useTasks hook should automatically refetch
          setIsAddModalOpen(false);
        }}
      />
    </Box>
  );
}
