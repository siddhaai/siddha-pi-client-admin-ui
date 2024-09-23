import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
// import PsychologyIcon from '@mui/icons-material/Psychology';
import ArticleIcon from '@mui/icons-material/Article';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        link: 'SiddhaAI/Dashboard/Dashboard'
      },
      {
        name: 'Patient Intake',
        icon: AssignmentIndTwoToneIcon,
        items: [
          {
            name: 'New Patient',
            link: 'SiddhaAI/NewPatient/NewPatient'
          },
          {
            name: 'Existing Patient',
            link: 'SiddhaAI/ExistingPatient/ExistingPatient'
          }
        ]
      },
      {
        name: 'Intake Form Customize',
        icon: DynamicFormIcon,
        link: 'SiddhaAI/FormBuilder/FormBuilder'
      },
      {
        name: `Doctor's List`,
        icon: AccountTreeTwoToneIcon,
        link: 'SiddhaAI/CreateDoctor/CreateDoctor'
      },
      {
        name: `Agreement`,
        icon: ArticleIcon,
        link: 'SiddhaAI/TC/TC'
      },
      {
        name: `Reports`,
        icon: AssessmentIcon,
        link: 'SiddhaAI/Reports/Reports'
      },
      {
        name: `Settings`,
        icon: SettingsIcon,
        link: 'SiddhaAI/Settings/Settings'
      }
      // {
      //   name: `AI`,
      //   icon: PsychologyIcon,
      //   link: 'SiddhaAI/Ai/Ai'
      // },
    ]
  },
  {
    heading: '',
    items: []
  }
];

export default menuItems;
