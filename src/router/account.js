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

// const RegisterBasic = Loader(
//   lazy(() => import('src/content/pages/Auth/Register/Basic'))
// );
const EMRConfigure = Loader(
  lazy(() => import('src/content/pages/Auth/EMRConfigure/EMRConfigure'))
);
const ForgotPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ForgetPassword'))
);
const ResetPassword = Loader(
  lazy(() => import('src/content/pages/Auth/ForgetPassword/ResetPassword'))
);
const UnAuth = Loader(
  lazy(() => import('src/content/pages/Status/UnAuth/index'))
);
// const InvalidToken = Loader(
//   lazy(() => import('src/content/pages/Auth/InvalidToken/InvalidToken'))
// );
// const PayMent = Loader(
//   lazy(() => import('src/content/pages/Auth/PayMent/PayMent'))
// );
const EMRResponse = Loader(
  lazy(() => import('src/content/pages/Auth/EMRResponse/EMRResponse'))
);

// const PI = Loader(lazy(() => import('src/content/pages/Auth/PI/PI')));

const accountRoutes = [
  // outside admin panel routes 
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
    path: 'emr-configure',
    element: <EMRConfigure />
  },
  {
    path: 'emr-response',
    element: <EMRResponse />
  },
  {
    path: 'unauthorized',
    element: <UnAuth />
  },
  // {
  //   path: 'pay-ment',
  //   element: <PayMent />
  // }
];

export default accountRoutes;
