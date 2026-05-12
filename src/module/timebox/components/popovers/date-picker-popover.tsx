// DatePickerPopover - Quick date picker for task due dates

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { CustomPopover } from 'src/shared/ui/custom-popover';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface DatePickerPopoverProps {
  anchorEl: HTMLElement | null;
  onAnchorChange: (el: HTMLElement | null) => void;
  value: string | null;
  onChange: (date: string | null) => void;
  children: React.ReactNode;
}

// ----------------------------------------------------------------------
// Helper: Generate date options
// ----------------------------------------------------------------------

interface DateOption {
  key: string;
  label: string;
  date: Dayjs | null;
}

function generateDateOptions(): DateOption[] {
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  return [
    { key: 'today', label: 'Today', date: today },
    { key: 'tomorrow', label: 'Tomorrow', date: tomorrow },
  ];
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function DatePickerPopover({
  anchorEl,
  onAnchorChange,
  value,
  onChange,
  children,
}: DatePickerPopoverProps) {
  const { t } = useTranslate('timebox.tasks');
  const open = anchorEl !== null;
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    value ? dayjs(value) : null
  );

  const dateOptions = generateDateOptions();

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date);
    onChange(date ? date.toISOString() : null);
    onAnchorChange(null);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange(null);
    onAnchorChange(null);
  };

  const handleClose = () => {
    onAnchorChange(null);
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
              minWidth: 220,
            },
          },
        }}
      >
        <Stack spacing={1}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('setDueDate')}
            </Typography>
            {value && (
              <IconButton size="small" onClick={handleClear} sx={{ p: 0.5 }}>
                <Iconify icon="solar:close-circle-bold" width={16} />
              </IconButton>
            )}
          </Box>

          {/* Quick options */}
          {dateOptions.map((option) => (
            <Box
              key={option.key}
              onClick={() => handleDateSelect(option.date)}
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 150ms',
                bgcolor: selectedDate?.isSame(option.date, 'day')
                  ? 'action.selected'
                  : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography variant="body2">{t(`common.${option.key}`)}</Typography>
            </Box>
          ))}

          {/* Custom date picker */}
          <Box
            sx={{
              mt: 0.5,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Note: Using a simple text input for custom date
                In production, you'd want to integrate MUI DatePicker here */}
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
            >
              {t('common.later')}
            </Typography>
            {/* TODO: Add MUI DatePicker integration */}
            <Box
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider',
                textAlign: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption">Pick a date...</Typography>
            </Box>
          </Box>
        </Stack>
      </CustomPopover>
    </>
  );
}
