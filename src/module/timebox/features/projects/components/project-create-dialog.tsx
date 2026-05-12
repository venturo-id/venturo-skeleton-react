// ProjectCreateDialog - Create new project dialog

import type { TFunction } from 'i18next';
import type { Project, ProjectFormData } from 'src/module/timebox/types';

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
import { useTeams } from 'src/module/timebox/features/teams/hooks';
import { DEFAULT_PROJECT_COLOR, DEFAULT_PROJECT_ICONS } from 'src/module/timebox/utils/constants';

import { createProject } from '../api';

// ----------------------------------------------------------------------
// Schema
// ----------------------------------------------------------------------

function makeSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(1, { message: t('validation.nameRequired') })
      .max(100, { message: t('validation.nameMax') }),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, { message: t('validation.invalidColor') }),
    icon: z.string().optional(),
    teamId: z.string().nullish(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface ProjectCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
  defaultTeamId?: string;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function ProjectCreateDialog({
  open,
  onClose,
  onCreated,
  defaultTeamId,
}: ProjectCreateDialogProps) {
  const { t } = useTranslate('timebox.projects');
  const { t: tCommon } = useTranslate('common');
  const schema = useMemo(() => makeSchema(t), [t]);

  const submitting = useBoolean();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: teams } = useTeams();

  const defaultValues: FormValues = useMemo(
    () => ({
      name: '',
      color: DEFAULT_PROJECT_COLOR,
      icon: DEFAULT_PROJECT_ICONS[0],
      teamId: defaultTeamId ?? null,
    }),
    [defaultTeamId]
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { handleSubmit, watch, reset } = methods;

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    if (!open) setErrorMsg(null);
  }, [open, defaultValues, reset]);

  const onCreate = handleSubmit(async (values) => {
    setErrorMsg(null);
    submitting.onTrue();
    try {
      const formData: ProjectFormData = {
        name: values.name,
        color: values.color,
        icon: values.icon,
        teamId: values.teamId ?? null,
      };
      const newProject = await createProject(formData);
      onCreated(newProject);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('errors.createFailed'));
    } finally {
      submitting.onFalse();
    }
  });

  return (
    <>
      <MotionDialog
        open={open}
        onClose={submitting.value ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
          <Box sx={{ flex: 1 }}>{t('dialog.createTitle')}</Box>
          <IconButton size="small" onClick={onClose} disabled={submitting.value}>
            <Iconify icon="mingcute:close-line" width={18} />
          </IconButton>
        </DialogTitle>

        <Form methods={methods} onSubmit={onCreate} sx={{ display: 'contents' }}>
          <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={2.5}>
              {/* Project Name */}
              <Field.Text name="name" label={t('form.name')} autoFocus />

              {/* Color Picker */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('form.color')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    '#FA383E',
                    '#FFAB00',
                    '#FFD666',
                    '#22C55E',
                    '#00B8D9',
                    '#3B82F6',
                    '#8E33FF',
                    '#F64F00',
                    '#607D8B',
                    '#919EAB',
                  ].map((color) => (
                    <Box
                      key={color}
                      onClick={() => methods.setValue('color', color)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: color,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: selectedColor === color ? 'primary.main' : 'transparent',
                        transition: 'border-color 150ms',
                        '&:hover': {
                          borderColor: selectedColor === color ? 'primary.main' : 'text.disabled',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Icon Picker */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('form.icon')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {DEFAULT_PROJECT_ICONS.map((icon) => (
                    <Box
                      key={icon}
                      onClick={() => methods.setValue('icon', icon)}
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: selectedIcon === icon ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        fontSize: 20,
                        bgcolor: selectedIcon === icon ? 'action.selected' : 'transparent',
                        transition: 'all 150ms',
                        '&:hover': {
                          borderColor: selectedIcon === icon ? 'primary.main' : 'text.disabled',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      {icon}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Team Selector (if teams exist) */}
              {teams && teams.length > 0 && (
                <Field.Select name="teamId" label={t('form.team')}>
                  <MenuItem value="">{t('form.noTeam')}</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}
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
            <Button type="submit" variant="contained" disabled={submitting.value}>
              {submitting.value ? tCommon('saving') : tCommon('create')}
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
