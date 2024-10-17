import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import PersonIcon from '@mui/icons-material/Person'; // Default avatar icon
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  styled as muiStyled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';

const Input = muiStyled('input')({
  display: 'none'
});

const AvatarWrapper = muiStyled(Box)(
  ({ theme }) => `
    position: relative;
    .MuiAvatar-root {
      width: ${theme.spacing(11)};
      height: ${theme.spacing(11)};
      border: 2px solid ${
        theme.palette.primary.main
      }; // Border color for default avatar
    }
`
);

const ButtonUploadWrapper = muiStyled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
    bottom: -${theme.spacing(2)};
    right: -${theme.spacing(2)};
    .MuiIconButton-root {
      border-radius: 50%;
      background: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.shadows[4]};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      padding: 0;
      &:hover {
        background: ${theme.palette.primary.dark};
      }
    }
`
);

function PageHeader() {
  const { axios } = useAxiosInterceptor();
  const [setUser] = useState({
    clientName: '',
    profilePhoto: '',
    officeLocations: []
  });
  const [orderBy, setOrderBy] = useState(''); // Track the column to sort by
  const [order, setOrder] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null); // Initialize as null
  const [userFullName, setUserFullName] = useState('');
  const [getUserImage, SetGetUserImage] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedOffices, setSelectedOffices] = useState([]);

  const token = localStorage.getItem('token');

  const createSortHandler = (property) => () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/getClientDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const fullName = `${response.data.clientProfile[0].clientName}`;
      setUserFullName(fullName);

      // Ensure proper Base64 URL format
      const imageUrl = response.data.clientProfile[0].profilePhoto
        ? `data:image/jpeg;base64,${response.data.clientProfile[0].profilePhoto}`
        : '';
      // Set image URL for displaying
      SetGetUserImage(imageUrl);

      setUser({
        clientName: response.data.client.client_firstName,
        profilePhoto: imageUrl,
        officeLocations: response.data.clientProfile[0].officeLocations || []
      });
    } catch (error) {
      console.error('Failed to fetch user data Create Profile Photo');
    }
  };

  const fetchDoctorOffice = async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { drchronoOfficeLocation } = response.data;
      const officeLocations = drchronoOfficeLocation.results;
      setSelectedOffices(officeLocations);
    } catch (error) {
      console.error('Failed to fetch user data drchrono from CreateProfile');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchDoctorOffice();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store file object directly
      setIsEditing(true);
    }
  };

  const handleProfileNameChange = (event) => {
    setUserFullName(event.target.value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('clientName', userFullName);
      if (image) {
        formData.append('profilePhoto', image); // Send file object
      }

      const response = await axios.put(
        `/adminProfile/updateProfilePhotoName`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        toast.success(t('Profile updated successfully!'));
        fetchUserData(); // Refresh user data to update the image
        setIsEditing(false);
        window.location.reload(); // Reload the entire page
      }
    } catch (error) {
      // toast.error('Failed to update profile');
      console.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div>
        <Toaster position="bottom-right" />
        <Grid
          container
          direction="column"
          alignItems="start"
          spacing={3}
          sx={{ mb: 3 }}
        >
          <Grid item xs={12} lg={5}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
            >
              <AvatarWrapper>
                <Avatar
                  variant="rounded"
                  src={image ? URL.createObjectURL(image) : getUserImage} // Display updated or default image
                  sx={{
                    bgcolor:
                      !image && !getUserImage ? 'transparent' : 'transparent',
                    color:
                      !image && !getUserImage ? 'primary.main' : 'transparent'
                  }}
                >
                  {!image && !getUserImage && <PersonIcon />}
                </Avatar>
                <Tooltip title={t('Edit Image')} arrow>
                  <ButtonUploadWrapper>
                    <Input
                      accept="image/*"
                      id="icon-button-file"
                      name="icon-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton component="span" color="primary">
                        <CloudUploadTwoToneIcon />
                      </IconButton>
                    </label>
                  </ButtonUploadWrapper>
                </Tooltip>
              </AvatarWrapper>
              <Tooltip title={t('Edit Name')} arrow>
                <Box ml={3} flex="1">
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={userFullName}
                      onChange={handleProfileNameChange}
                      autoFocus
                      placeholder={t('Enter your full name')}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      onClick={() => setIsEditing(true)}
                      sx={{
                        cursor: 'pointer',
                        borderBottom: '1px dashed grey'
                      }}
                    >
                      {userFullName || 'Enter here'}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {/* Save and Cancel buttons */}
        {isEditing && (
          <Box display="flex" justifyContent="start" mt={3} mb={3}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleSave}
              sx={{
                mr: 1,
                padding: `${theme.spacing(0.5, 1.6, 0.5, 1.2)}`,
                backgroundColor: `${theme.colors.primary.lighter}`,
                textTransform: 'uppercase',
                fontSize: `${theme.typography.pxToRem(11)}`,
                '&:hover': {
                  backgroundColor: `${theme.colors.primary.main}`,
                  color: `${theme.palette.getContrastText(
                    theme.colors.primary.main
                  )}`
                }
              }}
            >
              {t('Save')}
            </Button>

            <Button size="small" color="error" onClick={handleCancel}>
              <CloseTwoToneIcon />
            </Button>
          </Box>
        )}

        {/* Office details */}
        <CardHeader
          title={
            <Grid container spacing={1} alignItems="center" gap={10}>
              <Grid item xs={6} md={3}>
                {t('OFFICE LOCATION')}
              </Grid>
              {/* <Grid item md={6}>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-search"
                  type="search"
                  placeholder="Search by name..."
                  style={{
                    display: 'none',
                    justifyContent: 'flex-start',
                    marginLeft: '10px'
                  }}
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </Grid> */}
            </Grid>
          }
        />

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
                    {t('LOCATION')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'last_name'}
                    direction={orderBy === 'last_name' ? order : 'asc'}
                    onClick={createSortHandler('last_name')}
                  >
                    {t('PHONE NUMBER')}
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={createSortHandler('email')}
                  >
                    {t('CITY')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'practice_name'}
                    direction={orderBy === 'practice_name' ? order : 'asc'}
                    onClick={createSortHandler('practice_name')}
                  >
                    {t('STATE')}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ textWrap: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === 'npi_number'}
                    direction={orderBy === 'npi_number' ? order : 'asc'}
                    onClick={createSortHandler('npi_number')}
                  >
                    {t('ZIP CODE')}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOffices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                  <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                selectedOffices?.map((office) => (
                  <TableRow key={office.id}>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {office?.name ? office?.name : '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {office?.phone_number ? office?.phone_number : '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {office?.city ? office?.city : '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {office?.state ? office?.state : '-'}
                    </TableCell>
                    <TableCell sx={{ textWrap: 'nowrap' }}>
                      {office?.zip_code ? office?.zip_code : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default PageHeader;
