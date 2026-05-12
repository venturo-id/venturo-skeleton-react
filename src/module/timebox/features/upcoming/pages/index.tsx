import { Box } from '@mui/material';

import { UpcomingView } from '../page';

export default function UpcomingPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <UpcomingView />
    </Box>
  );
}