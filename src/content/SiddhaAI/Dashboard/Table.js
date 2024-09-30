import ReplayIcon from '@mui/icons-material/Replay';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  // TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import toast, { Toaster } from 'react-hot-toast';
import ExistingPatientAp from './ExistingPatientAp/TableData';
import CloseIcon from '@mui/icons-material/Close';

// Define styled components for different status labels
const LabelSuccess = styled(Box)(
  ({ theme }) => `
  display: inline-block;
  background: ${theme.colors.success.lighter};
  color: ${theme.colors.success.main};
  text-transform: uppercase;
  font-size: ${theme.typography.pxToRem(11)}; 
  font-weight: bold;
  padding: ${theme.spacing(1, 2)};
  border-radius: ${theme.general.borderRadiusSm};
`
);

const LabelError = styled(Box)(
  ({ theme }) => `
  display: inline-block;
  background: ${theme.colors.error.lighter};
  color: ${theme.colors.error.main};
  text-transform: uppercase;
  font-size: ${theme.typography.pxToRem(11)}; 
  font-weight: bold;
  padding: ${theme.spacing(1, 2)};
  border-radius: ${theme.general.borderRadiusSm};
`
);

const LabelWarning = styled(Box)(
  ({ theme }) => `
  display: inline-block;
  background: ${theme.colors.warning.lighter};
  color: ${theme.colors.warning.main};
  text-transform: uppercase;
  font-size: ${theme.typography.pxToRem(11)}; 
  font-weight: bold;
  padding: ${theme.spacing(1, 2)};
  border-radius: ${theme.general.borderRadiusSm};
`
);

const LabelBlue = styled(Box)(
  ({ theme }) => `
  display: inline-block;
  background: ${alpha(theme.palette.info.main, 0.1)};
  color: ${theme.palette.info.main};
  text-transform: uppercase;
  font-size: ${theme.typography.pxToRem(11)}; 
  font-weight: bold;
  padding: ${theme.spacing(1, 2)};
  border-radius: ${theme.general.borderRadiusSm};
`
);

const DataCard = () => {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState([]); // Single array of patients
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('all');

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const fetchMonitorPatients = async (status) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = `/monitor-patients`;

    try {
      // Pass status as a query parameter
      const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          all_data: status || '' // If status is empty, send an empty value to fetch all
        }
      });

      if (response.data.success) {
        const patientsData = response.data.data;

        // When a status is passed, API should return only the corresponding array
        // When no status is passed, store all categories from the API response
        setData({
          pendingPatientForms: patientsData.pendingPatientForms || [],
          inProgressPatientForms: patientsData.inProgressPatientForms || [],
          patientFormSubmit: patientsData.patientFormSubmit || [],
          expiredPatientForms: patientsData.expiredPatientForms || []
        });
      } else {
        toast.error('Invalid data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitorPatients(); // Fetch all patients on component mount
  }, []);

  const handleReScheduleClick = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const renderTableRows = (patientsData, selectedStatus) => {
    // If a status is selected, access the specific array based on the status
    let patients = [];

    if (selectedStatus === 'pendingPatientForms') {
      patients = patientsData?.pendingPatientForms;
    } else if (selectedStatus === 'inProgressPatientForms') {
      patients = patientsData?.inProgressPatientForms;
    } else if (selectedStatus === 'patientFormSubmit') {
      patients = patientsData?.patientFormSubmit;
    } else if (selectedStatus === 'expiredPatientForms') {
      patients = patientsData?.expiredPatientForms;
    } else {
      // If no status is selected, combine all arrays to display all patients
      // If no status is selected, combine all arrays to display all patients
      patients = [
        ...(patientsData?.pendingPatientForms || []),
        ...(patientsData?.inProgressPatientForms || []),
        ...(patientsData?.patientFormSubmit || []),
        ...(patientsData?.expiredPatientForms || [])
      ];
    }

    if (!patients || patients.length === 0) {
      return (
        <>
          {loading ? (
            <TableRow>
              <Typography
                colSpan={5}
                sx={{ margin: theme.spacing(2), textAlign: 'center' }}
              >
                {t('Loading...')}
              </Typography>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                {t('No records found')}
              </TableCell>
            </TableRow>
          )}
        </>
      );
    }

    return patients.map((patient) => {
      let statusLabel;

      if (patient?.status === 'Pending') {
        statusLabel = <LabelWarning>{t('Pending')}</LabelWarning>;
      } else if (patient?.status === 'InProgress') {
        statusLabel = <LabelBlue>{t('In Progress')}</LabelBlue>;
      } else if (patient?.status === 'FormSubmited') {
        statusLabel = <LabelSuccess>{t('Submitted')}</LabelSuccess>;
      } else {
        statusLabel = <LabelError>{t('Expired')}</LabelError>;
      }

      return (
        <TableRow key={patient?.document_id}>
          <TableCell sx={{ textAlign: 'center' }}>
            {patient?.patientName}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            {patient?.patientPhNum}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            {new Date(patient?.created_at).toLocaleDateString('en-US')}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{statusLabel}</TableCell>
          {patient.status === 'Expired' && (
            <TableCell sx={{ textAlign: 'center' }}>
              <Button onClick={() => handleReScheduleClick(patient)}>
                <ReplayIcon />
                {t('Re-Schedule')}
              </Button>
            </TableCell>
          )}
        </TableRow>
      );
    });
  };

  const handleStatus = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);

    // Fetch patients based on the selected status
    fetchMonitorPatients(selectedStatus); // Pass the selected status to the API call
  };

  // console.log('selected Patient', selectedPatient);

  return (
    <Box>
      <Toaster position="bottom-right" />

      <Card sx={{ mb: 2, width: '100%' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <CardHeader
            title={t('PATIENT INTAKE FORM STATUS')}
            sx={{ p: 2, whiteSpace: 'nowrap' }}
          />
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel>{t('Status')}</InputLabel>
                <Select
                  label="status"
                  value={status}
                  onChange={handleStatus}
                  fullWidth
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pendingPatientForms">Pending</MenuItem>
                  <MenuItem value="inProgressPatientForms">
                    In Progress
                  </MenuItem>
                  <MenuItem value="patientFormSubmit">Submitted</MenuItem>
                  <MenuItem value="expiredPatientForms">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>
                {t('Patient Name')}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {t('Patient Phone')}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {t('Created At')}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{t('Status')}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{t('Action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows(data, status)}</TableBody>
        </Table>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth={
            isExtraLargeScreen
              ? 'lg'
              : isLargeScreen
              ? 'md'
              : isSmallScreen
              ? 'sm'
              : 'xs'
          } // Dynamically adjust width based on screen size
        >
          <DialogTitle>
            {t('Re-Schedule Appointment')}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ExistingPatientAp selectedPatient={selectedPatient} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              {t('Cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default DataCard;
