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
import { verify } from 'src/utils/jwt';import useAuth from 'src/hooks/useAuth';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Copyright } from '@mui/icons-material';
import Doctors from '../../../../assets/Doctors.svg';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText
} from '@mui/material';
// import { Link } from 'react-router-dom';
import AuthContext from 'src/contexts/AuthContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
    /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
      t('Invalid email address')
    )
    .required(t('Email is required')),
  password: Yup.string()
    .required(t('Password is required'))
    .min(8, t('Password is too short - should be 8 chars minimum'))
    .max(13, t('Password is too long - should be 13 chars maximum'))
    .matches(/[a-zA-Z]/, t('Password can only contain Latin letters'))
    .matches(/[A-Z]/, t('Password must contain at least one uppercase letter'))
    .matches(/[a-z]/, t('Password must contain at least one lowercase letter'))
    .matches(/[0-9]+/, t('Password must contain at least one number'))
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      t('Password must contain at least one special character')
    )
});

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const isMountedRef = useRefMounted();
  const { axios } = useAxiosInterceptor();
  const {
    setName,
    setGuideName,
    setAccountId,
    openDialog3,
    setOpenDialog3
  } = useContext(AuthContext);
  const [openDialog2, setOpenDialog2] = useState(false);
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
  const [practiceName, setPracticeName] = useState(""); // State to toggle password visibility


  const [initialValues, setInitialValues] = useState({
    email: '',
    password: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    actionText: '',
    actionLink: '',
});

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

  // const handleSubmit = async (values, setSubmitting) => {
  //   setLoading(true); // Show loading spinner
  //   try {
  //     // Attempt login with provided credentials
  //     const response = await login(values.email, values.password);

  //     if (response.success && response.user) {
  //       const token = response.user;
  //       let accessToken = token;

  //       // Verify token and ensure it's valid before proceeding
  //       if (accessToken && verify(accessToken)) {
  //         // Successful login, navigate to dashboard
  //         toast.success(t('Login successful!'));
  //         setSession(accessToken);
  //         navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');

  //         // Store credentials if 'Remember Me' is checked
  //         if (rememberMe) {
  //           localStorage.setItem('rememberedEmail', values.email);
  //           localStorage.setItem('rememberedPassword', values.password);
  //         } else {
  //           localStorage.removeItem('rememberedEmail');
  //           localStorage.removeItem('rememberedPassword');
  //         }
  //       }
  //     } else {
  //       // Show error message if response is not successful (e.g., invalid credentials)
  //       toast.error(t('Invalid Email ID or Password. Please try again!'));
  //     }
  //   } catch (error) {
  //     // If error is 401 (Unauthorized), show invalid credentials message
  //     if (error.response?.status === 401) {
  //       // Specific handling for invalid credentials
  //       toast.error(t('Invalid Email ID or Password. Please try again!'));
  //     } else {
  //       // Handle other errors that are not 401
  //       toast.error(error.response?.data?.message || t('Login failed'));
  //     }

  //     setSubmitting(false); // Ensure form stops submitting
  //   } finally {
  //     setLoading(false); // Hide loading spinner
  //   }
  // };

  const handleSubmit = async (values) => {
    setLoading(true); // Show loading spinner
  
    try {
      // Call the login function
      const response = await login(values.email, values.password);
      console.log(response, 'response on loginscreen');
  
      const errorMessage = response?.error?.message;
      console.log(errorMessage, 'errorMessage');
  
      // Check if login was successful
      if (!response.success) {
        // Handle specific error messages
        if (
          errorMessage === 'Invalid Email ID or Password. Please try again!' ||
          errorMessage === 'Unauthorized domain. Please login with the correct domain.'
        ) {
          toast.error(errorMessage);
        } else if (errorMessage === 'No subscription found for the customer.') {
          console.log("no subs condition");
          // Show subscription renewal dialog
          setDialogContent({
            title: 'Subscription Expired',
            message: errorMessage,
            actionText: 'Renew Now',
            actionLink: '/account/pay-ment', // Adjust link as needed
          });
          setOpenDialog(true);
        } else if (errorMessage === 'Client EMR details not found.') {
          // Show EMR configuration dialog
          setOpenDialog2(true);
          console.log('EMR connection not found. Please configure your EMR connection.');
        } else {
          // Fallback for unexpected errors
          // toast.error(t('An unexpected error occurred. Please try again.'));
        }
        // setSubmitting(false);
        setLoading(false);
        return; // Stop further execution if login fails
      }
  
      // If login is successful and authentication is verified
      if (errorMessage === 'Authentication successful.') {
        const token = response.user;
        // Navigate to the dashboard
        toast.success(t('Login successful!'));
        navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');
        // Store token and user session
        setSession(token);
  
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
          localStorage.setItem('rememberedPassword', values.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
      }
    } catch (error) {
       // Fallback for truly unexpected errors
       console.error('Unexpected error in handleSubmit:', error);
       toast.error(t('An unexpected error occurred. Please try again. catch'));
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [logoUrl, setLogoUrl] = useState(null);

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
        setPracticeName(practiceName)
      })
      .catch((error) => {
        console.error('Error fetching the logo:', error);
        setLogoUrl(null); // Set to null on error
      });
  }, []);


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
                mt={4}
                md={7}
                sx={{
                  display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                  backgroundImage: `url(${Doctors})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              <Grid item xs={12} sm={10} md={4} elevation={6} square>
              <Box sx={{display:"flex", justifyContent:"center"}}>
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
                    backgroundPosition: 'center center'
                  }}
                />
                </Box>
 <Typography variant="h5" align="center" sx={{ mt: 2 }}>
        {practiceName}
      </Typography>                
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
                      variant="h2"
                      sx={{
                        mb: 1
                      }}
                    >
                      {t('Sign in')}
                    </Typography>
                  </Box>
                  <Box component="div" noValidate sx={{ mt: 1 }}>
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

                    {/* Password Input Field with Toggle Visibility */}
                    <TextField
                      margin="normal"
                      fullWidth
                      name="password"
                      label={t('Password')}
                      type={showPassword ? 'text' : 'password'} // Toggle between text and password
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
                      {t('Sign In')}
                    </Button>
                    </Box>
                   
                    <Grid container>
                      <Grid item xs>
                        <Link
                          component={RouterLink}
                          to="/account/forgot-password"
                        >
                          <b>{t('Forgot password?')}</b>
                        </Link>
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
                        {t('Version')} 0.0.7
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      
      {/* Dialog for Open Dialog */}

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



      <Dialog open={openDialog2} maxWidth="xs" sx={{  backgroundColor: 'rgb(255, 255, 255)', // Semi-transparent white background
    backdropFilter: 'blur(10px)', // Apply blur effect to background
    }}>
  
        <DialogTitle
          sx={{
            fontSize: '1.2rem',
            textAlign: 'center',
            fontWeight: 'bold',
            mt: 2
          }}
        >
          Configure Your EMR First!
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {/* Yellow Error Icon */}
            <ErrorIcon sx={{ color: '#f2c94c', fontSize: 50 }} />

            {/* Text Content */}
            <Typography variant="h6" sx={{ margin: '20px 0' }}>
              The Siddha PI web app must integrate with an EMR system to
              efficiently manage and expand the patient intake process.
            </Typography>

            {/* Button */}

            {/* <Button variant="contained" color="primary" onClick={() => setOpenDialog2(false)}>
            Configure
          </Button> */}
            <Link
              to="/account/emr-configure"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="contained" color="primary">
                Configure
              </Button>
            </Link>
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setOpenDialog2(false)} color="primary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>

      <Dialog open={openDialog3} maxWidth="xs">
        <DialogActions sx={{ justifyContent: 'end' }}>
          <Button onClick={() => setOpenDialog3(false)} color="primary">
            <CloseIcon sx={{ color: 'red' }} />{' '}
            {/* Set the icon color to red */}
          </Button>
        </DialogActions>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            // mt={2} // Add margin to space content from the top
          >
            {/* Verified Icon */}
            <VerifiedIcon
              sx={{
                color: '#00d566',
                fontSize: 50,
                mt: -2 // Add margin below the icon to space it from the title
              }}
            />

            {/* Dialog Title */}
            <DialogTitle
              sx={{
                fontSize: '1.3rem',
                textAlign: 'center',
                fontWeight: 'bold',
                mt: 0 // Ensure no extra margin on the top
              }}
            >
              Congratulations..!
            </DialogTitle>

            {/* Text Content */}
            <Typography sx={{ margin: '20px 0', fontSize: '1.1rem' }}>
              Your EMR is now seamlessly connected with Siddha PI
            </Typography>


              <Link
                to="/"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="contained" color="info">
                 Login
                </Button>
              </Link>
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
      </Dialog>
    </>
  );
}
