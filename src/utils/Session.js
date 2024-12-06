// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button
// } from '@mui/material';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import { useNavigate } from 'react-router';

// export default function Session() {
//   const navigate = useNavigate();
//   const { axios } = useAxiosInterceptor();

//   const [isSessionExpired, setIsSessionExpired] = useState(false);
//   const adminPortalSessionTime = localStorage.getItem('adminPortalSessionTime');

//   const setSession = (accessToken) => {
//     if (accessToken) {
//       localStorage.setItem('accessToken', accessToken);
//       axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//     } else {
//       localStorage.removeItem('accessToken');
//       delete axios.defaults.headers.common.Authorization;
//     }
//   };

//   useEffect(() => {
//     if (adminPortalSessionTime) {
//       const sessionEndTime = new Date(Number(adminPortalSessionTime));
//       const warningTime = new Date(sessionEndTime.getTime() - 30 * 1000); // 30 seconds before session ends
//       //   const warningTime = new Date(sessionEndTime.getTime() - 30 * 60 * 1000); // 30 minutes before session expires

//       const interval = setInterval(() => {
//         const now = new Date();
  
//         // Avoid resetting the state if already expired
//         if (now >= warningTime && now < sessionEndTime && !isSessionExpired) {
//           setIsSessionExpired(true);
//         } else if (now >= sessionEndTime) {
//           handleLogout();
//           clearInterval(interval);
//         }
//       }, 1000);
  
//       return () => clearInterval(interval); // Cleanup on component unmount
//     }
//   }, [adminPortalSessionTime, isSessionExpired]);
  
//   const handleStayLogin = async () => {
//     const username = localStorage.getItem('userAdminEmail');
//     const password = localStorage.getItem('userAdminPassword');
  
//     if (username && password) {
//       try {
//         const response = await axios.post(
//           `/adminLogin`,
//           {},
//           {
//             headers: {
//               username,
//               password,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (response.status === 200) {
//           setSession(response.data.token);
//           setIsSessionExpired(false); // Close the dialog
//           localStorage.setItem('adminPortalSessionTime', Date.now() + 1 * 60 * 1000); // Reset session time (1 minute)
//         } else {
//           console.error('Login failed. Status:', response.status);
//         }
//       } catch (error) {
//         console.error('Error during stay login:', error);
//       }
//     } else {
//       console.error('Username or password is missing in localStorage');
//     }
//   };
  

//   const handleLogout = () => {
//     localStorage.removeItem('userAdminEmail');
//     localStorage.removeItem('userAdminPassword');
//     localStorage.removeItem('accessToken');
//     setIsSessionExpired(false);
//     navigate('/');
//   };



//   return (
//     <Dialog
//       open={isSessionExpired}
//       onClose={() => setIsSessionExpired(false)}
//       fullWidth
//       maxWidth="sm"
//     >
//       <DialogTitle>Session Expiration Warning</DialogTitle>
//       <DialogContent>
//         Your session will expire soon. Do you want to stay logged in?
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleStayLogin} color="primary" variant="contained">
//           Stay Logged In
//         </Button>
//         <Button onClick={handleLogout} color="secondary" variant="outlined">
//           Logout
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
