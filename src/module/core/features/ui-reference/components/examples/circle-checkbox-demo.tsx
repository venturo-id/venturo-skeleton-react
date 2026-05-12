import type { ChangeEvent } from 'react';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { DemoCard } from '../demo-card';

// ----------------------------------------------------------------------

const PRIORITY_COLORS = {
  none: undefined,
  low: '#eab308',
  medium: '#f97316',
  high: '#ef4444',
} as const;

interface PriorityColor {
  label: string;
  color: string | undefined;
}

const PRIORITY_OPTIONS: PriorityColor[] = [
  { label: 'ui-reference.circleCheckbox.none', color: PRIORITY_COLORS.none },
  { label: 'ui-reference.circleCheckbox.low', color: PRIORITY_COLORS.low },
  { label: 'ui-reference.circleCheckbox.medium', color: PRIORITY_COLORS.medium },
  { label: 'ui-reference.circleCheckbox.high', color: PRIORITY_COLORS.high },
];

// ----------------------------------------------------------------------

function CircleCheckbox({
  checked,
  onChange,
  priorityColor,
}: {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  priorityColor?: string;
}) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'divider',
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: priorityColor || 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: 'common.white',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            ✓
          </Typography>
        </Box>
      }
    />
  );
}

function CheckboxDemo({ label, priorityColor }: { label: string; priorityColor?: string }) {
  const { t } = useTranslate('ui-reference');
  const [checked, setChecked] = useState(false);

  return (
    <Stack alignItems="center" spacing={0.75}>
      <CircleCheckbox checked={checked} onChange={() => setChecked((v) => !v)} priorityColor={priorityColor} />
      <Typography variant="body2" color="text.secondary">
        {t(label)}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function CircleCheckboxDemo() {
  const { t } = useTranslate('ui-reference');

  return (
    <DemoCard title={t('circleCheckbox.title')} description={t('circleCheckbox.description')}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {PRIORITY_OPTIONS.map((option) => (
          <CheckboxDemo key={option.label} label={option.label} priorityColor={option.color} />
        ))}
      </Box>
    </DemoCard>
  );
}
