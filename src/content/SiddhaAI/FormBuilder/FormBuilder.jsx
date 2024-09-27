import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import NotificationImportantTwoToneIcon from '@mui/icons-material/NotificationImportantTwoTone';

// Define fields and required fields
const PersonalDetailsFields = [
  { name: 'firstName', label: 'First Name', visibility: false },
  { name: 'lastName', label: 'Last Name', visibility: false },
  { name: 'middleName', label: 'Middle Name', visibility: false },
  { name: 'dob', label: 'DOB', type: 'date', visibility: false },
  { name: 'phoneNumber', label: 'Phone Number', visibility: false },
  { name: 'email', label: 'Email', type: 'email', visibility: false },
  { name: 'gender', label: 'Gender', type: 'select', visibility: false },
  { name: 'language', label: 'Language', type: 'select', visibility: false }
];
const AddressDetailsFields = [
  { name: 'street', label: 'Street Name', visibility: false },
  { name: 'city', label: 'City', visibility: false },
  { name: 'state', label: 'State', visibility: false },
  { name: 'zipCode', label: 'Zip Code', visibility: false }
];

const InsuranceDetailsFields = [
  { name: 'payerName', label: 'Payer Name', visibility: false },
  { name: 'groupNumber', label: 'Group Number', visibility: false },
  { name: 'MemberId', label: 'Member Id', visibility: false },
  {
    name: 'patientsubscriberFirstName',
    label: 'subscriber First Name',
    visibility: false
  },
  {
    name: 'patientsubscriberLastName',
    label: 'subscriber Last Name',
    visibility: false
  },
  { name: 'patientsubscriberDOB', label: 'subscriber DOB', visibility: false },
  {
    name: 'patientsubscriberRelationShip',
    label: 'subscriber RelationShip',
    visibility: false
  }
];

const EmergencyDetailsFields = [
  {
    name: 'emergencyContactFirstName',
    label: 'Emergency Contact First Name',
    visibility: false
  },
  {
    name: 'emergencyContactLastName',
    label: 'Emergency Contact Last Name',
    visibility: false
  },
  {
    name: 'emergencyContactPhNum',
    label: 'Emergency Contact Phone Number',
    visibility: false
  },
  {
    name: 'emergencyContactRelationshipToPatient',
    label: 'Emergency Contact Relationship To Patient',
    visibility: false
  }
];

const PrimaryCarePhysicianDetailsFields = [
  {
    name: 'PrimaryCareDoctorFirstName',
    label: 'Primary Care Doctor First Name',
    visibility: false
  },
  {
    name: 'PrimaryCareDoctorLastName',
    label: 'Primary Care Doctor Last Name',
    visibility: false
  },
  {
    name: 'PrimaryCarePhoneNumber',
    label: 'Primary Care Phone Number',
    visibility: false
  },
  {
    name: 'PrimaryCareFaxNumber',
    label: 'Primary Care Fax Number',
    visibility: false
  },
  { name: 'ReferralName', label: 'Referral Name', visibility: false }
];
// Define required fields
const requiredFields = {
  PersonalDetails: ['firstName', 'lastName', 'dob', 'phoneNumber', 'gender'],
  AddressDetails: ['street', 'city', 'state', 'zipCode'],
  InsuranceDetails: [
    'payerName',
    'groupNumber',
    'MemberId',
    'patientsubscriberFirstName',
    'patientsubscriberLastName',
    'patientsubscriberDOB',
    'patientsubscriberRelationShip'
  ]
};
const FormBuilder = () => {
  const { axios } = useAxiosInterceptor();
  const theme = useTheme();
  // Add new state for viewing the form
  const [viewFormData, setViewFormData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem('token');
  const [formCustomLength, setFormCustomLength] = useState(false);

  const [formData, setFormData] = useState(null); // Store API response data (defaultForm and customForm)
  const [isDefaultSelected, setIsDefaultSelected] = useState(true); // To toggle between showing the default form
  const [isCustomSelected, setIsCustomSelected] = useState(false); // To toggle between showing the default form

  // Fetch form data from the API
  useEffect(() => {
    axios
      .get('/formBuild', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const { defaultForm, customForm } = response.data;
        setFormData({ defaultForm, customForm });
      })
      .catch((error) => console.error('Error fetching form data', error));
  }, [token]);

  // Function to handle View Form click
  const handleViewForm = () => {
    setIsLoading(true); // Show loading animation

    axios
      .get(`/formBuild`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setFormCustomLength(response.data.customForm.fields.length);
        // console.log('res form', response);

        setIsLoading(false); // Hide loading animation

        // Check if response structure is valid and contains fields
        if (
          response.status === 200 &&
          response.data.customForm &&
          response.data.customForm.fields &&
          response.data.customForm.fields.length > 0
        ) {
          const validSections = response.data.customForm.fields.filter(
            (section) => {
              const sectionFields = Object.values(section)[0]; // Get section fields
              return sectionFields.some((field) => field.visibility); // Check if any field is visible
            }
          );

          if (validSections.length > 0) {
            toast.success('Successfully fetched the form');
            setViewFormData(validSections); // Store only valid sections
            setDialogOpen(true); // Open the dialog to show form data
          } else {
            toast.error(
              'You don’t have any valid sections in the Patient intake form'
            );
          }
        } else {
          toast.error('You don’t have a Patient intake form');
        }
      })
      .catch((error) => {
        console.log('err', error);

        setIsLoading(false); // Hide loading animation
        toast.error('Failed to fetch form data');
      });
  };
  const handleCustomFormSelect = () => {
    setIsDefaultSelected(false); // Set to true to show default form in the stepper
    setIsCustomSelected(true);
  };

  // Handler to show default form in stepper
  const handleDefaultFormSelect = () => {
    setIsDefaultSelected(true); // Set to true to show default form in the stepper
    setIsCustomSelected(false);
    setActiveStep(0); // Reset step to 0
  };

  // Navigate to the next step
  const handleNext = () => {
    if (activeStep < formData.defaultForm.fields.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Navigate to the previous step
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // fetch form checked
  // const fetchFormType = async () => {
  //   try {
  //     const response = await axios.get(`/settings/getSettings`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     console.log('res setting', response);
  //     const {
  //       select_pi_form_send_to_patient_default, // default value from API
  //       select_pi_form_send_to_patient_custom
  //     } = response.data.settings;
  //     setFormCustomChecked(select_pi_form_send_to_patient_custom);
  //     setFormDefauktChecked(select_pi_form_send_to_patient_default);
  //     // const reports = response.data;
  //   } catch (error) {
  //     console.error('Error', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchFormType();
  // }, []);

  const [selectedFields, setSelectedFields] = useState({
    PersonalDetails: [],
    AddressDetails: [],
    InsuranceDetails: [],
    EmergencyDetails: [],
    PrimaryCarePhysician: []
  });

  const [isFormBuilt, setIsFormBuilt] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleFieldToggle = (section, fieldName) => {
    setSelectedFields((prevSelectedFields) => {
      const sectionFields = prevSelectedFields[section];
      const updatedSectionFields = sectionFields.includes(fieldName)
        ? sectionFields.filter((field) => field !== fieldName)
        : [...sectionFields, fieldName];
      return {
        ...prevSelectedFields,
        [section]: updatedSectionFields
      };
    });
  };

  const buildForm = () => {
    let hasError = false;
    const validateSection = (section) => {
      const fields = requiredFields[section];
      if (!fields) return true; // No required fields for this section
      return fields.every((requiredField) => {
        if (!selectedFields[section].includes(requiredField)) {
          toast.error(
            `Please select the ${requiredField} in ${section
              .replace(/([A-Z])/g, ' $1')
              .trim()}`
          );
          hasError = true;
          return false; // Indicate that validation failed
        }
        return true; // Validation passed
      });
    };
    const sections = [
      'PersonalDetails',
      'AddressDetails',
      'InsuranceDetails',
      'EmergencyDetails',
      'PrimaryCarePhysician'
    ];
    sections.some((section) => {
      if (!validateSection(section)) {
        return true; // Stop further validation if there's an error
      }
      return false;
    });
    if (!hasError) {
      if (!isFormBuilt) {
        setIsLoading(true);
        // setIsFormBuilt(true);
        sendFormData();
      }
    }
  };

  // Function to render the current section (step) based on activeStep
  const renderStepperContentDefault = (activeStep) => {
    if (!formData?.defaultForm) return null; // If no form data, return nothing

    const sections = formData.defaultForm.fields; // Get all the sections from defaultForm
    const currentSection = sections[activeStep]; // Get the current section based on activeStep
    const sectionName = Object.keys(currentSection)[0]; // Get the section name (e.g., PersonalDetails)
    const fields = currentSection[sectionName]; // Get the fields for that section

    // Render the fields in a 2-column layout
    return (
      <Grid container spacing={2}>
        {fields.map(
          (field, index) =>
            field.visibility && (
              <Grid item xs={12} sm={6} key={index}>
                {' '}
                {/* 2-column layout */}
                <TextField
                  fullWidth
                  label={field.field.replace(/([A-Z])/g, ' $1').trim()} // Convert field name to label
                  variant="outlined"
                />
              </Grid>
            )
        )}
      </Grid>
    );
  };

  const sendFormData = () => {
    // Include visibility status for both selected and non-selected fields
    const buildSectionData = (fields, section) => {
      return fields.map((field) => ({
        field: field.name,
        visibility: selectedFields[section].includes(field.name)
      }));
    };
    const formData = [
      {
        PersonalDetails: buildSectionData(
          PersonalDetailsFields,
          'PersonalDetails'
        )
      },
      {
        AddressDetails: buildSectionData(AddressDetailsFields, 'AddressDetails')
      },
      {
        InsuranceDetails: buildSectionData(
          InsuranceDetailsFields,
          'InsuranceDetails'
        )
      },
      {
        EmergencyDetails: buildSectionData(
          EmergencyDetailsFields,
          'EmergencyDetails'
        )
      },
      {
        PrimaryCarePhysician: buildSectionData(
          PrimaryCarePhysicianDetailsFields,
          'PrimaryCarePhysician'
        )
      }
    ];

    axios
      .put(
        `/formBuild`,
        { fields: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          // Form successfully saved
          toast.success('Form configuration saved successfully');
          setIsFormBuilt(true); // Allow viewing the form after it's built
          // toast.success('Form configuration saved successfully');
        } else if (response.status === 409) {
          // Form already exists
          toast.error('A form with this client account already exists');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          // Conflict - Form already exists
          toast.error('A form with this client account already exists');
        } else {
          // Any other errors - default message
          toast.error('Failed to save form configuration');
        }
      })
      .finally(() => {
        setIsLoading(false); // Stop loading state
      });
  };
  const handleAccordionChange = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const handleSelectAll = (section) => {
    const sectionFields =
      section === 'PersonalDetails'
        ? PersonalDetailsFields
        : section === 'AddressDetails'
        ? AddressDetailsFields
        : section === 'InsuranceDetails'
        ? InsuranceDetailsFields
        : section === 'EmergencyDetails'
        ? EmergencyDetailsFields
        : PrimaryCarePhysicianDetailsFields;

    setSelectedFields((prevSelectedFields) => ({
      ...prevSelectedFields,
      [section]: sectionFields.map((field) => field.name)
    }));
  };

  const renderFieldLabel = (field) => {
    const isRequired = requiredFields[field.section]?.includes(field.name);
    return (
      <Typography>
        {field.label}{' '}
        {isRequired ? <span style={{ color: 'red' }}>*</span> : null}
      </Typography>
    );
  };

  // Function to render fields for each section
  const renderSectionFields = (sectionData) => {
    return (
      <Grid container spacing={2}>
        {sectionData
          .filter((field) => field.visibility) // Only show visible fields
          .map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                fullWidth
                label={field.field.replace(/([A-Z])/g, ' $1').trim()} // Display field name with spaces between words
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true // Make fields read-only if needed
                }}
              />
            </Grid>
          ))}
      </Grid>
    );
  };

  // Function to render content inside the Stepper
  const renderStepperContent = (step) => {
    const sectionName = Object.keys(viewFormData[step])[0];
    const sectionFields = viewFormData[step][sectionName];

    return (
      <div>
        <form>{renderSectionFields(sectionFields)}</form>
      </div>
    );
  };
  return (
    <>
      <Formik
        initialValues={Object.fromEntries(
          Object.entries(selectedFields).flatMap(([section, fields]) =>
            fields.map((field) => [field, ''])
          )
        )}
        onSubmit={(values) => {
          console.log(values);
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <Toaster position="bottom-right" />
            <Box sx={{ m: 2, p: 2 }}>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="The default form includes the mandatory fields from Siddha-Pi and its integrated EMR system. These fields are fixed and cannot be modified by the admin user">
                    <Chip
                      label="Default"
                      onClick={handleDefaultFormSelect}
                      color={isDefaultSelected ? 'primary' : 'secondary'}
                    />
                  </Tooltip>
                  <Tooltip title="The custom form is dynamically created by the admin user. It can be modified at any time for the provider's convenience, with a preview option available for the built form">
                    <Chip
                      label="Custom"
                      onClick={handleCustomFormSelect}
                      color={isCustomSelected ? 'primary' : 'secondary'}
                    />
                  </Tooltip>
                </Stack>
                {/* <Box sx={{ p: 3 }}>
                  <Typography variant="h6">
                    Note:
                    <Typography color="secondary">
                      To change the mode of the patient intake form, navigate to
                      the admin panel settings: Settings → Patient Intake Form →
                      Patient Intake Form Type
                    </Typography>
                  </Typography>
                </Box> */}
                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      background: alpha(theme.colors.info.main, 0.08),
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 2,
                      mt: 2
                    }}
                  >
                    <NotificationImportantTwoToneIcon
                      sx={{
                        mr: 1,
                        color: theme.colors.info.main,
                        fontSize: theme.typography.pxToRem(22)
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          pt: 0.2
                        }}
                        gutterBottom
                      >
                        Note :
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: theme.typography.pxToRem(13)
                        }}
                      >
                        To change the mode of the patient intake form, navigate
                        to the admin panel settings: Settings → Patient Intake
                        Form → Patient Intake Form Type
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                {/* Show stepper only when the default form is selected */}
                {isDefaultSelected && formData?.defaultForm && (
                  <Box sx={{ p: 3 }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      {/* <Grid item xs={12} md={10}> */}
                      <Card sx={{ p: 3 }}>
                        <Box mt={4}>
                          <Stepper activeStep={activeStep}>
                            {formData.defaultForm.fields.map(
                              (section, index) => (
                                <Step key={index}>
                                  <StepLabel>
                                    {Object.keys(section)[0]
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()}
                                  </StepLabel>
                                </Step>
                              )
                            )}
                          </Stepper>

                          {/* Render current step content */}
                          <Box mt={2}>
                            {renderStepperContentDefault(activeStep)}
                          </Box>

                          {/* Navigation buttons */}
                          <Box
                            mt={2}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                            >
                              Back
                            </Button>
                            <Button
                              disabled={
                                activeStep ===
                                formData.defaultForm.fields.length - 1
                              }
                              onClick={handleNext}
                            >
                              Next
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                      {/* </Grid> */}
                    </Grid>
                  </Box>
                )}

                {/* Show loading spinner while fetching the form */}
                {isLoading && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {/* Display Dialog with Stepper inside when viewFormData is available */}
                {viewFormData && dialogOpen && (
                  <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="md"
                  >
                    <DialogTitle>Patient Intake Form</DialogTitle>
                    <DialogContent>
                      <Stepper activeStep={activeStep}>
                        {viewFormData.map((section, index) => (
                          <Step key={index}>
                            <StepLabel>
                              {Object.keys(section)[0]
                                .replace(/([A-Z])/g, ' $1')
                                .trim()}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>

                      {/* Render form fields inside a 2-column layout */}
                      <Box sx={{ mt: 2 }}>
                        {renderStepperContent(activeStep)}
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                      >
                        Back
                      </Button>
                      <Button
                        disabled={activeStep === viewFormData.length - 1}
                        onClick={() => setActiveStep((prev) => prev + 1)}
                      >
                        Next
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Grid>
            </Box>

            {isCustomSelected && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                      <Typography variant="h6" align="center">
                        Patient Intake Form
                      </Typography>
                      {Object.values(selectedFields).some(
                        (section) => section.length > 0
                      ) &&
                        [
                          'PersonalDetails',
                          'AddressDetails',
                          'InsuranceDetails',
                          'EmergencyDetails',
                          'PrimaryCarePhysician'
                        ].map(
                          (section) =>
                            selectedFields[section].length > 0 && (
                              <Box key={section} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">
                                  {section.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                                {selectedFields[section].map((fieldName) => {
                                  const field = [
                                    ...PersonalDetailsFields,
                                    ...AddressDetailsFields,
                                    ...InsuranceDetailsFields,
                                    ...EmergencyDetailsFields,
                                    ...PrimaryCarePhysicianDetailsFields
                                  ].find((f) => f.name === fieldName);
                                  return (
                                    <Box
                                      key={fieldName}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 2
                                      }}
                                    >
                                      <Field
                                        as={TextField}
                                        fullWidth
                                        name={fieldName}
                                        label={renderFieldLabel(field)}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values[fieldName]}
                                        variant="outlined"
                                      />
                                      <IconButton
                                        onClick={() =>
                                          handleFieldToggle(section, fieldName)
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
                  <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="h6">Add Form Fields</Typography>
                        <Typography variant="span">
                          Fields marked with{' '}
                          <span style={{ color: 'red' }}>*</span> are required
                        </Typography>
                      </Box>

                      {[
                        'PersonalDetails',
                        'AddressDetails',
                        'InsuranceDetails',
                        'EmergencyDetails',
                        'PrimaryCarePhysician'
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
                            <Typography>
                              {section.replace(/([A-Z])/g, ' $1').trim()}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid
                              container
                              spacing={1}
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 2 }}
                            >
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSelectAll(section)}
                                  size="small"
                                >
                                  Select All
                                </Button>
                              </Grid>
                            </Grid>
                            {section === 'PersonalDetails' &&
                              PersonalDetailsFields.map((field) =>
                                !selectedFields[section].includes(
                                  field.name
                                ) ? (
                                  <FormControlLabel
                                    key={field.name}
                                    control={
                                      <Checkbox
                                        checked={selectedFields[
                                          section
                                        ].includes(field.name)}
                                        onChange={() =>
                                          handleFieldToggle(section, field.name)
                                        }
                                        name={field.name}
                                        color="primary"
                                      />
                                    }
                                    label={renderFieldLabel({
                                      ...field,
                                      section
                                    })}
                                    sx={{ mt: 1 }}
                                  />
                                ) : null
                              )}
                            {section === 'AddressDetails' &&
                              AddressDetailsFields.map((field) =>
                                !selectedFields[section].includes(
                                  field.name
                                ) ? (
                                  <FormControlLabel
                                    key={field.name}
                                    control={
                                      <Checkbox
                                        checked={selectedFields[
                                          section
                                        ].includes(field.name)}
                                        onChange={() =>
                                          handleFieldToggle(section, field.name)
                                        }
                                        name={field.name}
                                        color="primary"
                                      />
                                    }
                                    label={renderFieldLabel({
                                      ...field,
                                      section
                                    })}
                                    sx={{ mt: 1 }}
                                  />
                                ) : null
                              )}
                            {section === 'InsuranceDetails' &&
                              InsuranceDetailsFields.map((field) =>
                                !selectedFields[section].includes(
                                  field.name
                                ) ? (
                                  <FormControlLabel
                                    key={field.name}
                                    control={
                                      <Checkbox
                                        checked={selectedFields[
                                          section
                                        ].includes(field.name)}
                                        onChange={() =>
                                          handleFieldToggle(section, field.name)
                                        }
                                        name={field.name}
                                        color="primary"
                                      />
                                    }
                                    label={renderFieldLabel({
                                      ...field,
                                      section
                                    })}
                                    sx={{ mt: 1 }}
                                  />
                                ) : null
                              )}
                            {section === 'EmergencyDetails' &&
                              EmergencyDetailsFields.map((field) =>
                                !selectedFields[section].includes(
                                  field.name
                                ) ? (
                                  <FormControlLabel
                                    key={field.name}
                                    control={
                                      <Checkbox
                                        checked={selectedFields[
                                          section
                                        ].includes(field.name)}
                                        onChange={() =>
                                          handleFieldToggle(section, field.name)
                                        }
                                        name={field.name}
                                        color="primary"
                                      />
                                    }
                                    label={renderFieldLabel({
                                      ...field,
                                      section
                                    })}
                                    sx={{ mt: 1 }}
                                  />
                                ) : null
                              )}
                            {section === 'PrimaryCarePhysician' &&
                              PrimaryCarePhysicianDetailsFields.map((field) =>
                                !selectedFields[section].includes(
                                  field.name
                                ) ? (
                                  <FormControlLabel
                                    key={field.name}
                                    control={
                                      <Checkbox
                                        checked={selectedFields[
                                          section
                                        ].includes(field.name)}
                                        onChange={() =>
                                          handleFieldToggle(section, field.name)
                                        }
                                        name={field.name}
                                        color="primary"
                                      />
                                    }
                                    label={renderFieldLabel({
                                      ...field,
                                      section
                                    })}
                                    sx={{ mt: 1 }}
                                  />
                                ) : null
                              )}
                            {selectedFields[section].length ===
                              (section === 'PersonalDetails'
                                ? PersonalDetailsFields
                                : section === 'AddressDetails'
                                ? AddressDetailsFields
                                : section === 'InsuranceDetails'
                                ? InsuranceDetailsFields
                                : section === 'EmergencyDetails'
                                ? EmergencyDetailsFields
                                : PrimaryCarePhysicianDetailsFields
                              ).length && (
                              <Typography>No more fields</Typography>
                            )}
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
                      // disabled={isLoading}
                      sx={{
                        mt: 2,
                        mr: 2
                      }}
                    >
                      {/* {isLoading ? 'Loading...' : 'Build Form'} */}
                      {formCustomLength === 1 ? 'Update Form' : 'Build Form'}
                    </Button>

                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleViewForm}
                      disabled={isLoading}
                      sx={{
                        mt: 2,
                        mr: 2
                      }}
                    >
                      {isLoading ? 'Loading...' : 'view Form'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default FormBuilder;
