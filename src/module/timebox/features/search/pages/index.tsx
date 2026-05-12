import { Box, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/shared/ui/iconify';

export default function SearchPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
        <Iconify icon="solar:clock-circle-outline" width={80} sx={{ color: 'text.disabled' }} />
        <Typography variant="h4">Search</Typography>
        <Typography variant="body2" color="text.secondary">
          Global search - Coming soon
        </Typography>
      </Stack>
    </Box>
  );
}
