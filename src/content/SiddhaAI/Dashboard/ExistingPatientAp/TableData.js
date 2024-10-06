import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Field, Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import * as Yup from 'yup';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SendIcon from '@mui/icons-material/Send';

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

const MainContent = styled(Box)`
  height: 100%;
  overflow: auto;
  flex: 1;
`;

const BoxActions = styled(Box)`
  background: ${(props) => props.theme.colors.alpha.black[5]};
`;

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

const appointmentDetailsSchema = Yup.object({
  appointment_date: Yup.mixed().test(
    'custom-date-time-validation',
    null,
    validateDateTime
  ),

  // time_Zone: Yup.string().required('Time Zone is required'),
  duration: Yup.string().required('Duration is required'),
  hospital_location: Yup.string().required('Hospital Location is required'),
  reason: Yup.string()
    .required('Reason is required')
    .max(100, 'Reason cannot exceed 100 characters'),
  notes: Yup.string()
    .required('notes is required')
    .max(1000, 'Additional notes cannot exceed 1000 characters'),
  preferred_doctor: Yup.string().required('Preferred doctor is required')
});

const completeRegistrationSchema = Yup.object({
  notes: Yup.string()
});

const TableData = ({ selectedPatient }) => {
  console.log('selectedPatient existing', selectedPatient);

  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const theme = useTheme();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleBack = () => setStep((prevStep) => prevStep - 1);
  const [smsText, setSmsText] = useState('');
  const [appointmentDateandTime, setAppointmentDateandTime] = useState('');
  // const [appointmenttimeZone, setAppointmenttimeZone] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [stateForSmsApi, setStateForSmsApi] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorsPhNo, setDoctorsPhNo] = useState('');
  const [doctorPracticeName, setDoctorPracticeName] = useState('');
  const [selectedOffices, setSelectedOffices] = useState([]);

  const [selectedPatientId, setSelectedPatientId] = useState(''); // ID of the selected patient for radio button selection
  const [dateTimeError, setDateTimeError] = useState(null);
  const token = localStorage.getItem('token');
  const [smsTemplateResponseData, setSmsTemplateResponseData] = useState([]);
  // State to handle the selected radio button
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [officePhone, setOfficePhone] = useState();
  const [showExitingPatient, setShowExitingPatient] = useState(false);

  // Function to handle radio button change
  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
    setSmsText(event.target.value);
  };

  const handleCreatePatient = (resetForm) => {
    window.location.reload();
    resetForm();
  };
  const fetchDoctorOffice = async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOfficePhone(
        response.data.drchronoDoctoresDetail.results[0].office_phone
      );

      const { drchronoOfficeLocation } = response.data;
      const officeLocations = drchronoOfficeLocation.results;
      setSelectedOffices(officeLocations);
    } catch (error) {
      console.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchDoctorOffice();
  }, []);

  const fetchDoctors = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { drchronoDoctoresDetail } = response.data;

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

  useEffect(() => {
    // console.log('patient Existing Ap', patient);
    if (selectedPatient) {
      // console.log('Selected Patient Details:', selectedPatient);
      setSelectedPatientId(selectedPatient);
    }
  }, []);

  // console.log('selectedPatientId', selectedPatientId.patientid);

  const handleCopy = () => {
    navigator.clipboard.writeText(smsText);
    toast.success('SMS copied Successfully');
  };
  const handleSubmitCompleteRegistration = async () => {
    setLoading(true);
    try {
      // Clean the phone number to remove any non-numeric characters
      const cleanedPhoneNumber = selectedPatientId?.patientPhNum.replace(
        /\D/g,
        ''
      );

      const response = await axios.post(
        `/sms/toPatient`,
        {
          message: selectedTemplate,
          patientPhNum: `+1${cleanedPhoneNumber}` // Use cleaned phone number here
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('SMS sent successfully!');
        setShowExitingPatient(true);
        // const delayedAction = () => {
        //   handleCreatePatient();
        //   // setIsRegistrationComplete(true); // Set registration complete on success
        // };

        // setTimeout(delayedAction, 3000); // 3000 milliseconds = 3 seconds
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

  const handleSubmitAppointmentDetails = async (values, { setSubmitting }) => {
    setAppointmentDateandTime(
      dayjs(values.appointment_date).format('YYYY-MM-DDTHH:mm')
    );
    // setAppointmenttimeZone(values.time_Zone);
    setOfficeLocation(values.hospital_location);

    setLoading(true);
    try {
      const headersPayload = {
        patientId: parseInt(selectedPatientId?.patientid),
        scheduleDateTime: dayjs(values.appointment_date).format(
          'YYYY-MM-DDTHH:mm:ss'
        ),
        duration: values.duration,
        office_location: values.hospital_location,
        reason: values.reason,
        notes: values.notes,
        doctorId: values.preferred_doctor
      };

      const smsTemplateDetails = {
        patientId: parseInt(selectedPatientId?.patientid),
        doctorId: values.preferred_doctor,
        // doctor_phone: officePhone,
        patientName: selectedPatientId?.patientName,
        scheduleDateTime: dayjs(values.appointment_date).format(
          'YYYY-MM-DDTHH:mm:ss'
        ),
        patientPhNum: selectedPatientId?.patientPhNum,
        // timeZone: appointmenttimeZone,
        // doctor_PraticeName: doctorPracticeName,
        // office_location: values.hospital_location,
        patient_is_new: selectedPatientId?.patient_is_new,
        patientReSchedule: true,
        document_id: selectedPatientId?.document_id
        // NpiNumber:selectedPatientId?.NpiNumber
      };

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
        //get sms template
        const response = await axios.post(`/sms`, smsTemplateDetails, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setSmsTemplateResponseData(response.data.data.message_template);

        toast.success('Appointment created successfully!');

        // Find the selected doctor based on doctorId
        const selectedDoctor = doctors.find(
          (doctor) => doctor.id === values.preferred_doctor
        );

        // Set the phone number and practice name of the selected doctor
        if (selectedDoctor) {
          setDoctorsPhNo(selectedDoctor.cell_phone || '');
          setDoctorPracticeName(selectedDoctor.practice_group_name || '');
        }

        setStep((prevStep) => prevStep + 1);
        setStateForSmsApi(true);
      } else if (response?.data?.status === 409) {
        toast.error(
          'The chosen time slot is unavailable for schedule! Choose another time slot.'
        );
      } else {
        console.error(
          response.data.message ||
            'Failed to create appointment. Please try again.'
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  // console.log(step, 'step 2');

  const handleSubmit = async (values, { setSubmitting }) => {
    if (step === 0) {
      await handleSubmitAppointmentDetails(values, { setSubmitting });
    } else if (step === 1 || stateForSmsApi === true) {
      await handleSubmitCompleteRegistration(values, { setSubmitting });
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <Helmet>
        <title>Re-Schedule Existing Patient</title>
      </Helmet>
      <MainContent>
        <Container sx={{ my: 2 }} maxWidth="md">
          <Card sx={{ mt: -1.5, pt: 4 }}>
            <Formik
              initialValues={{
                preferred_doctor: '',
                appointment_date: null,
                duration: '',
                hospital_location: '',
                reason: '',
                notes: ''
              }}
              validationSchema={
                step === 0
                  ? appointmentDetailsSchema
                  : step === 1
                  ? completeRegistrationSchema
                  : completeRegistrationSchema
              }
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Stepper alternativeLabel activeStep={step}>
                    {['Appointment Details', 'Send SMS'].map((label, index) => (
                      <Step key={label} completed={step > index}>
                        <StepLabel>{t(label)}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {step === 0 && (
                    <Box p={4}>
                      <Typography variant="h6" sx={{ marginY: 3 }}>
                        {`Schedule an Appointment for: ${selectedPatientId?.patientName}`}
                      </Typography>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Field name="appointment_date">
                            {({ field, form }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  sx={{
                                    width: '100%'
                                  }}
                                  ampm={true} // Enables the AM/PM selector
                                  disablePast={true} // Disables past dates
                                  label="Appointment Date & Time"
                                  value={field.value}
                                  onChange={(newValue) => {
                                    form.setFieldValue(
                                      field.name,
                                      newValue ? dayjs(newValue).toDate() : null
                                    );
                                    setDateTimeError(
                                      validateDateTime(newValue)
                                    ); // Validate the date and time
                                  }}
                                  minutesStep={5} // Sets the interval for time selection
                                  onError={(error) => setDateTimeError(error)} // Capture any error in date selection
                                  views={[
                                    'year',
                                    'month',
                                    'day',
                                    'hours',
                                    'minutes'
                                  ]} // Enables grid-like view for time
                                  slotProps={{
                                    actionBar: {
                                      actions: ['clear', 'cancel', 'accept'] // Shows the action buttons including 'OK'
                                    },
                                    textField: {
                                      error:
                                        Boolean(dateTimeError) ||
                                        (!field.value &&
                                          touched.appointment_date),
                                      helperText:
                                        dateTimeError ||
                                        (!field.value &&
                                          touched.appointment_date &&
                                          'Date and time are required.')
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={
                                        Boolean(dateTimeError) ||
                                        (!field.value &&
                                          touched.appointment_date)
                                      }
                                      helperText={
                                        dateTimeError ||
                                        (!field.value &&
                                          touched.appointment_date &&
                                          'Date and time are required.')
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          </Field>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Field name="duration">
                            {({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label={t('Duration')}
                                select
                                error={Boolean(
                                  touched.duration && errors.duration
                                )}
                                helperText={touched.duration && errors.duration}
                              >
                                <MenuItem value="30">30</MenuItem>
                                <MenuItem value="60">60</MenuItem>
                                <MenuItem value="90">90</MenuItem>
                              </TextField>
                            )}
                          </Field>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Field name="hospital_location">
                            {({
                              field,
                              form: { setFieldValue, touched, errors }
                            }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                label={t('Hospital Location')}
                                placeholder={t('Enter Hospital Location...')}
                                error={Boolean(
                                  touched.hospital_location &&
                                    errors.hospital_location
                                )}
                                helperText={
                                  touched.hospital_location &&
                                  errors.hospital_location
                                }
                                onChange={(event) => {
                                  setFieldValue(
                                    'hospital_location',
                                    event.target.value
                                  );
                                }}
                              >
                                {selectedOffices?.map((office) => (
                                  <MenuItem key={office?.id} value={office?.id}>
                                    {office?.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          </Field>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field name="preferred_doctor">
                            {({
                              field,
                              form: { setFieldValue, touched, errors }
                            }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                label={t('Preferred Doctor')}
                                placeholder={t('Enter preferred doctor...')}
                                error={Boolean(
                                  touched.preferred_doctor &&
                                    errors.preferred_doctor
                                )}
                                helperText={
                                  touched.preferred_doctor &&
                                  errors.preferred_doctor
                                }
                                onChange={(event) => {
                                  setFieldValue(
                                    'preferred_doctor',
                                    event.target.value
                                  );
                                }}
                              >
                                {doctors?.map((doctor) => (
                                  <MenuItem key={doctor?.id} value={doctor?.id}>
                                    {doctor?.first_name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          </Field>
                        </Grid>

                        <Grid item xs={12}>
                          <Field name="reason">
                            {({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={1}
                                label={t('Reason')}
                                placeholder={t(
                                  'Enter reason for appointment...'
                                )}
                                error={Boolean(touched.reason && errors.reason)}
                                helperText={touched.reason && errors.reason}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item xs={12}>
                          <Field name="notes">
                            {({ field }) => (
                              <TextField
                                {...field}
                                rows={4}
                                multiline
                                fullWidth
                                label={t('Additional Notes')}
                                placeholder={t(
                                  'Enter notes for appointment...'
                                )}
                                error={Boolean(touched.notes && errors.notes)}
                                helperText={touched.notes && errors.notes}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {step === 1 && (
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
                                  smsTemplateResponseData.map(
                                    (template, index) => (
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
                                                  onChange={
                                                    handleTemplateChange
                                                  }
                                                >
                                                  <FormControlLabel
                                                    value={
                                                      template.messageContent
                                                    } // Correctly use messageContent as value
                                                    control={<Radio />}
                                                    label={
                                                      template.messageContent
                                                    } // Display the message content
                                                  />
                                                </RadioGroup>
                                              </FormControl>
                                            </CardContent>
                                          </CardIndicatorWrapper>
                                        </Card>
                                      </Grid>
                                    )
                                  )
                                ) : (
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                  >
                                    No sms available.
                                  </Typography>
                                )}

                                {/* <Grid item xs={12} sx={{ mt: 2 }}>
                                  {smsText && (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                          gap: '10px'
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          type="submit"
                                          onClick={handleSubmit}
                                          disabled={loading}
                                          sx={{ height: '45px' }}
                                        >
                                          <SendIcon
                                            sx={{ padding: '0 5px 0 0' }}
                                          />
                                          Send SMS
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
                                          sx={{
                                            mb: 2
                                          }}
                                        >
                                          <ContentCopyIcon
                                            sx={{ padding: '0 5px 0 0' }}
                                          />
                                          Copy SMS
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </Grid> */}

                                <Grid item xs={12} sx={{ mt: 2 }}>
                                  {smsText && !showExitingPatient && (
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
                                          onClick={handleSubmit}
                                          disabled={loading}
                                          sx={{ mt: 2 }}
                                        >
                                          <SendIcon
                                            sx={{ padding: '0 5px 0 0' }}
                                          />
                                          Send SMS
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
                                          Copy SMS
                                        </Button>
                                      </Box>
                                    </>
                                  )}

                                  {showExitingPatient && (
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
                                        Dashboard
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

                  {step === 0 && (
                    <BoxActions>
                      <Box p={2} display="flex" sx={{ ml: '20px' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting || loading}
                        >
                          {t('Add appointment')}
                          {loading && (
                            <CircularProgress size={24} sx={{ ml: 2 }} />
                          )}
                        </Button>
                      </Box>
                    </BoxActions>
                  )}

                  {step > 0 && (
                    <BoxActions>
                      <Box p={2} display="flex" justifyContent="center">
                        {step > 0 && (
                          <Button
                            sx={{ display: 'none' }}
                            variant="outlined"
                            onClick={handleBack}
                            disabled={isSubmitting || loading}
                          >
                            {t('Back')}
                          </Button>
                        )}
                        {/* Add additional actions if necessary for other steps */}
                      </Box>
                    </BoxActions>
                  )}
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </MainContent>
    </>
  );
};

export default TableData;
