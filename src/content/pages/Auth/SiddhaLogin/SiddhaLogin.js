import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
import { Link, Link as RouterLink } from 'react-router-dom';

// import Paper from "@mui/material/Paper";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import Signin from '../../../static/images/SiddhaAI/signin.svg';
// import ClientLogo from '../../../static/images/SiddhaAI/clientLogo.png';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AuthContext from 'src/contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
// import axios from 'axios';
// import { ApiUrl } from 'src/content/SiddhaAI/ApiUrl';
import Loader from '../Loader/Loader';

// Import necessary components for the eye icon
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

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email address'
    )
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .max(13, 'Password is too long - should be 13 chars maximum')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]+/, 'Password must contain at least one number.')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must contain at least one special character.'
    )
});

export default function Login() {
  const navigate = useNavigate();
  const isMountedRef = useRefMounted();
  const { axios } = useAxiosInterceptor();

  // const { login, setSession } = useContext(AuthContext);
  const { login } = useAuth();

  const setSession = (accessToken) => {
    // console.log(accessToken, 'inside setsession');

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

  // const handleSubmit = async (values) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${ApiUrl}/adminLogin`,
  //       {},
  //       {
  //         headers: {
  //           username: values.email,
  //           password: values.password
  //         }
  //       }
  //     );
  //     if (response.status === 200) {
  //       const { token } = response.data;
  //       toast.success('Login successful!');
  //       localStorage.setItem('token', token);

  //       if (rememberMe) {
  //         localStorage.setItem('rememberedEmail', values.email);
  //         localStorage.setItem('rememberedPassword', values.password);
  //       } else {
  //         localStorage.removeItem('rememberedEmail');
  //         localStorage.removeItem('rememberedPassword');
  //       }

  //       login();
  //       navigate('/extended-sidebar/SiddhaAI/DashBoard/DashBoard');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error.message);
  //     toast.error(error.response?.data?.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    // console.log('inside handleSubmit', values);

    setLoading(true);
    try {
      // console.log('inside try');

      const response = await login(
        values.email,
        values.password
        // rememberMe
        // {},
        // {
        //   headers: {
        //     username: values.email,
        //     password: values.password,
        //     'Content-Type': 'application/json'
        //   }
        // }
      );
      // console.log('response inside try', response);

      if (response.success && response.user) {
        // console.log('inside if');

        const token = response.user;
        // console.log('token inside if', token);

        let accessToken = token;
        if (accessToken && verify(accessToken)) {
          // console.log('inside if if accessToken', accessToken);

          toast.success('Login successful!');
          setSession(accessToken);
          // localStorage.setItem('RoleIdForSideBar', response.user.roleId);
          navigate('/extended-sidebar/SiddhaAI/Dashboard/Dashboard');
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', values.email);
            localStorage.setItem('rememberedPassword', values.password);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
          }
        }
      } else {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    } catch (error) {
      // console.error('Error during login:', error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
                  // backgroundImage: 'url(/static/images/SiddhaAI/signin.svg)',
                  backgroundImage: `url(${Doctors})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              <Grid item xs={12} sm={10} md={6} elevation={6} square>
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: '70px',
                    ml: 15,
                    mt: 8,
                    backgroundImage:
                      'url(/static/images/SiddhaAI/clientLogo.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
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
                      label="Email"
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
                      label="Password"
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
                      label="Remember me"
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2
                        // backgroundColor: '#407bff',
                        // '&:hover': {
                        //   backgroundColor: '#12171e',
                        //   transition: 'background-color 0.3s ease'
                        // }
                      }}
                    >
                      Sign In
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
                      Siddha AI {new Date().getFullYear()}
                    </Box>

                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Typography color="secondary">Version 0.0.1</Typography>
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
