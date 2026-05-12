import { Box } from '@mui/material';

import { TodayView } from '../page';

export default function TodayPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TodayView />
    </Box>
  );
}