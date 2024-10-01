import axios from 'axios';

const prod = false;

export const ApiUrl = prod
  ? ' https://api.chozharoodagam.com'
  : ' https://api.chozharoodagam.com';

// export const ApiUrl = `http://localhost:3000`;
// export let ApiUrl = `http://192.168.1.6:3000`; // room airtel
// export const ApiUrl = `http://192.168.1.20:3000`; // office airtel
// export const ApiUrl = `http://192.168.1.18:3000`; // office airtel

export const axBackendInstance = axios.create({
  baseURL: `${ApiUrl}`,
  //   baseURL: `http://${window.location.hostname}:${window.location.port}`,
  headers: {
    'Content-Type': 'application/json'
  }
});
