import type { Session } from '../types';

import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { toast } from 'src/shared/ui/snackbar';
import { Iconify } from 'src/shared/ui/iconify';
import type { IconifyName } from 'src/shared/ui/iconify/register-icons';
import { fToNow } from 'src/shared/utils/format-time';
import { PageHeader } from 'src/shared/ui/page-header';
import { ErrorDialog } from 'src/shared/ui/error-dialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { ConfirmDialog } from 'src/shared/ui/confirm-dialog';
import { useAuthContext } from 'src/module/core/features/auth/hooks';

// ----------------------------------------------------------------------

const DEVICE_ICONS: Record<string, IconifyName> = {
  desktop: 'solar:monitor-smartphone-bold-duotone',
  mobile: 'solar:smartphone-bold-duotone',
  tablet: 'solar:tablet-bold-duotone',
};

function deviceIcon(type: string | null | undefined): IconifyName {
  return DEVICE_ICONS[type ?? ''] ?? 'solar:devices-bold-duotone';
}

// ----------------------------------------------------------------------

type RevokeTarget = { id: string; name: string };

export function SessionsView() {
  const { t } = useTranslate('session');
  const { getSessions, revokeSession, signOut } = useAuthContext();
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [revokeTarget, setRevokeTarget] = useState<RevokeTarget | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { value: logoutAllOpen, onTrue: openLogoutAll, onFalse: closeLogoutAll } = useBoolean();

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch {
      setLoadError(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [getSessions, t]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = useCallback(async () => {
    if (!revokeTarget) return;
    setActionLoading(true);
    try {
      await revokeSession(revokeTarget.id);
      toast.success(t('feedback.revoked'));
      setRevokeTarget(null);
      fetchSessions();
    } catch {
      setActionError(t('errors.revokeFailed'));
    } finally {
      setActionLoading(false);
    }
  }, [revokeTarget, revokeSession, fetchSessions, t]);

  const handleLogoutAll = useCallback(async () => {
    setActionLoading(true);
    try {
      await signOut({ allDevices: true });
      toast.success(t('feedback.loggedOutAll'));
      closeLogoutAll();
      router.refresh();
    } catch {
      setActionError(t('errors.logoutAllFailed'));
    } finally {
      setActionLoading(false);
    }
  }, [signOut, closeLogoutAll, router, t]);

  return (
    <DashboardContent maxWidth="md">
      <PageHeader
        title={t('title')}
        action={
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="solar:logout-2-bold-duotone" />}
            onClick={openLogoutAll}
          >
            {t('logoutAllDevices')}
          </Button>
        }
      />

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, mt: -1 }}>
        {t('subtitle')}
      </Typography>

      {loadError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError}
        </Alert>
      )}

      <Card>
        {loading ? (
          <Stack divider={<Divider />}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SessionRowSkeleton key={i} />
            ))}
          </Stack>
        ) : sessions.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6">{t('empty.title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {t('empty.subtitle')}
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                onRevoke={(id, name) => setRevokeTarget({ id, name })}
                labelThisDevice={t('thisDevice')}
                labelLastUsed={t('lastUsed')}
                labelIpAddress={t('ipAddress')}
                labelUnknown={t('unknown')}
                labelRevoke={t('revokeAccess')}
              />
            ))}
          </Stack>
        )}
      </Card>

      <ConfirmDialog
        open={!!revokeTarget}
        title={t('revokeConfirm.title')}
        description={t('revokeConfirm.description')}
        confirmLabel={t('revokeConfirm.confirm')}
        confirmColor="error"
        loading={actionLoading}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevoke}
      />

      <ConfirmDialog
        open={logoutAllOpen}
        title={t('logoutAllConfirm.title')}
        description={t('logoutAllConfirm.description')}
        confirmLabel={t('logoutAllConfirm.confirm')}
        confirmColor="error"
        loading={actionLoading}
        onClose={closeLogoutAll}
        onConfirm={handleLogoutAll}
      />

      <ErrorDialog
        open={!!actionError}
        message={actionError ?? ''}
        onClose={() => setActionError(null)}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type SessionRowProps = {
  session: Session;
  onRevoke: (id: string, name: string) => void;
  labelThisDevice: string;
  labelLastUsed: string;
  labelIpAddress: string;
  labelUnknown: string;
  labelRevoke: string;
};

function SessionRow({
  session,
  onRevoke,
  labelThisDevice,
  labelLastUsed,
  labelIpAddress,
  labelUnknown,
  labelRevoke,
}: SessionRowProps) {
  const deviceName = session.device_info?.name ?? labelUnknown;
  const icon = deviceIcon(session.device_info?.type);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ px: 3, py: 2.5 }}
    >
      <Iconify icon={icon} width={32} sx={{ color: 'text.secondary', flexShrink: 0 }} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Typography variant="subtitle2" noWrap>
            {deviceName}
          </Typography>
          {session.is_current && (
            <Chip label={labelThisDevice} size="small" color="success" variant="soft" />
          )}
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          {session.ip_address && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {labelIpAddress}: {session.ip_address}
            </Typography>
          )}
          {session.last_used_at && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {labelLastUsed}: {fToNow(session.last_used_at)}
            </Typography>
          )}
        </Stack>
      </Box>

      {!session.is_current && (
        <Button
          size="small"
          color="error"
          variant="soft"
          onClick={() => onRevoke(session.id, deviceName)}
          sx={{ flexShrink: 0 }}
        >
          {labelRevoke}
        </Button>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function SessionRowSkeleton() {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 3, py: 2.5 }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton width="40%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton width="60%" height={16} />
      </Box>
    </Stack>
  );
}
