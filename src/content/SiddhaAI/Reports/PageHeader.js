import { Typography, Grid } from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
// import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
function PageHeader() {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" gap={5} height={35}>
      <Grid item>
        <AssessmentOutlinedIcon fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Reports')}
        </Typography>
        <Typography variant="subtitle2">{t('Overall Reports')}</Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
