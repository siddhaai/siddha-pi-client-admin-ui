import ReactDOM from 'react-dom';
import 'src/mocks';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ScrollTop from 'src/hooks/useScrollTop';
import 'nprogress/nprogress.css';
import { Provider } from 'react-redux';
import store from 'src/store';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import { AuthProvider } from 'src/contexts/JWTAuthContext';


const PROD = true;
const StateForBuild = PROD ? 'PROD' : 'DEV';

// console.log('StateForBuild', StateForBuild);
// console.log("StateForBuild !== 'DEV'", StateForBuild !== 'DEV');

// Disable console logs in production
if (StateForBuild !== 'DEV') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
      <SidebarProvider>
        <BrowserRouter>
          <ScrollTop />
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </SidebarProvider>
    </Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
