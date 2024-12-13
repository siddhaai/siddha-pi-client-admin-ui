import React, {  useEffect, useState } from 'react';
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
  const nameRegex = /^[A-Za-z]+$/; // Only letters for first name
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // US phone format (XXX) XXX-XXXX

  // Validate first name
  if (!values.first_name) {
    errors.first_name = t('First name is required');
  } else if (values.first_name.length < 3) {
    errors.first_name = t('First name must be at least 3 characters');
  } else if (!nameRegex.test(values.first_name)) {
    errors.first_name = t('First name must contain only letters');
  }

  // Phone number validation
  if (!values.phone) {
    errors.phone = t('Phone number is required');
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = t('Phone number must be in the format (XXX) XXX-XXXX');
  } else if (['0', '1'].includes(values.phone[1])) {
    errors.phone = t('Phone number cannot start with 0 or 1 in the area code.');
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

// Validation for Appointment Details
const validateAppointmentDetails = (values) => {
  const errors = {};

  // Validate the DateTime using custom logic
  const dateTimeError = validateDateTime(values.appointment_date);
  if (dateTimeError) {
    errors.appointment_date = dateTimeError;
  }

  if (!values.duration) {
    errors.duration = t('Duration is required');
  }

  if (!values.hospital_location) {
    errors.hospital_location = t('Hospital location is required');
  }

  // Alpha-numeric validation for Reason
  const reasonRegex = /^[a-zA-Z0-9\s]*$/; // Allows only alphanumeric characters and spaces
  if (!values.reason) {
    errors.reason = t('Reason for appointment is required');
  } else if (!reasonRegex.test(values.reason)) {
    errors.reason = t('Reason can only contain letters and numbers');
  } else if (values.reason.length > 100) {
    errors.reason = t('Reason cannot exceed 100 characters');
  }

  if (!values.notes) {
    errors.notes = t('Additional Information are required');
  } else if (values.notes.length > 1000) {
    errors.notes = t('Additional Information cannot exceed 1000 characters');
  }

  if (!values.preferred_doctor) {
    errors.preferred_doctor = t('Preferred doctor is required');
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
  const [showExitingPatient, setShowExitingPatient] = useState(false);
  const [selectedOfficeAddress, setSelectedOfficeAddress] = useState(false);

  const [doctorNpi, setDoctorNpi] = useState('');

  const fetchDoctorOffice = async () => {
    try {
      const response = await axios.get('/getHospitalDetails', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { hospitalOfficeLocation } = response.data.data;

      if (hospitalOfficeLocation) {
        setSelectedOffices(hospitalOfficeLocation); // Save full data for later access
      } else {
        setSelectedOffices([]); // Handle missing office details
        console.error(
          'Unexpected data structure from API for office locations'
        );
      }
    } catch (error) {
      console.error('Failed to fetch office locations:', error);
    }
  };

  useEffect(() => {
    fetchDoctorOffice();
  }, []);



  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/getHospitalDetails', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const { hospitalDoctorsDetail } = response.data.data;
  
      if (hospitalDoctorsDetail) {
        const formattedDoctors = hospitalDoctorsDetail.map((doctor) => ({
          id: doctor?.emr_doctor_id,
          name: doctor?.doctor_name,
          npi_number: doctor?.npi_number // Include npi_number
        }));
        setDoctors(formattedDoctors);
      } else {
        setDoctors([]); // Handle case when doctor details are missing
        console.error('Unexpected data structure from API for doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]); // Reset doctors state on error
    }
  };
  

  useEffect(() => {
    fetchDoctors();
  }, []);

  // State for Personal Details
  const [personalDetails, setPersonalDetails] = useState({
    first_name: '',
    phone: ''
  });

  // State for Appointment Details
  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_date: null,
    duration: '',
    hospital_location: '',
    reason: '',
    notes: '',
    preferred_doctor: '',
    doctor_npi: '' // New state for storing NPI number
  });

  const [errors, setErrors] = useState({});

  // Handle change for Personal Details with real-time validation
  const handleChangePersonalDetails = (e) => {
    const { name, value } = e.target;

    // Update the field value
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    // Validate the field as the user types
    let fieldError = {};

    // Inline validation for the 'first_name' field
    if (name === 'first_name') {
      if (!value) {
        fieldError.first_name = t('First name is required');
      } else if (value.length < 3) {
        fieldError.first_name = t('First name must be at least 3 characters');
      } else if (!/^[A-Za-z]+$/.test(value)) {
        fieldError.first_name = t('First name must contain only letters');
      }
    }

    // Inline validation for the 'phone' field
    if (name === 'phone') {
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // US phone format (XXX) XXX-XXXX
      if (!value) {
        fieldError.phone = t('Phone number is required');
      } else if (!phoneRegex.test(value)) {
        fieldError.phone = t(
          'Phone number must be in the format (XXX) XXX-XXXX'
        );
      } else if (['0', '1'].includes(value[1])) {
        fieldError.phone = t(
          'Phone number cannot start with 0 or 1 in the area code'
        );
      }
    }

    // Update errors for the specific field, remove error if field is valid
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] || '' // Clear the error if the field is valid
    }));
  };

  
  const handleChangeAppointmentDetails = (e) => {
    const { name, value } = e.target;
  
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  
    if (name === 'preferred_doctor') {
      const selectedDoctor = doctors.find((doctor) => doctor.id === value);
      const doctorNpi = selectedDoctor ? selectedDoctor.npi_number : '';
  
      // Update doctorNpi state
      setDoctorNpi(doctorNpi);
  
      // Update appointmentDetails to include doctor_npi
      setAppointmentDetails((prevDetails) => ({
        ...prevDetails,
        doctor_npi: doctorNpi
      }));
  
      // console.log('Updated Doctor NPI:', doctorNpi); // Debugging
    }
  
    const fieldError = validateAppointmentDetails({
      ...appointmentDetails,
      [name]: value
    });
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] || null
    }));
  };
  

  
  // Updated handleAppointmentDateChange for date field
  const handleAppointmentDateChange = (newDateTime) => {
    setAppointmentDetails({
      ...appointmentDetails,
      appointment_date: newDateTime
    });

    // Validate the date field when it changes
    const dateTimeError = validateDateTime(newDateTime);
    setErrors((prevErrors) => ({
      ...prevErrors,
      appointment_date: dateTimeError || null // Only update the error for date field
    }));
  };

  // Handle Submit for Personal Information
  const handleSubmitPersonalInfo = async () => {
    const validationErrors = validatePersonalDetails(personalDetails);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Display validation errors
      return;
    }

    setLoading(true); // Show loading spinner while the form is being submitted
    setName(personalDetails.first_name);
    setMobile(personalDetails.phone);
    try {
      const headersPayload = {
        patientFname: personalDetails.first_name,
        patientPhNum: personalDetails.phone
      };

      const response = await axios.post(`/existingPatients`, headersPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 200) {
        setPatients(response.data.data); // Save retrieved patient data
        setSelectedPatient(true); // Mark that a patient is selected
      } else {
        toast.error(t('Failed to validate personal information'));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(t('No patient found with the provided details'));
      } else {
        toast.error(t('An unexpected error occurred. Please try again'));
      }
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  // const handleSelectPatient = (patientId) => {
  //   const patient = patients.find((p) => p.patient_id === patientId);
  //   setSelectedPatient(patient); // Store the full patient object
  //   setSelectedPatientId(patientId);
  // };

  const handleSelectPatient = (patientId) => {
    // console.log('patientId', patientId);

    const patient = patients.find((p) => p.patient_id === patientId);
    setSelectedPatient(patient); // Store the full patient object
    setSelectedPatientId(patientId); // Set selected patient ID
  };

  // Handle Submit for Appointment Details
  const handleSubmitAppointmentDetails = async () => {
    console.log('Submitting with NPI:', doctorNpi);
    const validationErrors = validateAppointmentDetails(appointmentDetails);

    // Set all errors if there are validation errors
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent submission if there are errors
    }

    // Proceed with submission if all fields are valid
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
      doctorId: appointmentDetails.preferred_doctor,
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
      doctorId: appointmentDetails.preferred_doctor,
      NpiNumber: parseInt(doctorNpi),
      office_location: selectedOfficeAddress,
    };

    try {
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
        const smsResponse = await axios.post(`/sms`, smsTemplateDetails, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setSmsTemeplateResponseData(smsResponse.data.data.message_template);
        toast.success(t('Appointment created successfully!'));
        setActiveStep((prevStep) => prevStep + 1);
      } else if (response.data.status === 409) {
        toast.error(
          // response.data.message ||
          t(
            'The chosen time slot is unavailable. Please choose another time slot'
          )
        );
      }
    } catch (error) {
      toast.error(
        // error.response?.data?.message ||
        t('Something went wrong. Please try again')
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
        setShowExitingPatient(true);
        // const delayedAction = () => {
        //   handleCreatePatient();
        //   // setIsRegistrationComplete(true); // Set registration complete on success
        // };

        // setTimeout(delayedAction, 3000); // 3000 milliseconds = 3 seconds
      } else {
        toast.error(t('Failed to Send SMS'));
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.detail ||
            t('SMS sending failed. Please try again')
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

  const handleOfficeSelection = (selectedOfficeId) => {
    const selectedOffice = selectedOffices.find(
      (office) => office.office_id === selectedOfficeId
    );

    if (selectedOffice) {
      const officeAddress = selectedOffice.office_address;
      // Send `officeAddress` to backend or store it for further use
      console.log('Selected Office Address:', officeAddress);
      // Example: save in state or send to backend as needed
      setSelectedOfficeAddress(officeAddress); // Optional, if you need to store
    } else {
      console.error('Office not found for the selected ID');
    }
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
                {[
                  t('Patient Details'),
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
                        error={!!errors.first_name} // Show error state if error exists
                        helperText={errors.first_name} // Show error message
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
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitPersonalInfo}
                      sx={{ my: 3 }}
                      disabled={loading} // Disable the button when loading
                    >
                      {t('Get Patient')}
                      {loading && (
                        <CircularProgress size={24} sx={{ ml: 2 }} />
                      )}{' '}
                      {/* Show loading spinner */}
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
                            {t('Select')}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {t('Chart Id')}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {t('First Name')}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {t('DOB')}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {t('Gender')}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {t('Phone')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
  {patients.length === 0 ? (
    // Show message when no patients are found
    <TableRow>
      <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
        {t('No patients found')}
      </TableCell>
    </TableRow>
  ) : (
    // Map through patients and render rows
    patients.map((patient) => (
      <TableRow key={patient?.patient_id}>
        <TableCell sx={{ textAlign: 'center' }}>
          <Radio
            checked={selectedPatientId === patient?.patient_id}
            onChange={() => handleSelectPatient(patient?.patient_id)}
            value={patient?.patient_id}
            name="select-patient"
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{patient?.chart_id}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{patient?.first_name}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {dayjs(patient?.date_of_birth).format('MM/DD/YYYY')}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{patient?.gender}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{patient?.cell_phone}</TableCell>
      </TableRow>
    ))
  )}
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
                            t('Please select a patient before proceeding')
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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

                    <Grid item xs={12} sm={6}>
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

                    {/* <Grid item xs={12} sm={6}>
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
                    </Grid> */}

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Hospital Location')}
                        name="hospital_location"
                        value={appointmentDetails.hospital_location}
                        onChange={(event) => {
                          handleChangeAppointmentDetails(event);
                          handleOfficeSelection(event.target.value); // New function to handle address extraction
                        }}
                        error={!!errors.hospital_location}
                        helperText={errors.hospital_location}
                      >
                        {/* {selectedOffices?.map((office) => (
                          <MenuItem
                            key={office?.office_id}
                            value={office?.office_id}
                          >
                            {office?.office_name}
                          </MenuItem>
                        ))} */}
                        {selectedOffices.length === 0 ? (
      <MenuItem disabled value="">
        {t('No hospital locations available')}
      </MenuItem>
    ) : (
      selectedOffices.map((office) => (
        <MenuItem key={office?.office_id} value={office?.office_id}>
          {office?.office_name}
        </MenuItem>
      ))
    )}
                      </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Preferred Doctor')}
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
                    </Grid> */}

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label={t('Preferred Doctor')}
                        name="preferred_doctor"
                        value={appointmentDetails.preferred_doctor}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.preferred_doctor}
                        helperText={errors.preferred_doctor}
                      >
                        {/* {doctors?.map((doctor) => (
                          <MenuItem key={doctor?.id} value={doctor?.id}>
                            {doctor?.name}
                          </MenuItem>
                        ))} */}
                        {doctors.length === 0 ? (
      <MenuItem disabled value="">
        {t('No doctors available')}
      </MenuItem>
    ) : (
      doctors.map((doctor) => (
        <MenuItem key={doctor?.id} value={doctor?.id}>
          {doctor?.name}
        </MenuItem>
      ))
    )}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('Additional Information')}
                        name="notes"
                        value={appointmentDetails.notes}
                        onChange={handleChangeAppointmentDetails}
                        error={!!errors.notes}
                        helperText={errors.notes}
                        multiline
                        rows={4}
                        // minRows={2}
                        // maxRows={6} // Specify the maximum number of rows
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
                      {t('Add appointment')}
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
                                {t('No sms available')}
                              </Typography>
                            )}

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
                                    {t('Existing Patient')}
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

export default PatientIntakeExisting;
