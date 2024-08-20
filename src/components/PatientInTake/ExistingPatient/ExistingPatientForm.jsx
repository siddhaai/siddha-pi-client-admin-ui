import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CssBaseline,
  Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "First Name must only contain letters"),
  patientDob: Yup.date()
    .required("Date of Birth is required")
    .nullable()
    .max(dayjs(), "Date cannot be in the future")
    .typeError("Invalid date format"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

const ExistingPatientForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ firstName: "", patientDob: null, phoneNumber: "" }}
    validationSchema={validationSchema}
    onSubmit={(values, { setFieldError, setSubmitting }) => {
      // Validate date on submit
      if (values.patientDob && values.patientDob.isAfter(dayjs())) {
        setFieldError("patientDob", "Date cannot be in the future");
        setSubmitting(false);
      } else {
        onSubmit(values, { setSubmitting });
      }
    }}
  >
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldError,
      values,
      touched,
      errors,
    }) => (
      <form onSubmit={handleSubmit} style={{ marginLeft: "400px" }}>
        <Grid container component="main">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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
                  Existing patient
                </Typography>
                <Box component="div" noValidate sx={{ mt: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        id="firstName"
                        name="firstName"
                        type="text"
                        label="First Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disableFuture
                          sx={{ width: "100%" }}
                          label="Patient DOB"
                          views={["year", "month", "day"]}
                          value={values.patientDob}
                          onChange={(date) => {
                            if (date && date.isAfter(dayjs())) {
                              setFieldValue("patientDob", null);
                              setFieldError(
                                "patientDob",
                                "Date cannot be in the future"
                              );
                            } else {
                              setFieldValue("patientDob", date);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="patientDob"
                              margin="normal"
                              fullWidth
                              error={Boolean(errors.patientDob)}
                              helperText={errors.patientDob}
                              onBlur={handleBlur}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        label="Phone Number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phoneNumber}
                        error={
                          touched.phoneNumber && Boolean(errors.phoneNumber)
                        }
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box display="flex" justifyContent="center" mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          background: "#407BFF",
                          "&:hover": {
                            color: "#ffff",
                            background: "#12171e",
                          },
                        }}
                        type="submit"
                      >
                        Get Patient
                      </Button>
                    </Box>
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

export default ExistingPatientForm;
