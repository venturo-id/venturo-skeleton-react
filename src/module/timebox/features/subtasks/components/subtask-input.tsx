// SubtaskInput - Quick input for adding subtasks

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface SubtaskInputProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function SubtaskInput({ onSubmit, onCancel, autoFocus = false }: SubtaskInputProps) {
  const { t } = useTranslate('timebox.tasks');

  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <Box
      sx={{
        px: 1,
        py: 1,
        borderRadius: 1,
        bgcolor: 'action.hover',
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Iconify icon="solar:add-circle-bold" width={16} sx={{ color: 'primary.main' }} />
        <TextField
          inputRef={inputRef}
          size="small"
          placeholder={t('addSubtask')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              fontSize: 'body2',
            },
          }}
        />
        <IconButton size="small" onClick={handleSubmit} disabled={!title.trim()} sx={{ p: 0.5 }}>
          <Iconify icon="solar:file-check-bold-duotone" width={16} sx={{ color: 'primary.main' }} />
        </IconButton>
        <IconButton size="small" onClick={onCancel} sx={{ p: 0.5 }}>
          <Iconify icon="solar:close-circle-bold" width={16} sx={{ color: 'text.disabled' }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
