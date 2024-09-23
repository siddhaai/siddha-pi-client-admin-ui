// import { Helmet } from 'react-helmet-async';
import TableData from './TableData';
import { Grid } from '@mui/material';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

function Profile() {
  return (
    <>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <TableData />
        </Grid>
      </Grid>
    </>
  );
}

export default Profile;
