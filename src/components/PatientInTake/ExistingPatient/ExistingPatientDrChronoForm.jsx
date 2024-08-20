import React, { useState } from "react";
import PatientForm from "./ExistingPatientForm";
import AppointmentForm from "./ExistingPatientAppointmentForm";
import SmsForm from "./ExistingPatientSmsForm";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ApiUrl } from "../../ApiUrl";
import dayjs from "dayjs";

const ExistingPatientDrchronoForm = () => {
  const [currentStep, setCurrentStep] = useState("patient");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [appointmentDateandTime, setAppointmentDateandTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [appointmenttimeZone, setAppointmenttimeZone] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [smsText, setSmsText] = useState("");

  const handlePatientSubmit = async (values, actions) => {
    setName(values.firstName);
    setMobile(values.phoneNumber);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${ApiUrl}/existingPatients`,
        {
          patientFname: values.firstName,
          patientDob: dayjs(values.patientDob).format("YYYY-MM-DD"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          maxRedirects: 0,
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        // Patient found
        setId(response.data.data.patient_id);
        setSelectedPatient(response.data.data);
        toast.success("Proceeding to appointment.");
        setCurrentStep("appointment");
      } else {
        // Handle other status codes if needed
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No patient found
        toast.error("No patient found with the provided details.");
      } else {
        // General error handling
        toast.error(
          error.response?.data?.detail ||
            "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (values, actions) => {
    setAppointmentDateandTime(
      dayjs(values.appointmentDateTime).format("YYYY-MM-DDTHH:mm")
    );
    setAppointmenttimeZone(values.timeZone);
    setOfficeLocation(values.hospitalLocation);

    let durationInteger = parseInt(values.appointmentDuration);
    try {
      const token = localStorage.getItem("token");

      const appointmentPayload = {
        patientid: id,
        scheduleDateTime: dayjs(values.appointmentDateTime).format(
          "YYYY-MM-DDTHH:mm"
        ),
        duration: durationInteger,
        reason: values.reason,
        notes: values.appointmentnotes,
        doctorid: values.appointmentPreferredDoctor,
        office_location: values.hospitalLocation,
      };

      const response = await axios.post(
        `${ApiUrl}/scheduleAppointment`,
        appointmentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 201) {
        toast.success("Appointment scheduled successfully!");
        setCurrentStep("sms");
      } else if (response.data.status === 409) {
        toast.error("Appointment overlap with another appointment");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.detail ||
            "Appointment scheduling failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleSmsSubmit = async () => {
    try {
      const response = await axios.post(
        `${ApiUrl}/sms`,
        {
          patientid: id,
          patientName: name,
          scheduleDateTime: appointmentDateandTime,
          patientPhNum: mobile,
          timeZone: appointmenttimeZone,
          office_location: officeLocation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("SMS sent successfully!");
        setSmsText(response.data.data.message_template);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.detail || "SMS sending failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <Toaster />
      {currentStep === "patient" && (
        <PatientForm onSubmit={handlePatientSubmit} />
      )}
      {currentStep === "appointment" && (
        <AppointmentForm
          patient={selectedPatient}
          onSubmit={handleAppointmentSubmit}
        />
      )}
      {currentStep === "sms" && (
        <SmsForm onSubmit={handleSmsSubmit} smsText={smsText} />
      )}
    </div>
  );
};

export default ExistingPatientDrchronoForm;
