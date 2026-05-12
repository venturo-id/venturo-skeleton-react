import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { CircleCheckboxDemo } from '../components/examples/circle-checkbox-demo';

// ----------------------------------------------------------------------

export default function UiReferenceView() {
  const { t } = useTranslate('ui-reference');

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} sx={{ mb: 5 }}>
        <Typography variant="h3">{t('title')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('description')}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <CircleCheckboxDemo />
      </Grid>
    </Container>
  );
}
