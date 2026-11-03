import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';
import { useAsyncAction } from 'src/shared/hooks/use-async-action';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmColor?: 'primary' | 'success' | 'warning' | 'error' | 'inherit';
  requireComment?: boolean;
  commentLabel?: string;
  commentPlaceholder?: string;
  /** Not needed when `onConfirm` returns a promise — the dialog waits for it on its own. */
  loading?: boolean;
  onClose: () => void;
  /** May return a promise; the confirm button shows a spinner until it settles. */
  onConfirm: (comment: string) => unknown;
};

type CommentState = {
  comment: string;
  error: boolean;
  setComment: (value: string) => void;
  touch: () => void;
  /** Marks the field touched and tells whether the comment may be submitted. */
  validate: () => boolean;
};

function useConfirmComment(open: boolean, requireComment: boolean): CommentState {
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) {
      setComment('');
      setTouched(false);
    }
  }, [open]);

  const empty = !comment.trim();

  return {
    comment,
    error: requireComment && touched && empty,
    setComment,
    touch: () => setTouched(true),
    validate: () => {
      setTouched(true);
      return !(requireComment && empty);
    },
  };
}

// ----------------------------------------------------------------------

type TitleProps = Pick<Props, 'title' | 'onClose'> & { busy: boolean };

function ConfirmDialogTitle({ title, busy, onClose }: TitleProps) {
  return (
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
      <Box sx={{ flex: 1 }}>{title}</Box>
      <IconButton size="small" onClick={onClose} disabled={busy}>
        <Iconify icon="mingcute:close-line" width={18} />
      </IconButton>
    </DialogTitle>
  );
}

// ----------------------------------------------------------------------

type ContentProps = Pick<
  Props,
  'description' | 'requireComment' | 'commentLabel' | 'commentPlaceholder'
> & {
  state: CommentState;
  busy: boolean;
};

function ConfirmDialogContent({
  description,
  requireComment,
  commentLabel,
  commentPlaceholder,
  state,
  busy,
}: ContentProps) {
  return (
    <DialogContent dividers sx={{ py: 3 }}>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: requireComment ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {(requireComment || commentLabel) && (
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={5}
          value={state.comment}
          onChange={(e) => state.setComment(e.target.value)}
          onBlur={state.touch}
          label={commentLabel}
          placeholder={commentPlaceholder}
          error={state.error}
          disabled={busy}
        />
      )}
    </DialogContent>
  );
}

// ----------------------------------------------------------------------

export function ConfirmDialog({
  open,
  title,
  confirmLabel,
  confirmColor = 'primary',
  requireComment = false,
  loading = false,
  onClose,
  onConfirm,
  ...contentProps
}: Props) {
  const { t: tCommon } = useTranslate('common');
  const commentState = useConfirmComment(open, requireComment);
  const confirming = useAsyncAction();
  const busy = loading || confirming.pending;

  const handleConfirm = () => {
    if (!commentState.validate()) return;
    confirming.run(() => onConfirm(commentState.comment.trim()));
  };

  return (
    <MotionDialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      motionVariant="bounceInUp"
    >
      <ConfirmDialogTitle title={title} busy={busy} onClose={onClose} />
      <ConfirmDialogContent
        {...contentProps}
        requireComment={requireComment}
        state={commentState}
        busy={busy}
      />
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={busy}>
          {tCommon('actions.cancel')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color={confirmColor} loading={busy}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </MotionDialog>
  );
}
