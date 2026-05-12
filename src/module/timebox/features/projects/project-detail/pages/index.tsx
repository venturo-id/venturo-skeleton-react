// Project Detail Page - Shows a single project with Kanban/List view

import { useState } from 'react';
import { useParams } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/shared/ui/iconify';
import { useTasks } from 'src/module/timebox/features/tasks/hooks';
import { useProject } from 'src/module/timebox/features/projects/hooks';
import { KanbanBoard } from 'src/module/timebox/components/kanban/kanban-board';
import { TaskListView } from 'src/module/timebox/components/list-view/task-list-view';
import { QuickAddButtonInline } from 'src/module/timebox/components/task/quick-add-button';
import { KanbanAddTaskModal } from 'src/module/timebox/features/tasks/components/kanban-add-task-modal';
import { ProjectUpdateDialog } from 'src/module/timebox/features/projects/components/project-update-dialog';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type ViewMode = 'kanban' | 'list';

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading: isProjectLoading, error: projectError } = useProject(id ?? '');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Only fetch tasks if we have the project
  const shouldFetch = !!project && !isProjectLoading;
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useTasks(
    project?.id ?? '',
    { skipCache: !shouldFetch }
  );

  const isLoading = isProjectLoading || isTasksLoading;
  const error = projectError || tasksError;

  // Handle task completion
  const handleToggleComplete = async (taskId: string) => {
    console.log('Toggle complete:', taskId);
  };

  const handleEditTask = (task: any) => {
    console.log('Edit task:', task);
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleMoveTask = async (taskId: string, targetSectionId: string | null) => {
    console.log('Move task:', taskId, 'to section:', targetSectionId);
  };

  const handleEditProject = () => {
    setIsEditDialogOpen(true);
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
  if (error || !project) {
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
          {error?.message || 'Project not found'}
        </Typography>
      </Box>
    );
  }

  // Calculate task counts
  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter((task) => task.completedAt).length ?? 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          {/* Project color indicator */}
          <Box
            sx={{
              width: 4,
              height: 40,
              borderRadius: 1,
              bgcolor: project.color || 'primary.main',
            }}
          />

          {/* Project info */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {project.name}
              </Typography>
              {project.isFavorite && (
                <Iconify icon="solar:cup-star-bold" width={16} sx={{ color: 'warning.main' }} />
              )}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
              {/* Task count */}
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {totalTasks} task{totalTasks !== 1 ? 's' : ''}
              </Typography>

              {/* Completion progress */}
              {totalTasks > 0 && (
                <>
                  <Box
                    sx={{
                      width: 80,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${completionPercentage}%`,
                        height: '100%',
                        bgcolor: project.color || 'primary.main',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {completionPercentage}%
                  </Typography>
                </>
              )}

              {/* Description preview */}
              {project.description && (
                <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: 300 }}>
                  {project.description}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
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
            <ToggleButton value="kanban" sx={{ gap: 0.5 }}>
              <Iconify icon="solar:chat-round-dots-bold" width={16} />
              Board
            </ToggleButton>
            <ToggleButton value="list" sx={{ gap: 0.5 }}>
              <Iconify icon="solar:list-bold" width={16} />
              List
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Edit project */}
          <IconButton onClick={handleEditProject} size="small">
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>

          {/* Quick add task */}
          <QuickAddButtonInline onClick={handleAddTask} />
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {viewMode === 'kanban' ? (
          <KanbanBoard
            project={project}
            tasks={tasks ?? []}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onTaskClick={handleTaskClick}
            onMoveTask={handleMoveTask}
            onAddTask={handleAddTask}
          />
        ) : (
          <TaskListView
            project={project}
            tasks={tasks ?? []}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        )}
      </Box>

      {/* Add Task Modal */}
      <KanbanAddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultProjectId={project.id}
        onCreated={(task) => {
          console.log('Task created:', task);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Project Dialog */}
      <ProjectUpdateDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        projectId={project.id}
        onUpdated={(updatedProject) => {
          console.log('Project updated:', updatedProject);
          setIsEditDialogOpen(false);
        }}
      />
    </Box>
  );
}
