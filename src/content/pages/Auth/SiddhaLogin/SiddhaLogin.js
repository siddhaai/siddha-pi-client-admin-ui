import React, { useState, useEffect } from 'react';
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
import { verify } from 'src/utils/jwt';
import useRefMounted from 'src/hooks/useRefMounted';
import useAuth from 'src/hooks/useAuth';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Copyright } from '@mui/icons-material';
import Doctors from '../../../../assets/Doctors.svg';
import { useTranslation } from 'react-i18next';

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

  const [initialValues, setInitialValues] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (values, setSubmitting) => {
    setLoading(true); // Show loading spinner
    try {
      // Attempt login with provided credentials
      const response = await login(values.email, values.password);
  
      if (response.success && response.user) {
        const token = response.user;
        let accessToken = token;
  
        // Verify token and ensure it's valid before proceeding
        if (accessToken && verify(accessToken)) {
          // Successful login, navigate to dashboard
          toast.success(t('Login successful!'));
          setSession(accessToken);
          navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');
  
          // Store credentials if 'Remember Me' is checked
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', values.email);
            localStorage.setItem('rememberedPassword', values.password);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
          }
        }
      } else {
        // Show error message if response is not successful (e.g., invalid credentials)
        toast.error(t('Invalid Email ID or Password. Please try again!'));
      }
  
    } catch (error) {
      // If error is 401 (Unauthorized), show invalid credentials message
      if (error.response?.status === 401) {
        // Specific handling for invalid credentials
        toast.error(t('Invalid Email ID or Password. Please try again!'));
      } else {
        // Handle other errors that are not 401
        toast.error(error.response?.data?.message || t('Login failed'));
      }
  
      setSubmitting(false); // Ensure form stops submitting
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

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
                xs={false}
                sm={4}
                md={6}
                sx={{
                  backgroundImage: `url(${Doctors})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              <Grid item xs={12} sm={10} md={6} elevation={6} square>
                <Grid
                  item
                  mt={4}
                  xs={4}
                  sm={4}
                  md={6}
                  sx={{
                    height: '70px',
                    ml: 15,
                    mt: 8,
                    backgroundImage:
                      'url(/static/images/SiddhaAI/clientLogo.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center'
                  }}
                />
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
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2
                      }}
                    >
                      {t('Sign In')}
                    </Button>
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
                        {t('Version')} 0.0.6
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
