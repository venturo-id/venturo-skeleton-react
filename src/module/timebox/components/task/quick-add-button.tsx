// QuickAddButton - Floating action button for adding tasks

import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface QuickAddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function QuickAddButton({
  onClick,
  disabled = false,
  tooltip,
  icon,
  size = 'medium',
  color = 'primary',
}: QuickAddButtonProps) {
  const { t } = useTranslate('timebox.tasks');

  const tooltipText = tooltip ?? t('addTask');

  return (
    <Tooltip title={tooltipText} arrow>
      <Fab
        color={color}
        size={size}
        onClick={onClick}
        disabled={disabled}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: 4,
          '&:hover': {
            boxShadow: 8,
          },
        }}
      >
        {icon || <Iconify icon="solar:add-circle-bold" width={24} />}
      </Fab>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------
// Variant: Inline QuickAddButton (for sidebar)
// ----------------------------------------------------------------------

interface QuickAddButtonInlineProps {
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export function QuickAddButtonInline({
  onClick,
  disabled = false,
  fullWidth = true,
  size = 'medium',
}: QuickAddButtonInlineProps) {
  const { t } = useTranslate('timebox.tasks');

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: 1.5,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 150ms',
        '&:hover': {
          opacity: disabled ? 0.5 : 0.9,
          transform: disabled ? 'none' : 'scale(1.02)',
        },
        ...(fullWidth && {
          width: '100%',
        }),
      }}
    >
      <Iconify icon="solar:add-circle-bold" width={size === 'small' ? 18 : 20} />
      <Typography
        variant={size === 'small' ? 'body2' : 'body1'}
        sx={{ fontWeight: 600, flex: 1, textAlign: 'center' }}
      >
        {t('addTask')}
      </Typography>
    </Box>
  );
}
