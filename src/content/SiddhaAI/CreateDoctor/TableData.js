import {
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';

function TableData() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const [orderBy, setOrderBy] = useState(''); // Track the column to sort by
  const [order, setOrder] = useState('');
  const [doctors, setDoctors] = useState([]); // Initialize as an empty array
  const [alertShow, setAlertShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Set a timeout to hide the alert after 2 seconds
    const timer = setTimeout(() => {
      setAlertShow(false);
    }, 2000);

    // Clean up the timer on component unmount or if alertShow changes
    return () => clearTimeout(timer);
  }, [alertShow]);

  const handleSearchInputChange = (newValue) => {
    setSearchInput(newValue);
    // setPage(0);
  };

  // Sort handler
  const createSortHandler = (property) => () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Fetch doctors from the API old
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { drchronoDoctoresDetail } = response.data;

      // Wrap in an array to handle a single doctor object
      setDoctors(drchronoDoctoresDetail.results || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // toast.error(t('Error fetching doctors create doctors file'));
      setDoctors([]); // Ensure doctors state is an empty array on error
    }
  }, []);

  //old
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // new
  // useEffect(() => {
  //   fetchDoctors(token, setDoctors);
  // }, [fetchDoctors, token, setDoctors]);

  return (
    <>
      <Helmet>
        <title>Doctor's List</title>
      </Helmet>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Grid container spacing={1} alignItems="center" gap={10}>
              <Grid item xs={6} md={3}>
                {t('LIST OF DOCTORS')}
              </Grid>
              <Grid item md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-search"
                  type="search"
                  placeholder={t('Search by name...')}
                  style={{
                    display: 'none',
                    justifyContent: 'flex-start',
                    marginLeft: '10px'
                  }}
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </Grid>
            </Grid>
          }
        />

        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'first_name'}
                    direction={orderBy === 'first_name' ? order : 'asc'}
                    onClick={createSortHandler('first_name')}
                  >
                    {t('FIRST NAME')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'last_name'}
                    direction={orderBy === 'last_name' ? order : 'asc'}
                    onClick={createSortHandler('last_name')}
                  >
                    {t('LAST NAME')}
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={createSortHandler('email')}
                  >
                    {t('EMAIL')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'practice_name'}
                    direction={orderBy === 'practice_name' ? order : 'asc'}
                    onClick={createSortHandler('practice_name')}
                  >
                    {t('PRACTICE NAME')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'npi_number'}
                    direction={orderBy === 'npi_number' ? order : 'asc'}
                    onClick={createSortHandler('npi_number')}
                  >
                    {t('NPI NUMBER')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={createSortHandler('id')}
                  >
                    {t('EMR DOCTOR ID')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'cell_phone'}
                    direction={orderBy === 'cell_phone' ? order : 'asc'}
                    onClick={createSortHandler('cell_phone')}
                  >
                    {t('MOBILE NO')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'specialty'}
                    direction={orderBy === 'specialty' ? order : 'asc'}
                    onClick={createSortHandler('specialty')}
                  >
                    {t('SPECIALTY')}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.first_name}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.last_name}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.email}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.practice_group_name || '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.npi_number || '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.id}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.cell_phone || '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {doctor.specialty || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

export default TableData;
