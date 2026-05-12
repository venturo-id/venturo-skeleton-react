import { Box, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/shared/ui/iconify';

export default function LabelDetailPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
        <Iconify icon="solar:tag-horizontal-bold-duotone" width={80} sx={{ color: 'text.disabled' }} />
        <Typography variant="h4">Label Detail</Typography>
        <Typography variant="body2" color="text.secondary">
          Label detail view - Coming soon
        </Typography>
      </Stack>
    </Box>
  );
}
