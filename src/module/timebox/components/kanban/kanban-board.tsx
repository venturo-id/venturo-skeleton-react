// KanbanBoard - Main Kanban board with drag-and-drop

import type { Task, Project, Section } from 'src/module/timebox/types';

import { useMemo, useState } from 'react';
import { useSensor, DndContext, useSensors, PointerSensor } from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { KanbanColumn } from './kanban-column';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface KanbanBoardProps {
  project: Project;
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onMoveTask?: (taskId: string, targetSectionId: string | null) => void;
  onAddTask?: () => void;
}

// ----------------------------------------------------------------------
// Helper: Group tasks by section
// ----------------------------------------------------------------------

interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

function groupTasksBySection(tasks: Task[], sections: Section[]): TaskGroup[] {
  const noSectionGroup: TaskGroup = {
    id: 'no-section',
    title: 'No Section',
    tasks: tasks.filter((t) => !t.sectionId),
  };

  const sectionGroups = sections.map((section) => ({
    id: section.id,
    title: section.name,
    tasks: tasks.filter((t) => t.sectionId === section.id),
    collapsed: section.collapsed,
  }));

  return [noSectionGroup, ...sectionGroups].filter((g) => g.tasks.length > 0 || g.id === 'no-section');
}

function groupTasksByStatus(tasks: Task[]): TaskGroup[] {
  const incompleteTasks = tasks.filter((t) => !t.completedAt);
  const completedTasks = tasks.filter((t) => t.completedAt);

  return [
    {
      id: 'incomplete',
      title: 'To Do',
      tasks: incompleteTasks,
      color: '#22C55E',
    },
    {
      id: 'complete',
      title: 'Done',
      tasks: completedTasks,
      color: '#919EAB',
    },
  ];
}

function groupTasksByPriority(tasks: Task[]): TaskGroup[] {
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

export function KanbanBoard({
  project,
  tasks,
  onToggleComplete,
  onEditTask,
  onTaskClick,
  onMoveTask,
  onAddTask,
}: KanbanBoardProps) {
  const { t: tCommon } = useTranslate('common');

  const [viewMode, setViewMode] = useState<'section' | 'status' | 'priority'>('section');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks based on view mode
  const groups = useMemo(() => {
    switch (viewMode) {
      case 'section':
        return groupTasksBySection(tasks, project.sections ?? []);
      case 'status':
        return groupTasksByStatus(tasks);
      case 'priority':
        return groupTasksByPriority(tasks);
      default:
        return groupTasksBySection(tasks, project.sections ?? []);
    }
  }, [tasks, project.sections, viewMode]);

  const handleToggleSection = (groupId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
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
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* View mode selector */}
          <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 0.25 }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('section')}
              sx={{
                bgcolor: viewMode === 'section' ? 'background.paper' : 'transparent',
                boxShadow: viewMode === 'section' ? 1 : 0,
              }}
            >
              <Iconify icon="solar:list-bold" width={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('status')}
              sx={{
                bgcolor: viewMode === 'status' ? 'background.paper' : 'transparent',
                boxShadow: viewMode === 'status' ? 1 : 0,
              }}
            >
              <Iconify icon="solar:file-check-bold-duotone" width={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('priority')}
              sx={{
                bgcolor: viewMode === 'priority' ? 'background.paper' : 'transparent',
                boxShadow: viewMode === 'priority' ? 1 : 0,
              }}
            >
              <Iconify icon="solar:flag-bold" width={16} />
            </IconButton>
          </Stack>

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

      {/* Board */}
      <DndContext sensors={sensors}>
        <Box
          sx={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            p: 2,
          }}
        >
          <Stack direction="row" spacing={2}>
            {groups.map((group) => (
              <KanbanColumn
                key={group.id}
                id={group.id}
                title={group.title}
                tasks={group.tasks}
                color={group.color}
                collapsed={collapsedSections.has(group.id)}
                onToggleCollapse={() => handleToggleSection(group.id)}
                onToggleComplete={onToggleComplete}
                onEditTask={onEditTask}
                onTaskClick={onTaskClick}
              />
            ))}
          </Stack>
        </Box>
      </DndContext>
    </Box>
  );
}
