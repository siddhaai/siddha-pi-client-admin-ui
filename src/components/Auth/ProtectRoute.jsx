// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useContext(AuthContext);

//   if (!isAuthenticated) {
//     return <Navigate to="/admin-signin" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
// import NotAuthorized from "../NA/NotAuthorized";
import { jwtDecode } from "jwt-decode";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, [location.pathname]);

  if (!isAuthenticated || !isTokenValid) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default ProtectedRoute;
