import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AuthContext from 'src/contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ApiUrl } from '../ApiUrl';
import Loader from '../Loader/Loader';

// Import necessary components for the eye icon
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useRefMounted from 'src/hooks/useRefMounted';
import { verify } from 'src/utils/jwt';
import useAuth from 'src/hooks/useAuth';

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

  const { login, setSession } = useAuth();
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
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error.message);
  //     toast.error(error.response?.data?.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (values, setSubmitting) => {
    setLoading(true);
    try {
      const response = await login(values?.email, values?.password);
      console.log(response, 'response on loginscreen');

      // console.log(response.user);
      if (response.success && response.token) {
        let accessToken = response.token;
        if (accessToken && verify(accessToken)) {
          toast.success('Login successful!');

          if (rememberMe) {
            localStorage.setItem('rememberedEmail', values.email);
            localStorage.setItem('rememberedPassword', values.password);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
          }

          setSession(accessToken);
          // localStorage.setItem('RoleIdForSideBar', response.user.roleId);
          // navigate('src/content/SiddhaAI/DashBoard/DashBoard');
          navigate(
            '/extended-sidebar/src/content/SiddhaAI/DashBoard/DashBoard'
          );
        }
      } else {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      console.error('Error during login:', error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <Toaster position="bottom-left" />
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
                xs={12}
                sx={{
                  height: '70px',
                  marginLeft: '7px',
                  marginTop: '7px',
                  backgroundImage:
                    'url(/static/images/SiddhaAI/clientLogo.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                  backgroundImage: 'url(/static/images/SiddhaAI/signin.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              <Grid item xs={12} sm={10} md={6} elevation={6} square>
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
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
                        mb: 2,
                        backgroundColor: '#407bff',
                        '&:hover': {
                          backgroundColor: '#12171e',
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href="/forget-password" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                    </Grid>
                    {/* <Copyright sx={{ mt: 5 }} /> */}
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
