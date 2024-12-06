import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import { t } from 'i18next';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: t('Dashboard'),
        icon: DashboardIcon,
        link: 'SiddhaAI/Dashboard/Dashboard'
      },
      {
        name: t('Patient Intake'),
        icon: AssignmentIndTwoToneIcon,
        items: [
          {
            name: t('New Patient'),
            link: 'SiddhaAI/NewPatient/NewPatient'
          },
          {
            name: t('Existing Patient'),
            link: 'SiddhaAI/ExistingPatient/ExistingPatient'
          }
        ]
      },
      {
        name: t('Intake Form Customize'),
        icon: DynamicFormIcon,
        link: 'SiddhaAI/FormBuilder/FormBuilder'
      },
      {
        name: t(`Doctors List`),
        icon: AccountTreeTwoToneIcon,
        link: 'SiddhaAI/CreateDoctor/CreateDoctor'
      },
      {
        name: t(`Agreement`),
        icon: ArticleIcon,
        link: 'SiddhaAI/TC/TC'
      },
      {
        name: t(`Reports`),
        icon: AssessmentIcon,
        link: 'SiddhaAI/Reports/Reports'
      },
      {
        name: t(`Settings`),
        icon: SettingsIcon,
        link: 'SiddhaAI/Settings/Settings'
      },
      {
        name: t(`About`),
        icon: InfoIcon,
        link: 'SiddhaAI/About/About'
      }
      // {
      //   name: `AI`,
      //   icon: PsychologyIcon,
      //   link: 'SiddhaAI/Ai/Ai'
      // }
    ]
  },
  {
    heading: '',
    items: []
  }
];

export default menuItems;
