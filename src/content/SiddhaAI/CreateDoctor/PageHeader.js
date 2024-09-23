import { Typography, Grid } from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function PageHeader() {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" gap={5} height={35}>
      <Grid item>
        <PersonOutlineIcon fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Doctors Details')}
        </Typography>
        <Typography variant="subtitle2">
          {t('You can view the doctor details from the EMR system!')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
