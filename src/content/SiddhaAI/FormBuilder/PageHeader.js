import { Grid, Typography } from '@mui/material';
import QueryStatsTwoToneIcon from '@mui/icons-material/QueryStatsTwoTone';
import { useTranslation } from 'react-i18next';

function PageHeader() {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" gap={5} height={35}>
      <Grid item>
        <QueryStatsTwoToneIcon fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Dashboard')}
        </Typography>
        <Typography variant="subtitle2">
          {t('This is overview status page')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
