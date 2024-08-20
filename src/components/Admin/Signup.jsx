import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import {
  CssBaseline,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SignupImg from "../../assets/signup.svg";
import { ApiUrl } from "../ApiUrl";

/* Validation schema */
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "First Name must only contain letters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last Name must only contain letters"),
  practicename: Yup.string()
    .required("Practicename Name is required")
    .min(3, "Practicename Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Practicename Name must only contain letters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  npi: Yup.string()
    .required("NPI Number is required")
    .matches(/^\d{10}$/, "NPI Number must be a 10-digit number"),
  mobile: Yup.string().required("Mobile Number is required"),
  emr: Yup.string().required("Please select your EMR"),
});

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{
        0: /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite={false}
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
// const calculateToastWidth = (message) => {
//   const baseWidth = 300; // Minimum width
//   const additionalWidth = Math.min(message.length * 7, 500); // Add 7px per character, capped at 500px
//   return `${baseWidth + additionalWidth}px`;
// };

export default function Signup() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values) => {
    console.log("values",values);
    let payload = {
      client_firstname: values.firstName,
      client_lastname: values.lastName,
      client_phone: values.mobile,
      client_email: values.email,
      client_npinumber: values.npi,
      client_emr: values.emr,
      client_practicenamename: values.practicename,
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiUrl}/clientVerification`,
        {},
        {
          headers: {
            Accept: "application/json",
            ...payload,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Registration successful!", {
          duration: 10000,
          // style: { width: calculateToastWidth("Registration successful!") },
        });
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.data || "Registration failed. Please try again."
        : "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        duration: 10000,
        // style: { width: calculateToastWidth(errorMessage) },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        practicename: "",
        email: "",
        npi: "",
        mobile: "",
        emr: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container component="main">
            <CssBaseline />
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                marginTop: "15px",
                backgroundImage: `url(${SignupImg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "100vh",
              }}
            />
            <Grid item xs={12} sm={6} component={Paper} elevation={6} square>
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
                  REGISTER
                </Typography>
                <Box component="div" noValidate sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    {/* First Name */}
                    <Grid item xs={12} sm={6}>
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
                        disabled={isSubmitting}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="lastName"
                        name="lastName"
                        type="text"
                        label="Last Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        disabled={isSubmitting}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* Practicename Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="practicename"
                        name="practicename"
                        type="text"
                        label="Practicename Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.practicename}
                        error={
                          touched.practicename && Boolean(errors.practicename)
                        }
                        helperText={touched.practicename && errors.practicename}
                        disabled={isSubmitting}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={isSubmitting}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* NPI Number */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="npi"
                        name="npi"
                        type="text"
                        inputProps={{ maxLength: 10 }}
                        label="NPI Number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.npi}
                        error={touched.npi && Boolean(errors.npi)}
                        helperText={touched.npi && errors.npi}
                        disabled={isSubmitting}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    {/* Mobile Number */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        sx={{ mt: "17px" }}
                        label="Mobile Number"
                        name="mobile"
                        type="text"
                        inputProps={{ maxLength: 14 }}
                        id="PatientPhoneNumber"
                        placeholder="(123) 456-7890"
                        variant="outlined"
                        value={values.mobile}
                        onChange={handleChange}
                        InputProps={{
                          inputComponent: TextMaskCustom,
                        }}
                        error={!!errors.mobile}
                        fullWidth
                      />
                      {errors.mobile && (
                        <Typography variant="caption" color="error">
                          {errors.mobile}
                        </Typography>
                      )}
                    </Grid>

                    {/* EMR */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        sx={{ width: "100%" }}
                        margin="normal"
                        error={touched.emr && Boolean(errors.emr)}
                      >
                        <InputLabel id="emr-label">EMR</InputLabel>
                        <Select
                          labelId="emr-label"
                          id="emr"
                          name="emr"
                          value={values.emr}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          label="EMR"
                        >
                          <MenuItem value="">
                            <em></em>
                          </MenuItem>
                          <MenuItem value="Epic">Epic</MenuItem>
                          <MenuItem value="Cerner">Cerner</MenuItem>
                          <MenuItem value="drchrono">DrChrono</MenuItem>
                          <MenuItem value="AthenaHealth">Athenahealth</MenuItem>
                        </Select>
                        {touched.emr && errors.emr && (
                          <FormHelperText error>{errors.emr}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#407bff",
                      "&:hover": {
                        backgroundColor: "#12171e",
                        transition: "background-color 0.3s ease",
                      },
                    }}
                    disabled={isSubmitting || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "REGISTER"}
                  </Button>
                  <Toaster />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}