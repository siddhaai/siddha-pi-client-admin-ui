import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import CloseIcon from '@mui/icons-material/Close';

export default function Session() {
  const { axios } = useAxiosInterceptor();

  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [warningTime, setWarningTime] = useState(null);
  const [isStayLoginLoading, setIsStayLoginLoading] = useState(false);
  const [dialogManuallyClosed, setDialogManuallyClosed] = useState(false); // New state to track manual closure

  const setSession = (accessToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const checkSessionTimeout = useCallback(() => {
    if (sessionEndTime && warningTime && !dialogManuallyClosed) {
      const now = new Date();
      if (now >= warningTime && now < sessionEndTime) {
        setIsSessionExpired(true); // Show the dialog when 30 minutes are left
      }
    }
  }, [sessionEndTime, warningTime ,dialogManuallyClosed]);

  useEffect(() => {
    const adminPortalSessionTime = localStorage.getItem('adminPortalSessionTime');

    if (adminPortalSessionTime) {
      // Convert the session time (hours) to milliseconds and calculate the end time
      const sessionDurationHours = Number(adminPortalSessionTime);
      if (!isNaN(sessionDurationHours) && sessionDurationHours > 0) {
        // const sessionStartTime = new Date(); // Assume session starts now
        const sessionStartTime = new Date(localStorage.getItem('sessionStartTime'));
        // console.log('sessionStartTime', sessionStartTime);
        const sessionEnd = new Date(sessionStartTime.getTime() + sessionDurationHours * 60 * 60 * 1000);
        setSessionEndTime(sessionEnd);

        // Set the warning time 30 minutes before the session ends
        const warningTime = new Date(sessionEnd.getTime() - 30 * 60 * 1000);
        setWarningTime(warningTime);
        // console.log('Session End Time:', sessionEnd);
        // console.log('Warning Time:', warningTime);
      } else {
        console.error('Invalid session duration:', adminPortalSessionTime);
      }
    }
  }, []);

  useEffect(() => {
    // Check session timeout every second
    // console.log("sessionEndTime", sessionEndTime, "warningTime", warningTime);
    if (sessionEndTime && warningTime) {
      const intervalId = setInterval(() => {
    // console.log("sessionEndTime In", sessionEndTime, "warningTime In", warningTime);
        if (!isStayLoginLoading) {
          checkSessionTimeout(); // Skip session checks while Stay Login is processing
        }
      }, 1000); // 1seconds once check session timeout

      return () => clearInterval(intervalId); // Cleanup interval
    }
  }, [checkSessionTimeout, sessionEndTime, warningTime, isStayLoginLoading]);

  const handleStayLogin = async () => {
    setIsStayLoginLoading(true);
    const username = localStorage.getItem('userAdminEmail');
    const password = localStorage.getItem('userAdminPassword');

    if (username && password) {
      try {
        const response = await axios.post(
          `/adminLogin`,
          {},
          {
            headers: {
              username,
              password,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          // console.log("token get", localStorage.getItem('accessToken'));
          // console.log('Login successful Token:', response.data.token);
          setSession(response.data.token);

          const sessionDurationHours = Number(response.data.adminPortal_session_time);
          if (!isNaN(sessionDurationHours) && sessionDurationHours > 0) {
            const sessionStartTime = new Date();
            const newSessionEndTime = new Date(sessionStartTime.getTime() + sessionDurationHours * 60 * 60 * 1000);
            setSessionEndTime(newSessionEndTime);

            const newWarningTime = new Date(newSessionEndTime.getTime() - 30 * 60 * 1000);
            setWarningTime(newWarningTime);

            localStorage.setItem('adminPortalSessionTime', sessionDurationHours.toString());
            setIsSessionExpired(false); // Close the dialog
            setDialogManuallyClosed(false); // Reset manual close flag
          } else {
            console.error('Invalid session duration received:', sessionDurationHours);
          }
        } else {
          console.error('Login failed. Status:', response.status);
        }
      } catch (error) {
        console.error('Error during stay login:', error);
      } finally {
        setIsStayLoginLoading(false);
      }
    } else {
      console.error('Username or password is missing in localStorage');
    }
  };

  const handleCloseDialog = () => {
    setIsSessionExpired(false);
    setDialogManuallyClosed(true); // Mark the dialog as manually closed
  };

  return (
    <Dialog
      open={isSessionExpired}
      onClose={() => {}} //disable close on outside click
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Session Expire - Warning
      <IconButton
          size="small"
          aria-label="close"
          onClick={handleCloseDialog}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon color='error' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
      Your session will expire soon.
      </DialogContent>
      <DialogActions>
        <Button
        variant="contained"
          onClick={handleStayLogin}
          color="primary"
          disabled={isStayLoginLoading} // Disable the button while loading
        >
          {isStayLoginLoading ? <CircularProgress size={20} /> : 'Stay Signed In'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
