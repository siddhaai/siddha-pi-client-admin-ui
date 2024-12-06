// import { useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { IconButton, InputAdornment } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import ResetPasswordImg from '../../../../assets/ResetPWD.svg';
// import { useLocation, useNavigate } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
// import Loader from '../Loader/Loader';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import { useTranslation } from 'react-i18next';
// import { t } from 'i18next';

// /* Validation schema */
// const validationSchema = Yup.object({
//   password: Yup.string()
//     .required(t('Password is required'))
//     .min(8, t('Password is too short - should be 8 chars minimum'))
//     .max(13, t('Password is too long - should be 13 chars maximum'))
//     .matches(/[a-zA-Z]/, t('Password can only contain Latin letters'))
//     .matches(/[A-Z]/, t('Password must contain at least one uppercase letter'))
//     .matches(/[a-z]/, t('Password must contain at least one lowercase letter'))
//     .matches(/[0-9]+/, t('Password must contain at least one number'))
//     .matches(
//       /[!@#$%^&*()\-_"=+{}; :,<.>]/,
//       t('Password must contain at least one special character')
//     ),
//   confirmPassword: Yup.string()
//     .required(t('Confirm Password is required'))
//     .oneOf(
//       [Yup.ref('password'), null],
//       t('Confirm password must match with new password')
//     )
// });

// export default function ResetPassword() {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation(); // Access the passed state
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { email } = location.state || {};

//   // console.log(email);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`/admin/resetPassword`, {
//         newPassword: values.password,
//         email
//       });

//       if (response.status === 200) {
//         toast.success(t('Password reset successfully'), { duration: 2000 });
//         setTimeout(() => {
//           navigate('/');
//         }, 2000);
//       } else {
//         toast.error(t('Please try again'));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || t('Something went wrong'));
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={{
//         password: '',
//         confirmPassword: ''
//       }}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({
//         handleSubmit,
//         handleChange,
//         handleBlur,
//         values,
//         touched,
//         errors,
//         isSubmitting
//       }) => (
//         <form onSubmit={handleSubmit}>
//           {/* <style>{loaderStyles}</style> */}
//           <Toaster position="bottom-right" />
//           {loading && <Loader />}
//           <Grid container component="main" sx={{ height: '100vh' }}>
//             <CssBaseline />
//             <Grid
//               item
//               xs={false}
//               sm={4}
//               md={7}
//               sx={{
//                 backgroundImage: `url(${ResetPasswordImg})`,
//                 backgroundRepeat: 'no-repeat',
//                 backgroundSize: 'contain'
//               }}
//             />
//             <Grid
//               item
//               xs={12}
//               sm={8}
//               md={5}
//               component={Paper}
//               elevation={6}
//               square
//             >
//               <Box
//                 sx={{
//                   my: 8,
//                   mx: 4,
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center'
//                 }}
//               >
//                 <Typography component="h1" variant="h5">
//                   {t('Reset Password')}
//                 </Typography>
//                 <Box component="div" noValidate sx={{ mt: 1 }}>
//                   <TextField
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     label={t('New Password')}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={values.password}
//                     error={touched.password && Boolean(errors.password)}
//                     helperText={touched.password && errors.password}
//                     disabled={isSubmitting}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             onClick={() => setShowPassword(!showPassword)}
//                             edge="end"
//                           >
//                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />
//                   <TextField
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     label={t('Confirm Password')}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={values.confirmPassword}
//                     error={
//                       touched.confirmPassword && Boolean(errors.confirmPassword)
//                     }
//                     helperText={
//                       touched.confirmPassword && errors.confirmPassword
//                     }
//                     disabled={isSubmitting}
//                     fullWidth
//                     margin="normal"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             onClick={() =>
//                               setShowConfirmPassword(!showConfirmPassword)
//                             }
//                             edge="end"
//                           >
//                             {showConfirmPassword ? (
//                               <VisibilityOff />
//                             ) : (
//                               <Visibility />
//                             )}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{
//                       mt: 3,
//                       mb: 2
//                     }}
//                     disabled={isSubmitting}
//                   >
//                     {t('Submit')}
//                   </Button>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       )}
//     </Formik>
//   );
// }


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
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

/* Validation schema */
const validationSchema = Yup.object({
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
    ),
  confirmPassword: Yup.string()
    .required(t('Confirm Password is required'))
    .oneOf(
      [Yup.ref('password'), null],
      t('Confirm password must match with new password')
    )
});

export default function ResetPassword() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Access the passed state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email } = location.state || {};

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      if (!navigator.onLine) {
        toast.error(t('No internet connection'));
        setSubmitting(false);
        setLoading(false);
        return;
      }

      const response = await axios.post(`/admin/resetPassword`, {
        newPassword: values.password,
        email
      });

      if (response.status === 200) {
        toast.success(t('Password reset successfully'), { duration: 2000 });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(t('Please try again'));
      }
    } catch (error) {
      if (!navigator.onLine) {
        toast.error(t('No internet connection'));
      } else {
        toast.error(error.response?.data?.message || t('Something went wrong'));
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
  initialValues={{
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
      <Toaster position="bottom-right" />
      {loading && <Loader />}
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* Image Section */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          lg={7}
          sx={{
            display: { xs: 'none', md: 'flex' }, // Image section only visible for md and larger
            backgroundImage: `url(${ResetPasswordImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        {/* Form Section */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: 'auto', md: '80%' }, // Center the card in md view
            width: { xs: '100%', md: '70%', lg: '60%' }, // Control card size
            margin: 'auto', // Align card to center
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              maxWidth: { xs: '100%', md: '400px' }, // Responsive max width
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5">
              {t('Reset Password')}
            </Typography>
            <Box component="div" noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label={t('New Password')}
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
                label={t('Confirm Password')}
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
              {/* Centered and responsive button */}
              <Box
                sx={{
                  display: 'flex',
                  width: '100%', // Ensures full-width container
                  mt: 3,
                  mb: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: { xs:'40%' }, // Responsive width
                    maxWidth: '400px', // Optional: max width limit
                  }}
                  disabled={isSubmitting}
                >
                  {t('Submit')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  )}
</Formik>

  );
}
