import React, { useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CssBaseline,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiUrl } from "../../ApiUrl";
import Loader from "../../Loader/Loader";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .matches(/^[A-Za-z]*$/, "First Name must only contain letters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .matches(/^[A-Za-z]*$/, "Last Name must only contain letters"),
  mobile: Yup.string()
    .required("Mobile Number is required")
    // .max(10, "Mobile number is maximum 10")
    .matches(
      /^\([2-9]\d{2}\) [2-9]\d{2}-\d{4}$/,
      "Mobile Number cannot start with 0 or 1"
    ),
  preferredDoctor: Yup.string().required("Preferred doctor is required"),
  patientGender: Yup.string().required("Patient gender is required"),
  patientDob: Yup.date()
    .required("Date of birth is required")
    .max(dayjs(), "Date cannot be in the future"),
});

const validateDob = (date) => {
  if (!date) return "Date of Birth is required";
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return "Invalid date";
  if (parsedDate.isAfter(dayjs()))
    return "Date of Birth cannot be in the future";
  return undefined;
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, name, ...other } = props;

  const handleChange = (event) => {
    onChange({ target: { name, value: event.target.value } });
  };

  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      inputRef={ref}
      onAccept={(value) =>
        handleChange({ target: { name: props.name, value } })
      }
      overwrite={false}
    />
  );
});

const PatientForm = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const dobError = validateDob(values.patientDob);
    if (dobError) {
      setErrors({ patientDob: dobError });
      setSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const headersPayload = {
        patientFname: values.firstName,
        patientLname: values.lastName,
        patientPhNum: values.mobile,
        patientDob: dayjs(values.patientDob).format("YYYY-MM-DD"),
        preferredDoctor: values.preferredDoctor,
        patientGender: values.patientGender,
      };

      const response = await axios.post(
        `${ApiUrl}/patientCreate`,
        headersPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Patient created successfully!");
        onSubmit(values, { setSubmitting, setErrors }); // Call onSubmit to handle next step
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data || "Registration failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          mobile: "",
          patientDob: null,
          preferredDoctor: "",
          patientGender: "",
        }}
        validationSchema={validationSchema}
        validate={(values) => {
          const errors = {};
          const dobError = validateDob(values.patientDob);
          if (dobError) errors.patientDob = dobError;
          return errors;
        }}
        onSubmit={handleSubmit}
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
          <form onSubmit={handleSubmit}>
            <Grid container component="main">
              <CssBaseline />
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                className="patient-intake-form"
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  component={Paper}
                  elevation={6}
                  square
                >
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
                      Create a patient
                    </Typography>
                    <Box component="div" noValidate sx={{ mt: 1 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            autoComplete="given-name"
                            name="firstName"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.firstName && Boolean(errors.firstName)
                            }
                            helperText={touched.firstName && errors.firstName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="mobile"
                            label="Mobile Number"
                            name="mobile"
                            InputProps={{
                              inputComponent: TextMaskCustom,
                            }}
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mobile && Boolean(errors.mobile)}
                            helperText={touched.mobile && errors.mobile}
                            inputProps={{ "aria-label": "Mobile Number" }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.patientGender &&
                              Boolean(errors.patientGender)
                            }
                          >
                            <InputLabel id="patientGender-label">
                              Gender
                            </InputLabel>
                            <Select
                              labelId="patientGender-label"
                              id="patientGender"
                              name="patientGender"
                              value={values.patientGender}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Gender"
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                              <MenuItem value="PNS">
                                Preffered not to say
                              </MenuItem>
                            </Select>
                            {touched.patientGender && errors.patientGender && (
                              <FormHelperText>
                                {errors.patientGender}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field name="patientDob">
                            {({ field, form }) => (
                              <DatePicker
                                label="Date of Birth"
                                {...field}
                                sx={{ width: "100%" }}
                                value={values.patientDob}
                                onChange={(date) =>
                                  setFieldValue("patientDob", date)
                                }
                                onBlur={handleBlur}
                                slotProps={{
                                  textField: {
                                    helperText:
                                      form.errors.patientDob &&
                                      form.touched.patientDob
                                        ? form.errors.patientDob
                                        : "",
                                    error: Boolean(
                                      form.errors.patientDob &&
                                        form.touched.patientDob
                                    ),
                                  },
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.preferredDoctor &&
                              Boolean(errors.preferredDoctor)
                            }
                          >
                            <InputLabel id="preferredDoctor-label">
                              Preferred Doctor
                            </InputLabel>
                            <Select
                              labelId="preferredDoctor-label"
                              id="preferredDoctor"
                              name="preferredDoctor"
                              value={values.preferredDoctor}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Preferred Doctor"
                            >
                              <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
                              <MenuItem value="Dr. Johnson">
                                Dr. Johnson
                              </MenuItem>
                            </Select>
                            {touched.preferredDoctor &&
                              errors.preferredDoctor && (
                                <FormHelperText>
                                  {errors.preferredDoctor}
                                </FormHelperText>
                              )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                              mt: 3,
                              mb: 2,
                              backgroundColor: "#407bff",
                              "&:hover": {
                                backgroundColor: "#12171e",
                                transition: "background-color 0.3s ease",
                              },
                            }}
                            disabled={loading}
                          >
                            {loading ? <Loader /> : "Create Patient"}
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
    </LocalizationProvider>
  );
};

export default PatientForm;
