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
import { format, addDays } from 'date-fns';
import { Line } from 'react-chartjs-2';
import Chart from 'react-apexcharts';
import { tooltip } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const fetchChartData = async () => {
  // Simulate API call with data for Monday to Friday, from 8 AM to 6 PM
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
          {
            label: 'Success Count',
            data: [
              { x: 'Monday', y: '8:00 AM', count: 2 },
              { x: 'Monday', y: '5:00 PM', count: 5 },
              { x: 'Monday', y: '9:00 AM', count: 3 },
              { x: 'Monday', y: '12:00 PM', count: 4 },
              { x: 'Tuesday', y: '8:00 AM', count: 1 },
              { x: 'Tuesday', y: '9:00 AM', count: 4 },
              { x: 'Thursday', y: '8:00 AM', count: 5 },
              { x: 'Thursday', y: '2:10 AM', count: 5 },
              { x: 'Friday', y: '4:00 PM', count: 2 },
              { x: 'Friday', y: '2:00 PM', count: 2 },
              { x: 'Friday', y: '10:00 AM', count: 2 },
              { x: 'Friday', y: '8:00 AM', count: 10 }
            ],
            fill: true,
            borderColor: 'rgb(241, 31, 94)',
            tension: 0.1,
            pointBackgroundColor: 'rgb(241, 31, 94)',
            showLine: true
          }
        ]
      });
    }, 1000); // Simulate API delay
  });
};

function Block1() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(format(new Date(), 'EEEE'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const powerDaily = [
    {
      name: 'Patients Intake',
      data: [344, 512, 829, 696, 847, 437, 935]
    },
    {
      name: 'Pending Forms',
      data: [324, 509, 820, 696, 845, 436, 931]
    },
    {
      name: 'Total Forms',
      data: [324, 509, 820, 696, 845, 436, 931]
    }
  ];

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
    colors: [
      theme.colors.primary.light,
      theme.colors.info.light,
      theme.colors.warning.light
    ],
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
      'Sunday',
      'Last Week',
      'Last Month',
      'Last Year',
      'Last Decade'
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
      data: [2.3, 3.1, 4.0, 3.8, 5.1, 3.6, 4.0, 3.8, 5.1, 3.6, 3.2]
    },
    {
      name: 'Net Loss',
      data: [2.1, 2.1, 3.0, 2.8, 4.0, 3.8, 5.1, 3.6, 4.1, 2.6, 1.2]
    },
    {
      name: 'Revenue',
      data: [2.3, 3.1, 4.0, 3.8, 5.1, 3.6, 4.0, 3.8, 5.1, 3.6, 3.2]
    }
  ];

  // const handleCardClick = async (event) => {
  //   // Prevent the dialog from reopening immediately after closing
  //   if (open) return;

  //   setOpen(true);
  //   setLoading(true);
  //   const data = await fetchChartData();
  //   setChartData(data);
  //   setLoading(false);
  // };
  const handleCardClick = () => {
    navigate('/extended-sidebar/SiddhaAI/Reports/Reports');
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentHour = currentTime.getHours();

    if (currentHour >= 18) {
      const nextDay = format(addDays(currentTime, 1), 'EEEE');
      setCurrentDay(nextDay);
    } else if (currentHour < 8) {
      const previousDay = format(addDays(currentTime, -1), 'EEEE');
      setCurrentDay(previousDay);
    } else {
      setCurrentDay(format(currentTime, 'EEEE'));
    }
  }, []);

  const DailyPowerOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      // sparkline: {
      //   enabled: true
      // },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        // horizontal: false,
        borderRadius: 10,
        columnWidth: '50%'
      }
    },
    colors: [
      theme.colors.primary.light,
      theme.colors.info.light,
      theme.colors.warning.light
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
      // colors: ['transparent']
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      title: {
        text: 'Days'
      },
      axisBorder: {
        show: true
      },
      labels: {
        show: true
      }
    },
    yaxis: {
      min: 200,
      max: 1000,
      title: {
        text: 'Count'
      },
      labels: {
        show: true
      }
    },
    tooltip: {
      enabled: true
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      strokeDashArray: 5,
      borderColor: theme.colors.alpha.black[10]
    }
  };

  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        height: '90%',
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
        title={t('Reports')}
      />
      <CardContent
        sx={{
          pt: 0,
          display: 'flex',
          alignItems: 'center'
        }}
      ></CardContent>
      <Chart options={Box2Options} series={Box2Data} type="bar" height={110} />
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
                Loading ...
              </Typography>
            </Box>
          ) : (
            <Box position="relative">
              <Button onClick={handleClose}>Close</Button>

              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  top: 9,
                  right: 13,
                  textDecoration: 'underline'
                }}
              >
                {`Today: ${currentDay}`}
              </Typography>

              <Typography variant="h4" m={2}>
                {t('Total Patient Intake (week)')}
              </Typography>
              {chartData && (
                <Chart
                  options={DailyPowerOptions}
                  series={powerDaily}
                  type="bar"
                  height={274}
                />
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default Block1;
