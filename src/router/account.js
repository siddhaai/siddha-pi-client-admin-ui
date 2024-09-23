import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Account
const SiddhaLogin = Loader(
  lazy(() => import('src/content/pages/Auth/SiddhaLogin/SiddhaLogin'))
);
const LoginCover = Loader(
  lazy(() => import('src/content/pages/Auth/Login/Cover'))
);
const LoginBasic = Loader(
  lazy(() => import('src/content/pages/Auth/Login/Basic'))
);

const RegisterCover = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Cover'))
);
const RegisterBasic = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Basic'))
);
const RegisterWizard = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Wizard'))
);

const RecoverPassword = Loader(
  lazy(() => import('src/content/pages/Auth/RecoverPassword'))
);

const ForgotPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ForgetPassword'))
);
const ResetPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ResetPassword'))
);
const accountRoutes = [
  {
    path: 'login',
    element: (
      <Guest>
        <LoginCover />
      </Guest>
    )
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />
  },
  {
    path: 'password-reset',
    element: <ResetPassword />
  },
  {
    path: 'register',
    element: (
      <Guest>
        <RegisterCover />
      </Guest>
    )
  },
  {
    path: 'login',
    element: <SiddhaLogin />
  },
  {
    path: 'login-basic',
    element: <LoginBasic />
  },
  {
    path: 'login-cover',
    element: <LoginCover />
  },
  {
    path: 'recover-password',
    element: <RecoverPassword />
  },
  {
    path: 'register',
    element: (
      <Guest>
        <RegisterCover />
      </Guest>
    )
  },
  {
    path: 'register-basic',
    element: <RegisterBasic />
  },
  {
    path: 'register-cover',
    element: <RegisterCover />
  },
  {
    path: 'register-wizard',
    element: <RegisterWizard />
  }
];

export default accountRoutes;
