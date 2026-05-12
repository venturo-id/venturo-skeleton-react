// CommentInput - Input field for adding comments

import type { FormEvent } from 'react';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  minRows?: number;
  autoFocus?: boolean;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function CommentInput({
  onSubmit,
  placeholder = 'Write a comment...',
  minRows = 1,
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    const trimmed = content.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = content.trim().length > 0;

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <TextField
        inputRef={textareaRef}
        multiline
        minRows={minRows}
        maxRows={8}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        fullWidth
        size="small"
        sx={{
          '& .MuiInputBase-root': {
            pr: 4,
            bgcolor: 'action.hover',
            borderRadius: 1,
            '&:focus-within': {
              bgcolor: 'background.paper',
              boxShadow: 1,
            },
          },
        }}
        InputProps={{
          sx: {
            fontSize: 'body2',
          },
        }}
      />

      {/* Send button (show when focused or has content) */}
      {(isFocused || canSubmit) && (
        <IconButton
          size="small"
          onClick={(e) => handleSubmit(e)}
          disabled={!canSubmit}
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            p: 0.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.hover',
              color: 'text.disabled',
            },
          }}
        >
          <Iconify icon="solar:export-bold" width={16} />
        </IconButton>
      )}
    </Box>
  );
}
