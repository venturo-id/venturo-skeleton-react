import type { SelectChangeEvent } from '@mui/material/Select';
import type { ApiKey, CreateApiKeyResult, ApiKeyEnvironment } from '../types';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';
import { toast } from 'src/shared/ui/snackbar';
import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';
import { PageHeader } from 'src/shared/ui/page-header';
import { ErrorDialog } from 'src/shared/ui/error-dialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { ConfirmDialog } from 'src/shared/ui/confirm-dialog';
import {
  useTable,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/shared/ui/table';

import { revokeApiKey } from '../api';
import { useApiKeyList } from '../hooks/use-api-key-list';
import { useApiKeyDialog } from '../hooks/use-api-key-dialog';
import { ApiKeyTableRow } from '../components/api-key-table-row';
import { ApiKeyFormDialog } from '../components/api-key-form-dialog';
import { ApiKeySecretDialog } from '../components/api-key-secret-dialog';
import { ApiKeyDetailDialog } from '../components/api-key-detail-dialog';

// ----------------------------------------------------------------------

type EnvFilter = 'all' | ApiKeyEnvironment;
type ActiveFilter = 'all' | 'active' | 'inactive';

export function ApiKeysListView() {
  const { t } = useTranslate('api-keys');
  const { t: tCommon } = useTranslate('common');

  const dialog = useApiKeyDialog();
  const table = useTable({ defaultRowsPerPage: 20, defaultDense: true });

  const [envFilter, setEnvFilter] = useState<EnvFilter>('all');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');

  const [secret, setSecret] = useState<CreateApiKeyResult | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'name', label: t('table.name') },
      { id: 'key_prefix', label: t('table.keyPrefix') },
      { id: 'environment', label: t('table.environment') },
      { id: 'created', label: t('table.created') },
      { id: 'last_used', label: t('table.lastUsed') },
      { id: 'expires', label: t('table.expires') },
      { id: 'status', label: t('table.status') },
      { id: 'actions', label: '', align: 'right' as const },
    ],
    [t]
  );

  // NOTE: contract has no `search` param — only environment + is_active filters.
  const listParams = useMemo(
    () => ({
      page: table.page + 1,
      limit: table.rowsPerPage,
      environment: envFilter === 'all' ? undefined : envFilter,
      is_active:
        activeFilter === 'all' ? undefined : activeFilter === 'active',
    }),
    [table.page, table.rowsPerPage, envFilter, activeFilter]
  );

  const { data, meta, loading, error, refresh } = useApiKeyList(listParams);

  const selectedKey = useMemo(
    () => (dialog.id ? (data.find((k) => k.id === dialog.id) ?? null) : null),
    [dialog.id, data]
  );

  const onView = useCallback((id: string) => dialog.open('view', id), [dialog]);
  const onEdit = useCallback((id: string) => dialog.open('edit', id), [dialog]);

  const onRevoke = useCallback(
    (id: string) => {
      const k = data.find((it) => it.id === id);
      if (k) setRevokeTarget(k);
    },
    [data]
  );

  const handleCreated = useCallback(
    (result: CreateApiKeyResult) => {
      refresh();
      dialog.close();
      // Reveal the one-time secret immediately after create.
      setSecret(result);
      toast.success(t('feedback.created'));
    },
    [dialog, refresh, t]
  );

  const handleSaved = useCallback(
    (saved: ApiKey) => {
      refresh();
      dialog.close();
      toast.success(t('feedback.updated', { name: saved.name }));
    },
    [dialog, refresh, t]
  );

  const handleRevokeConfirm = useCallback(async () => {
    if (!revokeTarget) return;
    setActionLoading(true);
    try {
      await revokeApiKey(revokeTarget.id);
      refresh();
      setRevokeTarget(null);
      toast.success(t('feedback.revoked'));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.revokeFailed'));
    } finally {
      setActionLoading(false);
    }
  }, [revokeTarget, refresh, t]);

  const showSkeletons = loading && data.length === 0;
  const isEmpty = !loading && data.length === 0;

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader
        title={t('title')}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => dialog.open('new')}
          >
            {t('buttons.new')}
          </Button>
        }
      />

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, mt: -1 }}>
        {t('subtitle')}
      </Typography>

      <Stack spacing={3}>
        <Card>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ p: 2.5, alignItems: { md: 'center' } }}
          >
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t('filters.environment')}</InputLabel>
              <Select
                value={envFilter}
                label={t('filters.environment')}
                onChange={(e: SelectChangeEvent) => {
                  setEnvFilter(e.target.value as EnvFilter);
                  table.onResetPage();
                }}
              >
                <MenuItem value="all">{t('filters.all')}</MenuItem>
                <MenuItem value="live">{t('environments.live')}</MenuItem>
                <MenuItem value="test">{t('environments.test')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t('filters.status')}</InputLabel>
              <Select
                value={activeFilter}
                label={t('filters.status')}
                onChange={(e: SelectChangeEvent) => {
                  setActiveFilter(e.target.value as ActiveFilter);
                  table.onResetPage();
                }}
              >
                <MenuItem value="all">{t('filters.all')}</MenuItem>
                <MenuItem value="active">{t('statuses.active')}</MenuItem>
                <MenuItem value="inactive">{t('filters.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider />

          {error && (
            <Alert severity="error" sx={{ m: 2.5 }}>
              {error}
            </Alert>
          )}

          <TableContainer>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1080 }}>
                <TableHeadCustom headCells={TABLE_HEAD} />
                <TableBody>
                  {showSkeletons && (
                    <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                  )}

                  {data.map((row) => (
                    <ApiKeyTableRow
                      key={row.id}
                      row={row}
                      onView={onView}
                      onEdit={onEdit}
                      onRevoke={onRevoke}
                    />
                  ))}

                  {isEmpty && (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length}>
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                          <Typography variant="h6">{t('list.emptyTitle')}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {t('list.emptySubtitle')}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            component="div"
            page={table.page}
            count={meta.total}
            rowsPerPage={table.rowsPerPage}
            rowsPerPageOptions={[20, 50, 100]}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage={tCommon('pagination.rowsPerPage')}
          />
        </Card>
      </Stack>

      <ApiKeyDetailDialog
        open={dialog.mode === 'view'}
        apiKey={dialog.mode === 'view' ? selectedKey : null}
        onClose={dialog.close}
        onEdit={onEdit}
        onRevoke={onRevoke}
      />

      <ApiKeyFormDialog
        open={dialog.mode === 'new' || dialog.mode === 'edit'}
        mode={dialog.mode === 'edit' ? 'edit' : 'new'}
        seed={dialog.mode === 'edit' ? selectedKey : null}
        onClose={dialog.close}
        onCreated={handleCreated}
        onSaved={handleSaved}
      />

      <ApiKeySecretDialog
        open={!!secret}
        result={secret}
        onClose={() => setSecret(null)}
      />

      <ConfirmDialog
        open={!!revokeTarget}
        title={t('revoke.title')}
        description={revokeTarget ? t('revoke.message', { name: revokeTarget.name }) : ''}
        confirmLabel={t('revoke.confirm')}
        confirmColor="error"
        loading={actionLoading}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevokeConfirm}
      />

      <ErrorDialog
        open={!!actionError}
        message={actionError ?? ''}
        onClose={() => setActionError(null)}
      />
    </DashboardContent>
  );
}
