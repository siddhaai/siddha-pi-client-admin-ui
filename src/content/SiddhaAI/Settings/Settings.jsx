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
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Add, Delete } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

export default function Settings() {
  const { axios } = useAxiosInterceptor();
  const theme = useTheme();
  const [smsCard, setSmsCard] = useState(false);
  const [smsTemplateView, setSmsTemplateView] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

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

  const [smsData, setSmsData] = useState({
    templateName: '',
    templateText: '', // The SMS template content, pre-filled with required variable
    selectedVariables: ['WEB_APP_URL'] // 'WEB_APP_URL' is always selected and cannot be removed
  });

  const variables = [
    { label: 'Patient First Name', value: 'patientName' },
    { label: 'Appointment Date & Time', value: 'scheduleDateTime' },
    { label: 'Time Zone', value: 'timeZone' },
    // { label: 'Doctor Phone Number', value: 'doctor_phone' },
    { label: 'Patient Intake Form Url', value: 'WEB_APP_URL', required: true } // Required checkbox
  ];

  // Handle variable selection (checkbox toggle)
  // const handleVariableSelect = (variable) => {
  //   const isSelected = smsData.selectedVariables.includes(variable);

  //   if (isSelected) {
  //     // Remove variable from selectedVariables and templateText
  //     setSmsData((prevData) => ({
  //       ...prevData,
  //       selectedVariables: prevData.selectedVariables.filter(
  //         (v) => v !== variable
  //       ),
  //       templateText: prevData.templateText.replace(`{{${variable}}}`, '')
  //     }));
  //   } else {
  //     // Add variable to selectedVariables and insert it into templateText
  //     setSmsData((prevData) => ({
  //       ...prevData,
  //       selectedVariables: [...prevData.selectedVariables, variable],
  //       templateText: `${prevData.templateText} {{${variable}}}`
  //     }));
  //   }
  // };

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

  // Handle changes in the textarea
  const handleTextChange = (e) => {
    setSmsData({ ...smsData, templateText: e.target.value });
  };

  // Handle template name input
  const handleTemplateNameChange = (e) => {
    setSmsData({ ...smsData, templateName: e.target.value });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Track current tab
  const [selectedImage, setSelectedImage] = useState(null); // Selected new image for upload
  const token = localStorage.getItem('token');
  const [errors, setErrors] = useState({}); // State to track validation errors
  const [cursorPosition, setCursorPosition] = useState(0); // To track cursor position

  // Track the cursor position in the textarea
  const handleCursorPositionChange = (event) => {
    setCursorPosition(event.target.selectionStart); // Update cursor position on text area click or change
  };

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

  // Handle email field change
  // Handle email change with validation
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index].email = value;
    setFormData({ ...formData, emails: updatedEmails });

    // Check for validation
    const newErrors = { ...errors };
    if (!validateEmail(value)) {
      newErrors[index] = 'Invalid email format';
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!smsData.selectedVariables.includes('WEB_APP_URL')) {
      toast.error('Please select "Patient Intake Form Url" field');
      return; // Prevent form submission
    }

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
      sms_template: [
        {
          templateName: smsData.templateName, // The template name entered by the user
          smsTemplateContant: smsData.templateText // The template content with placeholders
        }
      ]
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
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  // Submit the new logo to the backend
  const handleLogoSubmit = async () => {
    // Strip the "data:image/jpeg;base64," part from the base64 string
    const strippedBase64Image = selectedImage.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    );

    const logoRequestBody = {
      logo: strippedBase64Image // Send only the base64 image string without the prefix
    };

    try {
      const logoResponse = await axios.put(
        '/settings/updateSettingsLogo',
        logoRequestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (logoResponse.status === 200) {
        toast.success('Logo updated successfully!');
        setSelectedImage(null); // Clear the selected image after upload
        getAdminCustomSetting(); // Refresh settings to display updated logo
      } else {
        toast.error('Error updating logo');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }

    setIsEditing(false); // Exit editing mode
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Convert image to base64 and store it
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleCancelImageChange = () => {
    setSelectedImage(null); // Reset selected image
  };

  // Get settings from the API
  const getAdminCustomSetting = async () => {
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

      if (sms_template && sms_template.length > 0) {
        const template = sms_template[0]; // Assuming you're using the first template
        const preSelectedVariables = variables
          .filter((variable) =>
            template.smsTemplateContant.includes(`{{${variable.value}}}`)
          )
          .map((variable) => variable.value);

        setSmsData({
          templateName: template.templateName,
          templateText: template.smsTemplateContant,
          selectedVariables: preSelectedVariables
        });
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const getAdminCustomSms = async () => {
    try {
      const response = await axios.get('/sms/getSmsTemplate', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response?.status === 200) {
        console.log('sms templ', response?.data[0]?.messageContent);
        setSmsTemplateView(response?.data[0]?.messageContent);
        setOpenDialog(true);
        setSmsCard(true);
      } else {
        toast.error('Error fetching SMS template');
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  useEffect(() => {
    getAdminCustomSetting();
  }, []);

  const handleCancel = () => {
    setIsEditing(false); // Reset to non-editing state when Cancel is clicked
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Adjust padding for different screen sizes */}
      <Toaster position="bottom-right" />
      {/* Tabs to switch between sections */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Settings Tabs"
        sx={{ mb: 3 }}
        variant="scrollable"
      >
        <Tab label="Patient Intake Form" />
        <Tab label="Admin" />
        <Tab label="Notification" />
        <Tab label="Hospital" />
      </Tabs>
      {/* Tab Panels */}
      {tabIndex === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Patient Intake Form
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
            <Grid item>
              <Typography variant="caption">
                {formData.expiry > 1 ? "Day's" : 'Day'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Patient Intake Form Type
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
                label="Default"
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
                label="Custom"
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h5" gutterBottom>
              Custom SMS
            </Typography>

            {/* Text Field for the SMS Template Name */}
            <Box mt={2}>
              {/* Template Name Input Field */}
              <TextField
                disabled={!isEditing}
                label="SMS Template Title"
                value={smsData.templateName}
                onChange={handleTemplateNameChange}
                placeholder="Enter SMS Template Title"
              />

              {/* View Button */}
              <Button
                disabled={!isEditing}
                variant="outlined"
                onClick={getAdminCustomSms}
                sx={{ ml: 2 }}
              >
                View
              </Button>

              {/* Conditional rendering of the SMS template card */}
              {smsCard && (
                <Card>
                  <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    fullWidth
                    maxWidth={
                      isExtraLargeScreen
                        ? 'lg'
                        : isLargeScreen
                        ? 'md'
                        : isSmallScreen
                        ? 'sm'
                        : 'xs'
                    } // Adjust the width dynamically based on screen size
                  >
                    {/* <DialogTitle>
                      <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme.palette.grey[500]
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle> */}

                    {/* SMS Template Content */}
                    <DialogContent dividers>
                      <CardContent>
                        <Typography variant="body2">
                          {smsTemplateView}
                        </Typography>
                      </CardContent>
                    </DialogContent>

                    {/* Dialog Actions */}
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Card>
              )}
            </Box>

            {/* Display variable checkboxes */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {variables.map((variable) => (
                <Grid item key={variable.value}>
                  <FormControlLabel
                    disabled={!isEditing}
                    control={
                      <Checkbox
                        checked={smsData.selectedVariables.includes(
                          variable.value
                        )}
                        onChange={() => handleVariableSelect(variable.value)}
                      />
                    }
                    label={variable.label}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Text area for SMS template with chips for variables */}
            <Box mt={2}>
              {/* <Typography variant="caption">
                Click on the checkboxes to add variables into the text area
                below.
              </Typography> */}
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
                    disabled={!isEditing}
                    key={variable}
                    label={`{{${variable}}}`}
                    onDelete={() => handleVariableSelect(variable)}
                    sx={{ m: 0.5 }}
                  />
                ))}

                {/* Text area where the user can type */}
                <textarea
                  id="smsTemplateTextarea"
                  disabled={!isEditing}
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
                  placeholder="Type your sms content here..."
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Admin Panel Session
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
                {formData.sessionTimeout > 1 ? "Hour's" : 'Hour'}
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
                      <TableCell sx={{ textAlign: 'center' }}>Email</TableCell>
                      {isEditing && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            onClick={addEmailField}
                            variant="outlined"
                            disabled={
                              !isEditing || Object.keys(errors).length > 0
                            } // Disable if there are errors
                          >
                            <Add /> Add
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
                              <Tooltip title="Delete">
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
            Form Submit Reminder
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
                {formData.remainderTitle > 1 ? "Day's" : 'Day'}
              </Typography>
            </Grid>
          </Grid>

          <Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Send Email Report To Admin
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
                  label="Weekly"
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
                  label="Monthly"
                  disabled={!isEditing}
                />
              </Grid>
              <Button
                onClick={handleBothClick}
                sx={{ mt: 2 }}
                variant="outlined"
                disabled={!isEditing}
              >
                Both
              </Button>
            </Grid>
          </Box>
        </Box>
      )}
      {tabIndex === 3 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Healthcare organization logo
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
                  <Tooltip title="Upload new picture">
                    <CloudUploadIcon sx={{ width: '50px', height: '50px' }} />
                  </Tooltip>
                </IconButton>

                {/* If image is selected, show Cancel and Save Logo buttons */}
                {selectedImage && (
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancelImageChange}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleLogoSubmit}
                    >
                      Save Logo
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
                Change Picture
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>Select</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      Time Zone
                    </TableCell>
                    {isEditing && (
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          onClick={addTimeZoneField}
                          sx={{ mt: 0 }}
                          variant="outlined"
                          disabled={!isEditing}
                        >
                          <Add /> Add
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
                            <Tooltip title="Delete">
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

      {/* Hide the Change Settings buttons if tabIndex === 3 */}
      {/* {tabIndex !== 3 && (
        <Box mt={3}>
          {!isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Change Settings
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleSubmit}>
                Save Settings
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={handleCancel} // Clicking "Cancel" will exit edit mode
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      )} */}

      <Box mt={3}>
        {!isEditing ? (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Change Settings
          </Button>
        ) : (
          <>
            <Button variant="contained" onClick={handleSubmit}>
              Save Settings
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={handleCancel} // Clicking "Cancel" will exit edit mode
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
