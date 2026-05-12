import { Box, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/shared/ui/iconify';

export default function CompletedPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
        <Iconify icon="solar:file-check-bold-duotone" width={80} sx={{ color: 'text.disabled' }} />
        <Typography variant="h4">Completed</Typography>
        <Typography variant="body2" color="text.secondary">
          Completed tasks - Coming soon
        </Typography>
      </Stack>
    </Box>
  );
}
