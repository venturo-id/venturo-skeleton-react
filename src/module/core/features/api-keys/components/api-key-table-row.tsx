import type { ApiKey } from '../types';

import { useState } from 'react';

import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Label } from 'src/shared/ui/label';
import { Iconify } from 'src/shared/ui/iconify';
import { fDate, fToNow } from 'src/shared/utils/format-time';
import { CustomPopover } from 'src/shared/ui/custom-popover';

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

// ----------------------------------------------------------------------

type Props = {
  row: ApiKey;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onRevoke: (id: string) => void;
};

export function ApiKeyTableRow({ row, onView, onEdit, onRevoke }: Props) {
  const { t } = useTranslate('api-keys');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => setAnchorEl(null);

  const status = resolveStatus(row);
  const isRevoked = !!row.revoked_at;

  return (
    <>
      <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => onView(row.id)}>
        <TableCell>
          <Typography variant="body2" noWrap>
            {row.name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap sx={{ fontFamily: 'monospace' }}>
            {row.key_prefix}
          </Typography>
        </TableCell>

        <TableCell>
          <Label color={row.environment === 'live' ? 'info' : 'default'} variant="soft">
            {t(`environments.${row.environment}`)}
          </Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fDate(row.created_at)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {row.last_used_at ? fToNow(row.last_used_at) : t('table.neverUsed')}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {row.expires_at ? fDate(row.expires_at) : t('table.never')}
          </Typography>
        </TableCell>

        <TableCell>
          <Label color={STATUS_COLOR[status]} variant="soft">
            {t(`statuses.${status}`)}
          </Label>
        </TableCell>

        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClose();
              onView(row.id);
            }}
          >
            <Iconify icon="solar:eye-bold" />
            {t('rowActions.viewDetail')}
          </MenuItem>

          {!isRevoked && (
            <MenuItem
              onClick={() => {
                handleClose();
                onEdit(row.id);
              }}
            >
              <Iconify icon="solar:pen-bold" />
              {t('rowActions.edit')}
            </MenuItem>
          )}

          {!isRevoked && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem
                sx={{ color: 'error.main' }}
                onClick={() => {
                  handleClose();
                  onRevoke(row.id);
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                {t('rowActions.revoke')}
              </MenuItem>
            </>
          )}
        </MenuList>
      </CustomPopover>
    </>
  );
}
