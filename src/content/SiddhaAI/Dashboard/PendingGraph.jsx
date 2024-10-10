import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme
} from '@mui/material';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import useAxiosInterceptor from 'src/contexts/Interceptor';

const DataCard = () => {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  // Format the week start and end dates as MM/dd/yyyy
  const weekStart = format(startOfWeek(new Date()), 'MMM d');
  const weekEnd = format(endOfWeek(new Date()), 'MMM d');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar'
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        tickAmount: 4, // Controls the number of Y-axis ticks
        labels: {
          formatter: function (value) {
            return Math.round(value); // Show only whole numbers on the Y-axis
          }
        }
      },
      colors: ['#f44336'],
      legend: {
        position: 'top'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5
        }
      },
      dataLabels: {
        enabled: true
      }
    }
  });

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchMonitorPatients = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`/monitor-patients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('ressss', response.data.data.patientDetails);

        if (response.data.success) {
          const patients = response.data.data.patientFormBending || [];
          setData(patients);
          processChartData(patients);
          setPendingCount(
            patients.filter((patient) => !patient.access_token_used).length
          );
        } else {
          console.error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching data pending graph:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitorPatients();
  }, []);

  const processChartData = (patients) => {
    const result = patients.reduce((acc, patient) => {
      // Convert the date to MM/dd/yyyy format
      const date = format(new Date(patient.created_at), 'MM/dd/yyyy');
      if (!acc[date]) {
        acc[date] = { date, submitted: 0, notSubmitted: 0 };
      }
      if (patient.access_token_used) {
        acc[date].submitted += 1;
      } else {
        acc[date].notSubmitted += 1;
      }
      return acc;
    }, {});

    const dates = Object.keys(result);
    const submitted = dates.map((date) => result[date].submitted);
    const notSubmitted = dates.map((date) => result[date].notSubmitted);

    setChartData((prevData) => ({
      ...prevData,
      series: [{ name: 'Pending to Submit', data: notSubmitted }],
      options: {
        ...prevData.options,
        xaxis: {
          categories: dates // Dates are now in MM/dd/yyyy format
        }
      }
    }));
  };

  const handleCardClick = () => {
    if (open) return;
    setOpen(true);
    setLoading(true);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusStyle = (access_token_used) => ({
    backgroundColor: access_token_used ? '#4caf50' : '#f44336',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  });

  const Box2Options = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '80%'
      }
    },
    colors: [theme.colors.primary.light, theme.colors.info.light],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
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
      'Sunday'
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
      enabled: false
    }
  };

  const Box2Data = [
    {
      name: 'Net Profit',
      data: [2.3, 3.1, 4.0, 3.8, 5.1, 3.6, 4.0, 3.8, 5.1]
    },
    {
      name: 'Net Loss',
      data: [2.1, 2.1, 3.0, 2.8, 4.0, 3.8, 5.1, 3.6, 4.1]
    }
  ];

  return (
    <Box>
      <Card
        onClick={handleCardClick}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
          ':hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          },
          mb: 2,
          width: '100%'
        }}
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
          title={t('PI Form Status')}
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
            {pendingCount ? pendingCount : '0'}
          </Typography>
        </CardContent>
        <Chart options={Box2Options} series={Box2Data} type="bar" height={72} />

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            <Typography variant="h4" mt={3}>
              {t('Patient Intake Form Status')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginTop: 1,
                marginBottom: 2
              }}
            >
              Current Week
              {/* Total number of Pending Forms during the specified week */}
            </Typography>

            <Button
              sx={{ position: 'absolute', top: 6, right: 8 }}
              onClick={handleClose}
              color="error"
            >
              Close
            </Button>
            <Box sx={{ textAlign: 'right', display: 'none' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  marginTop: -5,
                  marginBottom: 1
                }}
              >
                {`${weekStart} - ${weekEnd}`} {/* Updated Date Format */}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={300}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Card>
    </Box>
  );
};

export default DataCard;
