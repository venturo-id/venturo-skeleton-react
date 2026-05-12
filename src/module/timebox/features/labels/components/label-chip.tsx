// LabelChip - Display label in a compact chip format

import type { ChipProps } from '@mui/material/Chip';
import type { Label } from 'src/module/timebox/types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface LabelChipProps extends Omit<ChipProps, 'color' | 'label'> {
  label: Label;
  onDelete?: () => void;
  size?: 'small' | 'medium';
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function LabelChip({ label, onDelete, size = 'small', ...props }: LabelChipProps) {
  const handleClick = () => {
    // Could open label picker or show label details
  };

  return (
    <Chip
      label={label.name}
      size={size}
      onClick={handleClick}
      onDelete={onDelete}
      {...props}
      sx={{
        height: size === 'small' ? 20 : 24,
        fontSize: size === 'small' ? 11 : 12,
        fontWeight: 500,
        bgcolor: label.color,
        color: '#fff',
        '& .MuiChip-label': {
          px: size === 'small' ? 0.75 : 1,
        },
        '& .MuiChip-deleteIcon': {
          color: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            color: '#fff',
          },
        },
        ...props,
      }}
    />
  );
}

// ----------------------------------------------------------------------
// Variant: CompactLabelChip (even smaller)
// ----------------------------------------------------------------------

interface CompactLabelChipProps {
  label: Label;
  onClick?: () => void;
}

export function CompactLabelChip({ label, onClick }: CompactLabelChipProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1,
        bgcolor: label.color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 150ms',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label.name}
      </Typography>
    </Box>
  );
}
