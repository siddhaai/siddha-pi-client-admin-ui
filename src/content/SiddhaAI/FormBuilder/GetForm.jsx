import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import {
  Button,
  TextField as MuiTextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ApiUrl } from "../ApiUrl";
import FileUpload from "./FileUpload";
import CameraUpload from "./CameraUpload";
import Loader from "../Loader/Loader";
import useAxiosInterceptor from 'src/contexts/Interceptor';


// Validation schemas for each step
const validationSchemas = [
  Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .min(3, "First Name must be at least 3 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(3, "Last Name must be at least 3 characters"),
  }),
  Yup.object({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string().required("Zip Code is required"),
  }),
  Yup.object({
    insuranceProvider: Yup.string().required("Insurance Provider is required"),
    policyNumber: Yup.string().required("Policy Number is required"),
    groupNumber: Yup.string().required("Group Number is required"),
  }),
];

const DynamicForm = () => {
  const { axios } = useAxiosInterceptor();
  const [formConfig, setFormConfig] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [agreeChecked, setAgreeChecked] = useState(false);

  const steps = [
    "Personal Details",
    "Address Details",
    "Insurance Details",
    "File Upload",
    "Camera Upload",
    "Review",
  ];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchFormConfig();
  }, []);

  // Fetch form configuration and build validation schema
  const fetchFormConfig = () => {
    axios
      .get(`/formbuild`)
      .then((response) => {
        const config = response.data.fields || [];
        if (Array.isArray(config) && config.length === 0) {
          setErrorMessage("Please build the form.");
          setFormConfig([]);
        } else {
          setErrorMessage(""); // Clear any previous error messages
          setFormConfig(config);
        }
      })
      .catch((error) => {
        console.error("Error fetching form configuration:", error);
        setErrorMessage("Error fetching form configuration");
        setFormConfig([]);
      });
  };

  // Get initial form values
  const getInitialValues = () => {
    return formConfig.reduce((acc, field) => {
      acc[field.name] = formData[field.name] || ""; // Retain values across steps
      return acc;
    }, {});
  };

  // Group form fields into sections
  const groupFieldsBySection = () => {
    const sections = {
      PersonalDetails: [],
      AddressDetails: [],
      InsuranceDetails: [],
    };

    formConfig.forEach((field) => {
      if (field.section === "PersonalDetails") {
        sections.PersonalDetails.push(field);
      } else if (field.section === "AddressDetails") {
        sections.AddressDetails.push(field);
      } else if (field.section === "InsuranceDetails") {
        sections.InsuranceDetails.push(field);
      }
    });

    return sections;
  };

  const handleNext = async (values, setErrors, validateForm) => {
    setLoading(true); // Show loader

    try {
      // Ensure the agreement checkbox is checked for each step
      if (!agreeChecked && activeStep < steps.length - 1) {
        setDialogMessage(
          "Please agree to the terms and conditions to proceed."
        );
        setDialogOpen(true);
        setLoading(false); // Hide loader immediately if checkbox is not checked
        return;
      }

      // Skip validation for FileUpload and CameraUpload steps (steps 3 and 4)
      if (activeStep === 3 || activeStep === 4) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds for loader animation
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setAgreeChecked(false); // Reset the checkbox
        setLoading(false); // Hide loader
        return;
      }

      // Validate only the fields for the current step
      await validationSchemas[activeStep].validate(values, {
        abortEarly: false,
      });

      // Simulate a 3-second loader delay before moving to the next step
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay

      // Save form data for the current step
      setFormData((prevData) => ({
        ...prevData,
        ...values,
      }));

      // Move to the next step and reset the checkbox
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setAgreeChecked(false); // Reset checkbox after moving to the next step
    } catch (validationErrors) {
      setDialogMessage("Please fill in all required fields before proceeding.");
      setDialogOpen(true);

      // Extract validation errors
      const errors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});

      setErrors(errors);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEdit = (sectionIndex) => {
    setActiveStep(sectionIndex);
  };

  const handleSubmit = (values) => {
    setLoading(true); // Show loader

    const formDataToSubmit = new FormData();

    // Append text fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key !== "file" && key !== "image") {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append files to FormData if they exist
    if (formData.file) {
      formDataToSubmit.append("file", formData.file);
    }
    if (formData.image) {
      formDataToSubmit.append("image", formData.image);
    }

    axios
      .post(`/submitForm`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        setLoading(false); // Hide loader
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setLoading(false); // Hide loader
      });
  };

  const renderFields = (fields, values, handleChange, handleBlur) => {
    return fields.map((field) => {
      const label = field.label || field.name;
      return (
        <Grid item xs={12} sm={8} md={4} key={field.name} sx={{ ml: 40 }}>
          {field.type === "select" ? (
            <FormControl fullWidth margin="normal">
              <InputLabel>{label}</InputLabel>
              <Select
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                label={label}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Field
              as={MuiTextField}
              fullWidth
              name={field.name}
              label={`${label} *`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values[field.name]}
              variant="outlined"
              helperText={<ErrorMessage name={field.name} component="div" />}
            />
          )}
        </Grid>
      );
    });
  };

  const renderSummary = () => {
    const sections = groupFieldsBySection();
    return (
      <div>
        {Object.entries(sections).map(([sectionKey, fields], index) => (
          <Box key={sectionKey} sx={{ mt: 2, ml: 40 }}>
            <Typography variant="h6">
              {sectionKey.replace(/([A-Z])/g, " $1").trim()}
              <IconButton onClick={() => handleEdit(index)} sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
            </Typography>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} key={field.name}>
                  <Typography>
                    <strong>{field.label || field.name}:</strong>{" "}
                    {formData[field.name]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </div>
    );
  };

  const renderStepContent = (
    step,
    values,
    handleChange,
    handleBlur,
    setErrors,
    validateForm
  ) => {
    switch (step) {
      case 0:
        return renderFields(
          groupFieldsBySection().PersonalDetails,
          values,
          handleChange,
          handleBlur
        );
      case 1:
        return renderFields(
          groupFieldsBySection().AddressDetails,
          values,
          handleChange,
          handleBlur
        );
      case 2:
        return renderFields(
          groupFieldsBySection().InsuranceDetails,
          values,
          handleChange,
          handleBlur
        );
      case 3:
        return (
          <FileUpload
            onUpload={(file) => setFormData((prev) => ({ ...prev, file }))}
          />
        );
      case 4:
        return (
          <CameraUpload
            onCapture={(image) => setFormData((prev) => ({ ...prev, image }))}
          />
        );
      case 5:
        return (
          <>
            {renderSummary()}
            <Box sx={{ mt: 2, ml: 40 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                  />
                }
                label="I agree to all terms and conditions"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!agreeChecked}
                sx={{ mt: 2 }}
              >
                {loading ? <Loader /> : "Submit"}
              </Button>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={validationSchemas[activeStep]}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        setErrors,
        validateForm,
      }) => (
        <Form>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, p: 3 }}>
            {renderStepContent(
              activeStep,
              values,
              handleChange,
              handleBlur,
              setErrors,
              validateForm
            )}
          </Box>

          {activeStep !== 5 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="contained"
                onClick={() => handleNext(values, setErrors, validateForm)}
              >
                {loading ? <Loader /> : "Next"}
              </Button>
            </Box>
          )}

          {activeStep < 5 && (
            <Box sx={{ mt: 2, ml: 40 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                  />
                }
                label="I agree to all terms and conditions"
              />
            </Box>
          )}

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullScreen={fullScreen}
          >
            <DialogTitle>{"Validation Error"}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
