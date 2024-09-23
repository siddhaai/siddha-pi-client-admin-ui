import { Typography, Grid } from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';

function PageHeader() {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" gap={5} height={35}>
      <Grid item>
        <PersonAddTwoToneIcon fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Profile')}
        </Typography>
        <Typography variant="subtitle2">
          {t('You can create profile here!')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
