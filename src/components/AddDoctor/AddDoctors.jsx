import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  DialogContentText,
  DialogTitle as ConfirmationDialogTitle,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import * as Yup from "yup";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ApiUrl } from "../ApiUrl";
import Loader from "../Loader/Loader";

// Custom TextMaskInput component for phone number input
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{ 0: /[0-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite={false}
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Form validation schema
const validationSchema = Yup.object({
  firstname: Yup.string().required("First Name is Required"),
  lastname: Yup.string().required("Last Name is Required"),
  email: Yup.string().email("Invalid Email").required("Email is Required"),
  hospitalName: Yup.string().required("Hospital Name is Required"),
  npiNumber: Yup.string().required("NPI Number is Required"),
  emrDoctorId: Yup.string().required("EMR Doctor ID is Required"),
  mobile: Yup.string().required("Mobile Number is Required"),
  practiceName: Yup.string().required("Practice Name is Required"),
});

const AddDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  // Fetch doctors from the server
  const fetchDoctors = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${ApiUrl}/getClientDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data.doctors)
        ? response.data.doctors
        : [];
      setDoctors(data); // Store the list of doctors
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(t("Error fetching doctors"));
      setDoctors([]);
    }
  }, [t]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleOpen = () => {
    setOpen(true);
    setEditingDoctor(null);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
  };

  useEffect(() => {
    if (editingDoctor) {
      setOpen(true);
    }
  }, [editingDoctor]);

  const handleSave = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true); // Show the loader
    try {
      const response = await axios.post(
        `${ApiUrl}/doctorRegistration`,
        {
          doctor_firstName: values.firstname,
          doctor_lastName: values.lastname,
          doctor_phone: values.mobile,
          doctor_email: values.email,
          doctor_NPInumber: values.npiNumber,
          emr_doctorId: values.emrDoctorId,
          doctor_PraticeName: values.practiceName,
          doctor_hospitalName: values.hospitalName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setDoctors((prevDoctors) => [...prevDoctors, response.data]);
        toast.success(t("Doctor Added Successfully"));
        handleClose();
      }
    } catch (error) {
      if (error.response?.data?.data?.status === 404) {
        toast.error(error.response.data.data.message);
      } else {
        toast.error(t("An unexpected error occurred"));
      }
      console.error("Error saving doctor:", error);
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  const handleUpdate = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true); // Show the loader
    try {
      const response = await axios.put(
        `${ApiUrl}/doctor/${editingDoctor._id}`,
        {
          doctor_firstName: values.firstname,
          doctor_lastName: values.lastname,
          doctor_phone: values.mobile,
          doctor_email: values.email,
          doctor_NPInumber: values.npiNumber,
          emr_doctorId: values.emrDoctorId,
          doctor_PraticeName: values.practiceName,
          doctor_hospitalName: values.hospitalName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === editingDoctor._id ? response.data : doctor
          )
        );
        toast.success(t("Doctor Updated Successfully"));
        handleClose();
      }
    } catch (error) {
      if (error.response?.data?.data?.status === 404) {
        toast.error(error.response.data.data.message);
      } else {
        toast.error(t("An unexpected error occurred"));
      }
      console.error("Error updating doctor:", error);
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  const handleDelete = (doctor) => {
    setDoctorToDelete(doctor);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Show the loader
    try {
      await axios.delete(`${ApiUrl}/doctor/${doctorToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor._id !== doctorToDelete._id)
      );
      toast.success(t("Doctor Deleted Successfully"));
    } catch (error) {
      toast.error(t("An unexpected error occurred"));
      console.error("Error deleting doctor:", error);
    } finally {
      setLoading(false); // Hide the loader
      setConfirmDeleteOpen(false);
      setDoctorToDelete(null);
    }
  };

  return (
    <div>
      <Toaster />
      {loading && <Loader />}
      <Container maxWidth="lg" sx={{ ml: 30 }}>
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            {t("Add Doctor")}
          </Typography>
          <Button
            sx={{
              ml: 126,
              display: "flex",
              mt: 3,
              mb: 2,
              color: "#ffff",
              backgroundColor: "#407bff",
              "&:hover": {
                backgroundColor: "#12171e",
                transition: "background-color 0.3s ease",
              },
            }}
            onClick={handleOpen}
          >
            {t("Add New Doctor")}
          </Button>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("First Name")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Last Name")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Email")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Hospital Name")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("NPI Number")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("EMR Doctor ID")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Mobile")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Practice Name")}
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {t("Actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow
                    key={doctor._id}
                    // sx={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_firstName}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_lastName}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_email}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_hospitalName}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_NPInumber}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.emr_doctorId}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_phone}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {doctor.doctor_PraticeName}
                    </TableCell>
                    <TableCell sx={{ display: "flex" }}>
                      <Tooltip title={t("Edit")}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(doctor)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Delete")}>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doctor)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* Dialog for adding/editing doctor */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDoctor ? t("Edit Doctor") : t("Add Doctor")}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              firstname: editingDoctor?.doctor_firstName || "",
              lastname: editingDoctor?.doctor_lastName || "",
              email: editingDoctor?.doctor_email || "",
              hospitalName: editingDoctor?.doctor_hospitalName || "",
              npiNumber: editingDoctor?.doctor_NPInumber || "",
              emrDoctorId: editingDoctor?.emr_doctorId || "",
              mobile: editingDoctor?.doctor_phone || "",
              practiceName: editingDoctor?.doctor_PraticeName || "",
            }}
            validationSchema={validationSchema}
            onSubmit={editingDoctor ? handleUpdate : handleSave}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <Field
                  as={TextField}
                  name="firstname"
                  label={t("First Name")}
                  fullWidth
                  margin="normal"
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errorMessage && errorMessage.includes("First Name")}
                  helperText={<ErrorMessage name="firstname" />}
                />
                <Field
                  as={TextField}
                  name="lastname"
                  label={t("Last Name")}
                  fullWidth
                  margin="normal"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errorMessage && errorMessage.includes("Last Name")}
                  helperText={<ErrorMessage name="lastname" />}
                />
                <Field
                  as={TextField}
                  name="email"
                  label={t("Email")}
                  fullWidth
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errorMessage && errorMessage.includes("Email")}
                  helperText={<ErrorMessage name="email" />}
                />
                <Field
                  as={TextField}
                  name="hospitalName"
                  label={t("Hospital Name")}
                  fullWidth
                  margin="normal"
                  value={values.hospitalName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!errorMessage && errorMessage.includes("Hospital Name")
                  }
                  helperText={<ErrorMessage name="hospitalName" />}
                />
                <Field
                  as={TextField}
                  name="npiNumber"
                  label={t("NPI Number")}
                  fullWidth
                  margin="normal"
                  value={values.npiNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errorMessage && errorMessage.includes("NPI Number")}
                  helperText={<ErrorMessage name="npiNumber" />}
                />
                <Field
                  as={TextField}
                  name="emrDoctorId"
                  label={t("EMR Doctor ID")}
                  fullWidth
                  margin="normal"
                  value={values.emrDoctorId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!errorMessage && errorMessage.includes("EMR Doctor ID")
                  }
                  helperText={<ErrorMessage name="emrDoctorId" />}
                />
                <Field
                  as={TextField}
                  name="mobile"
                  label={t("Mobile")}
                  fullWidth
                  margin="normal"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                  error={!!errorMessage && errorMessage.includes("Mobile")}
                  helperText={<ErrorMessage name="mobile" />}
                />
                <Field
                  as={TextField}
                  name="practiceName"
                  label={t("Practice Name")}
                  fullWidth
                  margin="normal"
                  value={values.practiceName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!errorMessage && errorMessage.includes("Practice Name")
                  }
                  helperText={<ErrorMessage name="practiceName" />}
                />
                {errorMessage && (
                  <DialogContentText color="error">
                    {errorMessage}
                  </DialogContentText>
                )}
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    {t("Cancel")}
                  </Button>
                  <Button type="submit" color="primary" disabled={loading}>
                    {editingDoctor ? t("Update") : t("Save")}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Doctor */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <ConfirmationDialogTitle>{t("Confirm Delete")}</ConfirmationDialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("Are you sure you want to delete this doctor?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            {t("Cancel")}
          </Button>
          <Button onClick={confirmDelete} color="primary" disabled={loading}>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDoctor;
