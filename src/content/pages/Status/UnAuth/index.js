import { Box, Typography, Container, styled, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// import UnAuthImage from '../../../../assets/401UnAuth.svg';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

// const OutlinedInputWrapper = styled(OutlinedInput)(
//   ({ theme }) => `
//     background-color: ${theme.colors.alpha.white[100]};
// `
// );

// const ButtonSearch = styled(Button)(
//   ({ theme }) => `
//     margin-right: -${theme.spacing(1)};
// `
// );

function Status401() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Status - 401</title>
      </Helmet>
      <MainContent>
  <Container maxWidth="md">
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
    >
      {/* <Box
        sx={{
          width: { xs: '100%', sm: '75%' },
          height: { xs: 200, sm: 300, md: 700 },
          backgroundImage: `url(${UnAuthImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 2,
        }}
        alt="401"
      /> */}
      <Typography
        variant="h4"
        sx={{
          my: 2,
        }}
      >
        {t("Your session has expired. Please log in again.")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')} // Replace with your routing mechanism
        sx={{
          mt: 2,
        }}
      >
        {t('Go To Sign In')}
      </Button>
    </Box>
  </Container>
</MainContent>

    </>
  );
}

export default Status401;
