import React from 'react';
import { useNavigate } from 'react-router';
import { axBackendInstance } from 'src/utils/axios-instance';

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

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
      // Token is expired or invalid, remove it from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('jwtToken');
      delete axBackendInstance.defaults.headers.common.Authorization;

      // Navigate to the logout screen
      navigate('/account/LogOutForSession');
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
  }, [navigate]);

  return { axios: axBackendInstance };
};

export default useAxiosInterceptor;
