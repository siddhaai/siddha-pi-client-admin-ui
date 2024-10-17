// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   MenuItem,
//   Paper,
//   Radio,
//   RadioGroup,
//   Step,
//   StepLabel,
//   Stepper,
//   styled,
//   TextField,
//   Typography,
//   useTheme
// } from '@mui/material';
// import { Field, Form, Formik } from 'formik';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useTranslation } from 'react-i18next';
// import * as Yup from 'yup';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import { toast, Toaster } from 'react-hot-toast';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { IMaskInput } from 'react-imask';
// import useAxiosInterceptor from 'src/contexts/Interceptor';

// const MainContent = styled(Box)`
//   height: 100%;
//   overflow: auto;
//   flex: 1;
// `;

// const BoxActions = styled(Box)`
//   background: ${(props) => props.theme.colors.alpha.black[5]};
// `;

// const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
//   const { onChange, name, ...other } = props;

//   return (
//     <IMaskInput
//       {...other}
//       mask="(000) 000-0000"
//       inputRef={ref}
//       onAccept={(value) => onChange({ target: { name, value } })}
//       overwrite={false}
//     />
//   );
// });
// const CardIndicatorWrapper = styled(Card)(
//   () => `
//     position: relative;

//     .MuiCard-indicator {
//       position: absolute;
//       left: 0;
//       right: 0;
//       top: 0;
//       height: 5px;
//     }
// `
// );
// const validateDateTime = (value) => {
//   const selectedDate = dayjs(value);
//   const currentDate = dayjs();
//   const selectedTime = selectedDate.hour();
//   const currentHour = currentDate.hour();
//   const isSameDay = currentDate.isSame(selectedDate, 'day');

//   if (!value) {
//     return 'Date and time are required.';
//   }
//   if (selectedDate.isBefore(currentDate, 'minute')) {
//     return 'Select a current or future date and a valid time.';
//   }
//   if (selectedTime < 8 || selectedTime >= 18) {
//     return 'Please select a time between 8:00 AM and 6:00 PM.';
//   }
//   if (currentHour >= 18 && isSameDay) {
//     return 'Please choose a time between 8:00 AM and 6:00 PM on a future date.';
//   }
//   if (isSameDay && selectedTime < currentHour) {
//     return "Times are not available for today's date.";
//   }
//   return null;
// };

// const personalInfoSchema = Yup.object({
//   first_name: Yup.string()
//     .required('First Name is required')
//     .min(3, 'First Name must be at least 3 characters')
//     .matches(/^[A-Za-z]*$/, 'First Name must only contain letters'),
//   last_name: Yup.string()
//     .required('Last Name is required')
//     .min(3, 'Last Name must be at least 3 characters')
//     .matches(/^[A-Za-z]*$/, 'Last Name must only contain letters'),
//   phone: Yup.string()
//     // .matches(/^[2-9]\d{9}$/, 'Invalid phone number')
//     .max(14, 'Phone Number maximum allowed is 10 characters')
//     .required('Phone number is required'),
//   preferred_doctor: Yup.string().required('Preferred doctor is required'),
//   gender: Yup.string().required('Gender is required'),
//   dob: Yup.date()
//     .required('Date of birth is required')
//     .max(dayjs(), 'Date cannot be in the future')
// });

// const appointmentDetailsSchema = Yup.object({
//   appointment_date: Yup.mixed().test(
//     'custom-date-time-validation',
//     null,
//     validateDateTime
//   ),
//   // time_Zone: Yup.string().required('Time Zone is required'),
//   hospital_location: Yup.string().required('Hospital Location is required'),
//   reason: Yup.string().required('Reason is required'),
//   notes: Yup.string().required('Notes is required'),
//   duration: Yup.string().required('Duration is required')
// });

// const completeRegistrationSchema = Yup.object({
//   notes: Yup.string().required('Notes is required')
// });

// const TableData = () => {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const theme = useTheme();
//   // const { resetForm } = useFormikContext();
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [id, setId] = useState('');
//   const handleBack = () => setStep((prevStep) => prevStep - 1);
//   const [smsText, setSmsText] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [name, setName] = useState('');
//   const [stateForSmsApi, setStateForSmsApi] = useState(false);
//   const [selectedOffices, setSelectedOffices] = useState([]);

//   const [appointmentDateandTime, setAppointmentDateandTime] = useState('');
//   // const [appointmenttimeZone, setAppointmenttimeZone] = useState('');
//   // const [officeLocation, setOfficeLocation] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [doctorsPhNo, setDoctorsPhNo] = useState('');
//   const [doctorPracticeName, setDoctorPracticeName] = useState('');
//   // New state to track if registration is complete
//   const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
//   const [dateTimeError, setDateTimeError] = useState(null);
//   const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [smsTemplateResponseData, setSmsTemeplateResponseData] = useState([]);
//   const [officePhone, setOfficePhone] = useState();

//   const token = localStorage.getItem('token');

//   const handleCopy = () => {
//     navigator.clipboard.writeText(selectedTemplate);
//     toast.success('SMS copied Successfully');
//   };

//   const handleTemplateChange = (event) => {
//     setSelectedTemplate(event.target.value);
//     setSmsText(event.target.value);
//   };

//   // console.log(selectedTemplate, 'selected Template');

//   const fetchDoctorOffice = async () => {
//     try {
//       const response = await axios.get(`/drchronoDoctorDetails`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       //office phone
//       setOfficePhone(
//         response.data.drchronoDoctoresDetail.results[0].office_phone
//       );
//       const { drchronoOfficeLocation } = response.data;
//       const officeLocations = drchronoOfficeLocation.results;
//       setSelectedOffices(officeLocations);
//     } catch (error) {
//       toast.error('Failed to fetch user data');
//     }
//   };

//   useEffect(() => {
//     fetchDoctorOffice();
//   }, []);

//   // console.log(officePhone);

//   const fetchDoctors = useCallback(async () => {
//     try {
//       const response = await axios.get(`/drchronoDoctorDetails`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const { drchronoDoctoresDetail } = response.data;

//       // Ensure that you are getting results and update the state
//       if (drchronoDoctoresDetail && drchronoDoctoresDetail.results) {
//         setDoctors(drchronoDoctoresDetail.results);
//       } else {
//         setDoctors([]); // In case of unexpected data structure
//         toast.error('Unexpected data structure from API');
//       }
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       toast.error(t('Error fetching doctors'));
//       setDoctors([]); // Reset doctors state on error
//     }
//   }, []);

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleSubmitPersonalInfo = async (values, { setSubmitting }) => {
//     setName(values.first_name);
//     setMobile(values.phone);

//     setLoading(true);
//     try {
//       const headersPayload = {
//         patientFname: values.first_name,
//         patientLname: values.last_name,
//         patientPhNum: values.phone,
//         patientDob: dayjs(values.dob).format('YYYY-MM-DD'),
//         doctorId: values.preferred_doctor,
//         patientGender: values.gender
//       };

//       const response = await axios.post(`/patientCreate`, headersPayload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.status === 201) {
//         toast.success('Patient created successfully!');
//         setId(response.data.data.id);
//         console.log(setId, 'id');

//         // Find the selected doctor based on doctorId
//         const selectedDoctor = doctors.find(
//           (doctor) => doctor.id === values.preferred_doctor
//         );

//         // Set the phone number and practice name of the selected doctor
//         if (selectedDoctor) {
//           setDoctorsPhNo(selectedDoctor.cell_phone || '');
//           setDoctorPracticeName(selectedDoctor.practice_group_name || '');
//         }

//         setStep((prevStep) => prevStep + 1); // Move to the next step
//       } else {
//         toast.error(
//           response.data.message || 'Failed to validate personal information.'
//         );
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   const handleSubmitAppointmentDetails = async (values, { setSubmitting }) => {
//     setAppointmentDateandTime(
//       dayjs(values.appointment_date).format('YYYY-MM-DDTHH:mm')
//     );

//     setLoading(true);
//     try {
//       // const token = localStorage.getItem('token');
//       const headersPayload = {
//         patientId: id,
//         scheduleDateTime: dayjs(values.appointment_date).format(
//           'YYYY-MM-DDTHH:mm'
//         ),
//         duration: values.duration,
//         office_location: values.hospital_location,
//         reason: values.reason,
//         notes: values.notes,
//         doctorId: values.preferred_doctor,
//         patientReSchedule: false
//       };

//       const smsTemplateDetails = {
//         patientId: id,
//         // doctor_phone: officePhone,
//         patientName: name,
//         scheduleDateTime: dayjs(values.appointment_date).format(
//           'YYYY-MM-DDTHH:mm:ss'
//         ),
//         patientPhNum: mobile,
//         // timeZone: appointmenttimeZone,
//         doctor_PraticeName: doctorPracticeName,
//         // office_location: officeLocation,
//         patient_is_new: true
//       };
//       const response = await axios.post(
//         `/scheduleAppointment`,
//         headersPayload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       console.log('sms response template', response);

//       if (response?.data?.status === 201) {
//         const response = await axios.post(`/sms`, smsTemplateDetails, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           }
//         });

//         setSmsTemeplateResponseData(response.data.data.message_template);
//         toast.success('Appointment created successfully!');

//         setStep((prevStep) => prevStep + 1);
//         setStateForSmsApi(true);
//       } else if (response.data.status === 409) {
//         toast.error(
//           response.data.message ||
//             'The chosen time slot is unavailable for schedule! Choose another time slot'
//         );
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   // console.log('sms tem', smsTemplateResponseData);

//   const handleSubmitCompleteRegistration = async ({ setSubmitting }) => {
//     setLoading(true);

//     try {
//       const cleanedPhoneNumber = mobile.replace(/\D/g, '');

//       const response = await axios.post(
//         `/sms/toPatient`,
//         {
//           message_template: selectedTemplate,
//           patientPhNum: `+1${cleanedPhoneNumber}`
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       if (response.data.data.status === 200) {
//         toast.success('SMS sent successfully!');
//         setIsRegistrationComplete(true); // Set registration complete on success
//         const delayedAction = () => {
//           handleCreatePatient();
//           // setIsRegistrationComplete(true); // Set registration complete on success
//         };

//         setTimeout(delayedAction, 3000); // 3000 milliseconds = 3 seconds
//       } else {
//         toast.error('Failed to Send SMS');
//       }
//     } catch (error) {
//       if (error.response) {
//         toast.error(
//           error.response.data.detail || 'SMS sending failed. Please try again.'
//         );
//       } else {
//         toast.error('Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   const handleSubmit = async (values, { setSubmitting }) => {
//     if (step === 0) {
//       await handleSubmitPersonalInfo(values, { setSubmitting });
//     } else if (step === 1) {
//       await handleSubmitAppointmentDetails(values, { setSubmitting });
//       // await handleSubmitCompleteRegistration(values, { setSubmitting });
//     } else if (step === 2 || stateForSmsApi === true) {
//       await handleSubmitCompleteRegistration(values, { setSubmitting });
//     }
//   };

//   const handleCreatePatient = (resetForm) => {
//     window.location.reload();
//     // setStep();
//     resetForm();
//   };

//   return (
//     <>
//       <Toaster position="bottom-right" />
//       <Helmet>
//         <title>Patient Register</title>
//       </Helmet>
//       <MainContent>
//         <Container sx={{ my: 2 }} maxWidth="md">
//           <Card sx={{ mt: -1.5, pt: 4 }}>
//             <Box px={4}>
//               <Typography variant="h2" sx={{ mb: 1 }}>
//                 {t('Add New Patient')}
//               </Typography>
//               <Typography
//                 variant="h4"
//                 color="text.secondary"
//                 fontWeight="normal"
//                 sx={{ mb: 3 }}
//               ></Typography>
//             </Box>

//             <Formik
//               initialValues={{
//                 first_name: '',
//                 last_name: '',
//                 phone: '',
//                 gender: '',
//                 dob: null,
//                 preferred_doctor: '',
//                 appointment_date: null,
//                 duration: '',
//                 //  time_Zone: '',
//                 hospital_location: '',
//                 reason: '',
//                 notes: ''
//               }}
//               validationSchema={
//                 step === 0
//                   ? personalInfoSchema
//                   : step === 1
//                   ? appointmentDetailsSchema
//                   : completeRegistrationSchema
//               }
//               onSubmit={handleSubmit}
//             >
//               {({ isSubmitting, touched, errors }) => (
//                 <Form>
//                   <Stepper alternativeLabel activeStep={step}>
//                     {[
//                       'Personal Information',
//                       'Appointment Details',
//                       'Send SMS'
//                     ].map((label, index) => (
//                       <Step key={label} completed={step > index}>
//                         <StepLabel>{t(label)}</StepLabel>
//                       </Step>
//                     ))}
//                   </Stepper>

//                   {step === 0 && (
//                     <Box p={4}>
//                       <Grid container spacing={4}>
//                         <Grid item xs={12} md={6}>
//                           <Field name="first_name">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('First name')}
//                                 placeholder={t('Enter your first name here...')}
//                                 error={Boolean(
//                                   touched.first_name && errors.first_name
//                                 )}
//                                 helperText={
//                                   touched.first_name && errors.first_name
//                                 }
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="last_name">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('Last name')}
//                                 placeholder={t('Enter your last name here...')}
//                                 error={Boolean(
//                                   touched.last_name && errors.last_name
//                                 )}
//                                 helperText={
//                                   touched.last_name && errors.last_name
//                                 }
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="phone">
//                             {({ field, form: { setFieldValue } }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('Phone number')}
//                                 placeholder={t(
//                                   'Enter your phone number here...'
//                                 )}
//                                 error={Boolean(touched.phone && errors.phone)}
//                                 helperText={touched.phone && errors.phone}
//                                 InputProps={{
//                                   inputComponent: TextMaskCustom,
//                                   inputProps: {
//                                     name: 'phone',
//                                     onChange: (e) =>
//                                       setFieldValue('phone', e.target.value) // Update Formik value
//                                   }
//                                 }}
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="gender">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('Gender')}
//                                 select
//                                 error={Boolean(touched.gender && errors.gender)}
//                                 helperText={touched.gender && errors.gender}
//                               >
//                                 <MenuItem value="UNK">
//                                   Choose not to disclose
//                                 </MenuItem>
//                                 <MenuItem value="Female">Female</MenuItem>
//                                 <MenuItem value="Male">Male</MenuItem>
//                                 <MenuItem value="Other">Other</MenuItem>
//                               </TextField>
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="dob">
//                             {({ field, form }) => (
//                               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                   label={t('Date of Birth')}
//                                   value={field.value}
//                                   onChange={(date) =>
//                                     form.setFieldValue(field.name, date)
//                                   }
//                                   format="MM/DD/YYYY" // Set the desired date format
//                                   renderInput={(params) => (
//                                     <TextField
//                                       {...params}
//                                       fullWidth
//                                       error={Boolean(touched.dob && errors.dob)}
//                                       helperText={touched.dob && errors.dob}
//                                     />
//                                   )}
//                                 />
//                               </LocalizationProvider>
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="preferred_doctor">
//                             {({
//                               field,
//                               form: { setFieldValue, touched, errors }
//                             }) => (
//                               <TextField
//                                 {...field}
//                                 select
//                                 fullWidth
//                                 label={t('Preferred Doctor')}
//                                 placeholder={t('Enter preferred doctor...')}
//                                 error={Boolean(
//                                   touched.preferred_doctor &&
//                                     errors.preferred_doctor
//                                 )}
//                                 helperText={
//                                   touched.preferred_doctor &&
//                                   errors.preferred_doctor
//                                 }
//                                 onChange={(event) => {
//                                   setFieldValue(
//                                     'preferred_doctor',
//                                     event.target.value
//                                   );
//                                 }}
//                               >
//                                 {doctors?.map((doctor) => (
//                                   <MenuItem key={doctor?.id} value={doctor?.id}>
//                                     {doctor?.first_name}
//                                   </MenuItem>
//                                 ))}
//                               </TextField>
//                             )}
//                           </Field>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   )}

//                   {step === 1 && (
//                     <Box p={4}>
//                       <Grid container spacing={4}>
//                         <Grid item xs={12} md={6}>
//                           <Field name="appointment_date">
//                             {({ field, form }) => (
//                               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DateTimePicker
//                                   sx={{
//                                     width: '100%'
//                                   }}
//                                   ampm={true}
//                                   disablePast={true} // Disables past dates
//                                   label="Appointment Date & Time"
//                                   value={field.value}
//                                   onChange={(newValue) => {
//                                     form.setFieldValue(
//                                       field.name,
//                                       newValue ? dayjs(newValue).toDate() : null
//                                     );
//                                     setDateTimeError(
//                                       validateDateTime(newValue)
//                                     ); // Validate the date and time
//                                   }}
//                                   minutesStep={5} // Sets the interval for time selection
//                                   onError={(error) => setDateTimeError(error)} // Capture any error in date selection
//                                   slotProps={{
//                                     actionBar: {
//                                       actions: ['clear', 'cancel', 'accept'] // Shows the action buttons including 'OK'
//                                     },
//                                     textField: {
//                                       error:
//                                         Boolean(dateTimeError) ||
//                                         (!field.value &&
//                                           touched.appointment_date),
//                                       helperText:
//                                         dateTimeError ||
//                                         (!field.value &&
//                                           touched.appointment_date &&
//                                           'Date and time are required.')
//                                     }
//                                   }}
//                                   renderInput={(params) => (
//                                     <TextField
//                                       {...params}
//                                       fullWidth
//                                       error={
//                                         Boolean(dateTimeError) ||
//                                         (!field.value &&
//                                           touched.appointment_date)
//                                       }
//                                       helperText={
//                                         dateTimeError ||
//                                         (!field.value &&
//                                           touched.appointment_date &&
//                                           'Date and time are required.')
//                                       }
//                                     />
//                                   )}
//                                 />
//                               </LocalizationProvider>
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="duration">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('Duration')}
//                                 select
//                                 error={Boolean(
//                                   touched.duration && errors.duration
//                                 )}
//                                 helperText={touched.duration && errors.duration}
//                               >
//                                 <MenuItem value="30">30</MenuItem>
//                                 <MenuItem value="60">60</MenuItem>
//                                 <MenuItem value="90">90</MenuItem>
//                               </TextField>
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="hospital_location">
//                             {({
//                               field,
//                               form: { setFieldValue, touched, errors }
//                             }) => (
//                               <TextField
//                                 {...field}
//                                 select
//                                 fullWidth
//                                 label={t('Hospital Location')}
//                                 placeholder={t('Enter Hospital Location...')}
//                                 error={Boolean(
//                                   touched.hospital_location &&
//                                     errors.hospital_location
//                                 )}
//                                 helperText={
//                                   touched.hospital_location &&
//                                   errors.hospital_location
//                                 }
//                                 onChange={(event) => {
//                                   setFieldValue(
//                                     'hospital_location',
//                                     event.target.value
//                                   );
//                                 }}
//                               >
//                                 {selectedOffices?.map((office) => (
//                                   <MenuItem key={office?.id} value={office?.id}>
//                                     {office?.name}
//                                   </MenuItem>
//                                 ))}
//                               </TextField>
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="reason">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 multiline
//                                 // rows={2}
//                                 label={t('Reason ')}
//                                 placeholder={t(
//                                   'Enter reason for appointment...'
//                                 )}
//                                 error={Boolean(touched.reason && errors.reason)}
//                                 helperText={touched.reason && errors.reason}
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Field name="notes">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 multiline
//                                 rows={4}
//                                 label={t('Notes')}
//                                 placeholder={t(
//                                   'Enter notes for appointment...'
//                                 )}
//                                 error={Boolean(touched.notes && errors.notes)}
//                                 helperText={touched.notes && errors.notes}
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   )}

//                   {step === 2 && (
//                     <Box p={1}>
//                       <Grid
//                         container
//                         component="main"
//                         sx={{ display: 'flex', justifyContent: 'center' }}
//                       >
//                         {/* <Toaster /> */}
//                         <Paper
//                           sx={{
//                             p: 4,
//                             width: '100%',
//                             maxWidth: '600px',
//                             mx: 'auto'
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: 'flex',
//                               flexDirection: 'column',
//                               alignItems: 'center'
//                             }}
//                           >
//                             <Typography component="h1" variant="h5">
//                               Send SMS
//                             </Typography>
//                             <Box component="div" noValidate sx={{ mt: 1 }}>
//                               <Grid container spacing={2}>
//                                 {smsTemplateResponseData.length > 0 ? (
//                                   smsTemplateResponseData.map(
//                                     (template, index) => (
//                                       <Grid item xs={12} key={index}>
//                                         {' '}
//                                         {/* Use index as key or provide a unique id if available */}
//                                         <Card>
//                                           <CardIndicatorWrapper>
//                                             <Box
//                                               className="MuiCard-indicator"
//                                               sx={{
//                                                 background: `${theme.colors.info.main}`
//                                               }}
//                                             />
//                                             <CardContent>
//                                               <FormControl component="fieldset">
//                                                 <RadioGroup
//                                                   value={selectedTemplate}
//                                                   onChange={
//                                                     handleTemplateChange
//                                                   }
//                                                 >
//                                                   <FormControlLabel
//                                                     value={
//                                                       template.messageContent
//                                                     } // Use messageContent as value
//                                                     control={<Radio />}
//                                                     label={
//                                                       template.messageContent
//                                                     } // Display the message content
//                                                   />
//                                                 </RadioGroup>
//                                               </FormControl>
//                                             </CardContent>
//                                           </CardIndicatorWrapper>
//                                         </Card>
//                                       </Grid>
//                                     )
//                                   )
//                                 ) : (
//                                   <Typography
//                                     variant="body1"
//                                     color="textSecondary"
//                                   >
//                                     No templates available.
//                                   </Typography>
//                                 )}

//                                 <Grid item xs={12} sx={{ mt: 2 }}>
//                                   {smsText && (
//                                     <>
//                                       <Button
//                                         variant="contained"
//                                         fullWidth
//                                         onClick={handleCopy}
//                                         sx={{
//                                           mb: 2
//                                         }}
//                                       >
//                                         <ContentCopyIcon />
//                                         Copy SMS
//                                       </Button>
//                                       <div
//                                         style={{
//                                           display: 'flex',
//                                           justifyContent: 'space-between',
//                                           gap: '10px'
//                                         }}
//                                       >
//                                         <Button
//                                           onClick={() =>
//                                             handleCreatePatient(
//                                               isSubmitting?.resetForm
//                                             )
//                                           }
//                                           fullWidth
//                                         >
//                                           Create Patient
//                                         </Button>
//                                         <Button
//                                           variant="contained"
//                                           color="primary"
//                                           type="submit"
//                                           disabled={isSubmitting || loading}
//                                           fullWidth
//                                         >
//                                           Send SMS
//                                           {loading && (
//                                             <CircularProgress
//                                               size={24}
//                                               sx={{ ml: 2 }}
//                                             />
//                                           )}
//                                         </Button>
//                                       </div>
//                                     </>
//                                   )}
//                                 </Grid>
//                               </Grid>
//                             </Box>
//                           </Box>
//                         </Paper>
//                       </Grid>
//                     </Box>
//                   )}

//                   <BoxActions>
//                     <Box p={2} display="flex" justifyContent="center">
//                       {step > 0 && (
//                         <Button
//                           variant="outlined"
//                           style={{ display: 'none' }}
//                           onClick={handleBack}
//                           disabled={isSubmitting || loading}
//                         >
//                           {t('Back')}
//                         </Button>
//                       )}
//                       {step < 2 ? (
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           type="submit"
//                           disabled={isSubmitting || loading}
//                         >
//                           {t('Next')}
//                           {loading && (
//                             <CircularProgress size={24} sx={{ ml: 2 }} />
//                           )}
//                         </Button>
//                       ) : isRegistrationComplete === true ? (
//                         <Typography
//                           style={{ display: 'none' }}
//                           variant="contained"
//                           color="primary"
//                           type="submit"
//                         >
//                           {/* {t('Finish')} */}
//                           {loading && (
//                             <CircularProgress
//                               size={24}
//                               sx={{ ml: 2, display: 'none' }}
//                             />
//                           )}
//                         </Typography>
//                       ) : (
//                         <Typography sx={{ display: 'none' }}></Typography>
//                       )}
//                     </Box>
//                   </BoxActions>
//                 </Form>
//               )}
//             </Formik>
//           </Card>
//         </Container>
//       </MainContent>
//     </>
//   );
// };

// export default TableData;

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
  Container
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import {
  LocalizationProvider,
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
import SendIcon from '@mui/icons-material/Send';
import { t } from 'i18next';

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
    errors.first_name = t('First name is required');
  } else if (values.first_name.length < 3) {
    errors.first_name = t('First name must be at least 3 characters');
  } else if (!nameRegex.test(values.first_name)) {
    errors.first_name = t('First name must contain only letters');
  }

  if (!values.last_name) {
    errors.last_name = t('Last name is required');
  } else if (values.last_name.length < 3) {
    errors.last_name = t('Last name must be at least 3 characters');
  } else if (!nameRegex.test(values.last_name)) {
    errors.last_name = t('Last name must contain only letters');
  }

  // Phone number validation
  if (!values.phone) {
    errors.phone = t('Phone number is required');
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = t('Phone number must be in the format (XXX) XXX-XXXX');
  } else if (['0', '1'].includes(values.phone[1])) {
    errors.phone = t('Phone number cannot start with 0 or 1 in the area code');
  }

  if (!values.gender) {
    errors.gender = t('Gender is required');
  }

  if (!values.preferred_doctor) {
    errors.preferred_doctor = t('Preferred doctor is required');
  }

  if (!values.dob) {
    errors.dob = t('Date of birth is require');
  } else if (dayjs(values.dob).isAfter(dayjs())) {
    errors.dob = t('Date of birth cannot be in the future');
  }

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
    return t('Date and time are required');
  }
  if (selectedDate.isBefore(currentDate, 'minute')) {
    return t('Select a current or future date and a valid time');
  }
  if (selectedTime < 8 || selectedTime >= 18) {
    return t('Please select a time between 8:00 AM and 6:00 PM');
  }
  if (currentHour >= 18 && isSameDay) {
    return t(
      'Please choose a time between 8:00 AM and 6:00 PM on a future date'
    );
  }
  if (isSameDay && selectedTime < currentHour) {
    return t("Times are not available for today's date");
  }
  return null;
};

// Field-specific validators
const validateDuration = (value) => {
  if (!value) {
    return t('Duration is required');
  }
  return null;
};

const validateLocation = (value) => {
  if (!value) {
    return t('Hospital location is required');
  }
  return null;
};

// Alpha-numeric validation for Reason

const validateReason = (value) => {
  const reasonRegex = /^[a-zA-Z0-9\s]*$/; // Allows only alphanumeric characters and spaces
  if (!value) {
    return t('Reason for appointment is required');
  } else if (!reasonRegex.test(value)) {
    return t('Reason can only contain letters and numbers');
  } else if (value.length > 100) {
    return t('Reason cannot exceed 100 characters');
  }
  return null;
};

const validateNotes = (value) => {
  if (!value) {
    return t('Additional notes are required');
  } else if (value.length > 1000) {
    return t('Additional notes cannot exceed 1000 characters');
  }
  return null;
};

// Validation for Appointment Details
// const validateAppointmentDetails = (values) => {
//   const errors = {};

//   // Validate the DateTime using custom logic
//   const dateTimeError = validateDateTime(values.appointment_date);
//   if (dateTimeError) {
//     errors.appointment_date = dateTimeError;
//   }

//   if (!values.duration) {
//     errors.duration = 'Duration is required.';
//   }

//   if (!values.hospital_location) {
//     errors.hospital_location = 'Hospital location is required.';
//   }

//   if (!values.reason) {
//     errors.reason = 'Reason for appointment is required.';
//   }

//   if (!values.notes) {
//     errors.notes = 'Notes are required.';
//   } else if (values.notes.length > 300) {
//     errors.notes = 'Notes cannot exceed 300 characters.';
//   }

//   return errors;
// };

// Component
const PatientIntakeNew = () => {
  const { axios } = useAxiosInterceptor();
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [doctors, setDoctors] = useState([]);
  const [officePhone, setOfficePhone] = useState();
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [id, setId] = useState('');
  const [smsText, setSmsText] = useState('');
  const [mobile, setMobile] = useState(''); //patient Phone Number
  const [name, setName] = useState('');
  const [appointmentDateandTime, setAppointmentDateandTime] = useState('');
  // const [stateForSmsApi, setStateForSmsApi] = useState(false);
  const [doctorsPhNo, setDoctorsPhNo] = useState('');
  const [doctorPracticeName, setDoctorPracticeName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [smsTemplateResponseData, setSmsTemeplateResponseData] = useState([]);
  const [genders, SetGenders] = useState([]);
  const [showCreatePatient, setShowCreatePatient] = useState(false);

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
      console.error('Failed to fetch user data new patient');
    }
  };
  const fetchGender = async () => {
    try {
      const response = await axios.get(`/fieldValues/genders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('res', response.data.data);
      SetGenders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user data new patient', error);
    }
  };

  // useEffect(() => {
  //   fetchDoctorOffice();
  //   fetchGender();
  // }, []);

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
        console.error('Unexpected data structure from API');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // console.error(t('Error fetching doctors'));
      setDoctors([]); // Reset doctors state on error
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
     fetchDoctorOffice();
    fetchGender();
  }, []);

  // State to track personal details and errors
  const [personalDetails, setPersonalDetails] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    dob: null,
    gender: '',
    preferred_doctor: ''
  });

  const [errors, setErrors] = useState({});

  // State for Appointment Details
  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_date: null,
    duration: '',
    hospital_location: '',
    reason: '',
    notes: ''
  });

  // State for SMS Details
  // const [smsDetails, setSmsDetails] = useState({
  //   message: ''
  // });

  // Handle change for Personal Details (validate on change)
  const handleChangePersonalDetails = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });

    // Validate field on change
    const newErrors = validatePersonalDetails({
      ...personalDetails,
      [name]: value
    });
    setErrors({ ...errors, [name]: newErrors[name] });
  };

  // Handle Date of Birth change
  const handleDateChange = (date) => {
    setPersonalDetails({ ...personalDetails, dob: date });

    // Validate date on change
    const newErrors = validatePersonalDetails({
      ...personalDetails,
      dob: date
    });
    setErrors({ ...errors, dob: newErrors.dob });
  };

  // Handle change for Appointment Details
  const handleChangeAppointmentDetails = (e) => {
    const { name, value } = e.target;

    setAppointmentDetails({ ...appointmentDetails, [name]: value });

    // Field-specific validation
    let error = null;
    switch (name) {
      case 'duration':
        error = validateDuration(value);
        break;
      case 'hospital_location':
        error = validateLocation(value);
        break;
      case 'reason':
        error = validateReason(value);
        break;
      case 'notes':
        error = validateNotes(value);
        break;
      default:
        break;
    }

    // Set the error only for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  // Handle Date Change for Appointment Date and Time
  const handleAppointmentDateChange = (newDateTime) => {
    setAppointmentDetails({
      ...appointmentDetails,
      appointment_date: newDateTime
    });

    // Validate DateTime
    const dateTimeError = validateDateTime(newDateTime);

    // Set error for the appointment_date field only
    setErrors((prevErrors) => ({
      ...prevErrors,
      appointment_date: dateTimeError
    }));
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
      const headersPayload = {
        patientFname: personalDetails.first_name,
        patientLname: personalDetails.last_name,
        patientPhNum: personalDetails.phone,
        patientDob: dayjs(personalDetails.dob).format('YYYY-MM-DD'),
        doctorId: personalDetails.preferred_doctor,
        patientGender: personalDetails.gender
      };

      const response = await axios.post(`/patientCreate`, headersPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        toast.success(t('Patient created successfully!'));
        setId(response.data.data.id);
        const selectedDoctor = doctors.find(
          (doctor) => doctor.id === personalDetails.preferred_doctor
        );

        if (selectedDoctor) {
          setDoctorsPhNo(selectedDoctor.cell_phone || '');
          setDoctorPracticeName(selectedDoctor.practice_group_name || '');
        }
        setActiveStep((prevStep) => prevStep + 1); // Move to the next step
      } else {
        toast.error(
          response.data.message || t('Failed to validate personal information')
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t('Something went wrong. Please try again')
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit for Appointment Details
  const handleSubmitAppointmentDetails = async () => {
    const dateTimeError = validateDateTime(appointmentDetails.appointment_date);
    const durationError = validateDuration(appointmentDetails.duration);
    const locationError = validateLocation(
      appointmentDetails.hospital_location
    );
    const reasonError = validateReason(appointmentDetails.reason);
    const notesError = validateNotes(appointmentDetails.notes);

    const validationErrors = {
      appointment_date: dateTimeError,
      duration: durationError,
      hospital_location: locationError,
      reason: reasonError,
      notes: notesError
    };

    // Filter out fields with no errors
    const filteredErrors = Object.keys(validationErrors).reduce((acc, key) => {
      if (validationErrors[key]) {
        acc[key] = validationErrors[key];
      }
      return acc;
    }, {});

    // If there are any errors, stop the submission
    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    setAppointmentDateandTime(
      dayjs(appointmentDetails.appointment_date).format('YYYY-MM-DDTHH:mm')
    );

    setLoading(true);

    const headersPayload = {
      patientId: id,
      scheduleDateTime: dayjs(appointmentDetails.appointment_date).format(
        'YYYY-MM-DDTHH:mm'
      ),
      duration: appointmentDetails.duration,
      office_location: appointmentDetails.hospital_location,
      reason: appointmentDetails.reason,
      notes: appointmentDetails.notes,
      doctorId: personalDetails.preferred_doctor, // Assuming doctor ID is static or passed from props
      patientReSchedule: false
    };

    const smsTemplateDetails = {
      patientId: id,
      patientName: name,
      scheduleDateTime: dayjs(appointmentDetails.appointment_date).format(
        'YYYY-MM-DDTHH:mm'
      ),
      patientPhNum: mobile,
      doctor_PraticeName: doctorPracticeName,
      patient_is_new: true,
      doctorId: personalDetails.preferred_doctor // Assuming doctor ID is static or passed from props
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

        setSmsTemeplateResponseData(smsResponse.data.data.message_template);
        toast.success(t('Appointment created successfully!'));

        setActiveStep((prevStep) => prevStep + 1); // Move to the next step
      } else if (response.data.status === 409) {
        toast.error(
          response.data.message ||
            t(
              'The chosen time slot is unavailable. Please choose another time slot'
            )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t('Something went wrong. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate);
    toast.success(t('SMS copied Successfully'));
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
    setSmsText(event.target.value);
  };

  // const [showNavButton, setShowNavButton] = useState(false);

  // Handle Submit for SMS Information
  const handleSubmitSms = async () => {
    setLoading(true);

    try {
      const cleanedPhoneNumber = mobile.replace(/\D/g, '');

      const response = await axios.post(
        `/sms/toPatient`,
        {
          message: selectedTemplate,
          patientPhNum: `+1${cleanedPhoneNumber}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success(t('SMS sent successfully!'));
        // Show the "Create Patient" button and hide SMS buttons
        setShowCreatePatient(true);
        // // setShowNavButton(true);
        // const delayedAction = () => {
        //   handleCreatePatient();
        //   // setIsRegistrationComplete(true); // Set registration complete on success
        // };

        // setTimeout(delayedAction, 10000); // 10000 milliseconds = 10 seconds
      } else {
        toast.error(t('Failed to Send SMS'));
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.detail ||
            t('SMS sending failed. Please try again.')
        );
      } else {
        toast.error(t('Something went wrong. Please try again'));
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
        <title>Patient Register</title>
      </Helmet>
      <MainContent>
        <Container sx={{ my: 2 }} maxWidth="md">
          <Card sx={{ mt: -1.5, pt: 4 }}>
            <Box px={4}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {t('Add New Patient')}
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
                {[
                  t('Personal Information'),
                  t('Appointment Details'),
                  t('Send SMS')
                ].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Box py={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('First Name')}
                        name="first_name"
                        value={personalDetails.first_name}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('Last Name')}
                        name="last_name"
                        value={personalDetails.last_name}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('Phone')}
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
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t('Date of Birth')}
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
                        label={t('Gender')}
                        name="gender"
                        value={personalDetails.gender}
                        onChange={handleChangePersonalDetails}
                        error={!!errors.gender}
                        helperText={errors.gender}
                      >
                        {genders?.map((gender, index) => (
                          <MenuItem key={index} value={gender?.id}>
                            {gender?.value}
                          </MenuItem>
                        ))}
                        {/* <MenuItem value="UNK">Choose not to disclose</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Other">Other</MenuItem> */}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Preferred Doctor')}
                        name="preferred_doctor"
                        value={personalDetails.preferred_doctor}
                        onChange={handleChangePersonalDetails}
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
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitPersonalInfo}
                      sx={{ my: 3 }}
                      disabled={loading}
                    >
                      {t('Register a patient')}
                      {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                    </Button>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box py={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDateTimePicker
                          label={t('Appointment Date & Time')}
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
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Duration')}
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
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Hospital Location')}
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
                    <Grid item xs={12} sm={6} md={6}></Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        label={t('Reason')}
                        name="reason"
                        value={appointmentDetails.reason}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.reason}
                        helperText={errors.reason}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        label={t('Additional Notes')}
                        name="notes"
                        value={appointmentDetails.notes}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.notes}
                        helperText={errors.notes}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={handleSubmitAppointmentDetails}
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {t('Add appointment')}
                    {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                  </Button>
                </Box>
              )}

              {activeStep === 2 && (
                <Box py={3}>
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
                                {t('No SMS Available')}
                              </Typography>
                            )}

                            <Grid item xs={12} sx={{ mt: 2 }}>
                              {smsText && !showCreatePatient && (
                                <>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      gap: '10px'
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={handleSubmitSms}
                                      disabled={loading}
                                      sx={{ mt: 2 }}
                                    >
                                      <SendIcon sx={{ padding: '0 5px 0 0' }} />
                                      {t('Send SMS')}
                                      {loading && (
                                        <CircularProgress
                                          size={24}
                                          sx={{ ml: 2 }}
                                        />
                                      )}
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      onClick={handleCopy}
                                      sx={{ mt: 2 }}
                                    >
                                      <ContentCopyIcon
                                        sx={{ padding: '0 5px 0 0' }}
                                      />
                                      {t('Copy SMS')}
                                    </Button>
                                  </Box>
                                </>
                              )}

                              {showCreatePatient && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 2
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreatePatient}
                                  >
                                    {t('Create Patient')}
                                  </Button>
                                </Box>
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

export default PatientIntakeNew;
