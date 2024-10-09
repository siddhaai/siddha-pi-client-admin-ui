import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

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

const RegisterBasic = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Basic'))
);

const ForgotPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ForgetPassword'))
);
const ResetPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ResetPassword'))
);
const accountRoutes = [
  {
    path: 'forgot-password',
    element: <ForgotPassword />
  },
  {
    path: 'password-reset',
    element: <ResetPassword />
  },

  {
    path: 'login',
    element: <SiddhaLogin />
  },

  {
    path: 'register-basic',
    element: <RegisterBasic />
  }
];

export default accountRoutes;
