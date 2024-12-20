// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import ForgetPasswordEmailImg from '../../../../assets/EnterOTP.svg';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { ApiUrl } from 'src/content/SiddhaAI/ApiUrl';
// import Loader from '../Loader/Loader';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import { useTranslation } from 'react-i18next';

// /* Validation schema */
// const validationSchema = Yup.object({
//   email: Yup.string()
//     .matches(
//       /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
//       'Invalid email address'
//     )
//     .required('Email is required'),
//   otp: Yup.string().required('OTP is required').max(6, 'Maximum 6 number')
// });

// export default function ForgetPasswordEmail() {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();

//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(0); // Timer state
//   const [otpSent, setOtpSent] = useState(false); // OTP sent state
//   const [otpExpired, setOtpExpired] = useState(false); // OTP expired state

//   // Timer countdown logic
//   useEffect(() => {
//     let countdown;
//     if (timer > 0) {
//       countdown = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (timer === 0 && otpSent) {
//       setOtpExpired(true); // OTP expired
//     }

//     return () => clearInterval(countdown);
//   }, [timer, otpSent]);

//   // Handle sending OTP
//   const handleSendOtp = async (email) => {
//     if (!email) {
//       toast.error(t('Please enter your email'));
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(`/admin/forgotPassword`, {
//         email
//       });

//       if (response.status === 200) {
//         toast.success(t('OTP sent successfully'));
//         setOtpSent(true);
//         setOtpExpired(false);
//         setTimer(60); // Start 1-minute countdown
//       } else {
//         toast.error(t('Failed to send OTP, please try again'));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || t('Something went wrong'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle OTP verification
//   const handleSubmitOtp = async (values, { setSubmitting }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`/admin/otpVerify`, {
//         email: values.email,
//         otp: parseInt(values.otp)
//       });

//       if (response.status === 200) {
//         toast.success(t('OTP is Validate Successfully!'), { duration: 3000 });
//         setTimeout(() => {
//           navigate('/account/password-reset', {
//             state: { email: values.email }
//           });
//         }, 1000);
//       } else {
//         toast.error(t('Invalid OTP, please try again'));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || t('Something went wrong'));
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <Toaster position="bottom-right" />
//       {loading && <Loader />}
//       <Formik
//         initialValues={{
//           email: '',
//           otp: ''
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmitOtp}
//       >
//         {({
//           handleSubmit,
//           handleChange,
//           handleBlur,
//           values,
//           touched,
//           errors,
//           isSubmitting
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Grid container component="main" sx={{ height: '100vh' }}>
//               <CssBaseline />
//               <Grid
//                 item
//                 xs={false}
//                 sm={4}
//                 md={7}
//                 sx={{
//                   backgroundImage: `url(${ForgetPasswordEmailImg})`,
//                   backgroundRepeat: 'no-repeat',
//                   backgroundSize: 'contain'
//                 }}
//               />
//               <Grid
//                 item
//                 xs={12}
//                 sm={8}
//                 md={5}
//                 component={Paper}
//                 elevation={6}
//                 square
//               >
//                 <Box
//                   sx={{
//                     my: 8,
//                     mx: 4,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center'
//                   }}
//                 >
//                   <Box>
//                     <Typography component="h1" variant="h5">
//                       {t('Forgot Password')}
//                     </Typography>
//                     <Typography component="span" variant="subtitle1">
//                       {t('Please enter your registered Email for verification')}
//                       <br />
//                       {t(
//                         'We will send a One-Time Password (OTP) to your Email'
//                       )}
//                     </Typography>
//                   </Box>
//                   <Box component="div" noValidate sx={{ mt: 1 }}>
//                     {/* Email Input Field */}
//                     <TextField
//                       id="email"
//                       name="email"
//                       type="email"
//                       label={t('Email')}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       value={values.email}
//                       error={touched.email && Boolean(errors.email)}
//                       helperText={touched.email && errors.email}
//                       disabled={isSubmitting || loading || otpSent}
//                       fullWidth
//                       margin="normal"
//                     />

//                     {/* Send OTP Button */}
//                     {!otpSent && (
//                       <Button
//                         onClick={() => handleSendOtp(values.email)}
//                         variant="contained"
//                         sx={{
//                           mt: 3,
//                           mb: 2
//                         }}
//                         disabled={loading || isSubmitting}
//                       >
//                         {t('Send OTP')}
//                       </Button>
//                     )}

//                     {/* OTP Timer and Resend OTP Button */}
//                     {otpSent && (
//                       <>
//                         {otpExpired ? (
//                           <Button
//                             onClick={() => handleSendOtp(values.email)}
//                             variant="contained"
//                             sx={{
//                               mt: 3,
//                               mb: 2
//                             }}
//                             disabled={loading || isSubmitting}
//                           >
//                             {t('Resend OTP')}
//                           </Button>
//                         ) : (
//                           <Typography
//                             variant="body2"
//                             sx={{ display: 'none', mt: 2, mb: 2 }}
//                           >
//                             {t('Resend OTP in', { timer })}
//                           </Typography>
//                         )}

//                         {/* OTP Input Field */}
//                         <TextField
//                           id="otp"
//                           name="otp"
//                           type="text"
//                           label={t('OTP')}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.otp}
//                           error={touched.otp && Boolean(errors.otp)}
//                           helperText={touched.otp && errors.otp}
//                           disabled={isSubmitting}
//                           fullWidth
//                           margin="normal"
//                         />

//                         {/* Verify OTP Button */}
//                         <Button
//                           type="submit"
//                           fullWidth
//                           variant="contained"
//                           sx={{
//                             mt: 3,
//                             mb: 2
//                           }}
//                           disabled={isSubmitting || loading}
//                         >
//                           {t('Verify OTP')}
//                         </Button>
//                       </>
//                     )}
//                   </Box>
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ForgetPasswordEmailImg from '../../../../assets/EnterOTP.svg';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { useTranslation } from 'react-i18next';
import SendIcon from '@mui/icons-material/Send';

/* Validation schema */
const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
      'Invalid email address'
    )
    .required('Email is required'),
  otp: Yup.string().required('OTP is required').max(6, 'Maximum 6 number')
});

export default function ForgetPasswordEmail() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer state
  const [otpSent, setOtpSent] = useState(false); // OTP sent state
  const [otpExpired, setOtpExpired] = useState(false); // OTP expired state


  // Timer countdown logic
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpExpired(true); // OTP expired
    }

    return () => clearInterval(countdown);
  }, [timer, otpSent]);

  // Handle sending OTP
  const handleSendOtp = async (email) => {
    if (!email) {
      toast.error(t('Please enter your email'));
      return;
    }
     // Check network connectivity
     if (!navigator.onLine) {
      toast.error(t('No internet connection'));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/admin/forgotPassword`, {
        email
      });

      console.log('response send otp', response);

      if (response.status === 200) {
        toast.success(t('OTP sent successfully'));
        setOtpSent(true);
        setOtpExpired(false);
        setTimer(60); // Start 1-minute countdown
      } else {
        toast.error(t('Failed to send OTP, please try again'));
      }
    } catch (error) {
      // console.log('error otp send', error);
      toast.error(error.response?.data?.message || t('Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleSubmitOtp = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(`/admin/otpVerify`, {
        email: values.email,
        otp: parseInt(values.otp)
      });
console.log("response otp verify",response);
      if (response.status === 200) {
        toast.success(t('OTP is Validate Successfully!'), { duration: 3000 });
        setTimeout(() => {
          navigate('/account/password-reset', {
            state: { email: values.email }
          });
        }, 1000);
      } else {
        toast.error(t('Invalid OTP, please try again'));
      }
    } catch (error) {
      console.log('error otp verify', error);
      toast.error(error?.response?.data?.message || t('Something went wrong'));
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3%' }}>
      <Toaster position="bottom-right" />
      {loading && <Loader />}
      <Formik
        initialValues={{
          email: '',
          otp: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitOtp}
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
        display: { xs: 'none', md: 'flex' }, // Image section hidden on small screens
        backgroundImage: `url(${ForgetPasswordEmailImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain', // Ensures image scales properly
        backgroundPosition: 'center', // Centers the image
        height: '100%', // Full height
        width: '100%', // Full width
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
        alignItems: 'center', // Centers the form horizontally and vertically
        height: { xs: 'auto', md: '80%' }, // Auto height on small screens, centered card on medium+
        width: { xs: '100%', md: '70%', lg: '60%' }, // Control card width
        margin: 'auto', // Align the card to center
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          maxWidth: { xs: '100%', md: '400px' }, // Responsive max width for the form
          width: '100%', // Full width

        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          {t('Forgot Password')}
        </Typography>
        <Typography component="p" variant="subtitle1" sx={{ mb: 3 }}>
          {t('Please enter your registered Email for verification.')}
          <br />
          {t('We will send a One-Time Password (OTP) to your Email.')}
        </Typography>

        <Box component="div" noValidate sx={{ width: '100%' }}>
          {/* Email Input Field */}
          <TextField
            id="email"
            name="email"
            type="email"
            label={t('Email')}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            disabled={isSubmitting || loading || otpSent}
            fullWidth
            margin="normal"
          />

          {/* Send OTP Button */}
          {!otpSent && (
            <Button
              onClick={() => handleSendOtp(values.email)}
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                width: { xs: '40%' }, // Responsive width
                maxWidth: '400px',
              }}
              disabled={loading || isSubmitting}
            >
            <SendIcon size="24" sx={{ pr: 1 }} />
              {t('Send OTP')}
            </Button>
          )}

          {/* OTP Timer and Resend Button */}
          {otpSent && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
             {otpExpired && (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-start', // Aligns the button to the right
      width: '100%', // Ensures proper alignment responsiveness
      mt: 2, // Adds top margin for spacing
    }}
  >
    <Button
      onClick={() => handleSendOtp(values.email)}
      variant="contained"
      sx={{
        width: { xs: '40%' }, // Responsive width for button
      }}
      disabled={loading || isSubmitting}
    >
      {t('Resend OTP')}
    </Button>
  </Box>
)}

              </Box>

              {/* OTP Input Field */}
              <TextField
                id="otp"
                name="otp"
                type="text"
                label={t('OTP')}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.otp}
                error={touched.otp && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                disabled={isSubmitting}
                fullWidth
                margin="normal"
              />

              {/* Verify OTP Button */}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: { xs: '40%' },
                }}
                disabled={isSubmitting || loading}
              >
                {t('Verify OTP')}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Grid>
  </Grid>
</form>


        )}
      </Formik>
    </div>
  );
}
