// LabelPickerPopover - Label picker with multi-select support

import type { ReactNode } from 'react';
import type { Label } from 'src/module/timebox/types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { CustomPopover } from 'src/shared/ui/custom-popover';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface LabelPickerPopoverProps {
  anchorEl: HTMLElement | null;
  onAnchorChange: (el: HTMLElement | null) => void;
  labels: Label[];
  value: string[];
  onChange: (labelIds: string[]) => void;
  onCreateLabel?: (name: string, color: string) => void;
  children: ReactNode;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function LabelPickerPopover({
  anchorEl,
  onAnchorChange,
  labels,
  value,
  onChange,
  onCreateLabel,
  children,
}: LabelPickerPopoverProps) {
  const open = anchorEl !== null;

  const handleClose = () => {
    onAnchorChange(null);
  };
  const { t } = useTranslate('timebox.tasks');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleLabel = (labelId: string) => {
    if (value.includes(labelId)) {
      onChange(value.filter((id) => id !== labelId));
    } else {
      onChange([...value, labelId]);
    }
  };

  return (
    <>
      {children}
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              p: 1.5,
              minWidth: 240,
              maxHeight: 400,
            },
          },
        }}
    >
      <Stack spacing={1.5}>
        {/* Header */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {t('form.labels')}
        </Typography>

        {/* Search */}
        <TextField
          size="small"
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:clock-circle-outline" width={16} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              bgcolor: 'background.paper',
            },
          }}
        />

        {/* Labels list */}
        {filteredLabels.length > 0 ? (
          <Stack spacing={0.5} sx={{ maxHeight: 250, overflowY: 'auto' }}>
            {filteredLabels.map((label) => {
              const isSelected = value.includes(label.id);

              return (
                <Box
                  key={label.id}
                  onClick={() => handleToggleLabel(label.id)}
                  sx={{
                    px: 1,
                    py: 0.75,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    bgcolor: isSelected ? `${label.color}20` : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? label.color : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected ? `${label.color}30` : 'action.hover',
                    },
                  }}
                >
                  {/* Color indicator */}
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: label.color,
                      flexShrink: 0,
                    }}
                  />

                  {/* Label name */}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {label.name}
                  </Typography>

                  {/* Check mark for selected */}
                  {isSelected && (
                    <Iconify
                      icon="solar:file-check-bold-duotone"
                      width={16}
                      sx={{ color: label.color, flexShrink: 0 }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box
            sx={{
              py: 3,
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            <Typography variant="caption">
              {searchQuery ? t('noLabels') : t('noLabels')}
            </Typography>
          </Box>
        )}

        {/* Create new label (optional) */}
        {onCreateLabel && (
          <Box
            sx={{
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* TODO: Implement create label UI */}
          </Box>
        )}
      </Stack>
    </CustomPopover>
    </>
  );
}
