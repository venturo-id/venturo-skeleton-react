// Today View - All tasks due today

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { useProjects } from 'src/module/timebox/features/projects/hooks';
import { TaskListView } from 'src/module/timebox/components/list-view/task-list-view';
import { QuickAddButtonInline } from 'src/module/timebox/components/task/quick-add-button';
import { KanbanAddTaskModal } from 'src/module/timebox/features/tasks/components/kanban-add-task-modal';

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function TodayView() {
  const { t: tCommon } = useTranslate('common');

  const { data: projects, isLoading, error } = useProjects();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get all tasks from all projects and filter for today
  const todayTasks = useMemo(() => {
    if (!projects) return [];

    const startOfToday = dayjs().startOf('day');
    const endOfToday = dayjs().endOf('day');

    const allTasks: any[] = [];

    projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task: any) => {
          if (task.dueDate) {
            const dueDate = dayjs(task.dueDate);
            if (dueDate.isSame(startOfToday, 'day') || dueDate.isAfter(startOfToday) && dueDate.isBefore(endOfToday)) {
              allTasks.push({
                ...task,
                projectName: project.name,
                projectColor: project.color,
              });
            }
          }
        });
      }
    });

    return allTasks;
  }, [projects]);

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

  // Create a mock project object for the view
  const todayProject: any = useMemo(
    () => ({
      id: 'today',
      name: `${tCommon('today')} - ${dayjs().format('MMM D')}`,
      color: '#22C55E',
      sections: [],
      tasks: todayTasks,
    }),
    [todayTasks, tCommon]
  );

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
          <Iconify icon="solar:calendar-date-bold" width={24} sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {tCommon('today')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {dayjs().format('dddd, MMMM D')} • {todayTasks.length} tasks
            </Typography>
          </Box>
        </Stack>

        {/* Quick Add Button */}
        <QuickAddButtonInline onClick={handleAddTask} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {todayTasks.length > 0 ? (
          <TaskListView
            project={todayProject}
            tasks={todayTasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        ) : (
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
            <Iconify icon="solar:confetti-minimalistic-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No tasks for today
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enjoy your day! Add a task if you have something to do.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Task Modal */}
      <KanbanAddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={(task) => {
          console.log('Task created:', task);
          setIsAddModalOpen(false);
        }}
      />
    </Box>
  );
}
