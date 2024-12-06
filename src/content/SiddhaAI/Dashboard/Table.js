import ReplayIcon from '@mui/icons-material/Replay';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon for ascending
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Icon for descending
import {
  alpha,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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
  Pagination, // Import Pagination
  CircularProgress,
  Popover,
  Tooltip
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import toast, { Toaster } from 'react-hot-toast';
import ExistingPatientAp from './ExistingPatientAp/TableData';
import { Link } from 'react-router-dom';
import AuthContext from 'src/contexts/AuthContext';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';


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
  const {  companyProvidedPassword } = useContext(AuthContext);

  // State Management
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState([]); // Array of patients
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  // Check if popover is open
  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;


  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // New state variable for password reset dialog
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(null);

  // Sorting State
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is ascending

  useEffect(() => {
    if(companyProvidedPassword){
      setShowPasswordResetDialog(companyProvidedPassword)
    }
    fetchMonitorPatients(status, currentPage, itemsPerPage, sortOrder); // Include sortOrder
}, [status, currentPage, itemsPerPage, sortOrder, companyProvidedPassword]);

  // Responsive Design Hooks

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  // Fetch Patients Function
  // console.log("companyProvidedPassword",companyProvidedPassword);
  const fetchMonitorPatients = async (status, page = 1, limit = 10,order = 'desc') => {
    // console.log("companyProvidedPassword func in",companyProvidedPassword);
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = `/monitor-patients`;
  
    try {
      if (!navigator.onLine) {
        toast.error(t('No internet connection'));
        setLoading(false);
        return;
      }

      const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          all_data: status || 'all', // Default to 'all' if status is empty
          page,
          limit,
          sort_order: order, // Add the sort_order parameter
        },
      });
  
      // console.log('response sort table', response.data);

      if (response.data.success) {
        const patientsData = response.data.data; // Flat array
        const pagination = response.data.pagination;
  
        setData(patientsData || []);
  
        // Set pagination information
        setTotalPages(pagination.totalPages || 1);
        setCurrentPage(pagination.currentPage || 1);
        setItemsPerPage(pagination.itemsPerPage || 10);
      } else {
        console.error('Invalid data');
      }
    } catch (err) {
      console.error('Error fetching data from table from dashboard:', err);
      // toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  // console.log("showPasswordResetDialog",showPasswordResetDialog);

  // Fetch patients on component mount and when status/page changes
 

  // Handle Sorting Toggle
const handleSortToggle = async () => {
  const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  setSortOrder(newSortOrder);
  setLoading(true);

  // Reset currentPage to 1 and fetch sorted data for the first page
  setCurrentPage(1); // Reset to the first page
  await fetchMonitorPatients(status, 1, itemsPerPage, newSortOrder);

  setLoading(false);
};


  // Handle Status Change
  const handleStatus = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    setCurrentPage(1); // Reset to first page on status change
  };

  // Sort Patients by Date
  const sortPatientsByDate = (patients) => {


    if (!patients || patients.length === 0) return [];

    return patients.sort(() => {
      return sortOrder === 'asc' ;
    });
  };

  // Render Table Rows
  const renderTableRows = (patients) => { 
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }
    if (!patients || patients.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
            {loading ? <CircularProgress /> : t('No records found')}
          </TableCell>
        </TableRow>
      );
    }

    const sortedPatients = sortPatientsByDate(patients);

    return sortedPatients.map((patient) => {
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
          {/* <TableCell sx={{ textAlign: 'center' }}>
            {new Date(patient?.created_at).toLocaleDateString('en-US')}
          </TableCell> */}
          <TableCell sx={{ textAlign: 'center' }}>
  {new Date(patient?.created_at).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })}
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


  // Handle the reset password dialog close
  const handlePasswordResetDialogClose = () => {
    setShowPasswordResetDialog(false); // Close the reset password dialog
  };

  
  // Open the popover
  const handleFilterOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Toaster position="bottom-right" />

      {/* Conditionally render the password reset dialog */}
      {showPasswordResetDialog && (
        <Dialog open={showPasswordResetDialog} onClose={handlePasswordResetDialogClose}>
          <DialogTitle>{t('Please reset your password for security reasons')}</DialogTitle>
          <DialogActions>
          <Link
        to="/extended-sidebar/SiddhaAI/Settings/Settings"
        style={{ textDecoration: 'none' }}
      >
        <Button variant="outlined">
          Settings
        </Button>
      </Link>
          </DialogActions>
        </Dialog>
      )}

      <Card sx={{ mb: 2, width: '100%' }}>
        <Grid
          container
          spacing={2}
          sx={{ p: 2, display: 'flex', alignItems: 'center' }}
        >
          <Grid item xs={6} sm={6}>
            <CardHeader
              title={t('PATIENT INTAKE FORM STATUS')}
              sx={{ p: 0, whiteSpace: 'nowrap' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={t('Filter')} aria-label="filter">
        <IconButton onClick={handleFilterOpen} aria-describedby={id}>
          <FilterAltOutlinedIcon />
        </IconButton>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2, minWidth: '200px' }}>
            <FormControl fullWidth>
              <InputLabel>{t('Status')}</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(event) => {
                  handleStatus(event);
                  handleFilterClose(); // Close the popover on selection
                }}
                size="small"
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
          </Box>
        </Popover>
      </Box>
    </Grid>
        </Grid>

        {/* Wrap the table with a Box to allow horizontal scrolling */}
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>
                  {t('Patient Name')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {t('Mobile Number')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {t('Created At')}
                    <IconButton onClick={handleSortToggle} size="small">
  {sortOrder === 'asc' ? (
    <ArrowUpwardIcon color="secondary" sx={{ height: '20px' }} />
  ) : (
    <ArrowDownwardIcon color="secondary" sx={{ height: '20px' }} />
  )}
</IconButton>

                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {t('Status')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {t('Actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableRows(data)}</TableBody>
          </Table>
        </Box>

        {/* Pagination Component */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 1 }}
        />
      </Card>

      {/* Dialog for Re-Scheduling */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={isExtraLargeScreen ? 'lg' : isLargeScreen ? 'md' : 'xs'} // Dynamically adjust width based on screen size
      >
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            {/* <CloseIcon /> */}
            {t('Close')}
          </Button>
        </DialogActions>
        <DialogTitle>{t('Re-Schedule Appointment')}</DialogTitle>
        <DialogContent>
          <ExistingPatientAp
            selectedPatient={selectedPatient}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DataCard;
