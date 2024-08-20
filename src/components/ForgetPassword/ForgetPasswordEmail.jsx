import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import * as Yup from "yup";
import ForgetPasswordEmailImg from "../../assets/email.svg";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiUrl } from "../ApiUrl";
import Loader from "../Loader/Loader";

/* Validation schema */
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  otp: Yup.string().required("OTP is required").max(6, "maximum 6 number"),
});

export default function ForgetPasswordEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer state
  const [otpSent, setOtpSent] = useState(false); // OTP sent state
  const [otpExpired, setOtpExpired] = useState(false); // OTP expired state

  // Timer countdown logic
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpExpired(true); // OTP expired
    }
    return () => clearInterval(countdown);
  }, [timer, otpSent]);

  // Handle sending OTP
  const handleSendOtp = async (email) => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/admin/forgotPassword`, {
        email,
      });

      if (response.status === 200) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
        setOtpExpired(false);
        setTimer(60); // Start 1-minute countdown
      } else {
        toast.error("Failed to send OTP, please try again");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleSubmitOtp = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/admin/otpVerify`, {
        email: values.email,
        otp: parseInt(values.otp),
      });

      if (response.status === 200) {
        // toast.success("OTP is Validate Successfully!", { duration: 10000 });
        // navigate("/password-reset");
        // navigate("/password-reset", { state: { email: values.email } });
        toast.success("OTP is Validate Successfully!", { duration: 3000 });
        setTimeout(() => {
          navigate("/password-reset", { state: { email: values.email } });
        }, 2000); // Delay navigation by 3 seconds
      } else {
        toast.error("Invalid OTP, please try again");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      {loading && <Loader />}
      <Formik
        initialValues={{
          email: "",
          otp: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitOtp}
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
            <Grid container component="main" sx={{ height: "100vh" }}>
              <CssBaseline />
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage: `url(${ForgetPasswordEmailImg})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
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
                  <Box>
                    <Typography component="h1" variant="h5">
                      Forget Password
                    </Typography>
                    <Typography component="span" variant="subtitle1">
                      Please enter your registered Email for verification.
                      <br />
                      We will send a One-Time Password (OTP) to your Email.
                    </Typography>
                  </Box>
                  <Box component="div" noValidate sx={{ mt: 1 }}>
                    {/* Email Input Field */}
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
                      disabled={isSubmitting || loading || otpSent}
                      fullWidth
                      margin="normal"
                    />

                    {/* Send OTP Button */}
                    {!otpSent && (
                      <Button
                        onClick={() => handleSendOtp(values.email)}
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
                        disabled={loading || isSubmitting}
                      >
                        Send OTP
                      </Button>
                    )}

                    {/* OTP Timer and Resend OTP Button */}
                    {otpSent && (
                      <>
                        {otpExpired ? (
                          <Button
                            onClick={() => handleSendOtp(values.email)}
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
                            disabled={loading || isSubmitting}
                          >
                            Resend OTP
                          </Button>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ display: "none", mt: 2, mb: 2 }}
                          >
                            Resend OTP in {timer} seconds
                          </Typography>
                        )}

                        {/* OTP Input Field */}
                        <TextField
                          id="otp"
                          name="otp"
                          type="text"
                          label="OTP"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.otp}
                          error={touched.otp && Boolean(errors.otp)}
                          helperText={touched.otp && errors.otp}
                          disabled={isSubmitting}
                          fullWidth
                          margin="normal"
                        />

                        {/* Verify OTP Button */}
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
                          Verify OTP
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}
