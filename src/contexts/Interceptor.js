import React from 'react';
import { axBackendInstance } from 'src/utils/axios-instance';

const useAxiosInterceptor = (onSessionExpired) => {

// Utility to save the last visited URL with query parameters
// const saveLastVisitedUrl = () => {
//   const currentPath = window.location.pathname + window.location.search;
//   const storedPath = localStorage.getItem('lastVisitedUrl');
//   if (storedPath !== currentPath) {
//     localStorage.setItem('lastVisitedUrl', currentPath);
//   }
// };


  // Define request/response and error interceptors
  const requestInterceptor = (config) => {
    const accessToken = localStorage.getItem('accessToken');

    // If token is present, add it to the request's Authorization Header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  };

  const responseInterceptor = (response) => {
    // Handle successful responses as needed
    return response;
  };

  const errorRequestInterceptor = (error) => {
    // Handle request errors here
    return Promise.reject(error);
  };
  const errorResponseInterceptor = (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session Expired");
      // saveLastVisitedUrl();
      // if (onSessionExpired) onSessionExpired();
    }
    return Promise.reject(error);
  };

  // Set up the interceptors with useEffect
  React.useEffect(() => {
    const requestInterceptorId = axBackendInstance.interceptors.request.use(
      requestInterceptor,
      errorRequestInterceptor
    );

    const responseInterceptorId = axBackendInstance.interceptors.response.use(
      responseInterceptor,
      errorResponseInterceptor
    );

    // Cleanup function
    return () => {
      axBackendInstance.interceptors.request.eject(requestInterceptorId);
      axBackendInstance.interceptors.response.eject(responseInterceptorId);
    };
  }, [onSessionExpired]);

  return { axios: axBackendInstance };
};

export default useAxiosInterceptor;
