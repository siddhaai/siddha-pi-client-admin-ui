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
          {t('New Patient')}
        </Typography>
        {/* <Typography variant="subtitle2">
          {t('New Patients')}
        </Typography> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
