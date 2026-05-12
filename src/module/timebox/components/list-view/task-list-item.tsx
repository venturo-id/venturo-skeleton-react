// TaskListItem - Horizontal task item for list view

import type { Task } from 'src/module/timebox/types';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AvatarGroup from '@mui/material/AvatarGroup';

import { Iconify } from 'src/shared/ui/iconify';
import { CircleCheckbox } from 'src/module/timebox/components/task/circle-checkbox';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface TaskListItemProps {
  task: Task;
  isDragging?: boolean;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onClick?: (task: Task) => void;
  showDescription?: boolean;
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

function getPriorityColor(priority: Task['priority']) {
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
      return 'transparent';
  }
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

export function TaskListItem({
  task,
  isDragging = false,
  onComplete,
  onEdit,
  onClick,
  showDescription = false,
}: TaskListItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const dueDateDisplay = useMemo(() => formatDate(task.dueDate), [task.dueDate]);

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.completedAt) return false;
    const dueDate = dayjs(task.dueDate);
    const now = dayjs();
    return dueDate.isBefore(now) && !dueDate.isSame(now, 'day');
  }, [task.dueDate, task.completedAt]);

  const priorityBorderColor = getPriorityBorderColor(task.priority);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      onClick={() => onClick?.(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        px: 1.5,
        py: 1,
        mb: 0.5,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        boxShadow: isDragging ? 2 : 0,
        cursor: 'pointer',
        transition: 'all 150ms',
        position: 'relative',
        ...(task.priority !== 'none' && {
          borderLeft: 3,
          borderLeftColor: priorityBorderColor,
        }),
        '&:hover': {
          boxShadow: 1,
          borderColor: 'text.disabled',
        },
      }}
    >
      <Stack spacing={0.5}>
        {/* Main Row */}
        <Stack direction="row" spacing={1} alignItems="flex-start">
          {/* Checkbox */}
          <CircleCheckbox
            checked={!!task.completedAt}
            onChange={(checked) => onComplete?.(task.id)}
            priority={task.priority}
            size="small"
          />

          {/* Title */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                textDecoration: task.completedAt ? 'line-through' : 'none',
                color: task.completedAt ? 'text.disabled' : 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.title}
            </Typography>

            {/* Description (collapsible) */}
            {(showDescription || expanded || task.description) && (
              <Collapse in={expanded || showDescription}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mt: 0.25,
                  }}
                >
                  {task.description}
                </Typography>
              </Collapse>
            )}
          </Box>

          {/* Metadata */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* Due date */}
            {task.dueDate && (
              <Chip
                label={dueDateDisplay}
                size="small"
                icon={<Iconify icon="solar:calendar-date-bold" width={12} sx={{ ml: 0.25 }} />}
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

            {/* Priority badge */}
            {task.priority !== 'none' && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getPriorityColor(task.priority),
                }}
              />
            )}

            {/* Labels (compact) */}
            {task.labels && task.labels.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                {task.labels.slice(0, 2).map((label) => (
                  <Box
                    key={label.id}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: label.color,
                    }}
                  />
                ))}
                {task.labels.length > 2 && (
                  <Chip
                    label={`+${task.labels.length - 2}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      bgcolor: 'action.hover',
                      color: 'text.secondary',
                      '& .MuiChip-label': {
                    px: 0.5,
                  },
                    }}
                  />
                )}
              </Box>
            )}

            {/* Expand button (if has description) */}
            {task.description && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                sx={{ p: 0.25 }}
              >
                <Iconify
                  icon={expanded ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'}
                  width={14}
                />
              </IconButton>
            )}

            {/* Actions (on hover) */}
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
        </Stack>

        {/* Expanded Details Row */}
        <Collapse in={expanded}>
          <Stack direction="row" spacing={2} sx={{ pl: 3.5, pt: 0.5, pb: 0.5 }}>
            {/* Full labels */}
            {task.labels && task.labels.length > 0 && (
              <Stack direction="row" spacing={0.5}>
                {task.labels.map((label) => (
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
              </Stack>
            )}

            {/* Assignees */}
            {task.assigneeIds && task.assigneeIds.length > 0 && (
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
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
}
