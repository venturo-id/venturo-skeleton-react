import type { ApiKey } from '../types';

import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Label } from 'src/shared/ui/label';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';
import { fToNow } from 'src/shared/utils/format-time';

// ----------------------------------------------------------------------

type ApiKeyStatus = 'active' | 'revoked' | 'expired';

function resolveStatus(row: ApiKey): ApiKeyStatus {
  if (row.revoked_at) return 'revoked';
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return 'expired';
  return 'active';
}

const STATUS_COLOR: Record<ApiKeyStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  revoked: 'error',
  expired: 'warning',
};

function fDateOrDash(input: string | null): string {
  return input ? dayjs(input).format('DD MMM YYYY HH:mm') : '—';
}

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onRevoke: (id: string) => void;
};

export function ApiKeyDetailDialog({ open, apiKey, onClose, onEdit, onRevoke }: Props) {
  const { t } = useTranslate('api-keys');
  const { t: tCommon } = useTranslate('common');

  const status = apiKey ? resolveStatus(apiKey) : null;
  const isRevoked = !!apiKey?.revoked_at;

  return (
    <MotionDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {apiKey?.name ?? t('detail.title')}
          </Typography>
        </Box>
        {apiKey && status && (
          <Label variant="soft" color={STATUS_COLOR[status]}>
            {t(`statuses.${status}`)}
          </Label>
        )}
        <IconButton size="small" onClick={onClose}>
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
        {apiKey && (
          <Stack spacing={2.5}>
            <DetailItem label={t('form.keyPrefix')} value={apiKey.key_prefix} mono />
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              }}
            >
              <DetailItem
                label={t('form.environment')}
                value={t(`environments.${apiKey.environment}`)}
              />
              <DetailItem
                label={t('form.rateLimit')}
                value={`${apiKey.rate_limit} / ${apiKey.rate_limit_window}s`}
              />
              <DetailItem label={t('form.description')} value={apiKey.description} />
              <DetailItem
                label={t('detail.totalRequests')}
                value={String(apiKey.total_requests)}
              />
              <DetailItem label={t('detail.lastUsedAt')} value={fDateOrDash(apiKey.last_used_at)} />
              <DetailItem label={t('detail.lastUsedIp')} value={apiKey.last_used_ip} />
              <DetailItem
                label={t('form.expiresAt')}
                value={apiKey.expires_at ? fDateOrDash(apiKey.expires_at) : t('form.expiresNever')}
              />
              <DetailItem
                label={t('detail.createdAt')}
                value={apiKey.created_at ? fToNow(apiKey.created_at) : '—'}
              />
            </Box>

            <ChipList
              label={t('form.scopedPermissions')}
              values={apiKey.scoped_permissions}
              emptyText={t('detail.inheritsAll')}
            />
            <ChipList
              label={t('form.ipWhitelist')}
              values={apiKey.ip_whitelist}
              emptyText={t('detail.allIps')}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        {apiKey && !isRevoked && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => onRevoke(apiKey.id)}
            >
              {t('rowActions.revoke')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => onEdit(apiKey.id)}
            >
              {tCommon('actions.edit')}
            </Button>
          </>
        )}
      </DialogActions>
    </MotionDialog>
  );
}

// ----------------------------------------------------------------------

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ wordBreak: 'break-word', fontFamily: mono ? 'monospace' : undefined }}
      >
        {value || '—'}
      </Typography>
    </Stack>
  );
}

function ChipList({
  label,
  values,
  emptyText,
}: {
  label: string;
  values: string[] | null | undefined;
  emptyText: string;
}) {
  // BE may return null or omit these arrays entirely.
  const items = values ?? [];
  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      {items.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {items.map((v) => (
            <Chip key={v} label={v} size="small" variant="soft" />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          {emptyText}
        </Typography>
      )}
    </Stack>
  );
}
