// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import { Formik, Field, Form } from 'formik';
// import * as Yup from 'yup';
// import toast, { Toaster } from 'react-hot-toast';
// import CircularProgress from '@mui/material/CircularProgress';
// import useAxiosInterceptor from 'src/contexts/Interceptor';

// // API URLs
// const LoginApiUrl = '/adminLogin';
// const FileUploadApiUrl =
//   'http://ec2-44-207-188-40.compute-1.amazonaws.com:8000/ai';

// // Validation schemas using Yup
// const loginValidationSchema = Yup.object({
//   username: Yup.string().required('Username is required'),
//   password: Yup.string().required('Password is required')
// });

// const fileValidationSchema = Yup.object({
//   file: Yup.mixed().required('A file is required')
// });

// const FileUpload = () => {
//   const { axios } = useAxiosInterceptor();
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [authHeaders, setAuthHeaders] = useState({});

//   // Function to handle login form submission
//   const handleLogin = async (values, { setSubmitting }) => {
//     try {
//       const result = await axios.post(LoginApiUrl, {}, {
//         headers: {
//           Username: values.username,
//           Password: values.password
//         }
//       });

//       if (result.status === 200) {
//         toast.success('Login successful!');
//         setIsLoggedIn(true);
//         setAuthHeaders({
//           Authorization: `Bearer ${result.data.token}`
//         });
//       } else {
//         toast.error('Login failed.');
//       }
//     } catch (error) {
//       toast.error('Login failed.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Function to handle file upload form submission
//   const handleSubmit = async (values, { setSubmitting }) => {
//     const formData = new FormData();
//     formData.append('file', values.file);

//     setLoading(true);

//     try {
//       const result = await axios.post(FileUploadApiUrl, formData, {
//         headers: {
//           ...authHeaders,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       const [jsonData, processingTime] = result.data;
//       const parsedData = JSON.parse(jsonData);

//       setResponse({ data: parsedData, time: processingTime });
//       toast.success('File uploaded successfully!');
//     } catch (error) {
//       toast.error('Failed to upload file.');
//       setResponse(null);
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   // Function to handle file input change
//   const handleFileChange = (event, setFieldValue) => {
//     const file = event.currentTarget.files[0];
//     setFieldValue('file', file);
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <Box
//       component="main"
//       sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f4f8' }}
//     >
//       <CssBaseline />
//       <Grid
//         container
//         spacing={3}
//         justifyContent="center"
//         sx={{ minHeight: '100vh', alignItems: 'center' }}
//       >
//         {!isLoggedIn ? (
//           <Grid item xs={12} md={5}>
//             <Paper
//               elevation={8}
//               sx={{
//                 padding: 4,
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
//                 borderRadius: '12px'
//               }}
//             >
//               <Typography
//                 variant="h4"
//                 component="h1"
//                 gutterBottom
//                 color="#0277bd"
//                 textAlign="center"
//               >
//                 Login
//               </Typography>
//               <Formik
//                 initialValues={{ username: '', password: '' }}
//                 validationSchema={loginValidationSchema}
//                 onSubmit={handleLogin}
//               >
//                 {({ isSubmitting }) => (
//                   <Form>
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center'
//                       }}
//                     >
//                       <Field
//                         name="username"
//                         type="text"
//                         placeholder="Username"
//                         style={{
//                           marginBottom: '20px',
//                           width: '100%',
//                           padding: '10px',
//                           borderRadius: '8px',
//                           border: '2px solid #0277bd'
//                         }}
//                       />
//                       <Field
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         style={{
//                           marginBottom: '20px',
//                           width: '100%',
//                           padding: '10px',
//                           borderRadius: '8px',
//                           border: '2px solid #0277bd'
//                         }}
//                       />
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         disabled={isSubmitting}
//                         sx={{
//                           mt: 2,
//                           backgroundColor: '#0277bd',
//                           '&:hover': { backgroundColor: '#01579b' }
//                         }}
//                       >
//                         Login
//                       </Button>
//                     </Box>
//                   </Form>
//                 )}
//               </Formik>
//             </Paper>
//           </Grid>
//         ) : (
//           <>
//             <Grid item xs={12} md={5}>
//               <Paper
//                 elevation={8}
//                 sx={{
//                   padding: 4,
//                   backgroundColor: '#ffffff',
//                   boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
//                   borderRadius: '12px'
//                 }}
//               >
//                 <Typography
//                   variant="h4"
//                   component="h1"
//                   gutterBottom
//                   color="#0277bd"
//                   textAlign="center"
//                 >
//                   Upload and Capture
//                 </Typography>
//                 <Formik
//                   initialValues={{ file: null }}
//                   validationSchema={fileValidationSchema}
//                   onSubmit={handleSubmit}
//                 >
//                   {({ setFieldValue, isSubmitting }) => (
//                     <Form>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           flexDirection: 'column',
//                           alignItems: 'center'
//                         }}
//                       >
//                         <input
//                           type="file"
//                           name="file"
//                           accept="image/*"
//                           onChange={(event) =>
//                             handleFileChange(event, setFieldValue)
//                           }
//                           style={{
//                             marginBottom: '20px',
//                             width: '100%',
//                             padding: '10px',
//                             borderRadius: '8px',
//                             border: '2px solid #0277bd'
//                           }}
//                         />
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           color="primary"
//                           disabled={isSubmitting}
//                           sx={{
//                             mt: 2,
//                             backgroundColor: '#0277bd',
//                             '&:hover': { backgroundColor: '#01579b' }
//                           }}
//                         >
//                           Upload
//                         </Button>
//                         {imagePreview && (
//                           <Box sx={{ mt: 3, textAlign: 'center' }}>
//                             <Typography variant="body1" color="#0277bd">
//                               Preview:
//                             </Typography>
//                             <img
//                               src={imagePreview}
//                               alt="Preview"
//                               style={{
//                                 maxWidth: '100%',
//                                 maxHeight: '300px',
//                                 borderRadius: '12px',
//                                 boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'
//                               }}
//                             />
//                           </Box>
//                         )}
//                       </Box>
//                     </Form>
//                   )}
//                 </Formik>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Paper
//                 elevation={8}
//                 sx={{
//                   padding: 4,
//                   backgroundColor: '#ffffff',
//                   boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
//                   borderRadius: '12px'
//                 }}
//               >
//                 <Typography
//                   variant="h4"
//                   component="h1"
//                   gutterBottom
//                   color="#0277bd"
//                   textAlign="center"
//                 >
//                   Response
//                 </Typography>
//                 {loading ? (
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       height: '200px'
//                     }}
//                   >
//                     <CircularProgress color="primary" size={60} />
//                   </Box>
//                 ) : response ? (
//                   <Box
//                     sx={{
//                       backgroundColor: '#e3f2fd',
//                       padding: '20px',
//                       borderRadius: '12px',
//                       border: '1px solid #0277bd',
//                       whiteSpace: 'pre-wrap',
//                       wordWrap: 'break-word',
//                       maxHeight: '400px',
//                       overflowY: 'auto',
//                       boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'
//                     }}
//                   >
//                     <Typography variant="h6" color="#0277bd">
//                       Processed Data:
//                     </Typography>
//                     <pre>{JSON.stringify(response.data, null, 2)}</pre>
//                     <Typography variant="h6" color="#01579b" sx={{ mt: 2 }}>
//                       Processing Time: {response.time.toFixed(2)} seconds
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Typography
//                     variant="body1"
//                     color="textSecondary"
//                     textAlign="center"
//                   >
//                     No response to display.
//                   </Typography>
//                 )}
//               </Paper>
//             </Grid>
//           </>
//         )}
//       </Grid>
//       <Toaster position="bottom-center" />
//     </Box>
//   );
// };

// export default FileUpload;

import React, { useCallback, useEffect, useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  styled,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import {
  LocalizationProvider,
  // DateTimePicker,
  DatePicker,
  DesktopDateTimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const MainContent = styled(Box)`
  height: 100%;
  overflow: auto;
  flex: 1;
`;

const CardIndicatorWrapper = styled(Card)(
  () => `
    position: relative;
    
    .MuiCard-indicator {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 5px;
    }
`
);

// Custom phone number mask
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, name, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name, value } })}
      overwrite={false}
    />
  );
});

// Validation Functions
const validatePersonalDetails = (values) => {
  const errors = {};
  const nameRegex = /^[A-Za-z]+$/;
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // US phone format (XXX) XXX-XXXX

  if (!values.first_name) {
    errors.first_name = 'First name is required.';
  } else if (values.first_name.length < 3) {
    errors.first_name = 'First name must be at least 3 characters.';
  } else if (!nameRegex.test(values.first_name)) {
    errors.first_name = 'First name must contain only letters.';
  }

  // if (!values.last_name) {
  //   errors.last_name = 'Last name is required.';
  // } else if (values.last_name.length < 3) {
  //   errors.last_name = 'Last name must be at least 3 characters.';
  // } else if (!nameRegex.test(values.last_name)) {
  //   errors.last_name = 'Last name must contain only letters.';
  // }

  // Phone number validation
  if (!values.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = 'Phone number must be in the format (XXX) XXX-XXXX.';
  } else if (['0', '1'].includes(values.phone[1])) {
    errors.phone = 'Phone number cannot start with 0 or 1 in the area code.';
  }

  // if (!values.gender) {
  //   errors.gender = 'Gender is required.';
  // }

  // if (!values.preferred_doctor) {
  //   errors.preferred_doctor = 'Preferred doctor is required.';
  // }

  // if (!values.dob) {
  //   errors.dob = 'Date of birth is required.';
  // } else if (dayjs(values.dob).isAfter(dayjs())) {
  //   errors.dob = 'Date of birth cannot be in the future.';
  // }

  return errors;
};

// Custom Date-Time Validation for Appointment
const validateDateTime = (value) => {
  const selectedDate = dayjs(value);
  const currentDate = dayjs();
  const selectedTime = selectedDate.hour();
  const currentHour = currentDate.hour();
  const isSameDay = currentDate.isSame(selectedDate, 'day');

  if (!value) {
    return 'Date and time are required.';
  }
  if (selectedDate.isBefore(currentDate, 'minute')) {
    return 'Select a current or future date and a valid time.';
  }
  if (selectedTime < 8 || selectedTime >= 18) {
    return 'Please select a time between 8:00 AM and 6:00 PM.';
  }
  if (currentHour >= 18 && isSameDay) {
    return 'Please choose a time between 8:00 AM and 6:00 PM on a future date.';
  }
  if (isSameDay && selectedTime < currentHour) {
    return "Times are not available for today's date.";
  }
  return null;
};

// Validation for Appointment Details
const validateAppointmentDetails = (values) => {
  const errors = {};

  // Validate the DateTime using custom logic
  const dateTimeError = validateDateTime(values.appointment_date);
  if (dateTimeError) {
    errors.appointment_date = dateTimeError;
  }

  if (!values.duration) {
    errors.duration = 'Duration is required.';
  }

  if (!values.hospital_location) {
    errors.hospital_location = 'Hospital location is required.';
  }

  if (!values.reason) {
    errors.reason = 'Reason for appointment is required.';
  }

  if (!values.notes) {
    errors.notes = 'Notes are required.';
  } else if (values.notes.length > 300) {
    errors.notes = 'Notes cannot exceed 300 characters.';
  }

  if (!values.preferred_doctor) {
    errors.preferred_doctor = 'Preferred doctor is required.';
  }

  return errors;
};

// Component
const PatientIntakeExisting = () => {
  const { axios } = useAxiosInterceptor();
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [doctors, setDoctors] = useState([]);
  const [officePhone, setOfficePhone] = useState();
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [smsText, setSmsText] = useState('');
  const [mobile, setMobile] = useState(''); //patient Phone Number
  const [name, setName] = useState('');
  const [appointmentDateandTime, setAppointmentDateandTime] = useState('');
  // const [stateForSmsApi, setStateForSmsApi] = useState(false);
  // const [doctorsPhNo, setDoctorsPhNo] = useState('');
  const [doctorPracticeName, setDoctorPracticeName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [smsTemplateResponseData, setSmsTemeplateResponseData] = useState([]);

  //existing patient states
  const [selectedPatient, setSelectedPatient] = useState(false);
  const [patients, setPatients] = useState(); // State to hold the list of patients
  const [selectedPatientId, setSelectedPatientId] = useState(''); // ID of the selected patient for radio button selection

  const fetchDoctorOffice = async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //office phone
      setOfficePhone(
        response.data.drchronoDoctoresDetail.results[0].office_phone
      );
      const { drchronoOfficeLocation } = response.data;
      const officeLocations = drchronoOfficeLocation.results;
      setSelectedOffices(officeLocations);
    } catch (error) {
      toast.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchDoctorOffice();
  }, []);

  // console.log(officePhone);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { drchronoDoctoresDetail } = response.data;

      // Ensure that you are getting results and update the state
      if (drchronoDoctoresDetail && drchronoDoctoresDetail.results) {
        setDoctors(drchronoDoctoresDetail.results);
      } else {
        setDoctors([]); // In case of unexpected data structure
        toast.error('Unexpected data structure from API');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error(t('Error fetching doctors'));
      setDoctors([]); // Reset doctors state on error
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // State for Personal Details
  const [personalDetails, setPersonalDetails] = useState({
    first_name: '',
    phone: ''
    // last_name: '',
    // dob: null,
    // gender: '',
    // preferred_doctor: ''
  });

  // State for Appointment Details
  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_date: null,
    duration: '',
    hospital_location: '',
    reason: '',
    notes: '',
    preferred_doctor: ''
  });

  // State for SMS Details
  // const [smsDetails, setSmsDetails] = useState({
  //   message: ''
  // });

  const [errors, setErrors] = useState({});

  // Handle change for Personal Details
  const handleChangePersonalDetails = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  // Handle Date of Birth change
  // const handleDateChange = (date) => {
  //   setPersonalDetails({ ...personalDetails, dob: date });
  // };

  // Handle change for Appointment Details
  const handleChangeAppointmentDetails = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails({ ...appointmentDetails, [name]: value });
  };

  // Handle Date Change for Appointment
  const handleAppointmentDateChange = (newDateTime) => {
    setAppointmentDetails({
      ...appointmentDetails,
      appointment_date: newDateTime
    });
  };

  // Handle Submit for Personal Information
  const handleSubmitPersonalInfo = async () => {
    const validationErrors = validatePersonalDetails(personalDetails);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setName(personalDetails.first_name);
    setMobile(personalDetails.phone);
    setLoading(true);
    try {
      // const token = localStorage.getItem('token');
      const headersPayload = {
        patientFname: personalDetails.first_name,
        patientPhNum: personalDetails.phone
        // patientDob: dayjs(values.dob).format('YYYY-MM-DD')
      };

      const response = await axios.post(`/existingPatients`, headersPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 200) {
        setPatients(response?.data?.data);
        setSelectedPatient(true);
        // setStep((prevStep) => prevStep + 1); // Move to the next step
        // console.log(step, 'step 0');
      } else {
        toast.error(
          response.data.message || 'Failed to validate personal information.'
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No patient found
        toast.error('No patient found with the provided details.');
      } else {
        // General error handling
        toast.error(
          error.response?.data?.detail ||
            'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patientId) => {
    const patient = patients.find((p) => p.patient_id === patientId);
    setSelectedPatient(patient); // Store the full patient object
    setSelectedPatientId(patientId);
  };

  // Handle Submit for Appointment Details
  const handleSubmitAppointmentDetails = async () => {
    const validationErrors = validateAppointmentDetails(appointmentDetails);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setAppointmentDateandTime(
      dayjs(appointmentDetails.appointment_date).format('YYYY-MM-DDTHH:mm')
    );

    setLoading(true);

    const headersPayload = {
      patientId: selectedPatient.patient_id,
      scheduleDateTime: dayjs(appointmentDetails.appointment_date).format(
        'YYYY-MM-DDTHH:mm'
      ),
      duration: appointmentDetails.duration,
      office_location: appointmentDetails.hospital_location,
      reason: appointmentDetails.reason,
      notes: appointmentDetails.notes,
      doctorId: appointmentDetails.preferred_doctor, // Assuming doctor ID is static or passed from props
      patientReSchedule: false
    };

    const smsTemplateDetails = {
      patientId: selectedPatient.patient_id,
      patientName: name,
      scheduleDateTime: dayjs(appointmentDetails.appointment_date).format(
        'YYYY-MM-DDTHH:mm'
      ),
      patientPhNum: mobile,
      doctor_PraticeName: doctorPracticeName,
      doctor_phone: officePhone,
      patient_is_new: false
    };

    try {
      // First API Call: Schedule Appointment
      const response = await axios.post(
        `/scheduleAppointment`,
        headersPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response?.data?.status === 201) {
        // Second API Call: Send SMS
        const smsResponse = await axios.post(`/sms`, smsTemplateDetails, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        // setSmsTemeplateResponseData(response.data.data.message_template);
        setSmsTemeplateResponseData(smsResponse.data.data.message_template); // Access message_template inside "data"        toast.success('Appointment created successfully!');
        // console.log('SMS Response:', smsResponse.data.data.message_template);

        setActiveStep((prevStep) => prevStep + 1); // Move to the next step
      } else if (response.data.status === 409) {
        toast.error(
          response.data.message ||
            'The chosen time slot is unavailable. Please choose another time slot.'
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate);
    toast.success('SMS copied Successfully');
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
    setSmsText(event.target.value);
  };

  // Handle Submit for SMS Information
  const handleSubmitSms = async () => {
    setLoading(true);

    try {
      const cleanedPhoneNumber = mobile.replace(/\D/g, '');

      const response = await axios.post(
        `/sms/toPatient`,
        {
          message_template: selectedTemplate,
          patientPhNum: `+1${cleanedPhoneNumber}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.data.status === 200) {
        toast.success('SMS sent successfully!');
        const delayedAction = () => {
          handleCreatePatient();
          // setIsRegistrationComplete(true); // Set registration complete on success
        };

        setTimeout(delayedAction, 3000); // 3000 milliseconds = 3 seconds
      } else {
        toast.error('Failed to Send SMS');
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.detail || 'SMS sending failed. Please try again.'
        );
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = (resetForm) => {
    window.location.reload();
    resetForm();
  };

  return (
    <Box>
      <Toaster position="bottom-right" />
      <Helmet>
        <title>Get Existing Patient</title>
      </Helmet>
      <MainContent>
        <Container sx={{ my: 2 }} maxWidth="md">
          <Card sx={{ mt: -1.5, pt: 4 }}>
            <Box px={4}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {t('Get Existing Patient')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              ></Typography>
            </Box>
            <Box px={4}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {['Patient Details', 'Appointment Details', 'Send SMS'].map(
                  (label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  )
                )}
              </Stepper>

              {activeStep === 0 && (
                <Box>
                  {/* <Typography variant="h6" gutterBottom>
                    Patient Details
                  </Typography> */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={personalDetails.first_name}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={personalDetails.last_name}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phones"
                        name="phone"
                        value={personalDetails.phone}
                        onChange={handleChangePersonalDetails}
                        InputProps={{
                          inputComponent: TextMaskCustom
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Birth"
                          value={personalDetails.dob}
                          onChange={handleDateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.dob}
                              helperText={errors.dob}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Gender"
                        name="gender"
                        value={personalDetails.gender}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.gender}
                        helperText={errors.gender}
                      >
                        <MenuItem value="UNK">Choose not to disclose</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>
                   */}
                  </Grid>
                  <Grid
                    xs={12}
                    // md={12}
                    // sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSubmitPersonalInfo}
                      sx={{ my: 3 }}
                      disabled={loading}
                      // fullWidth
                    >
                      Get Patient
                    </Button>
                  </Grid>
                </Box>
              )}

              {activeStep === 0 && selectedPatient && (
                <>
                  {/* TableContainer with a fixed height and overflow auto for scrolling */}
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxHeight: '300px', // Set the height limit
                      overflowY: 'auto', // Enable vertical scrolling if content exceeds height
                      padding: '0 20px'
                    }}
                  >
                    <Table stickyHeader>
                      {' '}
                      {/* stickyHeader keeps the header visible when scrolling */}
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ textAlign: 'center' }}>
                            Select
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            Chart Id
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            First Name
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            Date of Birth
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            Gender
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            Phone
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.patient_id}>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Radio
                                checked={
                                  selectedPatientId === patient.patient_id
                                }
                                onChange={() =>
                                  handleSelectPatient(patient.patient_id)
                                }
                                value={patient.patient_id}
                                name="select-patient"
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {patient.chart_id}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {patient.first_name}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {patient.date_of_birth}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {patient.gender}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {patient.cell_phone}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {activeStep === 0 && selectedPatient && (
                <div>
                  <Box p={2} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (selectedPatient) {
                          setActiveStep((prevStep) => prevStep + 1); // Move to the next step
                        } else {
                          toast.error(
                            'Please select a patient before proceeding'
                          );
                        }
                      }}
                      disabled={!selectedPatientId} // Disable button if no patient is selected
                    >
                      {t('Next')}
                    </Button>
                  </Box>
                </div>
              )}

              {activeStep === 1 && (
                <Box>
                  {/* <Typography variant="h6" gutterBottom>
                    Appointment Details
                  </Typography> */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDateTimePicker
                          label="Appointment Date & Time"
                          disablePast={true}
                          value={appointmentDetails.appointment_date}
                          onChange={handleAppointmentDateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.appointment_date}
                              helperText={errors.appointment_date}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} s>
                      <TextField
                        fullWidth
                        select
                        label="Duration"
                        name="duration"
                        value={appointmentDetails.duration}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.duration}
                        helperText={errors.duration}
                      >
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="60">60</MenuItem>
                        <MenuItem value="90">90</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Hospital Location"
                        name="hospital_location"
                        value={appointmentDetails.hospital_location}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.hospital_location}
                        helperText={errors.hospital_location}
                      >
                        {selectedOffices?.map((office) => (
                          <MenuItem key={office?.id} value={office?.id}>
                            {office?.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Preferred Doctor"
                        name="preferred_doctor"
                        value={appointmentDetails.preferred_doctor}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.preferred_doctor}
                        helperText={errors.preferred_doctor}
                      >
                        {doctors?.map((doctor) => (
                          <MenuItem key={doctor?.id} value={doctor?.id}>
                            {doctor?.first_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Reason"
                        name="reason"
                        value={appointmentDetails.reason}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.reason}
                        helperText={errors.reason}
                        multiline
                        rows={4} // Reason is now a textarea with 4 rows
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Notes"
                        name="notes"
                        value={appointmentDetails.notes}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.notes}
                        helperText={errors.notes}
                        multiline
                        rows={4} // Notes textarea with 4 rows
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={handleSubmitAppointmentDetails}
                    sx={{ my: 3 }}
                    disabled={loading}
                  >
                    Schedule Appointment
                  </Button>
                </Box>
              )}

              {activeStep === 2 && (
                <Box p={1}>
                  <Grid
                    container
                    component="main"
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {/* <Toaster /> */}
                    <Paper
                      sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: '600px',
                        mx: 'auto'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Typography component="h1" variant="h5">
                          Send SMS
                        </Typography>
                        <Box component="div" noValidate sx={{ mt: 1 }}>
                          <Grid container spacing={2}>
                            {/* Check if smsTemplateResponseData exists and is not empty */}
                            {smsTemplateResponseData &&
                            smsTemplateResponseData.length > 0 ? (
                              smsTemplateResponseData.map((template, index) => (
                                <Grid item xs={12} key={index}>
                                  {/* Use index as key or provide a unique id if available */}
                                  <Card>
                                    <CardIndicatorWrapper>
                                      <Box
                                        className="MuiCard-indicator"
                                        sx={{
                                          background: `${theme.colors.info.main}`
                                        }}
                                      />
                                      <CardContent>
                                        <FormControl component="fieldset">
                                          <RadioGroup
                                            value={selectedTemplate}
                                            onChange={handleTemplateChange}
                                          >
                                            <FormControlLabel
                                              value={template.messageContent} // Correctly use messageContent as value
                                              control={<Radio />}
                                              label={template.messageContent} // Display the message content
                                            />
                                          </RadioGroup>
                                        </FormControl>
                                      </CardContent>
                                    </CardIndicatorWrapper>
                                  </Card>
                                </Grid>
                              ))
                            ) : (
                              <Typography variant="body1" color="textSecondary">
                                No templates available.
                              </Typography>
                            )}

                            <Grid item xs={12} sx={{ mt: 2 }}>
                              {smsText && (
                                <>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleCopy}
                                    sx={{
                                      mb: 2
                                    }}
                                  >
                                    <ContentCopyIcon />
                                    Copy SMS
                                  </Button>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      gap: '10px'
                                    }}
                                  >
                                    <Button
                                      onClick={
                                        () => handleCreatePatient()
                                        // isSubmitting?.resetForm
                                      }
                                      fullWidth
                                    >
                                      Create Patient
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      onClick={handleSubmitSms}
                                      disabled={loading}
                                      fullWidth
                                    >
                                      Send SMS
                                      {loading && (
                                        <CircularProgress
                                          size={24}
                                          sx={{ ml: 2 }}
                                        />
                                      )}
                                    </Button>
                                  </div>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Box>
              )}
            </Box>
          </Card>
        </Container>
      </MainContent>
    </Box>
  );
};

export default PatientIntakeExisting;
