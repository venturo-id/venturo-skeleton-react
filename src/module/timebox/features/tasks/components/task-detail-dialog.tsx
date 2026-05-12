// TaskDetailDialog - Full task editing dialog with all features

import type { Task, TaskPriority } from 'src/module/timebox/types';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { TASK_PRIORITY_COLORS } from 'src/module/timebox/utils/constants';
import { CircleCheckbox } from 'src/module/timebox/components/task/circle-checkbox';
import { LabelChip } from 'src/module/timebox/features/labels/components/label-chip';
import { RichTextEditor } from 'src/module/timebox/components/editor/rich-text-editor';
import { PriorityPopover } from 'src/module/timebox/components/popovers/priority-popover';
import { DatePickerPopover } from 'src/module/timebox/components/popovers/date-picker-popover';
import { LabelPickerPopover } from 'src/module/timebox/components/popovers/label-picker-popover';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function TaskDetailDialog({
  open,
  onClose,
  task,
  onUpdate,
  onDelete,
}: TaskDetailDialogProps) {
  const { t } = useTranslate('timebox.tasks');
  const { t: tCommon } = useTranslate('common');

  // Local state for inline editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  // Popover states
  const [dueDateAnchor, setDueDateAnchor] = useState<HTMLElement | null>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<HTMLElement | null>(null);
  const [labelsAnchor, setLabelsAnchor] = useState<HTMLElement | null>(null);

  // Derived values
  const priority = task.priority || 'none';
  const priorityColor = TASK_PRIORITY_COLORS[priority] || TASK_PRIORITY_COLORS.none;
  const dueDateDisplay = task.dueDate ? dayjs(task.dueDate) : null;

  // Handlers
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setEditedTitle(task.title);
  };

  const handleTitleSave = async () => {
    if (editedTitle.trim() && editedTitle !== task.title && onUpdate) {
      try {
        await onUpdate(task.id, { title: editedTitle.trim() });
      } catch (err) {
        console.error('Failed to update title:', err);
        setEditedTitle(task.title); // Revert
      }
    } else {
      setEditedTitle(task.title); // Revert if unchanged or empty
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(task.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleToggleComplete = async (checked: boolean) => {
    if (onUpdate) {
      await onUpdate(task.id, { completedAt: checked ? new Date().toISOString() : null });
    }
  };

  const handleDescriptionChange = useCallback((content: string) => {
    setDescription(content);
  }, []);

  const handleDueDateChange = async (date: string | null) => {
    setDueDateAnchor(null);
    if (onUpdate) {
      await onUpdate(task.id, { dueDate: date });
    }
  };

  const handlePriorityChange = async (priorityValue: TaskPriority) => {
    setPriorityAnchor(null);
    if (onUpdate) {
      await onUpdate(task.id, { priority: priorityValue });
    }
  };

  const handleLabelsChange = async (labelIds: string[]) => {
    setLabelsAnchor(null);
    if (onUpdate) {
      await onUpdate(task.id, { labels: labelIds.map((id) => ({ id } as any)) });
    }
  };

  const handleDeleteTask = async () => {
    if (onDelete && window.confirm(t('deleteTaskConfirm'))) {
      await onDelete(task.id);
      onClose();
    }
  };

  const isCompleted = !!task.completedAt;
  const isOverdue = !isCompleted && dueDateDisplay && dueDateDisplay.isBefore(dayjs(), 'day');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: 800,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Checkbox */}
        <Box sx={{ mt: 0.5 }}>
          <CircleCheckbox
            checked={isCompleted}
            size="medium"
            priority={priority}
            onChange={handleToggleComplete}
          />
        </Box>

        {/* Title */}
        <Box sx={{ flex: 1 }}>
          {isEditingTitle ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          ) : (
            <Typography
              variant="h5"
              onClick={handleTitleEdit}
              sx={{
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                },
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.disabled' : 'text.primary',
                py: 0.5,
                px: 0.5,
                ml: -0.5,
              }}
            >
              {task.title}
            </Typography>
          )}

          {/* Meta info */}
          <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {/* Due date */}
            <DatePickerPopover
              value={dueDateDisplay?.format('YYYY-MM-DD') ?? null}
              onChange={handleDueDateChange}
              anchorEl={dueDateAnchor}
              onAnchorChange={setDueDateAnchor}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Iconify
                  icon="solar:calendar-date-bold"
                  width={16}
                  sx={{ color: isOverdue ? 'error.main' : 'text.secondary' }}
                />
                <Typography variant="body2" sx={{ color: isOverdue ? 'error.main' : 'text.secondary' }}>
                  {dueDateDisplay ? dueDateDisplay.format('MMM D') : tCommon('noDate')}
                </Typography>
              </Box>
            </DatePickerPopover>

            {/* Priority */}
            <PriorityPopover
              value={priority as TaskPriority}
              onChange={handlePriorityChange}
              anchorEl={priorityAnchor}
              onAnchorChange={setPriorityAnchor}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: priorityColor,
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t(`priorities.${priority}`)}
                </Typography>
              </Box>
            </PriorityPopover>

            {/* Labels */}
            <LabelPickerPopover
              labels={task.labels || []}
              value={task.labels?.map((l) => l.id) || []}
              onChange={handleLabelsChange}
              anchorEl={labelsAnchor}
              onAnchorChange={setLabelsAnchor}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Iconify icon="solar:tag-horizontal-bold-duotone" width={16} sx={{ color: 'text.secondary' }} />
                <Stack direction="row" spacing={0.5}>
                  {(task.labels || []).slice(0, 2).map((label) => (
                    <LabelChip key={label.id} label={label} size="small" />
                  ))}
                  {(task.labels || []).length > 2 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      +{(task.labels || []).length - 2}
                    </Typography>
                  )}
                  {(task.labels || []).length === 0 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {tCommon('label')}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </LabelPickerPopover>
          </Stack>
        </Box>

        {/* Close button */}
        <IconButton onClick={onClose} size="small">
          <Iconify icon="solar:close-circle-bold" width={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Main content */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                {tCommon('description')}
              </Typography>
              <RichTextEditor
                content={description}
                onChange={handleDescriptionChange}
                placeholder={t('form.descriptionPlaceholder')}
                minHeight={100}
                editable
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Subtasks */}
            {/* TODO: Implement subtasks handlers */}
            {/* <SubtasksSection taskId={task.id} subtasks={task.subtasks || []} /> */}

            <Divider sx={{ my: 2 }} />

            {/* Comments */}
            {/* TODO: Implement comments handlers */}
            {/* <CommentsSection taskId={task.id} comments={task.comments || []} /> */}
          </Box>

          {/* Sidebar - Properties */}
          <Box
            sx={{
              width: 280,
              borderLeft: '1px solid',
              borderColor: 'divider',
              p: 2,
              overflowY: 'auto',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              {t('properties')}
            </Typography>

            <Stack spacing={2}>
              {/* Created at */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {tCommon('createdAt')}
                </Typography>
                <Typography variant="body2">
                  {dayjs(task.createdAt).format('MMM D, YYYY · h:mm A')}
                </Typography>
              </Box>

              {/* Updated at */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {tCommon('updatedAt')}
                </Typography>
                <Typography variant="body2">
                  {dayjs(task.updatedAt).format('MMM D, YYYY · h:mm A')}
                </Typography>
              </Box>

              {/* Completed at */}
              {isCompleted && task.completedAt && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    {t('taskCompleted')}
                  </Typography>
                  <Typography variant="body2">
                    {dayjs(task.completedAt).format('MMM D, YYYY · h:mm A')}
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Actions */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  {tCommon('actions')}
                </Typography>
                <Stack spacing={0.5}>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:copy-bold" width={16} />}
                    onClick={() => console.log('Duplicate task')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {tCommon('duplicate')}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
                    onClick={handleDeleteTask}
                    color="error"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {tCommon('delete')}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
