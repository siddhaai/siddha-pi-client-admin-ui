import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ResetPasswordImg from '../../../../assets/ResetPWD.svg';
import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
// import { ApiUrl } from '../ApiUrl';
// import { ApiUrl } from 'src/content/SiddhaAI/ApiUrl';
import Loader from '../../../SiddhaAI/Loader/Loader';
import useAxiosInterceptor from 'src/contexts/Interceptor';

/* Validation schema */
const validationSchema = Yup.object({
  // email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .max(13, 'Password is too long - should be 13 chars maximum.')
    // .matches(/[a-zA-Z]/, "Password can only contain Alpha letters.")
    .matches(/[a-zA-Z]/, 'Password must contain only alphabetic characters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]+/, 'Password must contain at least one number.')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must contain at least one special character.'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf(
      [Yup.ref('password'), null],
      'Confirm password must match with new password'
    )
});

// const loaderStyles = `
// .loader {
//   width: 40px;
//   height: 40px;
//   position: relative;
//   --c: no-repeat linear-gradient(#407bff 0 0);
//   background: var(--c) center/100% 10px, var(--c) center/10px 100%;
// }

// .loader:before {
//   content: "";
//   position: absolute;
//   inset: 0;
//   background: var(--c) 0 0, var(--c) 100% 0, var(--c) 0 100%, var(--c) 100% 100%;
//   background-size: 15.5px 15.5px;
//   animation: l16 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
// }

// @keyframes l16 {
//   33% {
//     inset: -10px;
//     transform: rotate(0deg);
//   }
//   66% {
//     inset: -10px;
//     transform: rotate(90deg);
//   }
//   100% {
//     inset: 0;
//     transform: rotate(90deg);
//   }
// }

// .loader-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 9999;
// }
// `;

export default function ResetPassword() {
  const { axios } = useAxiosInterceptor();

  const navigate = useNavigate();
  const location = useLocation(); // Access the passed state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email } = location.state || {};

  // console.log(email);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(`/admin/resetPassword`, {
        newPassword: values.password,
        email
      });

      if (response.status === 200) {
        toast.success('password reset successfully', { duration: 2000 });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('please try again');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        // email: "",
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          {/* <style>{loaderStyles}</style> */}
          <Toaster position="bottom-right" />
          {loading && <Loader />}
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${ResetPasswordImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
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
                  Reset Password
                </Typography>
                <Box component="div" noValidate sx={{ mt: 1 }}>
                  <TextField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isSubmitting}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    disabled={isSubmitting}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2
                      //  background: '#407BFF'
                    }}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
