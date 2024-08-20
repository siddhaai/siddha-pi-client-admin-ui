import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField as MuiTextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ApiUrl } from "../../components/ApiUrl";
import { CheckmarkIcon, ErrorIcon, toast, Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";

const PersonalDetailsFields = [
  { name: "FirstName", label: "First Name", type: "text" },
  { name: "LastName", label: "Last Name", type: "text" },
  { name: "middleName", label: "Middle Name", type: "text" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    name: "language",
    label: "Language",
    type: "select",
    options: ["English", "Spanish", "French", "Other"],
  },
];

const AddressDetailsFields = [
  { name: "Street", label: "Street", type: "text" },
  { name: "City", label: "City", type: "text" },
  { name: "State", label: "State", type: "text" },
  { name: "ZipCode", label: "Zip Code", type: "text" },
];

const InsuranceDetailsFields = [
  { name: "InsuranceProvider", label: "Insurance Provider", type: "text" },
  { name: "PolicyNumber", label: "Policy Number", type: "text" },
  { name: "GroupNumber", label: "Group Number", type: "text" },
];

const requiredFields = {
  PersonalDetails: ["FirstName", "LastName"],
  AddressDetails: ["Street", "City"],
  InsuranceDetails: ["InsuranceProvider", "PolicyNumber"],
};

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

const FormBuilder = () => {
  const [selectedFields, setSelectedFields] = useState({
    PersonalDetails: [],
    AddressDetails: [],
    InsuranceDetails: [],
  });
  const [isFormBuilt, setIsFormBuilt] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showAlert) {
      toast(alertMessage, {
        duration: 3000,
        icon:
          alertSeverity === "error" ? (
            <ErrorIcon
              color="#f44336"
              style={{ textAlign: "center", padding: "10px" }}
            />
          ) : (
            <CheckmarkIcon
              color="#4caf50"
              style={{ textAlign: "center", padding: "10px" }}
            />
          ),
        style: {
          background: "#fff",
          color: "#000",
          display: "flex",
          alignItems: "center",
          width: "auto",
          whiteSpace: "nowrap",
          padding: "8px 16px",
        },
      });
      setShowAlert(false);
    }
  }, [showAlert, alertMessage, alertSeverity]);
  // State to handle custom options
  const [customOptions, setCustomOptions] = useState({
    gender: ["Male", "Female", "Other"],
    language: ["English", "Spanish", "French", "Other"],
  });

  const [selectedDropdown, setSelectedDropdown] = useState(""); // New state to track selected dropdown
  const [newOption, setNewOption] = useState(""); // State for the new option input

  const handleFieldToggle = (section, fieldName) => {
    setSelectedFields((prevSelectedFields) => {
      const sectionFields = prevSelectedFields[section];
      const updatedSectionFields = sectionFields.includes(fieldName)
        ? sectionFields.filter((field) => field !== fieldName)
        : [...sectionFields, fieldName];
      return {
        ...prevSelectedFields,
        [section]: updatedSectionFields,
      };
    });
  };

  const handleRemoveField = (section, fieldName) => {
    setSelectedFields((prevSelectedFields) => ({
      ...prevSelectedFields,
      [section]: prevSelectedFields[section].filter(
        (field) => field !== fieldName
      ),
    }));
  };

  const buildForm = () => {
    for (const section in requiredFields) {
      for (const requiredField of requiredFields[section]) {
        if (!selectedFields[section].includes(requiredField)) {
          setAlertMessage(
            `Please select the ${requiredField.replace(
              /([A-Z])/g,
              " $1"
            )} in ${section.replace(/([A-Z])/g, " $1").trim()}`
          );
          setShowAlert(true);
          setAlertSeverity("error");
          return;
        }
      }
    }
    setIsLoading(true);
    setIsFormBuilt(true);
    setShowAlert(true);
    setAlertMessage("Form built successfully");
    setAlertSeverity("success");
    sendFormData();
  };

  const sendFormData = () => {
    const formData = Object.entries(selectedFields).flatMap(
      ([section, fields]) =>
        fields.map((field) => {
          // Find the field info from the available fields
          const fieldInfo = [
            ...PersonalDetailsFields,
            ...AddressDetailsFields,
            ...InsuranceDetailsFields,
          ].find((f) => f.name === field);

          console.log("Field Info:", fieldInfo); // Log field info to check its details

          // Retrieve the validation schema based on the field's name
          const validationSchemaKey = fieldInfo.name.toLowerCase();
          console.log("Validation Schema Key:", validationSchemaKey); // Log the schema key

          // Check available schemas for correct keys
          console.log(
            "Available schemas:",
            Object.keys(fieldValidationSchemas)
          );

          const validationSchema = fieldValidationSchemas[validationSchemaKey];
          console.log("Validation Schema:", validationSchema); // Log the retrieved schema

          // Serialize the validation schema
          let serializedValidation = null;
          if (validationSchema) {
            serializedValidation = {
              type: validationSchema.type,
              validations: validationSchema.tests.map((test) => {
                const { name, params } = test.OPTIONS;
                return {
                  type: name, // Validation type like 'required', 'min', etc.
                  params, // Parameters associated with the validation
                };
              }),
            };
            console.log("Serialized Validation:", serializedValidation); // Log the serialized validation
          }

          return {
            section,
            name: fieldInfo.name,
            type: fieldInfo.type,
            validation: serializedValidation,
          };
        })
    );

    console.log("Form Data to be sent:", formData); // Log the final form data to be sent

    axios
      .post(`${ApiUrl}/formBuild`, { fields: formData })
      .then((response) => {
        console.log("Form data sent successfully:", response);
        setIsFormBuilt(true);
        setAlertMessage("Form built successfully");
        setAlertSeverity("success");
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
        setAlertMessage("Error building form");
        setAlertSeverity("error");
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  const validationSchema = Yup.object(
    Object.fromEntries(
      Object.entries(selectedFields).flatMap(([section, fields]) =>
        fields.map((field) => [field, fieldValidationSchemas[field]])
      )
    )
  );

  const getInitialValues = () => {
    return Object.fromEntries(
      Object.entries(selectedFields).flatMap(([section, fields]) =>
        fields.map((field) => [field, ""])
      )
    );
  };

  const handleAccordionChange = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSelectAll = (section) => {
    const sectionFields =
      section === "PersonalDetails"
        ? PersonalDetailsFields
        : section === "AddressDetails"
        ? AddressDetailsFields
        : InsuranceDetailsFields;

    setSelectedFields((prevSelectedFields) => ({
      ...prevSelectedFields,
      [section]: sectionFields.map((field) => field.name),
    }));
  };

  const renderFieldLabel = (field) => {
    const isRequired = requiredFields[field.section]?.includes(field.name);
    return (
      <Typography>
        {field.label}{" "}
        {isRequired ? <span style={{ color: "red" }}>*</span> : null}
      </Typography>
    );
  };

  const handleAddOption = () => {
    if (newOption.trim() !== "" && selectedDropdown) {
      setCustomOptions((prevOptions) => ({
        ...prevOptions,
        [selectedDropdown]: [...prevOptions[selectedDropdown], newOption],
      }));
      setNewOption("");
      setShowAlert(true);
      setAlertMessage(`${selectedDropdown} added successfully`);
      setAlertSeverity("success");
    }
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <Toaster />
            <Grid container spacing={2} sx={{ marginLeft: "300px" }}>
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  Patient Form
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                  {Object.values(selectedFields).some(
                    (section) => section.length > 0
                  ) &&
                    [
                      "PersonalDetails",
                      "AddressDetails",
                      "InsuranceDetails",
                    ].map(
                      (section) =>
                        selectedFields[section].length > 0 && (
                          <Box key={section} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                              {section.replace(/([A-Z])/g, " $1").trim()}
                            </Typography>
                            {selectedFields[section].map((fieldName) => {
                              const field = [
                                ...PersonalDetailsFields,
                                ...AddressDetailsFields,
                                ...InsuranceDetailsFields,
                              ].find((f) => f.name === fieldName);
                              return (
                                <Box
                                  key={fieldName}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 2,
                                  }}
                                >
                                  {field.type === "select" ? (
                                    <FormControl
                                      fullWidth
                                      variant="outlined"
                                      margin="normal"
                                    >
                                      <InputLabel>{field.label}</InputLabel>
                                      <Select
                                        name={fieldName}
                                        value={values[fieldName]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label={field.label}
                                      >
                                        {customOptions[field.name]?.map(
                                          (option) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              {option}
                                            </MenuItem>
                                          )
                                        )}
                                      </Select>
                                    </FormControl>
                                  ) : (
                                    <Field
                                      as={MuiTextField}
                                      fullWidth
                                      name={fieldName}
                                      label={renderFieldLabel(field)}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values[fieldName]}
                                      variant="outlined"
                                      helperText={
                                        <ErrorMessage name={fieldName} />
                                      }
                                    />
                                  )}
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveField(section, fieldName)
                                    }
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Box>
                              );
                            })}
                          </Box>
                        )
                    )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">Add Form Fields</Typography>
                    <Typography variant="span">
                      Fields marked with <span style={{ color: "red" }}>*</span>{" "}
                      are required
                    </Typography>
                  </Box>

                  {[
                    "PersonalDetails",
                    "AddressDetails",
                    "InsuranceDetails",
                  ].map((section) => (
                    <Accordion
                      key={section}
                      expanded={expandedSection === section}
                      onChange={() => handleAccordionChange(section)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`${section}-content`}
                        id={`${section}-header`}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <Typography>
                            {section.replace(/([A-Z])/g, " $1").trim()}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSelectAll(section)}
                            sx={{
                              ml: 2,
                              color: "#ffff",
                              backgroundColor: "#407bff",
                              "&:hover": {
                                color: "#ffff",
                                backgroundColor: "#12171e",
                                transition: "background-color 0.3s ease",
                              },
                            }}
                          >
                            Select All
                          </Button>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {section === "PersonalDetails" &&
                          PersonalDetailsFields.map((field) =>
                            !selectedFields[section].includes(field.name) ? (
                              <FormControlLabel
                                key={field.name}
                                control={
                                  <Checkbox
                                    checked={selectedFields[section].includes(
                                      field.name
                                    )}
                                    onChange={() =>
                                      handleFieldToggle(section, field.name)
                                    }
                                    name={field.name}
                                    color="primary"
                                  />
                                }
                                label={renderFieldLabel({ ...field, section })}
                                sx={{ mt: 1 }}
                              />
                            ) : null
                          )}
                        {section === "AddressDetails" &&
                          AddressDetailsFields.map((field) =>
                            !selectedFields[section].includes(field.name) ? (
                              <FormControlLabel
                                key={field.name}
                                control={
                                  <Checkbox
                                    checked={selectedFields[section].includes(
                                      field.name
                                    )}
                                    onChange={() =>
                                      handleFieldToggle(section, field.name)
                                    }
                                    name={field.name}
                                    color="primary"
                                  />
                                }
                                label={renderFieldLabel({ ...field, section })}
                                sx={{ mt: 1 }}
                              />
                            ) : null
                          )}
                        {section === "InsuranceDetails" &&
                          InsuranceDetailsFields.map((field) =>
                            !selectedFields[section].includes(field.name) ? (
                              <FormControlLabel
                                key={field.name}
                                control={
                                  <Checkbox
                                    checked={selectedFields[section].includes(
                                      field.name
                                    )}
                                    onChange={() =>
                                      handleFieldToggle(section, field.name)
                                    }
                                    name={field.name}
                                    color="primary"
                                  />
                                }
                                label={renderFieldLabel({ ...field, section })}
                                sx={{ mt: 1 }}
                              />
                            ) : null
                          )}
                        {section === "PersonalDetails" && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                              Add Custom Gender and Language Options
                            </Typography>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ mt: 2 }}
                            >
                              <InputLabel>Select Dropdown</InputLabel>
                              <Select
                                value={selectedDropdown}
                                onChange={(e) =>
                                  setSelectedDropdown(e.target.value)
                                }
                                label="Select Dropdown"
                              >
                                <MenuItem value="gender">Gender</MenuItem>
                                <MenuItem value="language">Language</MenuItem>
                              </Select>
                            </FormControl>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <TextField
                                label="New Option"
                                variant="outlined"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                sx={{ mt: 2 }}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddOption}
                                sx={{
                                  // width:"100%",
                                  mt: 2,
                                  color: "black",
                                  fontWeight: "400",
                                  backgroundColor: "silver",

                                  "&:hover": {
                                    color: "#ffff",
                                    backgroundColor: "black",
                                    transition: "backgroundColor 0.3s ease",
                                  },
                                }}
                              >
                                Add Option
                              </Button>
                            </Box>
                          </Box>
                        )}
                        {selectedFields[section].length ===
                          (section === "PersonalDetails"
                            ? PersonalDetailsFields
                            : section === "AddressDetails"
                            ? AddressDetailsFields
                            : InsuranceDetailsFields
                          ).length && <Typography>No more fields</Typography>}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={buildForm}
                  disabled={isFormBuilt || isLoading}
                  sx={{
                    mt: 2,
                    mr: 2,
                    color: "#ffff",
                    backgroundColor: "#407bff",
                    "&:hover": {
                      color: "#ffff",
                      backgroundColor: "#12171e",
                      transition: "backgroundColor 0.3s ease",
                    },
                  }}
                >
                  {isLoading ? <Loader /> : "Build Form"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormBuilder;
