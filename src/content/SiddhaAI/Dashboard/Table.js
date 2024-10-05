import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
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
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  IconButton,
  Pagination // Import Pagination
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import toast, { Toaster } from 'react-hot-toast';
import ExistingPatientAp from './ExistingPatientAp/TableData';

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

  // State Management
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState([]); // Now a single array of patients
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('all');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // Responsive Design Hooks
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  // Fetch Patients Function
  const fetchMonitorPatients = async (status, page = 1, limit = 10) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = `/monitor-patients`;

    try {
      const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          all_data: status || 'all', // Default to 'all' if status is empty
          page,
          limit
        }
      });

      if (response.data.success) {
        const patientsData = response.data.data; // Flat array
        const pagination = response.data.pagination;

        setData(patientsData || []);

        // Set pagination information
        setTotalPages(pagination.totalPages || 1);
        setCurrentPage(pagination.currentPage || 1);
        setItemsPerPage(pagination.itemsPerPage || 10);
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

  // Fetch patients on component mount and when status/page changes
  useEffect(() => {
    fetchMonitorPatients(status, currentPage, itemsPerPage);
  }, [status, currentPage, itemsPerPage]);

  // Handle Re-Schedule Click
  const handleReScheduleClick = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  // Handle Dialog Close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  // Render Table Rows
  const renderTableRows = (patients) => {
    if (!patients || patients.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
            {loading ? t('Loading...') : t('No records found')}
          </TableCell>
        </TableRow>
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
          <TableCell sx={{ textAlign: 'center' }}>
            {patient.status === 'Expired' && (
              <Button onClick={() => handleReScheduleClick(patient)}>
                <ReplayIcon />
                {t('Re-Schedule')}
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };

  // Handle Status Change
  const handleStatus = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    setCurrentPage(1); // Reset to first page on status change
  };

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
                  label="Status"
                  value={status}
                  onChange={handleStatus}
                  fullWidth
                >
                  <MenuItem value="all">{t('All')}</MenuItem>
                  <MenuItem value="pendingPatientForms">
                    {t('Pending')}
                  </MenuItem>
                  <MenuItem value="inProgressPatientForms">
                    {t('In Progress')}
                  </MenuItem>
                  <MenuItem value="patientFormSubmit">
                    {t('Submitted')}
                  </MenuItem>
                  <MenuItem value="expiredPatientForms">
                    {t('Expired')}
                  </MenuItem>
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
          <TableBody>{renderTableRows(data)}</TableBody>
        </Table>

        {/* Pagination Controls */}
        <Box display="flex" justifyContent="center" mt={2} sx={{ p: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => {
              setCurrentPage(page);
            }}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Dialog for Re-Schedule */}
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
