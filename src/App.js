import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';
import { AuthProvider } from "src/contexts/AuthContext";
import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import AppInit from './components/AppInit';

function App() {
  const content = useRoutes(router);
  const auth = useAuth();

  return (
    <ThemeProvider>
      <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CssBaseline />
          {auth.isInitialized ? content : <AppInit />}
        </SnackbarProvider>
      </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
