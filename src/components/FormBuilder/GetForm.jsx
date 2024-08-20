import React, { useState } from "react";
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
} from "@mui/material";
import { ApiUrl } from "../ApiUrl";

const fieldValidationSchemas = {
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters"),
  lastName: Yup.string().required("Last Name is required"),
  middleName: Yup.string().required("Middle Name is required"),
  gender: Yup.string().required("Gender is required"),
  language: Yup.string().required("Language is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  insuranceProvider: Yup.string().required("Insurance Provider is required"),
  policyNumber: Yup.string().required("Policy Number is required"),
  groupNumber: Yup.string().required("Group Number is required"),
};

const DynamicForm = () => {
  const [formConfig, setFormConfig] = useState([]);
  const [validationSchema, setValidationSchema] = useState(Yup.object());
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch form configuration and build validation schema
  const fetchFormConfig = () => {
    axios
      .get(`${ApiUrl}/formbuild`)
      .then((response) => {
        const config = response.data.fields || [];
        if (Array.isArray(config) && config.length === 0) {
          setErrorMessage("Please build form");
          setFormConfig([]);
          setValidationSchema(Yup.object()); // Clear validation schema
        } else {
          setErrorMessage(""); // Clear any previous error messages
          setFormConfig(config);

          // Build validation schema based on the form configuration
          const schema = config.reduce((acc, field) => {
            if (fieldValidationSchemas[field.name]) {
              acc[field.name] = fieldValidationSchemas[field.name];
            }
            return acc;
          }, {});

          setValidationSchema(Yup.object().shape(schema));
        }
      })
      .catch((error) => {
        console.error("Error fetching form configuration:", error);
        setErrorMessage("Error fetching form configuration");
        setFormConfig([]);
        setValidationSchema(Yup.object()); // Clear validation schema
      });
  };

  // Get initial form values
  const getInitialValues = () => {
    return formConfig.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button variant="contained" color="primary" onClick={fetchFormConfig}>
        Get Form
      </Button>
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
      {formConfig.length > 0 && (
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            axios
              .post("/submitForm", values)
              .then((response) => {
                console.log("Form submitted successfully:", response.data);
              })
              .catch((error) => {
                console.error("Error submitting form:", error);
              });
          }}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              {formConfig.map((field) => (
                <div key={field.name}>
                  {field.type === "select" ? (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={field.label}
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
                      label={field.label}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values[field.name]}
                      variant="outlined"
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" variant="contained" color="primary">
                Submit Form
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default DynamicForm;
