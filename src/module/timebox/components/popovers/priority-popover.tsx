// PriorityPopover - Quick priority selector for tasks

import type { TaskPriority } from 'src/module/timebox/types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { CustomPopover } from 'src/shared/ui/custom-popover';
import { Iconify, type IconifyName } from 'src/shared/ui/iconify';
import { TASK_PRIORITIES } from 'src/module/timebox/utils/constants';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface PriorityPopoverProps {
  anchorEl: HTMLElement | null;
  onAnchorChange: (el: HTMLElement | null) => void;
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  children: React.ReactNode;
}

// ----------------------------------------------------------------------
// Helper: Get priority color
// ----------------------------------------------------------------------

function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'urgent':
    case 'high':
      return '#FA383E';
    case 'medium':
      return '#FFAB00';
    case 'low':
      return '#00B8D9';
    case 'none':
    default:
      return '#919EAB';
  }
}

function getPriorityIcon(priority: TaskPriority): IconifyName {
  switch (priority) {
    case 'urgent':
    case 'high':
      return 'solar:flag-bold';
    case 'medium':
      return 'solar:flag-bold';
    case 'low':
      return 'solar:flag-bold';
    case 'none':
    default:
      return 'solar:flag-bold';
  }
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function PriorityPopover({
  anchorEl,
  onAnchorChange,
  value,
  onChange,
  children,
}: PriorityPopoverProps) {
  const { t } = useTranslate('timebox.tasks');
  const open = anchorEl !== null;

  const handlePrioritySelect = (priority: TaskPriority) => {
    onChange(priority);
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
              p: 1,
              minWidth: 180,
            },
          },
        }}
      >
        <Stack spacing={0.5}>
          {TASK_PRIORITIES.map((priority) => {
            const color = getPriorityColor(priority);
            const icon = getPriorityIcon(priority);
            const isSelected = value === priority;

            return (
              <Box
                key={priority}
                onClick={() => handlePrioritySelect(priority)}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: isSelected ? 'action.selected' : 'action.hover',
                  },
                }}
              >
                {/* Color indicator */}
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />

                {/* Icon */}
                <Iconify icon={icon} width={16} sx={{ color, flexShrink: 0 }} />

                {/* Label */}
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontWeight: isSelected ? 600 : 400,
                    textTransform: 'capitalize',
                  }}
                >
                  {t(`priorities.${priority}`)}
                </Typography>

                {/* Check mark for selected */}
                {isSelected && (
                  <Iconify
                    icon="solar:file-check-bold-duotone"
                    width={16}
                    sx={{ color: 'primary.main', flexShrink: 0 }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </CustomPopover>
    </>
  );
}
