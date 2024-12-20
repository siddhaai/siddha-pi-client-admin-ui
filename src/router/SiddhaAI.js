import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Siddha AI

// const LoginScreen = Loader(
//   lazy(() => import('src/content/SiddhaAI/LoginScreen/LoginScreen'))
// );

const CreateDoctor = Loader(
  lazy(() => import('src/content/SiddhaAI/CreateDoctor/CreateDoctor'))
);
const About = Loader(
  lazy(() => import('src/content/SiddhaAI/About/About'))
);
const CreateProfile = Loader(
  lazy(() => import('src/content/SiddhaAI/CreateProfile/CreateProfile'))
);
const NewPatient = Loader(
  lazy(() => import('src/content/SiddhaAI/NewPatient/NewPatient'))
);

const FormBuilder = Loader(
  lazy(() => import('src/content/SiddhaAI/FormBuilder/FormBuilder'))
);

const DashBoard = Loader(
  lazy(() => import('src/content/SiddhaAI/Dashboard/Dashboard'))
);

const ExistingPatient = Loader(
  lazy(() => import('src/content/SiddhaAI/ExistingPatient/ExistingPatient'))
);

const Reports = Loader(
  lazy(() => import('src/content/SiddhaAI/Reports/Reports'))
);

const Settings = Loader(
  lazy(() => import('src/content/SiddhaAI/Settings/Settings'))
);

// const Ai = Loader(lazy(() => import('src/content/SiddhaAI/Ai/AiTest')));
const TC = Loader(lazy(() => import('src/content/SiddhaAI/TC/TC')));
const PasswordReset = Loader(lazy(() => import('src/content/SiddhaAI/PasswordReset/PasswordReset')));

const AdminRoutes = [
  // Sidebar items for the admin panel navigation
  {
    path: 'CreateDoctor',
    children: [
      {
        path: 'CreateDoctor',
        element: <CreateDoctor />
      }
    ]
  },
  {
    path: 'About',
    children: [
      {
        path: 'About',
        element: <About />
      }
    ]
  },
  {
    path: 'CreateProfile',
    children: [
      {
        path: 'CreateProfile',
        element: <CreateProfile />
      }
    ]
  },
  {
    path: 'NewPatient',
    children: [
      {
        path: 'NewPatient',
        element: <NewPatient />
      }
    ]
  },
  {
    path: 'FormBuilder',
    children: [
      {
        path: 'FormBuilder',
        element: <FormBuilder />
      }
    ]
  },
  {
    path: 'DashBoard',
    children: [
      {
        path: 'DashBoard',
        element: <DashBoard />
      }
    ]
  },
  {
    path: 'ExistingPatient',
    children: [
      {
        path: 'ExistingPatient',
        element: <ExistingPatient />
      }
    ]
  },
  {
    path: 'Reports',
    children: [
      {
        path: 'Reports',
        element: <Reports />
      }
    ]
  },

  {
    path: 'Settings',
    children: [
      {
        path: 'Settings',
        element: <Settings />
      }
    ]
  },
  {
    path: 'TC',
    children: [
      {
        path: 'TC',
        element: <TC />
      }
    ]
  },
  {
    path: 'PasswordReset',
    children: [
      {
        path: 'PasswordReset',
        element: <PasswordReset />
      }
    ]
  }
];

export default AdminRoutes;
