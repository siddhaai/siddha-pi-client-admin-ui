// import CloseIcon from '@mui/icons-material/Close';
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
//   IconButton,
//   Paper,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   useTheme,
//   useMediaQuery // Import useMediaQuery
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import ExistingPatientAp from './ExistingPatientAp/TableData';

// // Custom styling for the table
// const TableWrapper = styled(Table)(
//   ({ theme }) => `
//   tbody tr:hover {
//     background: ${alpha(theme.colors.primary.main, 0.02)};
//     border-color: ${alpha(theme.colors.alpha.black[5], 0.55)} !important;
//   }
// `
// );

// // Styled labels for success and error statuses
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

// const DataCard = () => {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const theme = useTheme();

//   // Use Media Queries to determine screen size
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
//   const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

//   const [openDialog, setOpenDialog] = useState(false);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [datapatientDetails, setDataPatientDetails] = useState([]);

//   // Fetch pending patient forms
//   const fetchMonitorPatients = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get(`/monitor-patients`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       // console.log('response', response.data.data);

//       if (response.data.success) {
//         setData(response.data.data.pendingPatientForms || []);
//         setDataPatientDetails(response.data.data.patientDetails || []);
//       } else {
//         console.error('Invalid data structure');
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMonitorPatients();
//   }, []);

//   // Handle re-schedule button click
//   const handleReScheduleClick = (patient) => {
//     setSelectedPatient(patient);
//     setOpenDialog(true);
//   };

//   // Close the dialog
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedPatient(null);
//   };

//   return (
//     <Box>
//       {/* Pending PI Form Users */}
//       <Card sx={{ mb: 2, width: '100%' }}>
//         <CardHeader title={t('PENDING FORMS USER DETAILS')} sx={{ p: 2 }} />
//         <CardContent sx={{ pt: 0 }}>
//           <TableContainer component={Paper}>
//             <TableWrapper>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Patient Name
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Patient Mobile
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Last SMS Send
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
//                         Loading...
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     datapatientDetails.map((patient, index) => (
//                       <TableRow key={index}>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.patientName}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.patientPhNum}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {new Date(patient.created_at).toLocaleDateString(
//                             'en-US'
//                           )}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.access_token_used ? (
//                             <LabelSuccess>{t('Submitted')}</LabelSuccess>
//                           ) : (
//                             <LabelWarning>{t('Pending')}</LabelWarning>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableWrapper>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Expired PI  forms Users */}
//       <Card sx={{ mb: 2, width: '100%' }}>
//         <CardHeader title={t('EXPIRED FORMS USER DETAILS')} sx={{ p: 2 }} />
//         <CardContent sx={{ pt: 0 }}>
//           <TableContainer component={Paper}>
//             <TableWrapper>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Patient Name
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Patient Mobile
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Last SMS Send
//                     </TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>Status</TableCell>
//                     <TableCell sx={{ textAlign: 'center' }}>
//                       Re-Schedule
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
//                         Loading...
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     data.map((patient) => (
//                       <TableRow key={patient?.patientid}>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.patientName}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.patientPhNum}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {new Date(patient.created_at).toLocaleDateString(
//                             'en-US'
//                           )}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           {patient?.access_token_used ? (
//                             <LabelSuccess>{t('Submitted')}</LabelSuccess>
//                           ) : (
//                             <LabelError>{t('Expired')}</LabelError>
//                           )}
//                         </TableCell>
//                         <TableCell sx={{ textAlign: 'center' }}>
//                           <Button
//                             onClick={() => handleReScheduleClick(patient)}
//                           >
//                             <ReplayIcon />
//                             Re-Schedule
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableWrapper>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Re-Schedule Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         fullWidth
//         maxWidth={
//           isExtraLargeScreen
//             ? 'lg'
//             : isLargeScreen
//             ? 'md'
//             : isSmallScreen
//             ? 'sm'
//             : 'xs'
//         } // Dynamically adjust width based on screen size
//       >
//         <DialogTitle>
//           {t('Re-Schedule Appointment')}
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseDialog}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: theme.palette.grey[500]
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <ExistingPatientAp patient={selectedPatient} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="secondary">
//             {t('Cancel')}
//           </Button>
//         </DialogActions>
//       </Dialog>
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
