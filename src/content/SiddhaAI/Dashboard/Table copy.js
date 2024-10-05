// import ReplayIcon from '@mui/icons-material/Replay';
// import {
//   alpha,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   Typography,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   useMediaQuery,
//   useTheme,
//   IconButton
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import toast, { Toaster } from 'react-hot-toast';
// import ExistingPatientAp from './ExistingPatientAp/TableData';
// import CloseIcon from '@mui/icons-material/Close';

// // Define styled components for different status labels
// const LabelSuccess = styled(Box)(
//   ({ theme }) => `
//   display: inline-block;
//   background: ${theme.colors.success.lighter};
//   color: ${theme.colors.success.main};
//   text-transform: uppercase;
//   font-size: ${theme.typography.pxToRem(11)};
//   font-weight: bold;
//   padding: ${theme.spacing(1, 2)};
//   border-radius: ${theme.general.borderRadiusSm};
// `
// );

// const LabelError = styled(Box)(
//   ({ theme }) => `
//   display: inline-block;
//   background: ${theme.colors.error.lighter};
//   color: ${theme.colors.error.main};
//   text-transform: uppercase;
//   font-size: ${theme.typography.pxToRem(11)};
//   font-weight: bold;
//   padding: ${theme.spacing(1, 2)};
//   border-radius: ${theme.general.borderRadiusSm};
// `
// );

// const LabelWarning = styled(Box)(
//   ({ theme }) => `
//   display: inline-block;
//   background: ${theme.colors.warning.lighter};
//   color: ${theme.colors.warning.main};
//   text-transform: uppercase;
//   font-size: ${theme.typography.pxToRem(11)};
//   font-weight: bold;
//   padding: ${theme.spacing(1, 2)};
//   border-radius: ${theme.general.borderRadiusSm};
// `
// );

// const LabelBlue = styled(Box)(
//   ({ theme }) => `
//   display: inline-block;
//   background: ${alpha(theme.palette.info.main, 0.1)};
//   color: ${theme.palette.info.main};
//   text-transform: uppercase;
//   font-size: ${theme.typography.pxToRem(11)};
//   font-weight: bold;
//   padding: ${theme.spacing(1, 2)};
//   border-radius: ${theme.general.borderRadiusSm};
// `
// );

// const DataCard = () => {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const theme = useTheme();

//   const [openDialog, setOpenDialog] = useState(false);
//   const [data, setData] = useState([]); // Single array of patients
//   const [loading, setLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [status, setStatus] = useState('all');

//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
//   const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

//   const fetchMonitorPatients = async (status) => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const url = `/monitor-patients`;

//     try {
//       // Pass status as a query parameter
//       const response = await axios.get(`${url}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         params: {
//           all_data: status || '' // If status is empty, send an empty value to fetch all
//         }
//       });

//       if (response.data.success) {
//         const patientsData = response.data.data;

//         // When no status is passed, store all categories from the API response
//         setData({
//           pendingPatientForms: patientsData.pendingPatientForms || [],
//           inProgressPatientForms: patientsData.inProgressPatientForms || [],
//           patientFormSubmit: patientsData.patientFormSubmit || [],
//           expiredPatientForms: patientsData.expiredPatientForms || []
//         });
//       } else {
//         toast.error('Invalid data');
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMonitorPatients(); // Fetch all patients on component mount
//   }, []);

//   const handleReScheduleClick = (patient) => {
//     setSelectedPatient(patient);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedPatient(null);
//   };

//   const renderTableRows = (patientsData, selectedStatus) => {
//     // If a status is selected, access the specific array based on the status
//     let patients = [];

//     if (selectedStatus === 'pendingPatientForms') {
//       patients = patientsData?.pendingPatientForms;
//     } else if (selectedStatus === 'inProgressPatientForms') {
//       patients = patientsData?.inProgressPatientForms;
//     } else if (selectedStatus === 'patientFormSubmit') {
//       patients = patientsData?.patientFormSubmit;
//     } else if (selectedStatus === 'expiredPatientForms') {
//       patients = patientsData?.expiredPatientForms;
//     } else {
//       // If no status is selected, combine all arrays to display all patients
//       patients = [
//         ...(patientsData?.pendingPatientForms || []),
//         ...(patientsData?.inProgressPatientForms || []),
//         ...(patientsData?.patientFormSubmit || []),
//         ...(patientsData?.expiredPatientForms || [])
//       ];
//     }

//     if (!patients || patients.length === 0) {
//       return (
//         <>
//           {loading ? (
//             <TableRow>
//               <Typography
//                 colSpan={5}
//                 sx={{ margin: theme.spacing(2), textAlign: 'center' }}
//               >
//                 {t('Loading...')}
//               </Typography>
//             </TableRow>
//           ) : (
//             <TableRow>
//               <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
//                 {t('No records found')}
//               </TableCell>
//             </TableRow>
//           )}
//         </>
//       );
//     }

//     return patients.map((patient) => {
//       let statusLabel;

//       if (patient?.status === 'Pending') {
//         statusLabel = <LabelWarning>{t('Pending')}</LabelWarning>;
//       } else if (patient?.status === 'InProgress') {
//         statusLabel = <LabelBlue>{t('In Progress')}</LabelBlue>;
//       } else if (patient?.status === 'FormSubmited') {
//         statusLabel = <LabelSuccess>{t('Submitted')}</LabelSuccess>;
//       } else {
//         statusLabel = <LabelError>{t('Expired')}</LabelError>;
//       }

//       return (
//         <TableRow key={patient?.document_id}>
//           <TableCell sx={{ textAlign: 'center' }}>
//             {patient?.patientName}
//           </TableCell>
//           <TableCell sx={{ textAlign: 'center' }}>
//             {patient?.patientPhNum}
//           </TableCell>
//           <TableCell sx={{ textAlign: 'center' }}>
//             {new Date(patient?.created_at).toLocaleDateString('en-US')}
//           </TableCell>
//           <TableCell sx={{ textAlign: 'center' }}>{statusLabel}</TableCell>
//           {patient.status === 'Expired' && (
//             <TableCell sx={{ textAlign: 'center' }}>
//               <Button onClick={() => handleReScheduleClick(patient)}>
//                 <ReplayIcon />
//                 {t('Re-Schedule')}
//               </Button>
//             </TableCell>
//           )}
//         </TableRow>
//       );
//     });
//   };

//   const handleStatus = (event) => {
//     const selectedStatus = event.target.value;
//     setStatus(selectedStatus);

//     // Fetch patients based on the selected status
//     fetchMonitorPatients(selectedStatus); // Pass the selected status to the API call
//   };

//   return (
//     <Box>
//       <Toaster position="bottom-right" />

//       <Card sx={{ mb: 2, width: '100%' }}>
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{ p: 2 }}
//         >
//           <CardHeader
//             title={t('PATIENT INTAKE FORM STATUS')}
//             sx={{ p: 2, whiteSpace: 'nowrap' }}
//           />
//           <Grid
//             container
//             spacing={2}
//             sx={{ display: 'flex', justifyContent: 'flex-end' }}
//           >
//             <Grid item xs={12} md={6} lg={3}>
//               <FormControl fullWidth>
//                 <InputLabel>{t('Status')}</InputLabel>
//                 <Select
//                   label="status"
//                   value={status}
//                   onChange={handleStatus}
//                   fullWidth
//                 >
//                   <MenuItem value="all">All</MenuItem>
//                   <MenuItem value="pendingPatientForms">Pending</MenuItem>
//                   <MenuItem value="inProgressPatientForms">
//                     In Progress
//                   </MenuItem>
//                   <MenuItem value="patientFormSubmit">Submitted</MenuItem>
//                   <MenuItem value="expiredPatientForms">Expired</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ textAlign: 'center' }}>
//                 {t('Patient Name')}
//               </TableCell>
//               <TableCell sx={{ textAlign: 'center' }}>
//                 {t('Patient Phone')}
//               </TableCell>
//               <TableCell sx={{ textAlign: 'center' }}>
//                 {t('Created At')}
//               </TableCell>
//               <TableCell sx={{ textAlign: 'center' }}>{t('Status')}</TableCell>
//               <TableCell sx={{ textAlign: 'center' }}>{t('Action')}</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>{renderTableRows(data, status)}</TableBody>
//         </Table>
//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth={
//             isExtraLargeScreen
//               ? 'lg'
//               : isLargeScreen
//               ? 'md'
//               : isSmallScreen
//               ? 'sm'
//               : 'xs'
//           } // Dynamically adjust width based on screen size
//         >
//           <DialogTitle>
//             {t('Re-Schedule Appointment')}
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: 'absolute',
//                 right: 8,
//                 top: 8,
//                 color: theme.palette.grey[500]
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers>
//             <ExistingPatientAp selectedPatient={selectedPatient} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="secondary">
//               {t('Cancel')}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Card>
//     </Box>
//   );
// };

// export default DataCard;

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
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import ExistingPatientAp from './ExistingPatientAp/TableData';
import toast, { Toaster } from 'react-hot-toast';

// Custom styling for the table
const TableWrapper = styled(Table)(
  ({ theme }) => `
  tbody tr:hover {
    background: ${alpha(theme.colors.primary.main, 0.02)};
    border-color: ${alpha(theme.colors.alpha.black[5], 0.55)} !important;
  }
`
);

// Styled labels for success, warning, error, and form submission statuses
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

  // Media queries for responsiveness
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  // const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  // Responsive dialog maxWidth
  const dialogMaxWidth = isSmallScreen ? 'xs' : isLargeScreen ? 'md' : 'sm';
  const dialogFullScreen = isSmallScreen;

  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState({
    pendingPatientForms: [],
    inProgressPatientForms: [],
    expiredPatientForms: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patient forms
  const fetchMonitorPatients = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/monitor-patients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error('Invalid data ');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitorPatients();
  }, []);

  // Handle re-schedule button click
  const handleReScheduleClick = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  // Helper function to render table rows based on patient data
  const renderTableRows = (patients, label) => {
    return patients.map((patient) => {
      let statusLabel;

      // Define the status logic for each table type
      if (label === 'Pending') {
        statusLabel = <LabelWarning>{t('Pending')}</LabelWarning>;
      } else if (label === 'In Progress') {
        if (patient.access_token_used && patient.patient_form_open) {
          statusLabel = <LabelBlue>{t('Form Submitted')}</LabelBlue>;
        } else {
          statusLabel = <LabelSuccess>{t('In Progress')}</LabelSuccess>;
        }
      } else if (label === 'Expired') {
        statusLabel = <LabelError>{t('Expired')}</LabelError>;
      }

      return (
        <TableRow key={patient.patientid}>
          <TableCell sx={{ textAlign: 'center' }}>
            {patient.patientName}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            {patient.patientPhNum}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            {new Date(patient.created_at).toLocaleDateString('en-US')}
          </TableCell>
          <TableCell sx={{ textAlign: 'center' }}>{statusLabel}</TableCell>
          {label === 'Expired' && (
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

  return (
    <Box>
      <Toaster position="bottom-right" />

      {/* Pending Forms */}
      {/* <Card sx={{ mb: 2, width: '100%' }}>
        <CardHeader title={t('PATIENT INTAKE FORM STATUS')} sx={{ p: 2 }} />
        <CardContent sx={{ pt: 0 }}>
          <TableContainer component={Paper}>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Name')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Mobile')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Last SMS Send')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Status')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                        {t('Loading...')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    renderTableRows(data.pendingPatientForms, 'Pending')
                  )}
                </TableBody>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                        {t('Loading...')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    renderTableRows(data.inProgressPatientForms, 'In Progress')
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </TableContainer>
        </CardContent>
      </Card> */}

      <Card sx={{ mb: 2, width: '100%' }}>
        <CardHeader title={t('PATIENT INTAKE FORM STATUS')} sx={{ p: 2 }} />
        <CardContent sx={{ pt: 0 }}>
          <TableContainer component={Paper}>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Name')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Mobile')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Last SMS Send')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Status')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                        {t('Loading...')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {/* Render Pending Patient Forms */}
                      {renderTableRows(data.pendingPatientForms, 'Pending')}

                      {/* Optional: Separator Row between Pending and In Progress */}
                      {/* <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0'
                          }}
                        >
                          {t('In Progress Forms')}
                        </TableCell>
                      </TableRow> */}

                      {/* Render In Progress Patient Forms */}
                      {renderTableRows(
                        data.inProgressPatientForms,
                        'In Progress'
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </TableContainer>
        </CardContent>
      </Card>

      {/* In Progress Forms */}
      {/* <Card sx={{ mb: 2, width: '100%' }}>
        <CardHeader title={t('IN PROGRESS FORMS USER DETAILS')} sx={{ p: 2 }} />
        <CardContent sx={{ pt: 0 }}>
          <TableContainer component={Paper}>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Name')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Mobile')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Last SMS Send')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Status')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                        {t('Loading...')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    renderTableRows(data.inProgressPatientForms, 'In Progress')
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </TableContainer>
        </CardContent>
      </Card> */}

      {/* Expired Forms */}
      <Card sx={{ mb: 2, width: '100%' }}>
        <CardHeader title={t('EXPIRED FORMS USER DETAILS')} sx={{ p: 2 }} />
        <CardContent sx={{ pt: 0 }}>
          <TableContainer component={Paper}>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Name')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Patient Mobile')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Last SMS Send')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Status')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Re-Schedule')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                        {t('Loading...')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    renderTableRows(data.expiredPatientForms, 'Expired')
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Re-Schedule Dialog */}
      {/* <Dialog  open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('Re-Schedule Appointment')}</DialogTitle>
        <DialogContent>
          <ExistingPatientAp selectedPatient={selectedPatient} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={dialogFullScreen}
        maxWidth={dialogMaxWidth}
        fullWidth
      >
        <DialogTitle>{t('Re-Schedule Appointment')}</DialogTitle>
        <DialogContent>
          <ExistingPatientAp selectedPatient={selectedPatient} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataCard;
