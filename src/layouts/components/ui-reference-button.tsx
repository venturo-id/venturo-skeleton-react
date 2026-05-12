import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { varTap, varHover, transitionTap } from 'src/shared/ui/animate';

// ----------------------------------------------------------------------

export function UiReferenceButton({ sx, ...other }: IconButtonProps) {
  const { t } = useTranslate('ui-reference');

  return (
    <Tooltip title={t('title')} arrow>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="UI Reference button"
        href="/ui-reference"
        sx={[{ p: 0, width: 40, height: 40 }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <Iconify icon="solar:list-bold" width={24} />
      </IconButton>
    </Tooltip>
  );
}
