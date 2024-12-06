import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  alpha,
  Card,
  Input,
 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';
import AuthContext from 'src/contexts/AuthContext';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import NotificationImportantTwoToneIcon from '@mui/icons-material/NotificationImportantTwoTone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import EmrBackImage from '../../../../assets/EmrBg.jpg';

const ClientAndOAuthFlow = () => {
  const { axios } = useAxiosInterceptor();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKeyFile, setPrivateKeyFile] = useState(null); // For file upload
  const [emr, setEmr] = useState('');
  const [emrOptions, setEmrOptions] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const name = 'epic';
  const theme = useTheme();
  const { name, guideName, accountId, setOpenDialog3 } = useContext(AuthContext);
// console.log(name, 'name',guideName,'guideName',accountId,'accountId');
  // Replace with your actual name


  
  // Fetch EMR options from the API
  const fetchEmrOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/fieldValues/emrSettings');
      if (response.data && response.data.emrData) {
        setEmrOptions(response.data.emrData); // Set the dropdown options from API
        // Check if the `name` matches any emrName and set that as the selected value
        const matchingEmr = response.data.emrData.find(
          (option) => option.emrName === name
        );
        if (matchingEmr) {
          setEmr(matchingEmr.emrName); // Set the EMR to the matched name
        }
      } else {
        toast.error('Failed to load EMR options');
      }
    } catch (error) {
      console.error('Error fetching EMR settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmrOptions(); // Fetch the EMR options when the component mounts
  }, []);
  // Function to handle OAuth authorization with query parameters
  const handleAuthorization = async () => {
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        emr: emr
      }).toString();

      const response = await axios.get(`/authSource?${params}`);
      const authUrl = response.data;

      // console.log('Authorization URL:', authUrl);

      const popup = window.open(
        authUrl,
        'DrChronoAuth',
        'width=600,height=600'
      );

      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          const tokens = localStorage.getItem('drchrono_tokens');
          if (tokens) {
            const { access_token, refresh_token } = JSON.parse(tokens);
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            localStorage.removeItem('drchrono_tokens');
          }
        }
      }, 1000);
    } catch (error) {
      // console.error('Error fetching authorization URL:', error);
      toast.error('Error during authorization. Please try again.');
    }
  };

  // console.log(accessToken, 'accessToken');
  // console.log(refreshToken, 'refreshToken');
  
  // Function to handle tokens from the popup
  const handleTokenResponse = (event) => {
    const tokens = event.data;
    if (tokens && tokens.access_token && tokens.refresh_token) {
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
      
      localStorage.removeItem('drchrono_tokens');
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleTokenResponse);
    return () => {
      window.removeEventListener('message', handleTokenResponse);
    };
  }, []);


  const handleSubmit = async () => {
    const headers = {
      'client_id': clientId,
      'client_secret': clientSecret,
      'redirect_uri': redirectUri,
      'client_emr': emr,
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'client_AccountId': accountId,
      'Content-Type': 'application/json',
    };
  
    // console.log('Headers being sent:', headers); // Debugging
  
    try {
      const response = await axios.post('/clientEmrDetails', {}, { headers: headers });
  
      if (response.status === 201) {
        toast.success('Registration successful!');
        navigate('/');
        setOpenDialog3(true);
      }
    } catch (error) {
      // console.error('Error:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || 'An error occurred while submitting'
      );
    }
  };



  // Function to handle file upload
  const handleFileUpload = (e) => {
    setPrivateKeyFile(e.target.files[0]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // background:`url(${EmrBackImage})`
      }}
    >
      <Toaster position="top-center" />

      {/* Step 2: OAuth Flow */}
      <Paper
        elevation={3}
        sx={{ padding: theme.spacing(3), width: '100%', maxWidth: '900px' }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'start' }}>
          EMR System
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // Align vertically in the center
            gap: 2 // Add some space between the text field and the text
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel id="emr-label">EMR</InputLabel>
            <Select
              labelId="emr-label"
              value={emr}
              label="EMR"
              onChange={(e) => setEmr(e.target.value)}
              disabled={name === emr} // Disable the dropdown if the selected EMR matches the context name
            >
              {loading ? (
                <MenuItem value="">
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                emrOptions.map((option) => (
                  <MenuItem
                    key={option._id}
                    value={option.emrName}
                    disabled={option.emrName === name} // Disable the option if it matches the name from context
                  >
                    {option.emrName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
            is your chosen EMR System.
          </Typography>
        </Box>
        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{
              background: alpha(theme.colors.info.main, 0.08),
              display: 'flex',
              alignItems: 'flex-start',
              p: 2,
              mt: 2
            }}
          >
            <NotificationImportantTwoToneIcon
              sx={{
                mr: 1,
                color: theme.colors.info.main,
                fontSize: theme.typography.pxToRem(22)
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  pt: 0.2
                }}
                gutterBottom
              >
                {t('Note :')}
              </Typography>
              <ul style={{ paddingLeft: theme.spacing(3), margin: 0 }}>
                {/* First bullet point with guideName as a link */}
                <li>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: theme.typography.pxToRem(13)
                    }}
                  >
                    {t('Please refer to the “')}
                    <a
                      href={guideName}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.colors.info.main }}
                    >
                      {t('EMR Guide Documentation')}
                    </a>
                    {t(
                      '” for instructions on configuring your EMR with the Siddha PI system. The documentation has been sent to your registered email address.'
                    )}
                  </Typography>
                </li>

                {/* Second bullet point */}
                <li>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: theme.typography.pxToRem(13)
                    }}
                  >
                    {t(
                      'If you want to change your EMR System here, please contact the Siddha AI Support Team.'
                    )}
                  </Typography>
                </li>
              </ul>
            </Box>
          </Card>
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: 'start', mt: 2 }}
        >
          Configure EMR System
        </Typography>

        {/* Conditional rendering based on emrName */}
        {emr === 'drchrono' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              width: '100%'
            }}
          >
            <TextField
              label="Client ID"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Client Secret"
              type="text"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Redirect URI"
              type="text"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ flex: 1 }}
            />
          </Box>
        )}

        {emr === 'epic' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row', // Horizontal layout
              gap: 2, // Spacing between the fields
              width: '100%'
            }}
          >
            <TextField
              label="Tenant ID"
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ flex: 1 }} // Make sure it takes equal space
            />
            <TextField
              label="Public Key"
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ flex: 1 }} // Make sure it takes equal space
            />
          

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}
            >
              <Typography variant="body1" gutterBottom>
                Private Key:
              </Typography>

              <Button
                variant="outlined"
                component="label" // Using component="label" to trigger file input
                startIcon={<UploadFileIcon />} // Icon in the button
                sx={{ textTransform: 'none', mt: 1 }} // Styling for the button
              >
                Upload File
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  sx={{ display: 'none' }} // Hide the actual file input
                />
              </Button>
            </Box>
            {/* </Box> */}
          </Box>
        )}

        {!accessToken && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end', // This will push the button to the right
              mt: 2 // Adds margin to the top
            }}
          >
            <Button
              onClick={handleAuthorization}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </Box>
        )}

        {accessToken && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              marginTop: 2,
            }}
          >
            Register
          </Button>
        )}

        <Grid item xs={12} sx={{ mt: 4 }}>
        
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: theme.typography.pxToRem(12),
                color: theme.colors.error.main
              }}
            >
              {t(
                'Important : When you click “Next” button you will be redirect to your EMR Authentication page. Once authentication done. You will be get a EMR Configuration successful message with Siddha PI app.'
              )}
            </Typography>
          </Box>
          {/* </Card> */}
        </Grid>
      </Paper>

    </Box>
  );
};

export default ClientAndOAuthFlow;
