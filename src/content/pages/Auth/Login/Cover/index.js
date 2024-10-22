import {
  Box,
  Card,
  Container,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTLogin from '../LoginJWT';
import { useTranslation } from 'react-i18next';

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
`
);

const MainContent = styled(Box)(
  ({ theme }) => `
  @media (min-width: ${theme.breakpoints.values.md}px) {
    padding: 0 0 0 0;
  }
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
);

function LoginCover() {
  const { method } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Siddha</title>
      </Helmet>
      <Content>
        <MainContent>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh'
            }}
            maxWidth="sm"
          >
            <Box
              sx={{
                p: 4,
                my: 4
              }}
            >
              {method === 'JWT' && <JWTLogin />}
            </Box>
          </Container>
        </MainContent>
      </Content>
    </>
  );
}

export default LoginCover;
