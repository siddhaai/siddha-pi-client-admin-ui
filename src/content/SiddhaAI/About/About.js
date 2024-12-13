import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import toast from 'react-hot-toast';

const About = () => {
  const { axios } = useAxiosInterceptor();
  const token = localStorage.getItem('token');
  const [about, setAbout] = useState({
    api: '',
    emr: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/about', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('res', response.data);
      setAbout({
        api: response.data.apiVersion,
        emr: response.data.clientEmrName
      });
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.data);
      setLoading(false);
    }
  };

  // console.log("about", about.api, about.emr);

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <Card sx={{ mt: 2, pt: 2, ml: 2, mr: 2 }}>
      <CardContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60vh"
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box
            sx={{
              p: 3
            }}
          >
            <Typography
              variant="h3"
              component="div"
              gutterBottom
              mt={-2}
              mb={2}
            >
              About
            </Typography>

            {/* First Paragraph */}
            <Typography fontSize={15} paragraph>
              Siddha-PI is an innovative healthcare platform designed to
              streamline and enhance medical practice management through
              advanced digital solutions. It connects electronic medical records
              (EMR) systems with a comprehensive set of tools to simplify
              patient intake, streamline communication, and improve overall
              efficiency in healthcare settings.
            </Typography>

            {/* Second Paragraph */}
            <Typography fontSize={15} paragraph>
              With features like patient intake automation, appointment
              scheduling, SMS and email notifications, AI-driven data retrieval,
              and secure payment processing, Siddha-PI helps healthcare
              providers manage their operations with ease. The platform ensures
              HIPAA compliance and integrates clearinghouse support for claims
              management, making it a powerful solution for both small practices
              and larger healthcare systems.
            </Typography>

            {/* Second Title */}
            <Typography variant="h4" component="div" gutterBottom mt={2}>
              Information about Siddha-PI integrated systems
            </Typography>

            {/* Bullet Points Section */}
            <Box component="ul" sx={{ ml: -7.5, mt: 1 }}>
              <List>
                <ListItem>
                  <ListItemText primary="Siddha PI - Admin Panel Version - V0.0.16" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Siddha PI - Intake Form Version - V1.1.13" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`Siddha PI - API Version - ${about.api || ''}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Siddha PI - AI Version - V1.0.35" />
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <Typography>EMR - {`${about.emr || ''}  `}</Typography>
                  {/* <ListItemText primary="DrChrono - API Version - V4 (Hunt Valley)" /> */}
                  <Chip label="Connected" color="success" size="small" />
                </ListItem>
                {/* <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row'
                  //   justifyContent: 'flex-start',
                  //   alignItems: 'center',
                  //   gap: 0.5 // Adjust the gap to control the closeness
                  //   padding: 0 // Optional: reduce padding if necessary
                }}
              >
                <Typography
                //   primary="DrChrono - API Version - V4 (Hunt Valley)"
                //   sx={{ margin: 0 }} // Remove any margin around the text
                >
                  DrChrono - API Version - V4 (Hunt Valley)
                </Typography>
                <Chip label="Connected" color="success" size="small" />
              </Box> */}
              </List>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default About;
