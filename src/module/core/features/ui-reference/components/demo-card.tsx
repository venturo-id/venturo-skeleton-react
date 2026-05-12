import type { ReactNode } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

export interface DemoCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DemoCard({ title, description, children }: DemoCardProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
}
