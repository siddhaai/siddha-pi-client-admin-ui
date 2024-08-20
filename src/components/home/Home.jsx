// import React, { useState, useEffect } from "react";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
// } from "@mui/material";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";
// import { ApiUrl } from "../ApiUrl";

// // Validation schema for EMR configuration
// const validationSchema = Yup.object().shape({
//   client_id: Yup.string().required("Client ID is required"),
//   client_secret: Yup.string().required("Client Secret is required"),
//   redirect_uri: Yup.string().required("Redirect URI is required"),
// });

// // Initial form values
// const initialValues = {
//   client_id: "",
//   client_secret: "",
//   redirect_uri: "",
//   emr: "drchrono",
// };

// export default function EmrConfiguration() {
//   const [email, setEmail] = useState("");
//   const [isEmailValid, setIsEmailValid] = useState(false);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false); // Loading state
//   const [verifyStatus, setVerifyStatus] = useState(false);
//   const [accessToken, setAccessToken] = useState("");
//   const [refreshToken, setRefreshToken] = useState("");

//   useEffect(() => {
//     if (isEmailValid && !data) {
//       (async () => {
//         await fetchData(email); // Fetch data when email is valid
//       })();
//     }
//   }, [isEmailValid, email, data]);

//   const handleEmailValidation = async () => {
//     const client_email = email;
//     try {
//       const response = await axios.post(
//         `${ApiUrl}/getClientDetails`,
//         {},
//         {
//           headers: { client_email },
//         }
//       );
//       if (response.status === 200) {
//         setIsEmailValid(true);
//         toast.success("Email validated successfully!");
//       } else {
//         setIsEmailValid(false);
//         toast.error("Invalid email address. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error validating email", error);
//       toast.error("Error validating email. Please try again.");
//     }
//   };

//   const handleAuthorization = async (values) => {
//     const clientData = {
//       emr: "drchrono",
//       client_id: values.client_id,
//       client_secret: values.client_secret,
//       redirect_uri: values.redirect_uri,
//     };
//     try {
//       const response = await axios.get(`${ApiUrl}/authSource`, {
//         params: clientData,
//       });
//       const authUrl = response.data;

//       // Open a popup window for authorization
//       const popup = window.open(
//         authUrl,
//         "DrChronoAuth",
//         "width=600,height=600"
//       );

//       // Polling to check if the popup has closed
//       const timer = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(timer);
//           // Update tokens from localStorage
//           const tokens = localStorage.getItem("drchrono_tokens");
//           if (tokens) {
//             const { access_token, refresh_token } = JSON.parse(tokens);
//             setAccessToken(access_token);
//             setRefreshToken(refresh_token);
//             localStorage.removeItem("drchrono_tokens"); // Clean up after use
//             setVerifyStatus(true); // Update verifyStatus after successful authorization
//           }
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Error fetching authorization URL:", error);
//     }
//   };

//   // Function to handle tokens from the popup
//   const handleTokenResponse = (event) => {
//     if (event.origin !== `${ApiUrl}`) {
//       return;
//     }
//     const tokens = event.data;
//     if (tokens && tokens.access_token && tokens.refresh_token) {
//       setAccessToken(tokens.access_token);
//       setRefreshToken(tokens.refresh_token);
//       localStorage.removeItem("drchrono_tokens"); // Clean up after use
//     }
//   };

//   // Add event listener for token response from the popup
//   useEffect(() => {
//     window.addEventListener("message", handleTokenResponse);
//     return () => {
//       window.removeEventListener("message", handleTokenResponse);
//     };
//   }, []);

//   const handleSubmit = async (values) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const refreshToken = localStorage.getItem("refreshToken");

//       const response = await axios.post("/api/submit", {
//         ...values,
//         accessToken,
//         refreshToken,
//       });

//       if (response.status === 200) {
//         toast.success("Form submitted successfully!");
//       }
//     } catch (error) {
//       console.error("Error submitting the form", error);
//       toast.error("Error submitting the form. Please try again.");
//     }
//   };

//   const fetchData = async (email) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${ApiUrl}/getClientDetails`,
//         {},
//         {
//           headers: {
//             client_email: email,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setData(response.data); // Assume API response is in the desired format
//       } else {
//         toast.error("Failed to fetch data. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//       toast.error("Error fetching data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Toaster />
//       {!isEmailValid ? (
//         <Grid container component="main">
//           <Grid item xs={12} component={Paper} elevation={6} square>
//             <Box
//               sx={{
//                 my: 8,
//                 mx: 4,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <Typography component="h1" variant="h5">
//                 Validate Email
//               </Typography>
//               <Box component="div" noValidate sx={{ mt: 1 }}>
//                 <TextField
//                   margin="normal"
//                   fullWidth
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   value={email}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleEmailValidation}
//                   sx={{ mt: 2 }}
//                 >
//                   Validate
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       ) : loading ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Formik
//           initialValues={data || initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize // Ensure form values are updated when `data` changes
//         >
//           {({
//             handleSubmit,
//             handleChange,
//             handleBlur,
//             values,
//             touched,
//             errors,
//           }) => (
//             <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//               <Grid container component="main">
//                 <Grid item xs={12} component={Paper} elevation={6} square>
//                   <Box
//                     sx={{
//                       my: 8,
//                       mx: 4,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography component="h1" variant="h5">
//                       Configure EMR
//                     </Typography>
//                     <Box component="div" noValidate sx={{ mt: 1 }}>
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>First Name</TableCell>
//                               <TableCell>Last Name</TableCell>
//                               <TableCell>Mobile</TableCell>
//                               <TableCell>Email</TableCell>
//                               <TableCell>Practice Name</TableCell>
//                               <TableCell>NPI</TableCell>
//                               <TableCell>EMR</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {data ? (
//                               <TableRow>
//                                 <TableCell>
//                                   {data.clientDetail.client_firstName}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_lastName}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_phone}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_email}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_practiceName}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_NPInumber}
//                                 </TableCell>
//                                 <TableCell>
//                                   {data.clientDetail.client_EMR}
//                                 </TableCell>
//                               </TableRow>
//                             ) : (
//                               <TableRow>
//                                 <TableCell colSpan={7} align="center">
//                                   <Typography variant="h6">
//                                     No data available
//                                   </Typography>
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>

//                       <TextField
//                         margin="normal"
//                         fullWidth
//                         id="client_id"
//                         label="Client ID"
//                         name="client_id"
//                         type="text"
//                         autoComplete="client_id"
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         value={values.client_id}
//                         error={touched.client_id && Boolean(errors.client_id)}
//                         helperText={touched.client_id && errors.client_id}
//                       />

//                       <TextField
//                         margin="normal"
//                         fullWidth
//                         name="client_secret"
//                         label="Client Secret"
//                         type="text"
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         value={values.client_secret}
//                         error={
//                           touched.client_secret && Boolean(errors.client_secret)
//                         }
//                         helperText={
//                           touched.client_secret && errors.client_secret
//                         }
//                       />

//                       <TextField
//                         margin="normal"
//                         fullWidth
//                         name="redirect_uri"
//                         label="Redirect URI"
//                         type="text"
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         value={values.redirect_uri}
//                         error={
//                           touched.redirect_uri && Boolean(errors.redirect_uri)
//                         }
//                         helperText={touched.redirect_uri && errors.redirect_uri}
//                       />

//                       {/* Conditionally render fields based on the EMR value */}
//                       {values.emr === "Epic" && (
//                         <>
//                           <TextField
//                             margin="normal"
//                             fullWidth
//                             name="extraField1"
//                             label="Epic Specific Field 1"
//                             type="text"
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             value={values.extraField1 || ""}
//                           />
//                           {/* Add more fields as needed */}
//                         </>
//                       )}

//                       {values.emr === "AnotherEMR" && (
//                         <>
//                           <TextField
//                             margin="normal"
//                             fullWidth
//                             name="extraField2"
//                             label="AnotherEMR Specific Field"
//                             type="text"
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             value={values.extraField2 || ""}
//                           />
//                           {/* Add more fields as needed */}
//                         </>
//                       )}

//                       <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{ mt: 2 }}
//                         onClick={() => handleAuthorization(values)}
//                       >
//                         Verify
//                       </Button>

//                       {verifyStatus && (
//                         <Button
//                           type="submit"
//                           fullWidth
//                           variant="contained"
//                           sx={{
//                             mt: 3,
//                             mb: 2,
//                             backgroundColor: "#407bff",
//                             "&:hover": {
//                               backgroundColor: "#12171e",
//                               transition: "background-color 0.3s ease",
//                             },
//                           }}
//                         >
//                           Submit
//                         </Button>
//                       )}
//                     </Box>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>
//           )}
//         </Formik>
//       )}
//     </div>
//   );
// // }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ApiUrl } from "../ApiUrl";

// const ClientAndOAuthFlow = () => {
//   const [clientEmail, setClientEmail] = useState("");
//   const [clientDetails, setClientDetails] = useState(null);
//   const [error, setError] = useState("");
//   const [clientId, setClientId] = useState("");
//   const [clientSecret, setClientSecret] = useState("");
//   const [redirectUri, setRedirectUri] = useState("");
//   const [emr, setEmr] = useState("");
//   const [accessToken, setAccessToken] = useState("");
//   const [refreshToken, setRefreshToken] = useState("");

//   // Function to fetch client details
//   const fetchClientDetails = async () => {
//     try {
//       const response = await axios.post(
//         `${ApiUrl}/getClientDetails`,
//         {},
//         {
//           headers: { client_email: clientEmail },
//         }
//       );
//       setClientDetails(response.data.clientDetail);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "An error occurred");
//       setClientDetails(null);
//     }
//   };

//   // Function to handle OAuth authorization with query parameters
//   const handleAuthorization = async () => {
//     try {
//       // Construct query parameters
//       const params = new URLSearchParams({
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: redirectUri,
//         emr: emr,
//       }).toString();

//       // Send GET request with query parameters
//       const response = await axios.get(`${ApiUrl}/authSource?${params}`);
//       console.log("query response", response);
//       const authUrl = response.data;
//       console.log(" query authUrl", authUrl);

//       console.log("Authorization URL:", authUrl);

//       // Open a popup window for authorization
//       const popup = window.open(
//         authUrl,
//         "DrChronoAuth",
//         "width=600,height=600"
//       );

//       // Polling to check if the popup has closed
//       const timer = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(timer);
//           // Update tokens from localStorage
//           const tokens = localStorage.getItem("drchrono_tokens");
//           if (tokens) {
//             const { access_token, refresh_token } = JSON.parse(tokens);
//             setAccessToken(access_token);
//             setRefreshToken(refresh_token);
//             localStorage.removeItem("drchrono_tokens"); // Clean up after use
//           }
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Error fetching authorization URL:", error);
//     }
//   };

//   // Function to handle tokens from the popup
//   const handleTokenResponse = (event) => {
//     if (event.origin !== "http://localhost:3001`") {
//       return;
//     }
//     const tokens = event.data;
//     console.log(tokens);

//     if (tokens && tokens.access_token && tokens.refresh_token) {
//       setAccessToken(tokens.access_token);
//       setRefreshToken(tokens.refresh_token);
//       localStorage.removeItem("drchrono_tokens"); // Clean up after use
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("message", handleTokenResponse);
//     return () => {
//       window.removeEventListener("message", handleTokenResponse);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Client Verification and OAuth Flow</h1>

//       {/* Step 1: Client Verification */}
//       <div>
//         <h2>Verify Client</h2>
//         <input
//           type="email"
//           value={clientEmail}
//           onChange={(e) => setClientEmail(e.target.value)}
//           placeholder="Enter client email"
//         />
//         <button onClick={fetchClientDetails}>Verify Email</button>

//         {error && <p>{error}</p>}

//         {clientDetails && (
//           <div>
//             <p>First Name: {clientDetails.client_firstName}</p>
//             <p>Last Name: {clientDetails.client_lastName}</p>
//             <p>Phone: {clientDetails.client_phone}</p>
//             <p>Email: {clientDetails.client_email}</p>
//             <p>Practice Name: {clientDetails.client_practiceName}</p>
//             <p>NPI Number: {clientDetails.client_NPInumber}</p>
//             <p>EMR: {clientDetails.client_EMR}</p>
//           </div>
//         )}
//       </div>

//       {/* Step 2: OAuth Flow */}
//       {clientDetails && (
//         <div>
//           <h2>OAuth Flow</h2>
//           <input
//             type="text"
//             value={clientId}
//             onChange={(e) => setClientId(e.target.value)}
//             placeholder="Client ID"
//           />
//           <input
//             type="text"
//             value={clientSecret}
//             onChange={(e) => setClientSecret(e.target.value)}
//             placeholder="Client Secret"
//           />
//           <input
//             type="text"
//             value={redirectUri}
//             onChange={(e) => setRedirectUri(e.target.value)}
//             placeholder="Redirect URI"
//           />
//           <input
//             type="text"
//             value={emr}
//             onChange={(e) => setEmr(e.target.value)}
//             placeholder="EMR"
//           />
//           <button onClick={handleAuthorization}>Authorize</button>

//           {accessToken && <p>Access Token: {accessToken}</p>}
//           {refreshToken && <p>Refresh Token: {refreshToken}</p>}
//         </div>
//       )}
//     </div>
//   );
// };import React, { useState, useEffect } from "react";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Paper,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// const ApiUrl = "http://localhost:3000";

// const ClientAndOAuthFlow = () => {
//   const [clientEmail, setClientEmail] = useState("");
//   const [clientDetails, setClientDetails] = useState(null);
//   const [error, setError] = useState("");
//   const [clientId, setClientId] = useState("");
//   const [clientSecret, setClientSecret] = useState("");
//   const [redirectUri, setRedirectUri] = useState("");
//   const [emr, setEmr] = useState("");
//   const [accessToken, setAccessToken] = useState("");
//   const [refreshToken, setRefreshToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOAuth, setShowOAuth] = useState(false);

//   const theme = useTheme();

//   // Function to fetch client details
//   const fetchClientDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${ApiUrl}/getClientDetails`,
//         {},
//         {
//           headers: { client_email: clientEmail },
//         }
//       );
//       setClientDetails(response.data.clientDetail);
//       setError("");
//       setShowOAuth(true);
//     } catch (err) {
//       setError(err.response?.data?.error || "An error occurred");
//       setClientDetails(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle OAuth authorization with query parameters
//   const handleAuthorization = async () => {
//     try {
//       const params = new URLSearchParams({
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: redirectUri,
//         emr: emr,
//       }).toString();

//       const response = await axios.get(`${ApiUrl}/authSource?${params}`);
//       const authUrl = response.data;

//       console.log("Authorization URL:", authUrl);

//       const popup = window.open(
//         authUrl,
//         "DrChronoAuth",
//         "width=600,height=600"
//       );

//       const timer = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(timer);
//           const tokens = localStorage.getItem("drchrono_tokens");
//           if (tokens) {
//             const { access_token, refresh_token } = JSON.parse(tokens);
//             setAccessToken(access_token);
//             setRefreshToken(refresh_token);
//             localStorage.removeItem("drchrono_tokens");
//           }
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Error fetching authorization URL:", error);
//     }
//   };

//   // Function to handle tokens from the popup
//   const handleTokenResponse = (event) => {
//     if (event.origin !== ApiUrl) {
//       return;
//     }
//     const tokens = event.data;
//     console.log(tokens);
//     if (tokens && tokens.access_token && tokens.refresh_token) {
//       localStorage.setItem("acceestoken nk", accessToken);
//       localStorage.setItem("refreshtoken nk", refreshToken);
//       setAccessToken(tokens.access_token);
//       setRefreshToken(tokens.refresh_token);
//       localStorage.setItem("accees--token", accessToken);
//       localStorage.setItem("refresh--token", refreshToken);
//       localStorage.removeItem("drchrono_tokens");
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("message", handleTokenResponse);
//     return () => {
//       window.removeEventListener("message", handleTokenResponse);
//     };
//   }, []);

//   return (
//     <Box
//       sx={{
//         padding: theme.spacing(4),
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         Client Verification and OAuth Flow
//       </Typography>

//       {/* Step 1: Client Verification */}
//       <Paper
//         elevation={3}
//         sx={{
//           padding: theme.spacing(3),
//           width: "100%",
//           maxWidth: "600px",
//           marginBottom: theme.spacing(3),
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Verify Client
//         </Typography>
//         <TextField
//           label="Enter client email"
//           type="email"
//           value={clientEmail}
//           onChange={(e) => setClientEmail(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         <Button
//           onClick={fetchClientDetails}
//           variant="contained"
//           color="primary"
//           sx={{ marginTop: theme.spacing(2) }}
//         >
//           Verify Email
//         </Button>

//         {loading && (
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginTop: theme.spacing(2),
//             }}
//           >
//             <CircularProgress size={24} />
//             <Typography sx={{ marginLeft: theme.spacing(2) }}>
//               Loading client details...
//             </Typography>
//           </Box>
//         )}

//         {error && <Typography color="error">{error}</Typography>}

//         {clientDetails && (
//           <Box sx={{ marginTop: theme.spacing(3) }}>
//             <Typography variant="body1">
//               <strong>First Name:</strong> {clientDetails.client_firstName}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Last Name:</strong> {clientDetails.client_lastName}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Phone:</strong> {clientDetails.client_phone}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Email:</strong> {clientDetails.client_email}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Practice Name:</strong>{" "}
//               {clientDetails.client_practiceName}
//             </Typography>
//             <Typography variant="body1">
//               <strong>NPI Number:</strong> {clientDetails.client_NPInumber}
//             </Typography>
//             <Typography variant="body1">
//               <strong>EMR:</strong> {clientDetails.client_EMR}
//             </Typography>
//           </Box>
//         )}
//       </Paper>

//       {/* Step 2: OAuth Flow */}
//       {showOAuth && (
//         <Paper
//           elevation={3}
//           sx={{ padding: theme.spacing(3), width: "100%", maxWidth: "600px" }}
//         >
//           <Typography variant="h6" gutterBottom>
//             OAuth Flow
//           </Typography>
//           <TextField
//             label="Client ID"
//             type="text"
//             value={clientId}
//             onChange={(e) => setClientId(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Client Secret"
//             type="text"
//             value={clientSecret}
//             onChange={(e) => setClientSecret(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Redirect URI"
//             type="text"
//             value={redirectUri}
//             onChange={(e) => setRedirectUri(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="EMR"
//             type="text"
//             value={emr}
//             onChange={(e) => setEmr(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <Button
//             onClick={handleAuthorization}
//             variant="contained"
//             color="primary"
//             sx={{ marginTop: theme.spacing(2) }}
//           >
//             Authorize
//           </Button>

//           {accessToken && (
//             <Typography variant="body1" sx={{ marginTop: theme.spacing(2) }}>
//               <strong>Access Token:</strong> {accessToken}
//             </Typography>
//           )}
//           {refreshToken && (
//             <Typography variant="body1" sx={{ marginTop: theme.spacing(2) }}>
//               <strong>Refresh Token:</strong> {refreshToken}
//             </Typography>
//           )}
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default ClientAndOAuthFlow;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Paper,
//   Grid,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { ApiUrl } from "../ApiUrl";
// import toast, { Toaster } from "react-hot-toast";
// import RegisterVerify from "../../assets/registerVerify.svg";

// const ClientAndOAuthFlow = () => {
//   const [clientEmail, setClientEmail] = useState("");
//   const [clientDetails, setClientDetails] = useState(null);
//   const [clientId, setClientId] = useState("");
//   const [clientSecret, setClientSecret] = useState("");
//   const [redirectUri, setRedirectUri] = useState("");
//   const [emr, setEmr] = useState("");
//   const [accessToken, setAccessToken] = useState("");
//   const [refreshToken, setRefreshToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOAuth, setShowOAuth] = useState(false);

//   const theme = useTheme();

//   // Function to fetch client details
//   const fetchClientDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${ApiUrl}/getClientDetails`,
//         {},
//         {
//           headers: { client_email: clientEmail },
//         }
//       );
//       setClientDetails(response.data.clientDetail);
//       setShowOAuth(true);
//       toast.success("Client details fetched successfully!");
//     } catch (err) {
//       setClientDetails(null);
//       toast.error(err.response?.data?.error || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle OAuth authorization with query parameters
//   const handleAuthorization = async () => {
//     try {
//       const params = new URLSearchParams({
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: redirectUri,
//         emr: emr,
//       }).toString();

//       const response = await axios.get(`${ApiUrl}/authSource?${params}`);
//       const authUrl = response.data;

//       console.log("Authorization URL:", authUrl);

//       const popup = window.open(
//         authUrl,
//         "DrChronoAuth",
//         "width=600,height=600"
//       );

//       const timer = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(timer);
//           const tokens = localStorage.getItem("drchrono_tokens");
//           if (tokens) {
//             const { access_token, refresh_token } = JSON.parse(tokens);
//             setAccessToken(access_token);
//             setRefreshToken(refresh_token);
//             localStorage.removeItem("drchrono_tokens");
//             toast.success("Authorization successful!");
//           }
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Error fetching authorization URL:", error);
//       toast.error("Error fetching authorization URL.");
//     }
//   };

//   // Function to handle tokens from the popup
//   const handleTokenResponse = (event) => {
//     if (event.origin !== ApiUrl) {
//       return;
//     }
//     const tokens = event.data;
//     if (tokens && tokens.access_token && tokens.refresh_token) {
//       setAccessToken(tokens.access_token);
//       setRefreshToken(tokens.refresh_token);
//       localStorage.removeItem("drchrono_tokens");
//       toast.success("Tokens received successfully!");
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("message", handleTokenResponse);
//     return () => {
//       window.removeEventListener("message", handleTokenResponse);
//     };
//   }, []);

//   return (
//     <Box
//       sx={{
//         padding: theme.spacing(4),
//       }}
//     >
//       {/* Toast Notification Container */}
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           style: {
//             fontSize: "16px",
//           },
//         }}
//       />

//       <Grid container spacing={4}>
//         {/* Image on the Left */}
//         <Grid item xs={12} md={4}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//             }}
//           >
//             <Grid
//               item
//               xs={false}
//               sm={4}
//               md={7}
//               sx={{
//                 backgroundImage: `url(${RegisterVerify})`,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//               }}
//             />
//           </Box>
//         </Grid>

//         {/* Form on the Right */}
//         <Grid item xs={12} md={8}>
//           <Paper
//             elevation={3}
//             sx={{
//               padding: theme.spacing(3),
//               width: "100%",
//               height: "100%",
//             }}
//           >
//             {/* Step 1: Client Verification */}
//             <Typography variant="h6" gutterBottom>
//               Email Verification
//             </Typography>
//             <TextField
//               label="Email"
//               type="email"
//               value={clientEmail}
//               onChange={(e) => setClientEmail(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//             <Button
//               onClick={fetchClientDetails}
//               variant="contained"
//               color="primary"
//               sx={{
//                 mt: 3,
//                 mb: 2,
//                 backgroundColor: "#407bff",
//                 "&:hover": {
//                   backgroundColor: "#12171e",
//                   transition: "background-color 0.3s ease",
//                 },
//               }}
//             >
//               Verify Email
//             </Button>

//             {loading && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginTop: theme.spacing(2),
//                 }}
//               >
//                 <CircularProgress size={24} />
//                 <Typography sx={{ marginLeft: theme.spacing(2) }}>
//                   Loading client details...
//                 </Typography>
//               </Box>
//             )}

//             {clientDetails && (
//               <Box sx={{ marginTop: theme.spacing(3) }}>
//                 <Typography variant="body1">
//                   <strong>First Name:</strong> {clientDetails.client_firstName}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Last Name:</strong> {clientDetails.client_lastName}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Phone:</strong> {clientDetails.client_phone}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Email:</strong> {clientDetails.client_email}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Practice Name:</strong>{" "}
//                   {clientDetails.client_practiceName}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>NPI Number:</strong> {clientDetails.client_NPInumber}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>EMR:</strong> {clientDetails.client_EMR}
//                 </Typography>
//               </Box>
//             )}

//             {/* Step 2: OAuth Flow */}
//             {showOAuth && (
//               <Box>
//                 <Typography variant="h6" gutterBottom>
//                   EMR Configuration
//                 </Typography>
//                 <TextField
//                   label="Client ID"
//                   type="text"
//                   value={clientId}
//                   onChange={(e) => setClientId(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <TextField
//                   label="Client Secret"
//                   type="text"
//                   value={clientSecret}
//                   onChange={(e) => setClientSecret(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <TextField
//                   label="Redirect URI"
//                   type="text"
//                   value={redirectUri}
//                   onChange={(e) => setRedirectUri(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <TextField
//                   label="EMR"
//                   type="text"
//                   value={emr}
//                   onChange={(e) => setEmr(e.target.value)}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <Button
//                   onClick={handleAuthorization}
//                   variant="contained"
//                   color="primary"
//                   sx={{
//                     mt: 3,
//                     mb: 2,
//                     backgroundColor: "#407bff",
//                     "&:hover": {
//                       backgroundColor: "#12171e",
//                       transition: "background-color 0.3s ease",
//                     },
//                   }}
//                 >
//                   Authorize
//                 </Button>

//                 {accessToken && (
//                   <Typography
//                     variant="body1"
//                     sx={{ marginTop: theme.spacing(2) }}
//                   >
//                     <strong>Access Token:</strong> {accessToken}
//                   </Typography>
//                 )}
//                 {refreshToken && (
//                   <Typography
//                     variant="body1"
//                     sx={{ marginTop: theme.spacing(2) }}
//                   >
//                     <strong>Refresh Token:</strong> {refreshToken}
//                   </Typography>
//                 )}
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ClientAndOAuthFlow;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ApiUrl } from "../ApiUrl";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";

const ClientAndOAuthFlow = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [clientDetails, setClientDetails] = useState(null);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [emr, setEmr] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOAuth, setShowOAuth] = useState(false);

  const theme = useTheme();

  // Function to fetch client details
  const fetchClientDetails = async () => {
    setLoading(true);
    setError("");
    setClientDetails(null);

    try {
      const response = await axios.post(
        `${ApiUrl}/getClientDetails`,
        {},
        {
          headers: { client_email: clientEmail },
        }
      );
      console.log(response.data);
      setClientDetails(response.data.clientdetails);
      setShowOAuth(true);
      toast.success("Email verified!");
    } catch (err) {
      if (err.response) {
        // Client received an error response (5xx, 4xx)
        toast.error(err.response.data.error);
      } else if (err.request) {
        // Client never received a response, or request never left
        toast.error("No response received. Please try again.");
      } else {
        // Anything else
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle OAuth authorization with query parameters
  const handleAuthorization = async () => {
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        emr: emr,
      }).toString();

      const response = await axios.get(`${ApiUrl}/authSource?${params}`);
      const authUrl = response.data;

      console.log("Authorization URL:", authUrl);

      const popup = window.open(
        authUrl,
        "DrChronoAuth",
        "width=600,height=600"
      );

      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          const tokens = localStorage.getItem("drchrono_tokens");
          if (tokens) {
            const { access_token, refresh_token } = JSON.parse(tokens);
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            localStorage.removeItem("drchrono_tokens");
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching authorization URL:", error);
      toast.error("Error during authorization. Please try again.");
    }
  };

  // Function to handle tokens from the popup
  const handleTokenResponse = (event) => {
    if (event.origin !== ApiUrl) {
      return;
    }
    const tokens = event.data;
    if (tokens && tokens.access_token && tokens.refresh_token) {
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
      localStorage.removeItem("drchrono_tokens");
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleTokenResponse);
    return () => {
      window.removeEventListener("message", handleTokenResponse);
    };
  }, []);

  // Function to submit data to the API
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${ApiUrl}/clientEmrDetails`,
        {},
        {
          headers: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            client_emr: emr,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred while submitting data"
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Toaster />
      {/* Step 1: Client Verification */}
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(3),
          width: "100%",
          maxWidth: "600px",
          marginBottom: theme.spacing(3),
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Emr Configuration
        </Typography>
        <TextField
          label="Enter client email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={fetchClientDetails}
          variant="contained"
          color="primary"
          sx={{
            marginTop: 2,
            backgroundColor: "#407bff",
            "&:hover": {
              backgroundColor: "#12171e",
              transition: "background-color 0.3s ease",
            },
          }}
        >
          Next
        </Button>

        {loading && <Loader />}

        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: theme.spacing(2),
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ marginLeft: theme.spacing(2) }}>
            Loading...
          </Typography>
        </Box> */}
        {error && <Typography color="error">{error}</Typography>}

        {clientDetails && (
          <TableContainer
            component={Paper}
            sx={{ marginTop: theme.spacing(3) }}
          >
            <Table>
              <TableHead
                sx={{
                  display: "flex",
                  textWrap: "nowrap",
                  textAlign: "center",
                }}
              >
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>First Name</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Last Name</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Mobile</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Email</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>NPI</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>EMR</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Practice Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  display: "flex",
                  textWrap: "nowrap",
                  textAlign: "center",
                }}
              >
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_firstName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_lastName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_phone}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_NPInumber}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_EMR}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {clientDetails.client_practiceName}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Step 2: OAuth Flow */}
      {showOAuth && (
        <Paper
          elevation={3}
          sx={{ padding: theme.spacing(3), width: "100%", maxWidth: "600px" }}
        >
          <TextField
            autoFocus={true}
            label="Number of Admins"
            type="number"
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
            margin="normal"
          />
          <TextField
            label="Client ID"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Secret"
            type="text"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Redirect URI"
            type="text"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="EMR"
            type="text"
            value={emr}
            onChange={(e) => setEmr(e.target.value)}
            fullWidth
            margin="normal"
          />
          {!accessToken && (
            <Button
              onClick={handleAuthorization}
              variant="contained"
              color="primary"
              sx={{
                marginTop: 2,
                backgroundColor: "#407bff",
                "&:hover": {
                  backgroundColor: "#12171e",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              Authorize
            </Button>
          )}

          {/* {accessToken && (
            <Typography variant="body1" sx={{ marginTop: theme.spacing(2) }}>
              <strong>Access Token:</strong> {accessToken}
            </Typography>
          )}
          {refreshToken && (
            <Typography variant="body1" sx={{ marginTop: theme.spacing(2) }}>
              <strong>Refresh Token:</strong> {refreshToken}
            </Typography>
          )} */}

          {accessToken && (
            <Button
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              sx={{
                marginTop: 2,
                backgroundColor: "#407bff",
                "&:hover": {
                  backgroundColor: "#2ad644",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              Register
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ClientAndOAuthFlow;
