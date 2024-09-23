import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import useAxiosInterceptor from 'src/contexts/Interceptor';

// API URLs
const LoginApiUrl = '/adminLogin';
const FileUploadApiUrl =
  'http://ec2-44-207-188-40.compute-1.amazonaws.com:8000/ai';

// Validation schemas using Yup
const loginValidationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const fileValidationSchema = Yup.object({
  file: Yup.mixed().required('A file is required')
});

const FileUpload = () => {
  const { axios } = useAxiosInterceptor();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authHeaders, setAuthHeaders] = useState({});

  // Function to handle login form submission
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const result = await axios.post(LoginApiUrl, {}, {
        headers: {
          Username: values.username,
          Password: values.password
        }
      });

      if (result.status === 200) {
        toast.success('Login successful!');
        setIsLoggedIn(true);
        setAuthHeaders({
          Authorization: `Bearer ${result.data.token}`
        });
      } else {
        toast.error('Login failed.');
      }
    } catch (error) {
      toast.error('Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Function to handle file upload form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('file', values.file);

    setLoading(true);

    try {
      const result = await axios.post(FileUploadApiUrl, formData, {
        headers: {
          ...authHeaders,
          'Content-Type': 'multipart/form-data'
        }
      });

      const [jsonData, processingTime] = result.data;
      const parsedData = JSON.parse(jsonData);

      setResponse({ data: parsedData, time: processingTime });
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file.');
      setResponse(null);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Function to handle file input change
  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue('file', file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f4f8' }}
    >
      <CssBaseline />
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ minHeight: '100vh', alignItems: 'center' }}
      >
        {!isLoggedIn ? (
          <Grid item xs={12} md={5}>
            <Paper
              elevation={8}
              sx={{
                padding: 4,
                backgroundColor: '#ffffff',
                boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
                borderRadius: '12px'
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="#0277bd"
                textAlign="center"
              >
                Login
              </Typography>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <Field
                        name="username"
                        type="text"
                        placeholder="Username"
                        style={{
                          marginBottom: '20px',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '2px solid #0277bd'
                        }}
                      />
                      <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                        style={{
                          marginBottom: '20px',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '2px solid #0277bd'
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{
                          mt: 2,
                          backgroundColor: '#0277bd',
                          '&:hover': { backgroundColor: '#01579b' }
                        }}
                      >
                        Login
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={8}
                sx={{
                  padding: 4,
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
                  borderRadius: '12px'
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  color="#0277bd"
                  textAlign="center"
                >
                  Upload and Capture
                </Typography>
                <Formik
                  initialValues={{ file: null }}
                  validationSchema={fileValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, isSubmitting }) => (
                    <Form>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="file"
                          name="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleFileChange(event, setFieldValue)
                          }
                          style={{
                            marginBottom: '20px',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '2px solid #0277bd'
                          }}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          sx={{
                            mt: 2,
                            backgroundColor: '#0277bd',
                            '&:hover': { backgroundColor: '#01579b' }
                          }}
                        >
                          Upload
                        </Button>
                        {imagePreview && (
                          <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="#0277bd">
                              Preview:
                            </Typography>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '12px',
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={8}
                sx={{
                  padding: 4,
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
                  borderRadius: '12px'
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  color="#0277bd"
                  textAlign="center"
                >
                  Response
                </Typography>
                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '200px'
                    }}
                  >
                    <CircularProgress color="primary" size={60} />
                  </Box>
                ) : response ? (
                  <Box
                    sx={{
                      backgroundColor: '#e3f2fd',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #0277bd',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Typography variant="h6" color="#0277bd">
                      Processed Data:
                    </Typography>
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                    <Typography variant="h6" color="#01579b" sx={{ mt: 2 }}>
                      Processing Time: {response.time.toFixed(2)} seconds
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    textAlign="center"
                  >
                    No response to display.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
      <Toaster position="bottom-center" />
    </Box>
  );
};

export default FileUpload;
