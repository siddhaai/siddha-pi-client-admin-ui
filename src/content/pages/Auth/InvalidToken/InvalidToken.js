import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InvalidToken() {
  const [open, setOpen] = useState(true); // Dialog is open initially
  const navigate = useNavigate();

  const handleStayLogin = async () => {
    const localStorageUserName = localStorage.getItem('userAdminEmail');
    const localStoragePassword = localStorage.getItem('userAdminPassword');

    if (localStorageUserName && localStoragePassword) {
      try {
        const response = await axios.post(
          `/adminLogin`,
          {},
          {
            headers: {
              username: localStorageUserName,
              password: localStoragePassword,
              'Content-Type': 'application/json'
            }
          }
        );        if (response.status === 200) {
          navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');
        } else {
          console.error('Login failed. Status:', response.status);
        }
      } catch (error) {
        console.error('Error during stay login:', error);
      }
    } else {
      console.error('Username or password is missing in localStorage');
    }
  };

  const handleLogout = () => {
    // Clear user data if needed
    localStorage.removeItem('userAdminEmail');
    localStorage.removeItem('userAdminPassword');
    navigate('/');
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Your Session is Expired</DialogTitle>
      <DialogContent>
        Please choose an option below to proceed.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleStayLogin} color="primary" variant="contained">
          Stay Logged In
        </Button>
        <Button onClick={handleLogout} color="secondary" variant="outlined">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

