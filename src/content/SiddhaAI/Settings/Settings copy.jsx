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
  Radio
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';

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
    custom: false // Custom option for Patient Intake Form
  });

  const [isEditing, setIsEditing] = useState(false);

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

  //
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
    const token = localStorage.getItem('token');

    const requestBody = {
      client_admin_session_time: formData.sessionTimeout,
      siddha_pi_form_session_time: formData.expiry,
      Patient_reminder_sms_alert: formData.remainderTitle,
      mail_send_email_ids: formData.emails,
      timeZones: formData.timeZones,
      weekly_report: formData.reportWeekly,
      monthly_report: formData.reportMonthly,
      select_pi_form_send_to_patient_default: formData.default, // Send default
      select_pi_form_send_to_patient_custom: formData.custom // Send custom
      // select_pi_form_send_to_patient: formData
    };

    console.log('reqBody', requestBody);

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
      console.log('response update', response);

      if (response.status === 200) {
        toast.success('Settings updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  // Get settings from the API
  const getAdminCustomSetting = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/settings/getSettings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // console.log('get responseeeee', response);

      const {
        client_admin_session_time,
        siddha_pi_form_session_time,
        Patient_reminder_sms_alert,
        mail_send_email_ids,
        timeZones,
        weekly_report,
        monthly_report,
        select_pi_form_send_to_patient_default, // default value from API
        select_pi_form_send_to_patient_custom // custom value from API
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
        default: select_pi_form_send_to_patient_default, // Set default
        custom: select_pi_form_send_to_patient_custom // Set custom
      });
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  // console.log('form data', formData);

  useEffect(() => {
    getAdminCustomSetting();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Toaster position="bottom-right" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Patient Intake Form</Typography>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={12} md={2}>
            <Typography variant="caption">Expired In :</Typography>
            <TextField
              // label="Expiry In"
              type="number"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 31, step: 1 }}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {formData.expiry > 1 ? 'Days' : 'Day'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Admin Panel Session </Typography>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={12} md={2}>
            <Typography variant="caption">Timeout In :</Typography>
            <TextField
              // label="Timeout In"
              type="number"
              name="sessionTimeout"
              value={formData.sessionTimeout}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 24, step: 1 }}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {formData.sessionTimeout > 1 ? 'Hours' : 'Hour'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Form Submit Remainder</Typography>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8} sm={6} md={2}>
            <Typography variant="caption">To Patient:</Typography>
            <TextField
              // label="Remainder Title"
              type="number"
              name="remainderTitle"
              value={formData.remainderTitle}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 31, step: 1 }}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {formData.remainderTitle > 1 ? 'Days' : 'Day'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Button onClick={addEmailField} disabled={!isEditing}>
        Add Admin Email Id's
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                {isEditing && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.emails.map((emailObj, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={emailObj.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      disabled={!isEditing}
                    />
                  </TableCell>
                  {isEditing && (
                    <TableCell>
                      <Button onClick={() => deleteEmailField(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Button onClick={addTimeZoneField} disabled={!isEditing}>
        Add Time Zone
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                {isEditing && <TableCell>Action</TableCell>}
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
                  {isEditing && (
                    <TableCell>
                      <Button onClick={() => deleteTimeZoneField(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Send Email Report To Admin</Typography>
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
      <Button onClick={handleBothClick} disabled={!isEditing}>
        Both
      </Button>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5">Patient Intake Form Type</Typography>
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

      <Box mt={3}>
        <Button onClick={() => setIsEditing(true)}>Change Settings</Button>
        {isEditing && (
          <Button onClick={handleSubmit} sx={{ ml: 2 }}>
            Save Settings
          </Button>
        )}
      </Box>
    </Box>
  );
}
