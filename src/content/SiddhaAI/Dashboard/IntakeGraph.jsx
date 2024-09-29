import {
  CardContent,
  CardHeader,
  Card,
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  useTheme,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import Chart from 'react-apexcharts';
import toast from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';

function PatientIntakeSuccessCount() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [currentDay, setCurrentDay] = useState(format(new Date(), 'EEEE'));
  // const [currentTime, setCurrentTime] = useState(new Date());
  const [chartData, setChartData] = useState({
    dates: [],
    newPatients: [],
    smsCounts: [],
    formSubmited: [],
    existingPatientRetrieve: []
  });
  const [dailyTotalSmsCount, setDailyTotalSmsCount] = useState('');
  const weekStart = format(startOfWeek(new Date()), 'MMM dd');
  const weekEnd = format(endOfWeek(new Date()), 'MMM dd');

  const fetchTotalPatientIntake = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/calculate-weekly-report`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const reports = response.data.reports.dailySummary;

      // Process data for the chart
      const dates = reports.map(
        (report) =>
          `${format(new Date(report._id.date), 'MM/dd/yyyy')} (${format(
            new Date(report._id.date),
            'EEEE'
          )})`
      );
      const newPatients = reports.map(
        (report) => report.totalPatientCreateCount
      );
      const smsCounts = reports.map((report) => report.totalSmsSendCount);
      const formSubmited = reports.map(
        (report) => report.totalupdatePatientPiForm
      );
      const existingPatientRetrieve = reports.map(
        (report) => report.totalExistingPatientRetrievedCount
      );

      // Update state with chart data
      setChartData({
        dates,
        newPatients,
        smsCounts,
        formSubmited,
        existingPatientRetrieve
      });
    } catch (error) {
      toast.error('Failed to fetch daily report');
    }
  };

  useEffect(() => {
    fetchTotalPatientIntake();
  }, []);

  // Fetch total SMS count for the card display
  useEffect(() => {
    const fetchTotalSmsCount = async () => {
      const token = localStorage.getItem('token');
      try {
        const responseChartData = await axios.get(`/dailyReport`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log(
        //   responseChartData.data.dailyReports.totalDailyReports[0]
        //     .totalSmsSendCount,
        //   '<==responseChartData'
        // );
        setDailyTotalSmsCount(
          responseChartData.data.dailyReports.totalDailyReports[0]
            .totalSmsSendCount
        );
      } catch (error) {
        toast.error('Failed to fetch daily report');
      }
    };

    fetchTotalSmsCount();
  }, []);

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true
        }
      },
      zoom: {
        enabled: false
      }
    },
    colors: [
      // theme.colors.primary.main,
      // theme.colors.warning.main,
      theme.colors.success.main,
      theme.colors.info.main
    ],
    dataLabels: {
      enabled: false
    },

    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      curve: 'smooth',
      width: 2
    },
    legend: {
      show: true
    },
    xaxis: {
      categories: chartData.dates, // Use formatted dates with day
      labels: {
        show: true
      }
    },
    yaxis: {
      show: true,
      title: {
        text: 'Count'
      }
    },
    tooltip: {
      enabled: true
    },
    grid: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '30%', // Adjust the width of the bars here (e.g., '50%' or a pixel value like '30px')
        borderRadius: 5 // Optional: Adds rounded corners to the bars
      }
    }
  };

  const handleCardClick = () => {
    if (open) return;

    setOpen(true);
    setLoading(true);
    fetchTotalPatientIntake(); // Fetch data again to ensure the latest update
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Box1Options = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: true
      }
    },
    colors: [theme.colors.warning.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.warning.main],
      curve: 'smooth',
      width: 2
    },
    legend: {
      show: false
    },
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      'Last Week',
      'Last Month',
      'Last Year'
    ],
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      min: 0
    },
    tooltip: {
      enabled: false // Disable the tooltip
    }
  };

  const Box1Data = [
    {
      name: 'Sales',
      data: [32, 52, 45, 32, 54, 56, 28, 25, 36, 62]
    }
  ];
  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        cursor: 'pointer', // Change cursor to pointer
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)', // Scale the card on hover
          boxShadow: theme.shadows[6] // Add shadow on hover
        }
      }}
      onClick={handleCardClick}
    >
      <CardHeader
        sx={{
          p: 2
        }}
        titleTypographyProps={{
          component: 'h5',
          variant: 'caption',
          fontWeight: 'bold'
        }}
        title={t('Patients Intake Status')}
      />
      <CardContent
        sx={{
          pt: 0,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            px: 1
          }}
          variant="h1"
        >
          Today : {`${dailyTotalSmsCount ? dailyTotalSmsCount : '0'}`}
        </Typography>
      </CardContent>
      {/* <Chart options={Box1Options} series={Box1Data} type="area" height={72} /> */}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px'
              }}
            >
              <CircularProgress />
              <Typography variant="h6" sx={{ marginLeft: 2 }}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Button
                sx={{ position: 'absolute', top: 6, right: 8 }}
                onClick={handleClose}
                color="error"
              >
                Close
              </Button>

              <Typography variant="h4" mt={3}>
                {t('Patient Intake Status  ')}
              </Typography>
              {/* <Typography
                variant="h6"
                sx={{
                  marginTop: 1,
                  marginBottom: 2
                }}
              >
                Total number of SMS send during the specified week
                Current Week
              </Typography> */}

              <Box>
                {/* Align text to the left */}
                <Box sx={{ textAlign: 'right', display: 'none' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      marginTop: -5,
                      marginBottom: 1
                    }}
                  >
                    {`${weekStart} - ${weekEnd}`}
                  </Typography>
                </Box>
              </Box>

              <Chart
                options={chartOptions}
                series={[
                  // {
                  //   name: 'New Patients Created',
                  //   data: chartData.newPatients
                  // },
                  // {
                  //   name: 'Existing Patient Retrieved',
                  //   data: chartData.existingPatientRetrieve
                  // },
                  {
                    name: 'SMS Send',
                    data: chartData.smsCounts
                  },
                  {
                    name: 'Patient Intake Form Submited',
                    data: chartData.formSubmited
                  }
                ]}
                type="bar"
                height="350px"
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default PatientIntakeSuccessCount;

// import {
//   CardContent,
//   CardHeader,
//   Card,
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogContent,
//   useTheme,
//   CircularProgress
// } from '@mui/material';
// import { useTranslation } from 'react-i18next';
// import { useState, useEffect } from 'react';
// import { format, startOfWeek, endOfWeek } from 'date-fns';
// import Chart from 'react-apexcharts';
// import toast from 'react-hot-toast';
// import useAxiosInterceptor from 'src/contexts/Interceptor';

// function IntakeGraph() {
//   const { axios } = useAxiosInterceptor();
//   const { t } = useTranslation();
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [chartData, setChartData] = useState({
//     dates: [],
//     newPatients: [],
//     smsCounts: [],
//     formSubmited: [],
//     existingPatientRetrieve: []
//   });
//   const [dailyTotalSmsCount, setDailyTotalSmsCount] = useState('');

//   const fetchTotalPatientIntake = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get(`/calculate-weekly-report`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const reports = response.data.reports.dailySummary;

//       // Process data for the chart
//       const dates = reports.map(
//         (report) =>
//           `${format(new Date(report._id.date), 'MM/dd/yyyy')} (${format(
//             new Date(report._id.date),
//             'EEEE'
//           )})`
//       );
//       const newPatients = reports.map(
//         (report) => report.totalPatientCreateCount
//       );
//       const smsCounts = reports.map((report) => report.totalSmsSendCount);
//       const formSubmited = reports.map(
//         (report) => report.totalupdatePatientPiForm
//       );
//       const existingPatientRetrieve = reports.map(
//         (report) => report.totalExistingPatientRetrievedCount
//       );

//       // Update state with chart data
//       setChartData({
//         dates,
//         newPatients,
//         smsCounts,
//         formSubmited,
//         existingPatientRetrieve
//       });
//     } catch (error) {
//       toast.error('Failed to fetch daily report');
//     }
//   };

//   useEffect(() => {
//     fetchTotalPatientIntake();
//   }, []);

//   // Fetch total SMS count for the card display
//   useEffect(() => {
//     const fetchTotalSmsCount = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const responseChartData = await axios.get(`/dailyReport`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setDailyTotalSmsCount(
//           responseChartData.data.dailyReports.totalDailyReports[0]
//             .totalSmsSendCount
//         );
//       } catch (error) {
//         toast.error('Failed to fetch daily report');
//       }
//     };

//     fetchTotalSmsCount();
//   }, []);

//   // Chart options for the preview
//   const chartOptionsPreview = {
//     chart: {
//       background: 'transparent',
//       toolbar: { show: true },
//       zoom: { enabled: false }
//     },
//     colors: [theme.colors.success.main, theme.colors.info.main],
//     dataLabels: { enabled: false },
//     theme: { mode: theme.palette.mode },
//     stroke: { show: true, curve: 'smooth', width: 2 },
//     legend: { show: true },
//     xaxis: {
//       categories: chartData.dates,
//       labels: {
//         rotate: -45, // Rotate labels to avoid overlap
//         style: { fontSize: '10px' }
//       }
//     },
//     yaxis: {
//       title: { text: 'Count' }
//     },
//     tooltip: { enabled: true },
//     grid: { show: false },
//     plotOptions: {
//       bar: { columnWidth: '40%', borderRadius: 5 }
//     }
//   };

//   // Detailed chart for the dialog
//   const chartOptions = {
//     ...chartOptionsPreview,
//     plotOptions: {
//       bar: { columnWidth: '30%', borderRadius: 5 } // Adjust for detailed view
//     }
//   };

//   const handleCardClick = () => {
//     setLoading(true);
//     fetchTotalPatientIntake().finally(() => setLoading(false)); // Ensure loading is handled
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Card
//       sx={{
//         overflow: 'visible',
//         width: '100%',
//         cursor: 'pointer',
//         transition: 'transform 0.3s, box-shadow 0.3s',
//         '&:hover': {
//           transform: 'scale(1.05)',
//           boxShadow: theme.shadows[6]
//         }
//       }}
//       onClick={handleCardClick}
//     >
//       <CardHeader
//         sx={{ p: 2 }}
//         titleTypographyProps={{
//           component: 'h5',
//           variant: 'caption',
//           fontWeight: 'bold'
//         }}
//         title={t('Patients Intake Status')}
//       />
//       <CardContent
//         sx={{
//           pt: 0,
//           display: 'flex',
//           alignItems: 'center',
//           flexDirection: 'column'
//         }}
//       >
//         <Typography variant="h1">
//           Today: {`${dailyTotalSmsCount || '0'}`}
//         </Typography>
//         {/* <Box sx={{ width: '100%', mt: 2 }}>
//           <Chart
//             options={chartOptionsPreview}
//             series={[
//               { name: 'SMS Send', data: chartData.smsCounts },
//               {
//                 name: 'Patient Intake Form Submitted',
//                 data: chartData.formSubmited
//               }
//             ]}
//             type="bar"
//             height={200}
//           />
//         </Box> */}
//       </CardContent>

//       {/* Dialog for detailed view */}
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogContent>
//           {loading ? (
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '300px'
//               }}
//             >
//               <CircularProgress />
//               <Typography variant="h6" sx={{ marginLeft: 2 }}>
//                 Loading...
//               </Typography>
//             </Box>
//           ) : (
//             <Box>
//               <Button
//                 sx={{ position: 'absolute', top: 6, right: 8 }}
//                 onClick={handleClose}
//                 color="error"
//               >
//                 Close
//               </Button>
//               <Typography variant="h4" mt={3}>
//                 {t('Patient Intake Status')}
//               </Typography>
//               <Box sx={{ mt: 3 }}>
//                 <Chart
//                   options={chartOptions}
//                   series={[
//                     { name: 'SMS Send', data: chartData.smsCounts },
//                     {
//                       name: 'Patient Intake Form Submitted',
//                       data: chartData.formSubmited
//                     }
//                   ]}
//                   type="bar"
//                   height={350}
//                 />
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// }

// export default IntakeGraph;
