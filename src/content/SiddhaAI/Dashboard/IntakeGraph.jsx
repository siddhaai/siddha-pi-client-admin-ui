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
  CircularProgress,
  Tooltip,
  Badge
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Chart from 'react-apexcharts';
import toast from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';

function PatientIntakeSuccessCount() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyTotalSmsCount, setDailyTotalSmsCount] = useState(0); // Initialize to 0
  const [chartData, setChartData] = useState({
    dates: [],
    smsCounts: [],
    formSubmited: []
  });
  const [dateRange, setDateRange] = useState(''); // New state to store the date range

  const todayDate = format(new Date(), 'MM/dd/yyyy'); // Format today's date as MM/DD/YYYY

  const fetchTotalPatientIntake = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/calculate-weekly-report`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const reports = response.data.reports.dailySummary;

      // Extract data for all dates
      const dates = reports.map(
        (report) => format(new Date(report._id.date), 'MM/dd/yyyy') // Format as MM/DD/YYYY
      );
      const smsCounts = reports.map((report) => report.totalSmsSendCount);
      const formSubmited = reports.map(
        (report) => report.totalUpdatePatientPiForm
      );

      // Find today's data for the card
      const todayReport = reports.find(
        (report) =>
          format(new Date(report._id.date), 'MM/dd/yyyy') === todayDate
      );
      const smsCount = todayReport ? todayReport.totalSmsSendCount : 0;

      setDailyTotalSmsCount(smsCount); // Update card value for today
      setChartData({
        dates, // All available dates
        smsCounts, // SMS counts for all dates
        formSubmited // Form submission counts for all dates
      });

      // Calculate the date range: from the first available date to today
      if (reports.length > 0) {
        const firstDate = format(new Date(reports[0]._id.date), 'MM/dd/yyyy'); // First date as MM/DD/YYYY
        const dateRangeString = `${firstDate} - ${todayDate}`;
        setDateRange(dateRangeString); // Set the date range
      }
    } catch (error) {
      toast.error('Failed to fetch daily report');
    }
  };

  useEffect(() => {
    fetchTotalPatientIntake();
  }, []);

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true
        },
        export: {
          csv: {
            filename: 'Patient Intake Status' // CSV download filename
          },
          svg: {
            filename: 'Patient Intake Status' // SVG download filename
          },
          png: {
            filename: 'Patient Intake Status' // PNG download filename
          }
        }
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.success.main, theme.colors.info.main],
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
    xaxis: {
      categories: chartData.dates, // Display all available dates on the x-axis
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
        columnWidth: '30%',
        borderRadius: 5
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
      <Tooltip
        title="Click here to view Patients Intake Status in bar chart"
        placement="top"
        arrow
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
      </Tooltip>
      <Tooltip
        title="Click here to view Patients Intake Status in bar chart"
        arrow
      >
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
            <Badge
              color="success"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              sx={{
                '.MuiBadge-badge': {
                  animation: 'pulse 1s infinite',
                  top: '2%',
                  right: '-6%',
                  transition: `${theme.transitions.create(['all'])}`
                }
              }}
              variant="dot"
              overlap="circular"
            >
              Today: {dailyTotalSmsCount}
            </Badge>
          </Typography>
        </CardContent>
      </Tooltip>

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
                {t('Patient Intake Status')}
              </Typography>

              {/* Display date range in secondary color */}
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.secondary.main, mt: 1 }}
              >
                {dateRange} {/* This will show the date range */}
              </Typography>

              <Chart
                options={chartOptions}
                series={[
                  {
                    name: 'SMS Sent',
                    data: chartData.smsCounts // SMS counts for all dates
                  },
                  {
                    name: 'Patient Intake Form Submitted',
                    data: chartData.formSubmited // Form submissions for all dates
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
