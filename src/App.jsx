import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectRoute";
import Login from "./components/Admin/Login";
import Signup from "./components/Admin/Signup";
import ForgetPasswordEmail from "./components/ForgetPassword/ForgetPasswordEmail";
import ForgetPwdOtp from "./components/ForgetPassword/ForgetPwdOtp";
import ResetPassword from "./components/ForgetPassword/ResetPassword";
import NavSideBar from "./components/NavSideBar/NavSideBar";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import DrChronoForm from "./components/PatientInTake/CreatePatient/DrChronoForm";
import NotFound from "./components/404/NotFound";
import DrchronoExistingPatient from "./components/PatientInTake/ExistingPatient/ExistingPatientDrChronoForm";
import AddDoctor from "./components/AddDoctor/AddDoctors";
import DashBoard from "./components/Dashboard/DashBoard";
import Home from "./components/home/Home";
import Account from "./components/DoctorAccount/Account";
import AccountCreate from "./components/Admin/Accountcreate";
import NotAuthorized from "./components/NA/NotAuthorized";
import GetForm from "./components/FormBuilder/GetForm";

function App() {
  const location = useLocation();
  const hideNavBarRoutes = [
    "/admin-signin",
    "/admin-signup",
    "/accountcreate",
    "/forget-password",
    "/forget-otp",
    "/password-reset",
    "/not-authorized",
    "/admin/emr/configuration",
  ];

  return (
    <AuthProvider>
      {!hideNavBarRoutes.includes(location.pathname) && <NavSideBar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drchrono/doctor/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-signin" element={<Login />} />
        <Route path="/admin-signup" element={<Signup />} />
        <Route path="/accountcreate" element={<AccountCreate />} />
        <Route path="/forget-password" element={<ForgetPasswordEmail />} />
        <Route path="/forget-otp" element={<ForgetPwdOtp />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/admin/emr/configuration" element={<Home />} />
        <Route path="/drchrono/doctor/getForm" element={<GetForm />} />
        <Route
          path="/drchrono/doctor/custom-form"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-intake/drchrono/patient-create"
          element={
            <ProtectedRoute>
              <DrChronoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-intake/drchrono/existing-patient"
          element={
            <ProtectedRoute>
              <DrchronoExistingPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drchrono/addDoctor"
          element={
            <ProtectedRoute>
              <AddDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drchrono/profile"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
