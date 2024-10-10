import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import useAuth from 'src/hooks/useAuth';
import useAxiosInterceptor from 'src/contexts/Interceptor';

import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';

// const MenuUserBox = styled(Box)(
//   ({ theme }) => `
//     background: ${theme.colors.alpha.black[5]};
//     padding: ${theme.spacing(2)};
// `
// );

// const UserBoxText = styled(Box)(
//   ({ theme }) => `
//     text-align: left;
//     padding-left: ${theme.spacing(1)};
// `
// );

// const UserBoxLabel = styled(Typography)(
//   ({ theme }) => `
//     font-weight: ${theme.typography.fontWeightBold};
//     color: ${theme.sidebar.menuItemColor};
//     display: block;

//     &.popoverTypo {
//       color: ${theme.palette.secondary.main};
//     }
// `
// );

// const UserBoxDescription = styled(Typography)(
//   ({ theme }) => `
//     color: ${alpha(theme.sidebar.menuItemColor, 0.6)};

//     &.popoverTypo {
//       color: ${theme.palette.secondary.light};
//     }
// `
// );

function SidebarTopSection() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { axios } = useAxiosInterceptor();

  // const navigate = useNavigate();
  // const location = useLocation();
  // const { user, logout } = useAuth();

  // const ref = useRef(null);
  // const [isOpen, setOpen] = useState(false);

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
      // console.log(user);
      console.error('Failed to fetch user data ex side top');
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 2,
        pt: 1,
        position: 'relative'
      }}
    >
      <Avatar
        sx={{
          width: 68,
          height: 68,
          mb: 2,
          mx: 'auto'
        }}
        alt={userFullName}
        src={getUserImage}
      />

      <Typography
        variant="h4"
        sx={{
          color: `${theme.colors.alpha.trueWhite[100]}`
        }}
      >
        {userFullName}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: `${theme.colors.alpha.trueWhite[70]}`
        }}
      ></Typography>
    </Box>
  );
}

export default SidebarTopSection;
