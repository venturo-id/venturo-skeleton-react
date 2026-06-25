import type { TFunction } from 'i18next';
import type {
  ApiKey,
  CreateApiKeyResult,
  CreateApiKeyPayload,
  UpdateApiKeyPayload,
} from '../types';

import * as z from 'zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';
import { Form, Field } from 'src/shared/ui/hook-form';
import { ErrorDialog } from 'src/shared/ui/error-dialog';
import { RHFNumericField } from 'src/shared/ui/hook-form/rhf-numeric-field';
import { usePermission } from 'src/module/core/features/auth/hooks/use-permission';

import { createApiKey, updateApiKey } from '../api';

// ----------------------------------------------------------------------

function makeSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(1, { message: t('validation.nameRequired') })
      .max(100, { message: t('validation.nameMax') }),
    description: z.string().max(500, { message: t('validation.descriptionMax') }).optional(),
    environment: z.enum(['live', 'test']),
    scoped_permissions: z.array(z.string()),
    ip_whitelist: z.array(z.string()),
    rate_limit: z
      .number()
      .min(1, { message: t('validation.rateLimitRange') })
      .max(100000, { message: t('validation.rateLimitRange') }),
    rate_limit_window: z
      .number()
      .min(60, { message: t('validation.rateWindowRange') })
      .max(86400, { message: t('validation.rateWindowRange') }),
    expires_at: z.string().nullish(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  mode: 'new' | 'edit';
  seed?: ApiKey | null;
  onClose: () => void;
  onCreated: (result: CreateApiKeyResult) => void;
  onSaved: (apiKey: ApiKey) => void;
};

export function ApiKeyFormDialog({ open, mode, seed, onClose, onCreated, onSaved }: Props) {
  const { t } = useTranslate('api-keys');
  const { t: tCommon } = useTranslate('common');
  const { permissions } = usePermission();
  const schema = useMemo(() => makeSchema(t), [t]);

  const submitting = useBoolean();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialValue = seed ?? null;
  const isEditing = mode === 'edit';

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: initialValue?.name ?? '',
      description: initialValue?.description ?? '',
      environment: initialValue?.environment ?? 'live',
      scoped_permissions: initialValue?.scoped_permissions ?? [],
      ip_whitelist: initialValue?.ip_whitelist ?? [],
      rate_limit: initialValue?.rate_limit ?? 1000,
      rate_limit_window: initialValue?.rate_limit_window ?? 3600,
      expires_at: initialValue?.expires_at ?? null,
    }),
    [initialValue]
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) methods.reset(defaultValues);
    if (!open) setErrorMsg(null);
  }, [open, defaultValues, methods]);

  const onSave = methods.handleSubmit(async (values) => {
    setErrorMsg(null);
    submitting.onTrue();
    try {
      if (isEditing && initialValue) {
        // environment & expires_at are immutable — not sent in PATCH.
        const payload: UpdateApiKeyPayload = {
          name: values.name,
          description: values.description || undefined,
          scoped_permissions: values.scoped_permissions,
          ip_whitelist: values.ip_whitelist,
          rate_limit: values.rate_limit,
          rate_limit_window: values.rate_limit_window,
        };
        const saved = await updateApiKey(initialValue.id, payload);
        onSaved(saved);
      } else {
        const payload: CreateApiKeyPayload = {
          name: values.name,
          description: values.description || undefined,
          environment: values.environment,
          scoped_permissions: values.scoped_permissions,
          ip_whitelist: values.ip_whitelist,
          rate_limit: values.rate_limit,
          rate_limit_window: values.rate_limit_window,
          expires_at: values.expires_at
            ? dayjs(values.expires_at).toISOString()
            : undefined,
        };
        const result = await createApiKey(payload);
        onCreated(result);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t('errors.saveFailed'));
    } finally {
      submitting.onFalse();
    }
  });

  const title = isEditing
    ? t('form.editTitle', { name: initialValue?.name ?? '' })
    : t('form.newTitle');

  return (
    <>
      <MotionDialog
        open={open}
        onClose={submitting.value ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
          <Box sx={{ flex: 1 }}>{title}</Box>
          <IconButton size="small" onClick={onClose} disabled={submitting.value}>
            <Iconify icon="mingcute:close-line" width={18} />
          </IconButton>
        </DialogTitle>
        <Form methods={methods} onSubmit={onSave} sx={{ display: 'contents' }}>
          <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={2.5}>
              <Field.Text name="name" label={t('form.name')} />

              <Field.Text
                name="description"
                label={t('form.description')}
                multiline
                minRows={2}
              />

              <Field.Select
                name="environment"
                label={t('form.environment')}
                disabled={isEditing}
                helperText={isEditing ? t('form.environmentImmutable') : undefined}
              >
                <MenuItem value="live">{t('environments.live')}</MenuItem>
                <MenuItem value="test">{t('environments.test')}</MenuItem>
              </Field.Select>

              {/* Options sourced from the user's own permissions → guarantees subset. */}
              <Field.Autocomplete
                name="scoped_permissions"
                label={t('form.scopedPermissions')}
                placeholder={t('form.scopedPermissionsHint')}
                helperText={t('form.scopedPermissionsHint')}
                multiple
                options={permissions}
                getOptionLabel={(opt) => opt as string}
              />

              {/* freeSolo — arbitrary IP / CIDR strings. */}
              <Field.Autocomplete
                name="ip_whitelist"
                label={t('form.ipWhitelist')}
                placeholder={t('form.ipWhitelistHint')}
                helperText={t('form.ipWhitelistHint')}
                multiple
                freeSolo
                options={[]}
                getOptionLabel={(opt) => opt as string}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <RHFNumericField name="rate_limit" label={t('form.rateLimit')} />
                <RHFNumericField name="rate_limit_window" label={t('form.rateLimitWindow')} />
              </Stack>

              {isEditing ? (
                // expires_at is immutable — plain read-only display (outside RHF).
                <TextField
                  fullWidth
                  label={t('form.expiresAt')}
                  value={
                    initialValue?.expires_at
                      ? dayjs(initialValue.expires_at).format('DD MMM YYYY')
                      : t('form.expiresNever')
                  }
                  disabled
                  helperText={t('form.expiresImmutable')}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              ) : (
                <Field.DatePicker
                  name="expires_at"
                  label={t('form.expiresAt')}
                  format="DD MMM YYYY"
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              loading={submitting.value}
            >
              {tCommon('actions.save')}
            </Button>
          </DialogActions>
        </Form>
      </MotionDialog>

      <ErrorDialog open={!!errorMsg} message={errorMsg ?? ''} onClose={() => setErrorMsg(null)} />
    </>
  );
}
