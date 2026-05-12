import { Box } from '@mui/material';

import { InboxView } from '../page';

export default function InboxPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <InboxView />
    </Box>
  );
}