import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CssBaseline,
  Paper,
  FormHelperText,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Custom validation function for DateTimePicker
const validateDateTime = (value) => {
  const selectedDate = dayjs(value);
  const currentDate = dayjs();
  const selectedTime = selectedDate.hour();
  const currentHour = currentDate.hour();
  const isSameDay = currentDate.isSame(selectedDate, "day");

  if (!value) {
    return "Date and time are required.";
  }
  if (selectedDate.isBefore(currentDate, "minute")) {
    return "Select a current or future date and a valid time.";
  }
  if (selectedTime < 8 || selectedTime >= 18) {
    return "Please select a time between 8:00 AM and 6:00 PM.";
  }
  if (currentHour >= 18 && isSameDay) {
    return "Please choose a time between 8:00 AM and 6:00 PM on a future date.";
  }
  if (isSameDay && selectedTime < currentHour) {
    return "Times are not available for today's date.";
  }
  return null;
};

// Validation schema for other fields
const validationSchema = Yup.object({
  appointmentPreferredDoctor: Yup.string().required(
    "Preferred doctor is required"
  ),
  hospitalLocation: Yup.string().required("Hospital Location is required"),
  timeZone: Yup.string().required("Time Zone is required"),
  appointmentDuration: Yup.string().required(
    "Appointment Duration is required"
  ),
  reason: Yup.string()
    .required("Reason is required")
    .min(3, "Reason must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Reason must only contain letters"),
  appointmentnotes: Yup.string().required("Appointment Notes are required"),
  appointmentDateTime: Yup.mixed().test(
    "custom-date-time-validation",
    null,
    validateDateTime
  ),
});

const ExistingPatientAppointmentForm = ({ onSubmit, patient }) => {
  const [dateTimeError, setDateTimeError] = useState("");

  return (
    <Formik
      initialValues={{
        appointmentPreferredDoctor: "",
        hospitalLocation: "",
        timeZone: "",
        appointmentDuration: "",
        reason: "",
        appointmentDateTime: null,
        appointmentnotes: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        const dateTimeValidationError = validateDateTime(
          values.appointmentDateTime
        );
        setDateTimeError(dateTimeValidationError);

        if (!dateTimeValidationError) {
          onSubmit(values, actions);
        } else {
          actions.setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        <form onSubmit={handleSubmit} style={{ marginLeft: "280px" }}>
          <Grid container component="main">
            <CssBaseline />
            <Box
              sx={{
                marginLeft: "10%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="patient-intake-form"
            >
              <Grid item xs={12} component={Paper} elevation={6} square>
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Create an Appointment{" "}
                    {patient && `for ${patient.first_name}`}
                  </Typography>
                  <Box component="div" noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            sx={{
                              width: "100%",
                            }}
                            slotProps={{
                              textField: {
                                error:
                                  Boolean(dateTimeError) ||
                                  (!values.appointmentDateTime &&
                                    touched.appointmentDateTime),
                                helperText:
                                  dateTimeError ||
                                  (!values.appointmentDateTime &&
                                  touched.appointmentDateTime
                                    ? "Date and time are required."
                                    : ""),
                              },
                            }}
                            disablePast={true}
                            label="Appointment Date & Time"
                            value={values.appointmentDateTime}
                            onChange={(newValue) => {
                              setFieldValue("appointmentDateTime", newValue);
                              setDateTimeError(validateDateTime(newValue));
                            }}
                            inputFormat="YYYY-MM-DD HH:mm"
                            // minTime={dayjs().set("hour", 8).set("minute", 0)}
                            // maxTime={dayjs().set("hour", 18).set("minute", 0)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={
                                  Boolean(dateTimeError) ||
                                  (!values.appointmentDateTime &&
                                    touched.appointmentDateTime)
                                }
                                helperText={
                                  dateTimeError ||
                                  (!values.appointmentDateTime &&
                                    touched.appointmentDateTime &&
                                    "Date and time are required.")
                                }
                              />
                            )}
                          />
                          {/* {dateTimeError && (
                            <div className="custom-error-text">
                              {dateTimeError}
                            </div>
                          )} */}
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          id="reason"
                          name="reason"
                          type="text"
                          label="Reason"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.reason}
                          error={touched.reason && Boolean(errors.reason)}
                          helperText={touched.reason && errors.reason}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="appointmentnotes"
                          name="appointmentnotes"
                          type="text"
                          label="Notes"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.appointmentnotes}
                          error={
                            touched.appointmentnotes &&
                            Boolean(errors.appointmentnotes)
                          }
                          helperText={
                            touched.appointmentnotes && errors.appointmentnotes
                          }
                          fullWidth
                          margin="normal"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={touched.timeZone && Boolean(errors.timeZone)}
                        >
                          <InputLabel id="timeZone-label">Time Zone</InputLabel>
                          <Select
                            labelId="timeZone-label"
                            id="timeZone"
                            name="timeZone"
                            value={values.timeZone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Time Zone"
                          >
                            <MenuItem value="CST">CST</MenuItem>
                            <MenuItem value="EST">EST</MenuItem>
                            <MenuItem value="PST">PST</MenuItem>
                          </Select>
                          {touched.timeZone && errors.timeZone && (
                            <FormHelperText error>
                              {errors.timeZone}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={
                            touched.hospitalLocation &&
                            Boolean(errors.hospitalLocation)
                          }
                        >
                          <InputLabel id="hospitalLocation-label">
                            Hospital Location
                          </InputLabel>
                          <Select
                            labelId="hospitalLocation-label"
                            id="hospitalLocation"
                            name="hospitalLocation"
                            value={values.hospitalLocation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Hospital Location"
                          >
                            <MenuItem value="383349">siddha office 1</MenuItem>
                            <MenuItem value="383349">siddha office 1</MenuItem>
                          </Select>
                          {touched.hospitalLocation &&
                            errors.hospitalLocation && (
                              <FormHelperText error>
                                {errors.hospitalLocation}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={
                            touched.appointmentPreferredDoctor &&
                            Boolean(errors.appointmentPreferredDoctor)
                          }
                        >
                          <InputLabel id="appointmentPreferredDoctor-label">
                            Preferred Doctor
                          </InputLabel>
                          <Select
                            labelId="appointmentPreferredDoctor-label"
                            id="appointmentPreferredDoctor"
                            name="appointmentPreferredDoctor"
                            value={values.appointmentPreferredDoctor}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Preferred Doctor"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="359001">Dr.XYZ</MenuItem>
                            <MenuItem value="359001">Dr.ABC</MenuItem>
                          </Select>
                          {touched.appointmentPreferredDoctor &&
                            errors.appointmentPreferredDoctor && (
                              <FormHelperText error>
                                {errors.appointmentPreferredDoctor}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={
                            touched.appointmentDuration &&
                            Boolean(errors.appointmentDuration)
                          }
                        >
                          <InputLabel id="appointmentDuration-label">
                            Appointment Duration
                          </InputLabel>
                          <Select
                            labelId="appointmentDuration-label"
                            id="appointmentDuration"
                            name="appointmentDuration"
                            value={values.appointmentDuration}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Appointment Duration"
                          >
                            <MenuItem value="30">30</MenuItem>
                            <MenuItem value="60">60</MenuItem>
                            <MenuItem value="90">90</MenuItem>
                          </Select>
                          {touched.appointmentDuration &&
                            errors.appointmentDuration && (
                              <FormHelperText error>
                                {errors.appointmentDuration}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          sx={{
                            background: "#407BFF",
                            "&:hover": {
                              color: "#ffff",
                              background: "#12171e",
                            },
                          }}
                        >
                          Create Appointment
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ExistingPatientAppointmentForm;
