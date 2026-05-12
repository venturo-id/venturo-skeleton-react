// KanbanColumn - Column in the Kanban board

import type { DragEndEvent } from '@dnd-kit/core';
import type { Task } from 'src/module/timebox/types';

import { CSS } from '@dnd-kit/utilities';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSensor, DndContext, useSensors, closestCenter, PointerSensor } from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { TaskCard } from './task-card';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  taskCount?: number;
  color?: string;
}

// ----------------------------------------------------------------------
// Sortable Task Item
// ----------------------------------------------------------------------

interface SortableTaskItemProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onClick?: (task: Task) => void;
}

function SortableTaskItem({ task, onComplete, onEdit, onClick }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        onComplete={onComplete}
        onEdit={onEdit}
        onClick={onClick}
        {...listeners}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function KanbanColumn({
  id,
  title,
  tasks,
  onToggleComplete,
  onEditTask,
  onTaskClick,
  onDragEnd,
  collapsed = false,
  onToggleCollapse,
  taskCount,
  color,
}: KanbanColumnProps) {
  const { t } = useTranslate('timebox.tasks');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const displayTasks = tasks ?? [];
  const computedTaskCount = taskCount ?? displayTasks.length;

  if (collapsed) {
    return (
      <Box
        sx={{
          minWidth: 280,
          maxWidth: 280,
          bgcolor: 'background.default',
          borderRadius: 2,
          p: 1,
        }}
      >
        <Box
          onClick={onToggleCollapse}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {color && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: color,
                }}
              />
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          <Chip
            label={computedTaskCount}
            size="small"
            sx={{
              height: 20,
              fontSize: 11,
              fontWeight: 500,
              bgcolor: 'action.hover',
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minWidth: 280,
        maxWidth: 280,
        bgcolor: 'background.default',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {color && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color,
              }}
            />
          )}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Chip
            label={computedTaskCount}
            size="small"
            sx={{
              height: 20,
              fontSize: 11,
              fontWeight: 500,
              bgcolor: 'action.hover',
            }}
          />
        </Box>

        <Stack direction="row" spacing={0.25}>
          {onToggleCollapse && (
            <IconButton size="small" onClick={onToggleCollapse} sx={{ p: 0.5 }}>
              <Iconify icon="solar:double-alt-arrow-up-bold-duotone" width={16} />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Task List */}
      <Box sx={{ px: 1, pb: 1, flex: 1, overflowY: 'auto' }}>
        {displayTasks.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={displayTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
              <Stack spacing={0.5}>
                {displayTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onComplete={onToggleComplete}
                    onEdit={onEditTask}
                    onClick={onTaskClick}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            <Typography variant="caption">{t('noTasks')}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
