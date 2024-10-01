// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import {
//   Box,
//   Button,
//   Card,
//   CardActions,
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
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   useTheme
// } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import { Field, Form, Formik } from 'formik';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { toast, Toaster } from 'react-hot-toast';
// import { useTranslation } from 'react-i18next';
// import { IMaskInput } from 'react-imask';
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import * as Yup from 'yup';

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

//   phone: Yup.string()
//     // .matches(/^[2-9]\d{9}$/, 'Invalid phone number')
//     .max(14, 'Phone Number maximum allowed is 10 characters')
//     .required('Phone number is required')
//   // dob: Yup.date()
//   //   .nullable()
//   //   .required('Date of birth is required')
//   //   .max(dayjs().toDate(), 'Date cannot be in the future')
// });

// const appointmentDetailsSchema = Yup.object({
//   appointment_date: Yup.mixed().test(
//     'custom-date-time-validation',
//     null,
//     validateDateTime
//   ),

//   // time_Zone: Yup.string().required('Time Zone is required'),
//   duration: Yup.string().required('Duration is required'),
//   hospital_location: Yup.string().required('Hospital Location is required'),
//   reason: Yup.string().required('Reason is required'),
//   notes: Yup.string().required('notes is required'),
//   preferred_doctor: Yup.string().required('Preferred doctor is required')
// });

// const completeRegistrationSchema = Yup.object({
//   notes: Yup.string()
// });

// const TableData = () => {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const theme = useTheme();

//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   // const [patient_id, setPatient_id] = useState('');
//   const handleBack = () => setStep((prevStep) => prevStep - 1);
//   const [smsText, setSmsText] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [name, setName] = useState('');
//   const [appointmentDateandTime, setAppointmentDateandTime] = useState('');
//   const [appointmenttimeZone, setAppointmenttimeZone] = useState('');
//   const [officeLocation, setOfficeLocation] = useState('');
//   const [stateForSmsApi, setStateForSmsApi] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [doctorsPhNo, setDoctorsPhNo] = useState('');
//   const [doctorPracticeName, setDoctorPracticeName] = useState('');
//   const [selectedOffices, setSelectedOffices] = useState([]);
//   const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

//   const [selectedPatientId, setSelectedPatientId] = useState(''); // ID of the selected patient for radio button selection
//   const [selectedPatient, setSelectedPatient] = useState(false);
//   const [patients, setPatients] = useState(); // State to hold the list of patients
//   const [dateTimeError, setDateTimeError] = useState(null);
//   const token = localStorage.getItem('token');
//   const [smsTemplateResponseData, setSmsTemeplateResponseData] = useState([]);
//   // State to handle the selected radio button
//   const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [officePhone, setOfficePhone] = useState();

//   // Function to handle radio button change
//   const handleTemplateChange = (event) => {
//     setSelectedTemplate(event.target.value);
//     setSmsText(event.target.value);
//   };
//   // console.log(selectedTemplate, 'selected Template');

//   // const templateArray = Object.values(smsTemplateResponseData);

//   const handleCreatePatient = (resetForm) => {
//     window.location.reload();
//     // setStep();
//     resetForm();
//   };
//   const fetchDoctorOffice = async () => {
//     try {
//       const response = await axios.get(`/drchronoDoctorDetails`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setOfficePhone(
//         response.data.drchronoDoctoresDetail.results[0].office_phone
//       );

//       const { drchronoOfficeLocation } = response.data;
//       const officeLocations = drchronoOfficeLocation.results;
//       setSelectedOffices(officeLocations);
//     } catch (error) {
//       console.error('Failed to fetch user data');
//     }
//   };

//   useEffect(() => {
//     fetchDoctorOffice();
//   }, []);

//   const fetchDoctors = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`/drchronoDoctorDetails`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Log the response to debug
//       // console.log('API Response:', response.data);

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

//   const handleCopy = () => {
//     navigator.clipboard.writeText(smsText);
//     toast.success('SMS copied Successfully');
//   };
//   const handleSubmitCompleteRegistration = async () => {
//     setLoading(true);
//     try {
//       // Clean the phone number to remove any non-numeric characters
//       const cleanedPhoneNumber = mobile.replace(/\D/g, '');

//       const response = await axios.post(
//         `/sms/toPatient`,
//         {
//           message_template: selectedTemplate,
//           patientPhNum: `+1${cleanedPhoneNumber}` // Use cleaned phone number here
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
//         toast.error('Failed to Send SMS.');
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
//     }
//   };

//   const handleSubmitPersonalInfo = async (values, { setSubmitting }) => {
//     setName(values.first_name);
//     setMobile(values.phone);

//     setLoading(true);
//     try {
//       // const token = localStorage.getItem('token');
//       const headersPayload = {
//         patientFname: values.first_name,
//         patientPhNum: values.phone
//         // patientDob: dayjs(values.dob).format('YYYY-MM-DD')
//       };

//       const response = await axios.post(`/existingPatients`, headersPayload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.data.status === 200) {
//         setPatients(response?.data?.data);
//         setSelectedPatient(true);
//         // setStep((prevStep) => prevStep + 1); // Move to the next step
//         // console.log(step, 'step 0');
//       } else {
//         toast.error(
//           response.data.message || 'Failed to validate personal information.'
//         );
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setSelectedPatient(false);
//         // No patient found
//         toast.error('No patient found with the provided details.');
//       } else {
//         // General error handling
//         toast.error(
//           error.response?.data?.detail ||
//             'An unexpected error occurred. Please try again.'
//         );
//       }
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   const handleSelectPatient = (patientId) => {
//     const patient = patients.find((p) => p.patient_id === patientId);
//     setSelectedPatient(patient); // Store the full patient object
//     setSelectedPatientId(patientId);
//   };

//   // console.log('selectedPatient', selectedPatient.patient_id);

//   const handleSubmitAppointmentDetails = async (values, { setSubmitting }) => {
//     // setAppointmentDateandTime(
//     //   dayjs(values.appointment_date).format('YYYY-MM-DDTHH:mm')
//     // );
//     setAppointmentDateandTime(
//       dayjs(values.appointment_date).format('YYYY-MM-DDTHH:mm')
//     );
//     // setAppointmenttimeZone(values.time_Zone);
//     setOfficeLocation(values.hospital_location);

//     setLoading(true);
//     try {
//       // const token = localStorage.getItem('token');
//       const headersPayload = {
//         patientId: selectedPatient.patient_id,
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
//         patientid: selectedPatient.patient_id,
//         doctor_phone: officePhone,
//         patientName: name,
//         scheduleDateTime: dayjs(values.appointment_date).format(
//           'YYYY-MM-DDTHH:mm'
//         ),
//         patientPhNum: mobile,
//         timeZone: appointmenttimeZone,
//         doctor_PraticeName: doctorPracticeName,
//         office_location: values.hospital_location,
//         patient_is_new: false
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

//       // console.log(step, 'step 2');

//       if (response?.data?.status === 201) {
//         //get sms template
//         const response = await axios.post(`/sms`, smsTemplateDetails, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         setSmsTemeplateResponseData(response.data.data.message_template);

//         toast.success('Appointment created successfully!');

//         // Find the selected doctor based on doctorId
//         const selectedDoctor = doctors.find(
//           (doctor) => doctor.id === values.preferred_doctor
//         );

//         // Set the phone number and practice name of the selected doctor
//         if (selectedDoctor) {
//           setDoctorsPhNo(selectedDoctor.cell_phone || '');
//           setDoctorPracticeName(selectedDoctor.practice_group_name || '');
//         }

//         setStep((prevStep) => prevStep + 1);
//         setStateForSmsApi(true);
//       } else if (response?.data?.status === 409) {
//         toast.error(
//           'The chosen time slot is unavailable for schedule! Choose another time slot.'
//         );
//       } else {
//         console.error(
//           response.data.message ||
//             'Failed to create appointment. Please try again.'
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
//   // console.log(step, 'step 2');
//   console.log('smsTemplateResponseDataaaa', smsTemplateResponseData);

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

//   return (
//     <>
//       <Toaster position="bottom-right" />
//       <Helmet>
//         <title>Get Existing Patient</title>
//       </Helmet>
//       <MainContent>
//         <Container sx={{ my: 2 }} maxWidth="md">
//           <Card sx={{ mt: -1.5, pt: 4 }}>
//             <Box px={4}>
//               <Typography variant="h2" sx={{ mb: 1 }}>
//                 {t('Get Existing Patient')}
//               </Typography>
//             </Box>

//             <Formik
//               initialValues={{
//                 first_name: '',
//                 last_name: '',
//                 phone: '',
//                 gender: '',
//                 // dob: null,
//                 preferred_doctor: '',
//                 // appointment_date: null,
//                 duration: '',
//                 // time_Zone: '',
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
//               {({ isSubmitting, errors, touched, setFieldValue }) => (
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
//                       <Grid container spacing={2}>
//                         <Grid item xs={6}>
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
//                         <Grid item xs={6}>
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

//                         <Grid item xs={12} md={12} sx={{ textAlign: 'center' }}>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             type="submit"
//                             disabled={isSubmitting || loading}
//                           >
//                             {t('Get Patient')}
//                             {loading && (
//                               <CircularProgress size={24} sx={{ ml: 2 }} />
//                             )}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   )}

//                   {step === 0 && selectedPatient && (
//                     <>
//                       {/* TableContainer with a fixed height and overflow auto for scrolling */}
//                       <TableContainer
//                         component={Paper}
//                         sx={{
//                           maxHeight: '300px', // Set the height limit
//                           overflowY: 'auto', // Enable vertical scrolling if content exceeds height
//                           padding: '0 20px'
//                         }}
//                       >
//                         <Table stickyHeader>
//                           {' '}
//                           {/* stickyHeader keeps the header visible when scrolling */}
//                           <TableHead>
//                             <TableRow>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 Select
//                               </TableCell>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 Chart Id
//                               </TableCell>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 First Name
//                               </TableCell>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 Date of Birth
//                               </TableCell>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 Gender
//                               </TableCell>
//                               <TableCell sx={{ textAlign: 'center' }}>
//                                 Phone
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {patients.map((patient) => (
//                               <TableRow key={patient.patient_id}>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   <Radio
//                                     checked={
//                                       selectedPatientId === patient.patient_id
//                                     }
//                                     onChange={() =>
//                                       handleSelectPatient(patient.patient_id)
//                                     }
//                                     value={patient.patient_id}
//                                     name="select-patient"
//                                   />
//                                 </TableCell>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   {patient.chart_id}
//                                 </TableCell>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   {patient.first_name}
//                                 </TableCell>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   {patient.date_of_birth}
//                                 </TableCell>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   {patient.gender}
//                                 </TableCell>
//                                 <TableCell sx={{ textAlign: 'center' }}>
//                                   {patient.cell_phone}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </>
//                   )}

//                   {step === 0 && selectedPatient && (
//                     <div>
//                       <Box p={2} display="flex" justifyContent="center">
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={() => {
//                             if (selectedPatient) {
//                               setStep((prevStep) => prevStep + 1); // Move to the next step
//                             } else {
//                               toast.error(
//                                 'Please select a patient before proceeding'
//                               );
//                             }
//                           }}
//                           disabled={!selectedPatientId} // Disable button if no patient is selected
//                         >
//                           {t('Next')}
//                         </Button>
//                       </Box>
//                     </div>
//                   )}

//                   {step === 1 && (
//                     <Box p={4}>
//                       <Typography variant="h6" sx={{ marginY: 3 }}>
//                         {`Schedule an Appointment for: ${selectedPatient.first_name}`}
//                       </Typography>
//                       <Grid container spacing={4}>
//                         <Grid item xs={12} md={6}>
//                           <Field name="appointment_date">
//                             {({ field, form }) => (
//                               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DateTimePicker
//                                   sx={{
//                                     width: '100%'
//                                   }}
//                                   // This enables the AM/PM selector
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
//                         {/* <Grid item xs={12} md={6}>
//                           <Field name="time_Zone">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 label={t('Time Zone')}
//                                 select
//                                 error={Boolean(
//                                   touched.time_Zone && errors.time_Zone
//                                 )}
//                                 helperText={
//                                   touched.time_Zone && errors.time_Zone
//                                 }
//                               >
//                                 <MenuItem value="CST">CST</MenuItem>
//                                 <MenuItem value="EST">EST</MenuItem>
//                                 <MenuItem value="PST">PST</MenuItem>
//                               </TextField>
//                             )}
//                           </Field>
//                         </Grid> */}
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

//                         <Grid item xs={12} md={6}>
//                           <Field name="reason">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 fullWidth
//                                 rows={4}
//                                 sx={{ background: 'red' }}
//                                 label={t('Reason')}
//                                 placeholder={t(
//                                   'Enter reason for appointment...'
//                                 )}
//                                 error={Boolean(touched.reason && errors.reason)}
//                                 helperText={touched.reason && errors.reason}
//                               />
//                             )}
//                           </Field>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <Field name="notes">
//                             {({ field }) => (
//                               <TextField
//                                 {...field}
//                                 rows={4}
//                                 multiline
//                                 fullWidth
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
//                         spacing={2}
//                         component="main"
//                         sx={{ display: 'flex', justifyContent: 'center' }}
//                       >
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
//                             <Box component="div" noValidate sx={{ mt: 3 }}>
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

//                   {step !== 0 && (
//                     <BoxActions>
//                       <Box p={2} display="flex" justifyContent="center">
//                         {step > 0 && (
//                           <Button
//                             variant="outlined"
//                             style={{ display: 'none' }}
//                             onClick={handleBack}
//                             disabled={isSubmitting || loading}
//                           >
//                             {t('Back')}
//                           </Button>
//                         )}
//                         {step < 2 ? (
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             type="submit"
//                             disabled={isSubmitting || loading}
//                           >
//                             {t('Next')}
//                             {loading && (
//                               <CircularProgress size={24} sx={{ ml: 2 }} />
//                             )}
//                           </Button>
//                         ) : isRegistrationComplete === true ? (
//                           <Button
//                             style={{ display: 'none' }}
//                             variant="contained"
//                             color="primary"
//                             type="submit"
//                             disabled={isSubmitting || loading}
//                           >
//                             {t('Appointment Schedule')}
//                             {loading && (
//                               <CircularProgress size={24} sx={{ ml: 2 }} />
//                             )}
//                           </Button>
//                         ) : null}
//                       </Box>
//                     </BoxActions>
//                   )}
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
      patient_is_new: false,
      doctorId: appointmentDetails.preferred_doctor // Assuming doctor ID is static or passed from props
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
                <Box py={3}>
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
                        label="Phone"
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
                      {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
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
                            DOB
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
                              {dayjs(patient.date_of_birth).format(
                                'MM/DD/YYYY'
                              )}
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
                <>
                  <Box p={2} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      sx={{ my: 3 }}
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
                </>
              )}

              {activeStep === 1 && (
                <Box py={3}>
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
                  <Box sx={{ my: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitAppointmentDetails}
                      sx={{ mt: 3 }}
                      disabled={loading}
                    >
                      Add appointment
                      {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                    </Button>
                  </Box>
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
                                No sms available.
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
                                      Existing Patient
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
