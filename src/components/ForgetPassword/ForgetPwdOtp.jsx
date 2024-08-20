import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import * as Yup from "yup";
import ForgetPwdOtpImg from "../../assets/otp.svg";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { ApiUrl } from "../ApiUrl";

// Custom loader styles
const loaderStyles = `
.loader {
  width: 40px;
  height: 40px;
  position: relative;
  --c: no-repeat linear-gradient(#407bff 0 0);
  background: var(--c) center/100% 10px, var(--c) center/10px 100%;
}

.loader:before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--c) 0 0, var(--c) 100% 0, var(--c) 0 100%, var(--c) 100% 100%;
  background-size: 15.5px 15.5px;
  animation: l16 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
}

@keyframes l16 {
  33% {
    inset: -10px;
    transform: rotate(0deg);
  }
  66% {
    inset: -10px;
    transform: rotate(90deg);
  }
  100% {
    inset: 0;
    transform: rotate(90deg);
  }
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
`;

/* Validation schema */
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export default function ForgetPwdOtp() {
  const navigate = useNavigate();
  const location = useLocation(); // Access the passed state
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(location.state?.timer || 0); // Set initial timer from passed state

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/admin/otpVerify`, {
        email: values.email,
        otp: parseInt(values.otp),
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully");
        navigate("/password-reset");
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
      <style>{loaderStyles}</style>
      <Toaster position="top-center" />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Formik
        initialValues={{
          email: "",
          otp: "",
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
            <Grid container component="main" sx={{ height: "100vh" }}>
              <CssBaseline />
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage: `url(${ForgetPwdOtpImg})`,
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
                  <Typography component="h1" variant="h5">
                    Verify OTP
                  </Typography>

                  <Box component="div" noValidate sx={{ mt: 1 }}>
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
                    <Typography variant="body1" sx={{ mb: 2, color: "red" }}>
                      OTP expired in {timer} seconds
                    </Typography>

                    <Grid item>
                      <Link href="/forget-password" variant="body2">
                        Didn't receive the code?
                      </Link>
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
                      disabled={isSubmitting || loading || timer <= 0}
                    >
                      Verify OTP
                    </Button>
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
