// SubtasksSection - Display and manage subtasks for a task

import type { Subtask } from 'src/module/timebox/types';

import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSensor, DndContext, useSensors, closestCenter, PointerSensor } from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { SubtaskInput } from './subtask-input';
import { SortableSubtaskRow } from './sortable-subtask-row';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface SubtasksSectionProps {
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
  onEditSubtask?: (subtaskId: string, title: string) => void;
  onReorderSubtasks?: (subtaskIds: string[]) => void;
}

// ----------------------------------------------------------------------
// Component: SubtasksSection
// ----------------------------------------------------------------------

export function SubtasksSection({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onEditSubtask,
  onReorderSubtasks,
}: SubtasksSectionProps) {
  const { t } = useTranslate('timebox.tasks');

  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Calculate progress
  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = subtasks.findIndex((s) => s.id === active.id);
      const newIndex = subtasks.findIndex((s) => s.id === over.id);

      const newSubtasks = [...subtasks];
      const [movedItem] = newSubtasks.splice(oldIndex, 1);
      newSubtasks.splice(newIndex, 0, movedItem);

      onReorderSubtasks?.(newSubtasks.map((s) => s.id));
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      {/* Header */}
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          <Iconify
            icon={isExpanded ? 'solar:double-alt-arrow-down-bold-duotone' : 'solar:double-alt-arrow-right-bold-duotone'}
            width={16}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('subtasks')} ({completedCount}/{totalCount})
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {/* Progress percentage */}
          <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 35, textAlign: 'right' }}>
            {Math.round(progress)}%
          </Typography>
        </Stack>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ px: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Subtasks List */}
      <Collapse in={isExpanded}>
        <Box sx={{ px: 1, py: 1 }}>
          {subtasks.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={subtasks.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <Stack spacing={0.5}>
                  {subtasks.map((subtask) => (
                    <SortableSubtaskRow
                      key={subtask.id}
                      subtask={subtask}
                      onToggle={onToggleSubtask}
                      onDelete={onDeleteSubtask}
                      onEdit={onEditSubtask}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          ) : (
            <Box
              sx={{
                py: 2,
                textAlign: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption">{t('addSubtask')}</Typography>
            </Box>
          )}

          {/* Add Subtask */}
          {!isAdding ? (
            <Box
              onClick={() => setIsAdding(true)}
              sx={{
                px: 1.5,
                py: 1,
                mt: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'all 150ms',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              <Iconify icon="solar:add-circle-bold" width={16} />
              <Typography variant="body2">{t('addSubtask')}</Typography>
            </Box>
          ) : (
            <SubtaskInput
              onSubmit={(title) => {
                onAddSubtask(title);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
