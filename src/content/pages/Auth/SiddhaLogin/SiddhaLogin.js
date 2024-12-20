import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Link, Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { t } from 'i18next';
import useAuth from 'src/hooks/useAuth';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Copyright } from '@mui/icons-material';
import Doctors from '../../../../assets/Doctors.svg';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from '@mui/material';
import AuthContext from 'src/contexts/AuthContext';
import VerifiedIcon from '@mui/icons-material/Verified';

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
      t('Invalid email address')
    )
    .required(t('Email is required')),
  password: Yup.string().required(t('Password is required'))
  // .min(8, t('Password is too short - should be 8 chars minimum'))
  // .max(13, t('Password is too long - should be 13 chars maximum'))
  // .matches(/[a-zA-Z]/, t('Password can only contain Latin letters'))
  // .matches(/[A-Z]/, t('Password must contain at least one uppercase letter'))
  // .matches(/[a-z]/, t('Password must contain at least one lowercase letter'))
  // .matches(/[0-9]+/, t('Password must contain at least one number'))
  // .matches(
  //   /[!@#$%^&*()\-_"=+{}; :,<.>]/,
  //   t('Password must contain at least one special character')
  // )
});

// const MAX_ATTEMPTS = 3; // Maximum allowed login attempts
// const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { axios } = useAxiosInterceptor();
  const {
    setName,
    setGuideName,
    setAccountId,
    openDialog3,
    setOpenDialog3,
    setCompanyProvidedPassword,
    setOpenDialog2
  } = useContext(AuthContext);
  // const [openDialog2, setOpenDialog2] = useState(true);
  // const { login, setSession } = useContext(AuthContext);
  const { login } = useAuth();

  const setSession = (accessToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [practiceName, setPracticeName] = useState(''); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState('');
  // const [attemptMessage, setAttemptMessage] = useState('');

  const [initialValues, setInitialValues] = useState({
    email: '',
    password: ''
  });

  // const [remainingAttempts, setRemainingAttempts] = useState(
  //   MAX_ATTEMPTS - (parseInt(localStorage.getItem('failedAttempts')) || 0)
  // );
  // const [isLocked, setIsLocked] = useState(false);
  // const [timer, setTimer] = useState(300); // 5 minutes countdown in seconds

  // !subscription Dialog
  //   const [openDialog, setOpenDialog] = useState(false);
  // const [dialogContent, setDialogContent] = useState({
  //     title: '',
  //     message: '',
  //     actionText: '',
  //     actionLink: '',
  // });

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');

    if (storedEmail && storedPassword) {
      setRememberMe(true);
      setInitialValues({ email: storedEmail, password: storedPassword });
    }
  }, []);

  useEffect(() => {
    // Disable back button on the login page
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null; // Clean up the effect
    };
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    // if (isLocked) return;
    setLoading(true); // Show loading spinner

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        toast.error(t('No internet connection'));
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // Call the login function
      const response = await login(values.email, values.password);
      // console.log(response, 'response on loginscreen');
      setName(response?.error?.emrName);
      setGuideName(response?.error?.emrDocumentation);
      setAccountId(response?.error?.client_AccountId);
      const errorMessage = response?.error?.message;

      if (!response.success) {
        if (
          errorMessage === 'Invalid Email ID or Password. Please try again!' ||
          errorMessage ===
            'Unauthorized domain. Please login with the correct domain.'
        ) {
          // setErrorMessage(
          //   `${errorMessage}    ${remainingAttempts - 1} attempts remaining.`
          // );
          // setAttemptMessage(`${remainingAttempts - 1} attempts remaining.`);
          setErrorMessage(errorMessage);
          // handleLoginFail();
        }
        //  !No subscription found for the customer
        // else if (errorMessage === 'No subscription found for the customer.') {
        //   // Show subscription renewal dialog
        //   setDialogContent({
        //     title: 'Subscription Expired',
        //     message: errorMessage,
        //     actionText: 'Renew Now',
        //     actionLink: '/account/pay-ment', // Adjust link as needed
        //   });
        //   setOpenDialog(true);
        // }
        else if (errorMessage === 'Client EMR details not found.') {
          // console.log("client emr condition");
          // Show EMR configuration dialog
          navigate('/account/emr-response');
          setOpenDialog2(true);
          // console.log('EMR connection not found. Please configure your EMR connection.');
        }
        // setSubmitting(false);
        setLoading(false);
        return; // Stop further execution if login fails
      }

      // If login is successful and authentication is verified
      if (response.fullRes?.message === 'Authentication successful.') {
        setCompanyProvidedPassword(
          response?.fullRes?.is_Company_provided_password
        );
        localStorage.setItem('userAdminEmail', values.email);
        localStorage.setItem('userAdminPassword', values.password);
         // Assume this is a UNIX timestamp in seconds
        localStorage.setItem('adminPortalSessionTime', response?.fullRes?.adminPortal_session_time);
        localStorage.setItem("sessionStartTime",new Date())
        // localStorage.setItem('adminPortalSessionTime', Date.now() + 1 * 60 * 1000); // 1 minutes from now
        localStorage.setItem('warningshown', 'false');
        localStorage.getItem('warningshown');


        const token = response.user;
        // console.log("token get",token);
        // Navigate to the dashboard
        toast.success(t('Login successful!'));
        navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');
        // Store token and user session
        setSession(token);

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
          localStorage.setItem('rememberedPassword', values.password);
          localStorage.removeItem('lockoutEndTime');
          localStorage.removeItem('failedAttempts');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
      }
    } catch (error) {
      // Fallback for truly unexpected errors
      // console.error('Unexpected error in handleSubmit:', error);
      //  toast.error(t('An unexpected error occurred. Please try again. catch'));
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();


// logo state
  const [logoUrl, setLogoUrl] = useState(null);

// get logo and practice name from the api
  useEffect(() => {
    axios
      .get('/adminLogin/getClientLogo')
      .then((response) => {
        // Extract base64 logo data and format it as a data URL
        const logoBase64 = response.data.logo;
        const practiceName = response.data.client_practiceName;
        if (logoBase64) {
          setLogoUrl(`data:image/jpeg;base64,${logoBase64}`);
        } else {
          setLogoUrl(null); // If no logo, set to null
        }
        setPracticeName(practiceName);
      })
      .catch((error) => {
        // console.error('Error fetching the logo:', error);
        setLogoUrl(null); // Set to null on error
      });
  }, []);

 

  // const handleNavigate = (resetForm) => {
  //   window.location.reload();
  //   resetForm();
  // }

  return (
    <>
      <Toaster position="bottom-right" />
      {loading && <Loader />}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container component="main" sx={{ height: '100vh' }}>
              <CssBaseline />
              <Grid
  item
  md={8}
  sx={{
    display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' },
    backgroundImage: `url(${Doctors})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }}
/>

              <Grid item xs={12} sm={12} md={4} elevation={6} square>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid
                    item
                    mt={4}
                    xs={4}
                    sm={4}
                    md={6}
                    sx={{
                      height: '70px',
                      mt: 8,
                      backgroundImage: logoUrl ? `url(${logoUrl})` : 'none', // Only show image if logoUrl is set
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      mr: { xs: 0, sm: 0, md: -2 }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    my: 4,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 1
                      }}
                    >
                      {practiceName}
                    </Typography>
                    {/* Display error message if it exists */}
                    {errorMessage && (
                      <Box
                        sx={{
                          mt: 2, 
                          px: 2, 
                          py: 1, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                          borderRadius: 1, 
                          border: '1px solid rgba(255, 0, 0, 0.3)'
                        }}
                      >
                        <ErrorIcon sx={{ color: 'rgb(237, 33, 33)', mr: 1 }} />{' '}
                        {/* Error icon with spacing */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgb(218, 50, 50)',
                            fontWeight: 500, 
                            textAlign: 'center'
                          }}
                        >
                          {errorMessage}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box component="div" noValidate sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="email"
                      label={t('Email')}
                      name="email"
                      autoComplete="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="password"
                      label={t('Password')}
                      type={showPassword ? 'text' : 'password'} 
                      id="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    </Grid>
                  </Grid>
                    
                    {/* Password Input Field with Toggle Visibility */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={t('Remember me')}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          mt: 1,
                          mb: 2,
                          width: '70%'
                        }}
                      >
                       {t("Sign In")}
                      </Button>
                    </Box>
                    <Grid container>
                      <Grid item xs={12}>
                        {' '}
                        <Link
                          component={RouterLink}
                          to="/account/forgot-password"
                          style={{ textDecoration: 'none', color: 'primary' }}
                        >
                          {' '}
                          <Typography variant="body1" color="primary">
                            {' '}
                            {t('Forgot Password?')}{' '}
                          </Typography>{' '}
                        </Link>{' '}
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Copyright sx={{ mt: 0 }} />
                      {t('Siddha AI')} {new Date().getFullYear()}
                    </Box>

                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Typography color="secondary">
                        {t('Version')} 0.0.25
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* // !subscribe Dialog for  Open Dialog 

      {openDialog && (
    <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{dialogContent.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                component={Link}
                to={dialogContent.actionLink}
                color="primary"
                variant="contained"
            >
                {dialogContent.actionText}
            </Button>
        </DialogActions>
    </Dialog>
)}

*/}

      <Dialog open={openDialog3} maxWidth="xs">
        <DialogActions sx={{ justifyContent: 'end' }}>
          <Button onClick={() => setOpenDialog3(false)} color="error">
            {/* <CloseIcon sx={{ color: 'red' }} />{' '} */}
            Close
          </Button>
        </DialogActions>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {/* Verified Icon */}
            <VerifiedIcon
              sx={{
                color: '#00d566',
                fontSize: 50,
                mt: -2 
              }}
            />

            <DialogTitle
              sx={{
                fontSize: '1.3rem',
                textAlign: 'center',
                fontWeight: 'bold',
                mt: 0
              }}
            >
              Congratulations..!
            </DialogTitle>

            <Typography sx={{ margin: '20px 0', fontSize: '1.1rem' }}>
              Your EMR is now seamlessly connected with Siddha PI
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
