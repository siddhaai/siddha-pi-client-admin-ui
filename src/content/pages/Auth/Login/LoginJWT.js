import { Box, Typography, Container, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from 'react-i18next';

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

function LoginJWT() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Status - 404</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="404" height={180} src="/static/images/status/NA.svg" />
            <Typography
              variant="h2"
              sx={{
                my: 2
              }}
            >
              {t("The page you were looking for doesn't exist.")}
            </Typography>
          </Box>
         
        </Container>
      </MainContent>
    </>
  );
}

export default LoginJWT;
