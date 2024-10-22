import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Typography,
  alpha,
  styled
} from '@mui/material';
// import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const UserBoxButton = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(1)};
  border-radius: ${theme.general.borderRadiusLg};
  
  &:hover {
    background: ${theme.colors.primary.main};
  }
`
);

const UserAvatar = styled(Avatar)(
  ({ theme }) => `
        height: 90%;
        width: 90%;
        border-radius: ${theme.general.borderRadiusLg};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${alpha(theme.colors.alpha.black[100], 0.08)};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

function HeaderUserbox() {
  const { t } = useTranslation();
  const { axios } = useAxiosInterceptor();
  const location = useLocation(); // Get the current location

  // const theme = useTheme();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem('token');
  const [userFullName, setUserFullName] = useState('');

  const [getUserImage, SetGetUserImage] = useState('');
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/getClientDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fullName = `${response.data.clientProfile[0].clientName}`;
      setUserFullName(fullName);
      const imageUrl = response.data.clientProfile[0].profilePhoto
        ? `data:image/jpeg;base64,${response.data.clientProfile[0].profilePhoto}`
        : '';
      SetGetUserImage(imageUrl);
    } catch (error) {
      console.log(user);
      console.error('Failed to fetch user data top right corner');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   // Close the popover when the route changes
  //   setOpen(false);
  // }, [location]);

  const handleViewProfile = () => {
    navigate('/extended-sidebar/SiddhaAI/CreateProfile/CreateProfile');
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        <UserAvatar alt={userFullName} src={getUserImage} />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar variant="rounded" alt={userFullName} src={getUserImage} />
          <UserBoxText>
            <UserBoxLabel variant="body1" sx={{ mt: 1 }}>
              {userFullName}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {/* {user.jobtitle} */}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <Divider />

        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleViewProfile}>
            <VisibilityIcon
              sx={{
                mr: 1
              }}
            />
            {t('View Profile')}
          </Button>
        </Box>
        {/* <Divider /> */}
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LogoutIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
