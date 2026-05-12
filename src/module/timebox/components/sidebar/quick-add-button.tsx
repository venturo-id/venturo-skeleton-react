import type { QuickAddButtonProps } from './types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

export function QuickAddButton({ onClick, disabled = false }: QuickAddButtonProps) {
  const { t } = useTranslate('timebox.common');

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Iconify icon="solar:add-circle-bold" width={24} />}
        onClick={onClick}
        disabled={disabled}
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 2,
          justifyContent: 'flex-start',
          typography: 'subtitle2',
          fontWeight: 600,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: (theme) => theme.customShadows.z4,
          '&:hover': {
            bgcolor: 'primary.dark',
            boxShadow: (theme) => theme.customShadows.z8,
          },
        }}
      >
        {t('addTask')}
      </Button>
    </Box>
  );
}
