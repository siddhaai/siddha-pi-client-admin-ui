import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Radio,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Avatar,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  // useMediaQuery,
  // useTheme,
  CircularProgress,
  TableContainer,
  Paper
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Add, Delete } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { axios } = useAxiosInterceptor();
  // const theme = useTheme();
  const [smsCard, setSmsCard] = useState(false);
  const [smsTemplateView, setSmsTemplateView] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false); // To toggle the add template section
  const [initialLoader, setInitialLoader] = useState(true); // New state for initial loader

  const { t } = useTranslation();

  // Initialize the states
  const [formData, setFormData] = useState({
    expiry: '',
    emailNotification: '',
    sessionTimeout: '',
    remainderTitle: '',
    emails: [{ email: '' }], // Initial state with one empty email field    timeZones: [],
    reportWeekly: false,
    reportMonthly: false,
    default: false, // Default option for Patient Intake Form
    custom: false, // Custom option for Patient Intake Form,
    logo: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const [smsData, setSmsData] = useState({
  //   templateName: '',
  //   templateText: '', // The SMS template content, pre-filled with required variable
  //   selectedVariables: ['WEB_APP_URL'] // 'WEB_APP_URL' is always selected and cannot be removed
  // });

  const [smsData, setSmsData] = useState({
    templateName: '',
    templateText: '',
    selectedVariables: ['WEB_APP_URL'],
    smsTemplates: [], // Store all templates
    selectedTemplateIndex: null, // Selected template index for radio button
    newTemplateName: '', // New template name
    newTemplateText: '', // New template content
    newSelectedVariables: [] // Variables for new template
  });

  // Function to handle deleting a template
  const handleDeleteTemplate = (indexToDelete) => {
    setSmsData((prevData) => {
      const updatedTemplates = prevData.smsTemplates.filter(
        (template, index) => index !== indexToDelete
      );
      return {
        ...prevData,
        smsTemplates: updatedTemplates
      };
    });
    console.success('Template deleted successfully!');
  };

  // Get settings from API
  const getAdminCustomSetting = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/settings/getSettings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const {
        client_admin_session_time,
        siddha_pi_form_session_time,
        Patient_reminder_sms_alert,
        mail_send_email_ids,
        timeZones,
        weekly_report,
        monthly_report,
        select_pi_form_send_to_patient_default,
        select_pi_form_send_to_patient_custom,
        logo,
        sms_template
      } = response.data.settings;

      setFormData({
        expiry: siddha_pi_form_session_time,
        emailNotification: '',
        sessionTimeout: client_admin_session_time,
        emails: mail_send_email_ids || [],
        timeZones: timeZones || [],
        reportWeekly: weekly_report,
        reportMonthly: monthly_report,
        remainderTitle: Patient_reminder_sms_alert,
        default: select_pi_form_send_to_patient_default,
        custom: select_pi_form_send_to_patient_custom,
        logo
      });

      // Set SMS templates and pre-selected variables
      if (sms_template && sms_template.length > 0) {
        const selectedTemplateIndex = sms_template.findIndex(
          (template) => template.selected
        ); // Find selected template

        setSmsData((prevData) => ({
          ...prevData,
          smsTemplates: sms_template, // Store all templates
          selectedTemplateIndex // Mark the selected template index
        }));
      }
    } catch (error) {
      toast.error(`${error.message}`);
    } finally {
      setIsLoading(false);
      setInitialLoader(false); // Stop the initial loader after fetching
    }
  };

  // Handle Template Name Change
  const handleTemplateNameChange = (e) => {
    setSmsData({ ...smsData, templateName: e.target.value });
  };

  // Handle Text Change for the SMS template
  const handleTextChange = (e) => {
    setSmsData({ ...smsData, templateText: e.target.value });
  };

  // Handle Variable Selection
  // const handleVariableSelect = (variable) => {
  //   const selectedVariables = smsData.selectedVariables.includes(variable)
  //     ? smsData.selectedVariables.filter((v) => v !== variable)
  //     : [...smsData.selectedVariables, variable];

  //   setSmsData({ ...smsData, selectedVariables });
  // };

  // Add New Template to the List
  const handleAddTemplate = () => {
    if (smsData.templateName && smsData.templateText) {
      const newTemplate = {
        templateName: smsData.templateName,
        smsTemplateContant: smsData.templateText,
        selected: false
      };

      setSmsData((prevData) => ({
        ...prevData,
        smsTemplates: [...prevData.smsTemplates, newTemplate], // Add the new template
        templateName: '',
        templateText: '',
        selectedVariables: []
      }));
      setShowAddTemplate(false); // Hide add template section after adding
      toast.success('New SMS template added successfully!');
    } else {
      toast.error('Please fill out the SMS template title and content.');
    }
  };

  const variables = [
    { label: 'Patient First Name', value: 'patientName' },
    { label: 'Appointment Date & Time', value: 'scheduleDateTime' },
    // { label: 'Time Zone', value: 'timeZone' },
    { label: 'Patient Intake Form Url', value: 'WEB_APP_URL', required: true } // Required checkbox
  ];

  const handleVariableSelect = (variable) => {
    const textarea = document.getElementById('smsTemplateTextarea');
    const cursorPosition = textarea.selectionStart; // Get the current cursor position
    const isSelected = smsData.selectedVariables.includes(variable);

    if (isSelected) {
      // Remove the variable from selectedVariables and the templateText
      setSmsData((prevData) => {
        const updatedTemplateText = prevData.templateText.replace(
          `{{${variable}}}`,
          ''
        );
        return {
          ...prevData,
          selectedVariables: prevData.selectedVariables.filter(
            (v) => v !== variable
          ),
          templateText: updatedTemplateText
        };
      });
    } else {
      // Insert the variable at the cursor position
      setSmsData((prevData) => {
        const beforeText = prevData.templateText.slice(0, cursorPosition);
        const afterText = prevData.templateText.slice(cursorPosition);
        const updatedTemplateText = `${beforeText}{{${variable}}}${afterText}`;
        return {
          ...prevData,
          selectedVariables: [...prevData.selectedVariables, variable],
          templateText: updatedTemplateText
        };
      });

      // Move the cursor to the right of the inserted variable
      setTimeout(() => {
        textarea.setSelectionRange(
          cursorPosition + `{{${variable}}}`.length,
          cursorPosition + `{{${variable}}}`.length
        );
        textarea.focus();
      }, 0);
    }
  };

  // Submit function for saving settings, including selected template
  const handleSubmit = async () => {
    // if (!smsData.selectedVariables.includes('WEB_APP_URL')) {
    //   toast.error('Please select "Patient Intake Form Url" field');
    //   return;
    // }

    // Check if a template has been selected
    if (
      smsData.selectedTemplateIndex === null ||
      smsData.selectedTemplateIndex === undefined
    ) {
      toast.error('Please select an SMS template to proceed.');
      return; // Exit the function early if no template is selected
    }

    // Prepare the SMS templates for PUT request, ensuring the selected template is marked
    const smsTemplatesWithSelection = smsData.smsTemplates.map(
      (template, index) => ({
        ...template,
        selected: index === smsData.selectedTemplateIndex // Mark the selected template in PUT request
      })
    );

    const requestBody = {
      client_admin_session_time: formData.sessionTimeout,
      siddha_pi_form_session_time: formData.expiry,
      Patient_reminder_sms_alert: formData.remainderTitle,
      mail_send_email_ids: formData.emails,
      timeZones: formData.timeZones,
      weekly_report: formData.reportWeekly,
      monthly_report: formData.reportMonthly,
      select_pi_form_send_to_patient_default: formData.default,
      select_pi_form_send_to_patient_custom: formData.custom,
      sms_template: smsTemplatesWithSelection // Include the updated SMS templates with selected template
    };

    try {
      const response = await axios.put(
        '/settings/updateSettings',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Settings updated successfully!');
        setIsEditing(false);
        setShowAddTemplate(false); // Hide the add section after saving
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Track current tab
  const token = localStorage.getItem('token');
  const [errors, setErrors] = useState({}); // State to track validation errors
  // const [cursorPosition, setCursorPosition] = useState(0); // To track cursor position
  const [selectedImage, setSelectedImage] = useState(null); // Selected new image for upload
  const [selectedImageFile, setSelectedImageFile] = useState(null); // For binary upload
  const [isLoading, setIsLoading] = useState(false);

  // Track the cursor position in the textarea
  // const handleCursorPositionChange = (event) => {
  //   setCursorPosition(event.target.selectionStart); // Update cursor position on text area click or change
  // };

  // Handle tab change
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  // Handle radio button change (only one can be selected at a time)
  const handleRadioChange = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      default: name === 'default' ? true : false,
      custom: name === 'custom' ? true : false
    });
  };

  // Handle "Both" button click
  const handleBothClick = () => {
    if (isEditing) {
      setFormData({
        ...formData,
        reportWeekly: true,
        reportMonthly: true
      });
    }
  };

  // Add new email field
  const addEmailField = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { email: '' }]
    });
  };

  // Add time zone input field
  const addTimeZoneField = () => {
    setFormData({
      ...formData,
      timeZones: [...formData.timeZones, { timeZones: '' }]
    });
  };

  // Handle email change with validation
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index].email = value;
    setFormData({ ...formData, emails: updatedEmails });

    // Check for validation
    const newErrors = { ...errors };
    if (!validateEmail(value)) {
      newErrors[index] = t('Invalid email format');
    } else {
      delete newErrors[index]; // Remove error if valid
    }
    setErrors(newErrors);
  };

  // Handle time zone field change
  const handleTimeZoneChange = (index, value) => {
    const updatedTimeZones = formData.timeZones.map((zoneObj, i) =>
      i === index ? { timeZones: value } : zoneObj
    );
    setFormData({ ...formData, timeZones: updatedTimeZones });
  };

  // Handle time zone selection (radio button)
  const handleTimeZoneSelect = (index) => {
    const updatedTimeZones = formData.timeZones.map((zoneObj, i) => ({
      ...zoneObj,
      selected: i === index // Set selected to true for the selected row, false for others
    }));
    setFormData({ ...formData, timeZones: updatedTimeZones });
  };

  // Delete email field
  const deleteEmailField = (index) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);
    setFormData({ ...formData, emails: updatedEmails });

    // Remove error for the deleted field
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  // Delete time zone field
  const deleteTimeZoneField = (index) => {
    const updatedTimeZones = formData.timeZones.filter((_, i) => i !== index);
    setFormData({ ...formData, timeZones: updatedTimeZones });
  };

  // Submit the new logo to the backend
  const handleLogoSubmit = async () => {
    if (!selectedImageFile) {
      toast.error(t('Please select an image to upload'));
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedImageFile); // Append the file as binary data
    setIsLoading(true);

    try {
      const logoResponse = await axios.put(
        '/settings/updateSettingsLogo',
        formData, // Send binary data
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the correct content type
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (logoResponse.status === 200) {
        toast.success(t('Logo updated successfully!'));
        setSelectedImageFile(null); // Clear the selected file after upload
        setSelectedImage(null); // Clear base64 preview
        getAdminCustomSetting(); // Refresh settings to display updated logo
        setIsLoading(false); // Reset loading state
      } else {
        toast.error(t('Error updating logo'));
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }

    setIsEditing(false); // Exit editing mode
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error(t('Please select a valid image file'));
      return;
    }

    // Enforce 5MB size limit
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      toast.error(
        t('File size exceeds 5MB limit. Please select a smaller image.')
      );
      return;
    }

    // Supported file types excluding GIF
    const supportedFormats = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif'
    ];

    if (!supportedFormats.includes(file.type)) {
      toast.error(t('Unsupported file format'));
      return;
    }

    // Use FileReader to convert image for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Base64 preview
    };

    setSelectedImageFile(file); // Store binary file for upload
    reader.readAsDataURL(file); // Read the file for display
  };

  const handleCancelImageChange = () => {
    setSelectedImage(null); // Reset selected image
  };

  useEffect(() => {
    getAdminCustomSetting();
  }, [getAdminCustomSetting]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Adjust padding for different screen sizes */}
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Toaster position="bottom-right" />
      {/* Tabs to switch between sections */}

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Settings Tabs"
        sx={{ mb: 3 }}
        variant="scrollable"
      >
        <Tab label={t('Patient Intake Form')} />
        <Tab label={t('Admin')} />
        <Tab label={t('Notification')} />
        <Tab label={t('Hospital')} />
      </Tabs>
      {/* Tab Panels */}
      {initialLoader ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        tabIndex === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              {t('Patient Intake Form')}
            </Typography>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={6} lg={2}>
                <Typography variant="caption">Expires In:</Typography>
                <TextField
                  type="number"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 1, max: 31 }}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item sx={{ mt: 1.5 }}>
                <Typography variant="caption">
                  {formData.expiry > 1 ? t("Day's") : t('Day')}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              {t('Patient Intake Form Type')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.default}
                      onChange={handleRadioChange}
                      name="default"
                    />
                  }
                  label={t('Default')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.custom}
                      onChange={handleRadioChange}
                      name="custom"
                    />
                  }
                  label={t('Custom')}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h5" gutterBottom>
                {t('Custom SMS Template')}
              </Typography>

              {/* Add New Template Button */}
              <Button
                disabled={!isEditing}
                variant="outlined"
                color="primary"
                onClick={() => setShowAddTemplate(!showAddTemplate)}
                sx={{ mt: 3 }}
              >
                {showAddTemplate ? t('Cancel') : t('Add New SMS Template')}
              </Button>

              {/* Form to Add a New SMS Template */}
              {showAddTemplate && (
                <Box mt={3}>
                  {/* Template Name Input Field */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        disabled={!isEditing}
                        label={t('SMS Template Title')}
                        value={smsData.templateName}
                        onChange={handleTemplateNameChange}
                        placeholder={t('Enter SMS Template Title')}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Display variable checkboxes */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {variables.map((variable) => (
                      <Grid item key={variable.value}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={smsData.selectedVariables.includes(
                                variable.value
                              )}
                              onChange={() =>
                                handleVariableSelect(variable.value)
                              }
                            />
                          }
                          label={variable.label}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Text area for SMS template with chips for variables */}
                  <Box mt={2}>
                    <Box
                      mt={1}
                      p={2}
                      sx={{
                        width: '100%',
                        minHeight: '100px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        position: 'relative'
                      }}
                    >
                      {/* Display the chips for selected variables */}
                      {smsData.selectedVariables.map((variable) => (
                        <Chip
                          key={variable}
                          label={`{{${variable}}}`}
                          onDelete={() => handleVariableSelect(variable)}
                          sx={{ m: 0.5 }}
                        />
                      ))}

                      {/* Text area where the user can type */}
                      <textarea
                        id="smsTemplateTextarea"
                        value={smsData.templateText}
                        onChange={handleTextChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          fontSize: '16px',
                          lineHeight: '1.5',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          resize: 'none'
                        }}
                        rows={6}
                        placeholder={t('Type your sms content here...')}
                      />
                    </Box>
                  </Box>

                  {/* Add New Template Submit Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTemplate}
                    sx={{ mt: 2 }}
                  >
                    {t('Save SMS')}
                  </Button>
                </Box>
              )}

              {/* SMS Template Table */}
              {!showAddTemplate && (
                <TableContainer
                  component={Paper}
                  sx={{ mt: 3, maxHeight: 400 }}
                >
                  <Table stickyHeader aria-label="sms templates table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {t('Select')}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            wordWrap: 'break-word' // Ensure text wrapping
                          }}
                        >
                          {t('SMS Title')}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            wordWrap: 'break-word' // Ensure text wrapping
                          }}
                        >
                          {t('Content')}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {t('Actions')}
                        </TableCell>{' '}
                        {/* Action Column for Delete */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {smsData.smsTemplates.length === 0 ? (
                        // Display this row if there are no templates
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                            {t('No records found')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Otherwise, display the templates
                        smsData.smsTemplates.map((template, index) => (
                          <TableRow key={template.templateName}>
                            <TableCell>
                              <Radio
                                disabled={!isEditing}
                                checked={
                                  smsData.selectedTemplateIndex === index
                                }
                                onChange={() =>
                                  setSmsData({
                                    ...smsData,
                                    selectedTemplateIndex: index
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: {
                                    xs: '12px',
                                    sm: '14px',
                                    md: '16px'
                                  },
                                  wordWrap: 'break-word' // Ensure text wrapping
                                }}
                              >
                                {template.templateName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                  fontSize: {
                                    xs: '12px',
                                    sm: '14px',
                                    md: '16px'
                                  },
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word' // Wrap words within the cell
                                }}
                              >
                                {template.smsTemplateContant}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={isEditing ? t('Delete') : t('Delete')}
                              >
                                <span>
                                  {/* Wrap IconButton in <span> to handle disabling */}
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteTemplate(index)}
                                    sx={{
                                      color: isEditing ? 'red' : 'gray',
                                      cursor: isEditing ? 'pointer' : 'none'
                                    }}
                                    disabled={!isEditing} // Disable button if not editing
                                  >
                                    <Delete />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        )
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('Admin Panel Session')}
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6} lg={2}>
              <Typography variant="caption">Timeout In:</Typography>
              <TextField
                type="number"
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1, max: 24 }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item sx={{ mt: 1.5 }}>
              <Typography variant="caption">
                {formData.sessionTimeout > 1 ? t("Hour's") : t('Hour')}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {t('Email')}
                      </TableCell>
                      {isEditing && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            onClick={addEmailField}
                            variant="outlined"
                            disabled={
                              !isEditing || Object.keys(errors).length > 0
                            } // Disable if there are errors
                          >
                            <Add /> {t('Add')}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.emails.map((emailObj, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="email"
                            value={emailObj.email}
                            onChange={(e) =>
                              handleEmailChange(index, e.target.value)
                            }
                            disabled={!isEditing}
                            error={!!errors[index]} // Show error state if email is invalid
                            helperText={errors[index]} // Display error message
                          />
                        </TableCell>
                        {isEditing && (
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Button onClick={() => deleteEmailField(index)}>
                              <Tooltip title={t('Delete')}>
                                <Delete color="error" />
                              </Tooltip>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {tabIndex === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('Form Submit Reminder')}
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6} lg={2}>
              <Typography variant="caption">To Patient:</Typography>
              <TextField
                type="number"
                name="remainderTitle"
                value={formData.remainderTitle}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1, max: 31 }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item sx={{ mt: 1.5 }}>
              <Typography variant="caption">
                {formData.remainderTitle > 1 ? t("Day's") : t('Day')}
              </Typography>
            </Grid>
          </Grid>

          <Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              {t('Send Email Report To Admin')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.reportWeekly}
                      onChange={handleCheckboxChange}
                      name="reportWeekly"
                    />
                  }
                  label={t('Weekly')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.reportMonthly}
                      onChange={handleCheckboxChange}
                      name="reportMonthly"
                    />
                  }
                  label={t('Monthly')}
                  disabled={!isEditing}
                />
              </Grid>
              <Button
                onClick={handleBothClick}
                sx={{ mt: 2 }}
                variant="outlined"
                disabled={!isEditing}
              >
                {t('Both')}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}
      {tabIndex === 3 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            {t('Healthcare organization logo')}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {/* Display current or selected logo */}
            <Card>
              <Avatar
                src={selectedImage || `data:image/jpeg;base64,${formData.logo}`} // Use selected image or current logo
                alt="Logo"
                sx={{ width: 120, height: 120 }}
              />
            </Card>
            {isEditing ? (
              <>
                {/* File input for image upload */}
                <IconButton color="primary" component="label">
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <Tooltip title={t('Upload new picture')}>
                    <CloudUploadIcon sx={{ width: '50px', height: '50px' }} />
                  </Tooltip>
                </IconButton>

                {/* If image is selected, show Cancel and Save Logo buttons */}
                {selectedImage && (
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      // color="secondary"
                      onClick={handleLogoSubmit}
                    >
                      {t('Save')}
                      {isLoading && (
                        <CircularProgress size={24} sx={{ ml: 2 }} />
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelImageChange}
                    >
                      {t('Cancel')}
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Button
                sx={{ display: 'none' }}
                onClick={() => setIsEditing(true)}
                variant="contained"
              >
                {t('Change Picture')}
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Select')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {t('Time Zone')}
                    </TableCell>
                    {isEditing && (
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          onClick={addTimeZoneField}
                          sx={{ mt: 0 }}
                          variant="outlined"
                          disabled={!isEditing}
                        >
                          <Add /> {t('Add')}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.timeZones.map((zoneObj, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Radio
                          checked={zoneObj.selected || false}
                          onChange={() => handleTimeZoneSelect(index)}
                          disabled={!isEditing}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={zoneObj.timeZones}
                          onChange={(e) =>
                            handleTimeZoneChange(index, e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </TableCell>
                      {isEditing && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button onClick={() => deleteTimeZoneField(index)}>
                            <Tooltip title={t('Delete')}>
                              <Delete color="error" />
                            </Tooltip>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Save Settings Button */}
      <Box mt={3}>
        {!isEditing ? (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            {t('Change Settings')}
          </Button>
        ) : (
          <>
            <Button variant="contained" onClick={handleSubmit}>
              {t('Save Settings')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={() => {
                setIsEditing(false);
              }}
            >
              {t('Cancel')}
            </Button>
          </>
        )}
      </Box>

      {/* SMS Template Preview Dialog */}
      {smsCard && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <Typography variant="h6" color="secondary">
              {t('Sample SMS')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">{smsTemplateView}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
