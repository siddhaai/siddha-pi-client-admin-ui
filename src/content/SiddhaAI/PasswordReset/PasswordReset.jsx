import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  InputAdornment,
  Grid,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function PasswordReset() {
  const { axios } = useAxiosInterceptor();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [validationStatus, setValidationStatus] = useState({
    minLength: false,
    maxLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const token = localStorage.getItem('Sessiontoken');

  // Password validation
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      maxLength: password.length <= 13,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setValidationStatus(validations);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSave = async () => {
    const fieldErrors = {};

    // Validate old password
    if (!oldPassword) {
      fieldErrors.oldPassword = t('Old password is required');
    }

    // Validate new password
    if (!newPassword) {
      fieldErrors.newPassword = t('New password is required');
    } else if (!Object.values(validationStatus).every((valid) => valid)) {
      fieldErrors.newPassword = t('Password does not meet the requirements');
    }

    // Validate confirm password
    if (!confirmPassword) {
      fieldErrors.confirmPassword = t('Confirm password is required');
    } else if (newPassword !== confirmPassword) {
      fieldErrors.confirmPassword = t('Passwords do not match');
    }

    // Set errors to state
    setErrors(fieldErrors);

    // If there are errors, prevent submission
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        '/admin/changePassword',
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || 'Password changed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      setLoading(false);
    } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          toast.error(error.response.data?.detail || 'Server error occurred. Please try again.');
        } else if (error.request) {
          // No response received (network error)
          toast.error('Network error. Please check your internet connection.');
        } else {
          // Something else happened while setting up the request
          toast.error('An unexpected error occurred. Please try again.');
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {t('Reset Password')}
            </Typography>
            <Box mb={2}>
              <TextField
                fullWidth
                label={t("Old Password")}
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, oldPassword: '' })); // Clear error when user types
                }}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label={t("New Password")}
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  handleNewPasswordChange(e);
                  setErrors((prev) => ({ ...prev, newPassword: '' })); // Clear error when user types
                }}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box mt={1}>
                {Object.entries(validationStatus).map(([key, valid]) => (
                  <Typography
                    key={key}
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: valid ? 'green' : 'red',
                    }}
                  >
                    {valid ? (
                      <CheckIcon fontSize="inherit" />
                    ) : (
                      <ClearIcon fontSize="inherit"  />
                    )}
                    <Box ml={1}>
                      {key === 'minLength' && t('At least 8 characters')}
                      {key === 'maxLength' && t('No more than 13 characters')}
                      {key === 'uppercase' && t('At least one uppercase letter')}
                      {key === 'lowercase' && t('At least one lowercase letter')}
                      {key === 'number' && t('At least one number')}
                      {key === 'specialChar' &&
                        t('At least one special character')}
                    </Box>
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label={t("Confirm Password")}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: '' })); // Clear error when user types
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              sx={{borderRadius: '30px', width:"60%"}}
            >
              {loading ? <CircularProgress size={24} /> : t('Save')}
            </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Toaster position="bottom-right" />
    </Grid>
  );
}
