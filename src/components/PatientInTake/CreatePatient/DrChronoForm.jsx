import React, { useState } from "react";
import PatientForm from "./PatientForm";
import AppointmentForm from "./AppointmentForm";
import SmsForm from "./SmsForm";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ApiUrl } from "../../ApiUrl"; // Adjust the import path as necessary
import dayjs from "dayjs";

const DrchronoForm = () => {
  const [currentStep, setCurrentStep] = useState("patient");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [appointmentDateandTime, setAppointmentDateandTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [appointmenttimeZone, setAppointmenttimeZone] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [smsText, setSmsText] = useState(""); // New state for SMS text

  const handlePatientSubmit = async (values, actions) => {
    setName(values.firstName);
    setMobile(values.mobile);

    try {
      const token = localStorage.getItem("token");

      const headersPayload = {
        patientFname: values.firstName,
        patientLname: values.lastName,
        patientPhNum: values.mobile,
        patientDob: dayjs(values.patientDob).format("YYYY-MM-DD"), // Format DOB here
        preferredDoctor: values.preferredDoctor,
        patientGender: values.patientGender,
      };

      const response = await axios.post(
        `${ApiUrl}/patientCreate`,
        headersPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setId(response.data.data.id);

      if (response.status === 201) {
        toast.success("Patient created successfully!");
        setCurrentStep("appointment");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data || "Registration failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
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
        setSmsText(response.data.data.message_template); // Update SMS text with the received message template
      } else {
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
        <AppointmentForm onSubmit={handleAppointmentSubmit} />
      )}
      {currentStep === "sms" && (
        <SmsForm onSubmit={handleSmsSubmit} smsText={smsText} />
      )}
    </div>
  );
};

export default DrchronoForm;
