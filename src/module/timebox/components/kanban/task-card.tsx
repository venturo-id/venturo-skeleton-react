// TaskCard - Draggable task card for Kanban board

import type { Task } from 'src/module/timebox/types';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AvatarGroup from '@mui/material/AvatarGroup';

import { Iconify } from 'src/shared/ui/iconify';
import { CircleCheckbox } from 'src/module/timebox/components/task/circle-checkbox';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onClick?: (task: Task) => void;
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  const date = dayjs(dateStr);
  const now = dayjs();
  const today = now.startOf('day');
  const tomorrow = today.add(1, 'day');
  const taskDate = date.startOf('day');

  if (taskDate.isSame(today, 'day')) {
    return 'Today';
  }
  if (taskDate.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  }
  if (taskDate.isBefore(today)) {
    return 'Overdue';
  }

  return date.format('MMM D');
}

function getPriorityBorderColor(priority: Task['priority']) {
  switch (priority) {
    case 'urgent':
    case 'high':
      return 'error.main';
    case 'medium':
      return 'warning.main';
    case 'low':
      return 'info.main';
    case 'none':
    default:
      return 'divider';
  }
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function TaskCard({
  task,
  isDragging = false,
  onComplete,
  onEdit,
  onClick,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dueDateDisplay = useMemo(() => formatDate(task.dueDate), [task.dueDate]);

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.completedAt) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && dueDate.toDateString() !== now.toDateString();
  }, [task.dueDate, task.completedAt]);

  const priorityBorderColor = getPriorityBorderColor(task.priority);

  return (
    <Box
      onClick={() => onClick?.(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 1.5,
        mb: 1,
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        boxShadow: isDragging ? 4 : 0,
        cursor: 'pointer',
        transition: 'all 150ms',
        position: 'relative',
        ...(task.priority !== 'none' && {
          borderLeft: 4,
          borderLeftColor: priorityBorderColor,
        }),
        '&:hover': {
          boxShadow: 2,
          borderColor: 'text.disabled',
        },
      }}
    >
      <Stack spacing={1}>
        {/* Header: Checkbox + Title */}
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <CircleCheckbox
            checked={!!task.completedAt}
            onChange={(checked) => onComplete?.(task.id)}
            priority={task.priority}
            size="small"
          />
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              fontWeight: 500,
              textDecoration: task.completedAt ? 'line-through' : 'none',
              color: task.completedAt ? 'text.disabled' : 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {task.title}
          </Typography>
        </Stack>

        {/* Description preview (optional) */}
        {task.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              pl: 3.5,
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Footer: Due date + Labels */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ pl: 3.5 }}>
          {/* Due date */}
          {task.dueDate && (
            <Chip
              label={dueDateDisplay}
              size="small"
              icon={
                <Iconify
                  icon="solar:calendar-date-bold"
                  width={12}
                  sx={{ ml: 0.25 }}
                />
              }
              sx={{
                height: 20,
                fontSize: 11,
                bgcolor: isOverdue ? 'error.lighter' : 'action.hover',
                color: isOverdue ? 'error.main' : 'text.secondary',
                '& .MuiChip-icon': {
                  color: isOverdue ? 'error.main' : 'text.disabled',
                },
              }}
            />
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <Stack direction="row" spacing={0.25}>
              {task.labels.slice(0, 2).map((label) => (
                <Chip
                  key={label.id}
                  label={label.name}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    bgcolor: label.color,
                    color: '#fff',
                    '& .MuiChip-label': {
                      px: 0.75,
                    },
                  }}
                />
              ))}
              {task.labels.length > 2 && (
                <Chip
                  label={`+${task.labels.length - 2}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    '& .MuiChip-label': {
                      px: 0.75,
                    },
                  }}
                />
              )}
            </Stack>
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Actions (only on hover) */}
          {isHovered && (
            <Stack direction="row" spacing={0.25}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(task);
                }}
                sx={{ p: 0.5 }}
              >
                <Iconify icon="solar:pen-bold" width={14} />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {/* Assignees (optional) */}
        {task.assigneeIds && task.assigneeIds.length > 0 && (
          <Box sx={{ pl: 3.5 }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: 10 } }}>
              {task.assigneeIds.map((assigneeId) => (
                <Avatar
                  key={assigneeId}
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    bgcolor: 'primary.main',
                  }}
                >
                  {assigneeId.charAt(0).toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
