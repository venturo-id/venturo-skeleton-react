// Upcoming View - Future tasks grouped by date

import type { Task } from 'src/module/timebox/types';

import dayjs from 'dayjs';
import { useMemo , useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { useProjects } from 'src/module/timebox/features/projects/hooks';
import { TaskCard } from 'src/module/timebox/components/kanban/task-card';
import { QuickAddButtonInline } from 'src/module/timebox/components/task/quick-add-button';
import { KanbanAddTaskModal } from 'src/module/timebox/features/tasks/components/kanban-add-task-modal';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface DateGroup {
  label: string;
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs } | null;
  tasks: Array<Task & { projectName: string; projectColor: string }>;
  color: string;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function UpcomingView() {
  const { t } = useTranslate('timebox.tasks');
  const { t: tCommon } = useTranslate('common');
  const { data: projects, isLoading, error } = useProjects();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState<string | false>(['overdue', 'today', 'tomorrow'].join(','));

  // Group tasks by date ranges
  const dateGroups = useMemo(() => {
    if (!projects) return [];

    const now = dayjs();
    const startOfToday = now.startOf('day');
    const endOfToday = now.endOf('day');
    const startOfTomorrow = now.add(1, 'day').startOf('day');
    const endOfTomorrow = now.add(1, 'day').endOf('day');
    const endOfWeek = now.endOf('week');
    const endOfNextWeek = now.add(1, 'week').endOf('week');

    const groups: DateGroup[] = [
      {
        label: tCommon('overdue'),
        dateRange: null, // Special handling for overdue
        tasks: [],
        color: '#EF4444',
      },
      {
        label: tCommon('today'),
        dateRange: { start: startOfToday, end: endOfToday },
        tasks: [],
        color: '#22C55E',
      },
      {
        label: tCommon('tomorrow'),
        dateRange: { start: startOfTomorrow, end: endOfTomorrow },
        tasks: [],
        color: '#3B82F6',
      },
      {
        label: t('thisWeek'),
        dateRange: { start: endOfTomorrow.add(1, 'millisecond'), end: endOfWeek },
        tasks: [],
        color: '#8B5CF6',
      },
      {
        label: t('nextWeek'),
        dateRange: { start: endOfWeek.add(1, 'millisecond'), end: endOfNextWeek },
        tasks: [],
        color: '#EC4899',
      },
      {
        label: t('later'),
        dateRange: { start: endOfNextWeek.add(1, 'millisecond'), end: dayjs('2099-12-31') },
        tasks: [],
        color: '#6B7280',
      },
    ];

    // Collect and categorize all tasks
    projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task: any) => {
          // Skip completed tasks
          if (task.completedAt) return;

          // Skip tasks without due dates
          if (!task.dueDate) return;

          const dueDate = dayjs(task.dueDate);
          const enrichedTask = {
            ...task,
            projectName: project.name,
            projectColor: project.color,
          };

          // Check overdue (before today and not completed)
          if (dueDate.isBefore(startOfToday)) {
            groups[0].tasks.push(enrichedTask);
            return;
          }

          // Find matching group
          for (const group of groups) {
            if (group.dateRange && dueDate.isAfter(group.dateRange.start) && dueDate.isBefore(group.dateRange.end)) {
              group.tasks.push(enrichedTask);
              break;
            }
          }
        });
      }
    });

    // Filter out empty groups
    return groups.filter((g) => g.tasks.length > 0);
  }, [projects, t, tCommon]);

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

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanels(isExpanded ? panel : false);
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

  // Calculate total tasks
  const totalTasks = dateGroups.reduce((sum, group) => sum + group.tasks.length, 0);

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
              {t('upcoming')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {totalTasks} task{totalTasks !== 1 ? 's' : ''} • {dateGroups.length} group{dateGroups.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Stack>

        {/* Quick Add Button */}
        <QuickAddButtonInline onClick={handleAddTask} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {totalTasks === 0 ? (
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
            <Iconify icon="solar:calendar-date-bold" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('noUpcomingTasks')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('noUpcomingTasksDescription')}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {dateGroups.map((group, index) => {
              const panelId = `panel-${index}`;
              const isExpanded = expandedPanels === panelId ||
                (typeof expandedPanels === 'string' && expandedPanels.includes(panelId));

              return (
                <Accordion
                  key={group.label}
                  expanded={isExpanded}
                  onChange={handleAccordionChange(panelId)}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': { margin: 0 },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<Iconify icon="solar:double-alt-arrow-down-bold-duotone" width={20} />}
                    sx={{
                      px: 2,
                      py: 1,
                      minHeight: 48,
                      '& .MuiAccordionSummary-content': {
                        margin: '0 !important',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {/* Color indicator */}
                      <Box
                        sx={{
                          width: 4,
                          height: 16,
                          borderRadius: 1,
                          bgcolor: group.color,
                        }}
                      />

                      {/* Group label */}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {group.label}
                      </Typography>

                      {/* Task count */}
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {group.tasks.length}
                        </Typography>
                      </Box>

                      {/* Date range hint for some groups */}
                      {group.dateRange && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {group.dateRange.start.format('MMM D')} - {group.dateRange.end.format('MMM D')}
                        </Typography>
                      )}
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
                    <Stack spacing={1}>
                      {group.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onComplete={handleToggleComplete}
                          onEdit={handleEditTask}
                          onClick={handleTaskClick}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Stack>
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