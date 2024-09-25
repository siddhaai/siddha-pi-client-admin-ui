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
  Card
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Add, Delete } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Settings() {
  const { axios } = useAxiosInterceptor();

  // Initialize the states
  const [formData, setFormData] = useState({
    expiry: '',
    emailNotification: '',
    sessionTimeout: '',
    remainderTitle: '',
    emails: [],
    timeZones: [],
    reportWeekly: false,
    reportMonthly: false,
    default: false, // Default option for Patient Intake Form
    custom: false, // Custom option for Patient Intake Form,
    logo: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Track current tab
  const [selectedImage, setSelectedImage] = useState(null); // Selected new image for upload
  const token = localStorage.getItem('token');

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

  // Add email input field
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
  const handleEmailChange = (index, value) => {
    const updatedEmails = formData.emails.map((emailObj, i) =>
      i === index ? { email: value } : emailObj
    );
    setFormData({ ...formData, emails: updatedEmails });
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
  };

  // Delete time zone field
  const deleteTimeZoneField = (index) => {
    const updatedTimeZones = formData.timeZones.filter((_, i) => i !== index);
    setFormData({ ...formData, timeZones: updatedTimeZones });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requestBody = {
      client_admin_session_time: formData.sessionTimeout,
      siddha_pi_form_session_time: formData.expiry,
      Patient_reminder_sms_alert: formData.remainderTitle,
      mail_send_email_ids: formData.emails,
      timeZones: formData.timeZones,
      weekly_report: formData.reportWeekly,
      monthly_report: formData.reportMonthly,
      select_pi_form_send_to_patient_default: formData.default,
      select_pi_form_send_to_patient_custom: formData.custom
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
      toast.error('Please select a valid image file (JPG, PNG, etc.)');
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
        logo
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
        <Tab label="Logo" />
        {/* <Tab label="Admin Email & Time Zones" />
        <Tab label="Report" /> */}
      </Tabs>
      {/* Tab Panels */}
      {tabIndex === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Patient Intake Form
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6} lg={2}>
              <Typography variant="caption">Expired In:</Typography>
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

          <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>Email</TableCell>
                      {isEditing && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          {' '}
                          <Button
                            onClick={addEmailField}
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
                    {formData.emails.map((emailObj, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            value={emailObj.email}
                            onChange={(e) =>
                              handleEmailChange(index, e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </TableCell>
                        {isEditing && (
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Button
                              // variant="contained"
                              onClick={() => deleteEmailField(index)}
                            >
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

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>
                        Time Zone
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Select</TableCell>
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
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Radio
                            checked={zoneObj.selected || false}
                            onChange={() => handleTimeZoneSelect(index)}
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
            Change Logo
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
                    <CloudUploadIcon />
                  </Tooltip>
                </IconButton>

                {/* If image is selected, show Cancel and Save Logo buttons */}
                {selectedImage && (
                  <Box>
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
              <Button onClick={() => setIsEditing(true)} variant="contained">
                Change Picture
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Hide the Change Settings buttons if tabIndex === 3 */}
      {tabIndex !== 3 && (
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
      )}
    </Box>
  );
}
