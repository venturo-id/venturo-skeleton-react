// TaskListView - Alternative list view for tasks

import type { SelectChangeEvent } from '@mui/material/Select';
import type { Task, Project, Section } from 'src/module/timebox/types';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { TaskListItem } from './task-list-item';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type GroupBy = 'none' | 'section' | 'priority' | 'dueDate' | 'label';
type SortBy = 'position' | 'dueDate' | 'priority' | 'title' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface TaskListViewProps {
  project: Project;
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
}

interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

// ----------------------------------------------------------------------
// Helper: Group and sort tasks
// ----------------------------------------------------------------------

function groupTasks(tasks: Task[], groupBy: GroupBy, sections: Section[]): TaskGroup[] {
  switch (groupBy) {
    case 'section': {
      const noSectionGroup: TaskGroup = {
        id: 'no-section',
        title: 'No Section',
        tasks: tasks.filter((t) => !t.sectionId),
      };

      const sectionGroups = sections.map((section) => ({
        id: section.id,
        title: section.name,
        tasks: tasks.filter((t) => t.sectionId === section.id),
      }));

      return [noSectionGroup, ...sectionGroups].filter((g) => g.tasks.length > 0 || g.id === 'no-section');
    }

    case 'priority': {
      const priorities: Record<string, Task[]> = {
        urgent: [],
        high: [],
        medium: [],
        low: [],
        none: [],
      };

      tasks.forEach((task) => {
        priorities[task.priority].push(task);
      });

      return Object.entries(priorities)
        .filter(([_, taskList]) => taskList.length > 0)
        .map(([priority, priorityTasks]) => ({
          id: priority,
          title: priority.charAt(0).toUpperCase() + priority.slice(1),
          tasks: priorityTasks,
          color: getPriorityColor(priority as any),
        }));
    }

    case 'dueDate': {
      const noDateGroup: TaskGroup = {
        id: 'no-date',
        title: 'No Date',
        tasks: tasks.filter((t) => !t.dueDate),
      };

      const overdueGroup: TaskGroup = {
        id: 'overdue',
        title: 'Overdue',
        tasks: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completedAt),
        color: '#FA383E',
      };

      const todayGroup: TaskGroup = {
        id: 'today',
        title: 'Today',
        tasks: tasks.filter((t) => {
          if (!t.dueDate) return false;
          const date = new Date(t.dueDate);
          const today = new Date();
          return (
            date.toDateString() === today.toDateString() &&
            date >= new Date(today.setHours(0, 0, 0, 0))
          );
        }),
        color: '#22C55E',
      };

      const upcomingGroup: TaskGroup = {
        id: 'upcoming',
        title: 'Upcoming',
        tasks: tasks.filter((t) => {
          if (!t.dueDate) return false;
          const date = new Date(t.dueDate);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return date > tomorrow && !t.completedAt;
        }),
        color: '#00B8D9',
      };

      return [overdueGroup, todayGroup, upcomingGroup, noDateGroup].filter((g) => g.tasks.length > 0);
    }

    default: {
      return [
        {
          id: 'all',
          title: 'All Tasks',
          tasks,
        },
      ];
    }
  }
}

function sortTasks(tasks: Task[], sortBy: SortBy, sortOrder: SortOrder): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'position': {
        comparison = (a.position ?? 0) - (b.position ?? 0);
        break;
      }
      case 'dueDate': {
        if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      }
      case 'priority': {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'title': {
        comparison = a.title.localeCompare(b.title);
        break;
      }
      case 'createdAt': {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      }
      // no default
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
    case 'high':
      return '#FA383E';
    case 'medium':
      return '#FFAB00';
    case 'low':
      return '#00B8D9';
    case 'none':
    default:
      return '#919EAB';
  }
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function TaskListView({
  project,
  tasks,
  onToggleComplete,
  onEditTask,
  onTaskClick,
  onAddTask,
}: TaskListViewProps) {
  const { t } = useTranslate('timebox.tasks');
  const { t: tCommon } = useTranslate('common');

  const [groupBy, setGroupBy] = useState<GroupBy>('section');
  const [sortBy, setSortBy] = useState<SortBy>('position');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.labels?.some((l) => l.name.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  // Group tasks
  const groups = useMemo(() => {
    const grouped = groupTasks(filteredTasks, groupBy, project.sections ?? []);
    return grouped.map((group) => ({
      ...group,
      tasks: sortTasks(group.tasks, sortBy, sortOrder),
    }));
  }, [filteredTasks, groupBy, project.sections, sortBy, sortOrder]);

  const handleToggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const [field, order] = event.target.value.split('-') as [SortBy, SortOrder];
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder={tCommon('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:clock-circle-bold" width={16} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 240 }}
          />

          {/* Group by */}
          <Select
            size="small"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="none">No Group</MenuItem>
            <MenuItem value="section">Section</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>

          {/* Sort by */}
          <Select
            size="small"
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="position-asc">Position ↑</MenuItem>
            <MenuItem value="dueDate-asc">Due Date ↑</MenuItem>
            <MenuItem value="dueDate-desc">Due Date ↓</MenuItem>
            <MenuItem value="priority-asc">Priority ↑</MenuItem>
            <MenuItem value="priority-desc">Priority ↓</MenuItem>
            <MenuItem value="title-asc">Title A-Z</MenuItem>
            <MenuItem value="title-desc">Title Z-A</MenuItem>
            <MenuItem value="createdAt-desc">Newest</MenuItem>
            <MenuItem value="createdAt-asc">Oldest</MenuItem>
          </Select>

          {/* Add task button */}
          {onAddTask && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="solar:add-circle-bold" width={16} />}
              onClick={onAddTask}
            >
              {tCommon('add')}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Task List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {groups.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            <Typography variant="body2">{t('noTasks')}</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {groups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.id);

              return (
                <Box key={group.id}>
                  {/* Group Header */}
                  <Box
                    onClick={() => handleToggleGroup(group.id)}
                    sx={{
                      px: 1,
                      py: 0.75,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      bgcolor: 'action.hover',
                      mb: isCollapsed ? 0 : 1,
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {group.color && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: group.color,
                          }}
                        />
                      )}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {group.title}
                      </Typography>
                      <Chip
                        label={group.tasks.length}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      />
                    </Stack>

                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <Iconify
                        icon={isCollapsed ? 'solar:forward-bold' : 'solar:double-alt-arrow-down-bold-duotone'}
                        width={16}
                      />
                    </IconButton>
                  </Box>

                  {/* Group Tasks */}
                  {!isCollapsed && (
                    <Stack spacing={0.5}>
                      {group.tasks.map((task) => (
                        <TaskListItem
                          key={task.id}
                          task={task}
                          onComplete={onToggleComplete}
                          onEdit={onEditTask}
                          onClick={onTaskClick}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
