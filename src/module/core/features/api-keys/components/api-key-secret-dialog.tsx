import type { CreateApiKeyResult } from '../types';

import { useCopyToClipboard } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { toast } from 'src/shared/ui/snackbar';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  result: CreateApiKeyResult | null;
  onClose: () => void;
};

// One-time secret reveal. The full `key` is returned only on create and can
// never be recovered — copying it is the whole point of this dialog.
export function ApiKeySecretDialog({ open, result, onClose }: Props) {
  const { t } = useTranslate('api-keys');
  const { copy } = useCopyToClipboard();

  const handleCopy = async () => {
    if (!result?.key) return;
    const ok = await copy(result.key);
    if (ok) toast.success(t('feedback.copied'));
  };

  return (
    <MotionDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
        <Box sx={{ flex: 1 }}>{t('secret.title')}</Box>
        <IconButton size="small" onClick={onClose}>
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          {t('secret.warning')}
        </Alert>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('secret.keyLabel')}
        </Typography>

        <Box
          sx={{
            mt: 0.5,
            p: 2,
            pr: 6,
            position: 'relative',
            borderRadius: 1,
            bgcolor: 'background.neutral',
            border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', wordBreak: 'break-all', pr: 1 }}
          >
            {result?.key}
          </Typography>
          <Tooltip title={t('secret.copy')}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Iconify icon="solar:copy-bold" width={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:copy-bold" />}
          onClick={handleCopy}
        >
          {t('secret.copy')}
        </Button>
        <Button variant="contained" onClick={onClose}>
          {t('secret.done')}
        </Button>
      </DialogActions>
    </MotionDialog>
  );
}
