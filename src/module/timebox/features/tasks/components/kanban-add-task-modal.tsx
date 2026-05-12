// KanbanAddTaskModal - Quick add task dialog

import type { TFunction } from 'i18next';
import type { Task, TaskFormData } from 'src/module/timebox/types';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';
import { Form, Field } from 'src/shared/ui/hook-form';
import { ErrorDialog } from 'src/shared/ui/error-dialog';
import { useLabels } from 'src/module/timebox/features/labels/hooks';
import { TASK_PRIORITIES } from 'src/module/timebox/utils/constants';
import { useProjects } from 'src/module/timebox/features/projects/hooks';

import { createTask } from '../api';

// ----------------------------------------------------------------------
// Schema
// ----------------------------------------------------------------------

function makeSchema(t: TFunction) {
  return z.object({
    title: z
      .string()
      .min(1, { message: t('validation.titleRequired') })
      .max(500, { message: t('validation.titleMax') }),
    projectId: z.string().min(1, { message: t('validation.projectRequired') }),
    sectionId: z.string().nullish(),
    priority: z.enum(['urgent', 'high', 'medium', 'low', 'none']),
    dueDate: z.string().nullish(),
    labelIds: z.array(z.string()).optional(),
    description: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface KanbanAddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
  defaultProjectId?: string;
  defaultSectionId?: string;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function KanbanAddTaskModal({
  open,
  onClose,
  onCreated,
  defaultProjectId,
  defaultSectionId,
}: KanbanAddTaskModalProps) {
  const { t } = useTranslate('timebox.tasks');
  const { t: tCommon } = useTranslate('common');
  const schema = useMemo(() => makeSchema(t), [t]);

  const submitting = useBoolean();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const { data: projects } = useProjects();
  const { data: labels } = useLabels();

  // Get sections for selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    defaultProjectId ?? null
  );
  const selectedProject = projects?.find((p) => p.id === selectedProjectId);
  const sections = selectedProject?.sections ?? [];

  const defaultValues: FormValues = useMemo(
    () => ({
      title: '',
      projectId: defaultProjectId ?? '',
      sectionId: defaultSectionId ?? null,
      priority: 'none',
      dueDate: null,
      labelIds: [],
      description: '',
    }),
    [defaultProjectId, defaultSectionId]
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { handleSubmit, watch, reset, setValue } = methods;

  const watchedProjectId = watch('projectId');
  const watchedPriority = watch('priority');
  const watchedLabelIds = watch('labelIds') ?? [];

  useEffect(() => {
    setSelectedProjectId(watchedProjectId);
  }, [watchedProjectId]);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setShowDescription(false);
    }
    if (!open) setErrorMsg(null);
  }, [open, defaultValues, reset]);

  const onCreate = handleSubmit(async (values) => {
    setErrorMsg(null);
    submitting.onTrue();
    try {
      const formData: Omit<TaskFormData, 'projectId'> = {
        title: values.title,
        sectionId: values.sectionId,
        priority: values.priority,
        dueDate: values.dueDate,
        labelIds: values.labelIds ?? [],
        description: values.description,
      };
      const newTask = await createTask(values.projectId, formData);
      onCreated(newTask);
      reset();
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('errors.createFailed'));
    } finally {
      submitting.onFalse();
    }
  });

  const toggleLabel = (labelId: string) => {
    const currentLabels = watchedLabelIds ?? [];
    if (currentLabels.includes(labelId)) {
      setValue('labelIds', currentLabels.filter((id) => id !== labelId));
    } else {
      setValue('labelIds', [...currentLabels, labelId]);
    }
  };

  return (
    <>
      <MotionDialog
        open={open}
        onClose={submitting.value ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
          <Box sx={{ flex: 1 }}>{t('dialog.addTaskTitle')}</Box>
          <IconButton size="small" onClick={onClose} disabled={submitting.value}>
            <Iconify icon="mingcute:close-line" width={18} />
          </IconButton>
        </DialogTitle>

        <Form methods={methods} onSubmit={onCreate} sx={{ display: 'contents' }}>
          <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={2}>
              {/* Title */}
              <Field.Text
                name="title"
                label={t('form.title')}
                placeholder={t('form.titlePlaceholder')}
                autoFocus
                multiline
                minRows={1}
                maxRows={4}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Submit on Enter (unless Shift+Enter for new line)
                    if (watchedProjectId) {
                      onCreate();
                    }
                  }
                }}
              />

              {/* Project & Section */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Field.Select name="projectId" label={t('form.project')} sx={{ flex: 1 }}>
                  <MenuItem value="">{t('form.selectProject')}</MenuItem>
                  {(projects ?? []).map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Select
                  name="sectionId"
                  label={t('form.section')}
                  disabled={!selectedProjectId || sections.length === 0}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="">{t('form.noSection')}</MenuItem>
                  {sections.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              {/* Priority */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                  {t('form.priority')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {TASK_PRIORITIES.map((priority) => (
                    <Box
                      key={priority}
                      onClick={() => setValue('priority', priority)}
                      sx={{
                        flex: 1,
                        py: 0.75,
                        px: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: watchedPriority === priority ? 'primary.main' : 'divider',
                        bgcolor: watchedPriority === priority ? 'action.selected' : 'transparent',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                        '&:hover': {
                          borderColor: 'text.disabled',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: priority === 'none' ? 'text.disabled' : getPriorityColor(priority),
                          mx: 'auto',
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {t(`priorities.${priority}`)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Due Date */}
              <Field.DatePicker
                name="dueDate"
                label={t('form.dueDate')}
                format="MMM D, YYYY"
              />

              {/* Labels */}
              {labels && labels.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('form.labels')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {labels.map((label) => {
                      const isSelected = watchedLabelIds.includes(label.id);
                      return (
                        <Box
                          key={label.id}
                          onClick={() => toggleLabel(label.id)}
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: isSelected ? label.color : 'divider',
                            bgcolor: isSelected ? label.color : 'transparent',
                            color: isSelected ? '#fff' : 'text.primary',
                            cursor: 'pointer',
                            transition: 'all 150ms',
                            '&:hover': {
                              borderColor: label.color,
                              bgcolor: isSelected ? label.color : `${label.color}20`,
                            },
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {label.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Description (optional expand) */}
              <Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', cursor: 'pointer' }}
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    {t('form.description')}
                    <Iconify
                      icon={showDescription ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'}
                      width={14}
                      sx={{ ml: 0.25, verticalAlign: 'middle' }}
                    />
                  </Typography>
                </Box>
                {showDescription && (
                  <Field.Text
                    name="description"
                    multiline
                    minRows={3}
                    maxRows={6}
                    placeholder={t('form.descriptionPlaceholder')}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 2 }}>
            <Button
              onClick={onClose}
              color="inherit"
              variant="outlined"
              disabled={submitting.value}
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={submitting.value || !watchedProjectId}>
              {submitting.value ? tCommon('saving') : t('form.addTask')}
            </Button>
          </DialogActions>
        </Form>
      </MotionDialog>

      <ErrorDialog
        open={!!errorMsg}
        title={t('errors.title')}
        message={errorMsg || ''}
        onClose={() => setErrorMsg(null)}
      />
    </>
  );
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

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
