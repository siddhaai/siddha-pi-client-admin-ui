import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

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

// Custom date-time validation function
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

const TestingPI = () => {
  // Steps state
  const [activeStep, setActiveStep] = useState(0);

  // Patient Details State
  const [patientDetails, setPatientDetails] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Appointment Details State
  const [appointmentDetails, setAppointmentDetails] = useState({
    dateTime: null
  });

  // SMS Details State
  const [smsDetails, setSmsDetails] = useState({
    message: ''
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Stepper steps
  const steps = ['Patient Details', 'Appointment Details', 'SMS Details'];

  // Handle change for Patient Details
  const handleChangePatientDetails = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  // Handle change for Appointment Details
  const handleDateChange = (newDateTime) => {
    setAppointmentDetails({ ...appointmentDetails, dateTime: newDateTime });
  };

  // Handle change for SMS Details
  const handleChangeSmsDetails = (e) => {
    const { name, value } = e.target;
    setSmsDetails({ ...smsDetails, [name]: value });
  };

  // Validate Patient Details
  const validatePatientDetails = () => {
    const newErrors = {};
    if (!patientDetails.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!patientDetails.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!patientDetails.phone) {
      newErrors.phone = 'Phone number is required';
    }
    return newErrors;
  };

  // Validate Appointment Details
  const validateAppointmentDetails = () => {
    const newErrors = {};
    const dateTimeError = validateDateTime(appointmentDetails.dateTime);
    if (dateTimeError) {
      newErrors.dateTime = dateTimeError;
    }
    return newErrors;
  };

  // Validate SMS Details
  const validateSmsDetails = () => {
    const newErrors = {};
    if (!smsDetails.message) {
      newErrors.message = 'SMS message is required';
    }
    return newErrors;
  };

  // Handle next step
  const handleNext = () => {
    let validationErrors = {};
    if (activeStep === 0) {
      validationErrors = validatePatientDetails();
    } else if (activeStep === 1) {
      validationErrors = validateAppointmentDetails();
    } else if (activeStep === 2) {
      validationErrors = validateSmsDetails();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop proceeding if errors exist
    }

    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form Submitted', {
      patientDetails,
      appointmentDetails,
      smsDetails
    });
    // Add API call or further form handling logic here
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <div>
          <h3>Patient Details</h3>
          <TextField
            label="First Name"
            name="firstName"
            value={patientDetails.firstName}
            onChange={handleChangePatientDetails}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <br />
          <TextField
            label="Last Name"
            name="lastName"
            value={patientDetails.lastName}
            onChange={handleChangePatientDetails}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <br />
          <TextField
            label="Phone"
            name="phone"
            value={patientDetails.phone}
            onChange={handleChangePatientDetails}
            InputProps={{
              inputComponent: TextMaskCustom
            }}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </div>
      )}

      {activeStep === 1 && (
        <div>
          <h3>Appointment Details</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={appointmentDetails.dateTime}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.dateTime}
                  helperText={errors.dateTime}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      )}

      {activeStep === 2 && (
        <div>
          <h3>SMS Details</h3>
          <TextField
            label="SMS Message"
            name="message"
            value={smsDetails.message}
            onChange={handleChangeSmsDetails}
            error={!!errors.message}
            helperText={errors.message}
            multiline
            rows={4}
          />
        </div>
      )}

      <div>
        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
          </Button>
        )}

        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

        {activeStep === steps.length - 1 && (
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestingPI;
