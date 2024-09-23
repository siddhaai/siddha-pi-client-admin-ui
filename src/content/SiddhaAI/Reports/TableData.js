import {
  Box,
  Card,
  CircularProgress,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { Helmet } from 'react-helmet-async';
import { DatePicker } from '@mui/x-date-pickers';

function Reports() {
  const { axios } = useAxiosInterceptor();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [chartTitle, setChartTitle] = useState('Monthly Summary Report');
  const [subtitle, setSubtitle] = useState('Last 30 days'); // Subtitle only for monthly and weekly
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [chartOptions, setChartOptions] = useState({
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
    labels: [], // Labels for pie chart
    colors: [
      theme.colors.primary.main,
      theme.colors.info.main,
      theme.colors.warning.main,
      theme.colors.success.main,
      theme.colors.error.main
    ],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true
    },
    theme: {
      mode: theme.palette.mode
    }
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      setChartData(null); // Clear previous chart data

      const params =
        selectedReport === 'custom'
          ? {
              from: fromDate?.toISOString().split('T')[0],
              to: toDate?.toISOString().split('T')[0]
            }
          : {};

      const response = await axios.get(`/calculate-${selectedReport}-report`, {
        params
      });

      if (selectedReport === 'monthly') {
        const {
          totalPatientCreateCount,
          totalSmsSendCount,
          totalExistingPatientRetrievedCount,
          totalScheduleAppointmentCount,
          totalUpdatePatientPiForm
        } = response.data.monthlySummary;

        const data = [
          totalPatientCreateCount,
          totalSmsSendCount,
          totalExistingPatientRetrievedCount,
          totalScheduleAppointmentCount,
          totalUpdatePatientPiForm
        ];

        setChartTitle('Monthly Summary Report');
        setSubtitle('Last 30 days'); // Set subtitle for monthly report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            'Patient Created',
            'SMS Sent',
            'Existing Patients Retrieved',
            'Appointments Scheduled',
            'Patient Intake Form Submited'
          ]
        }));
      } else if (selectedReport === 'weekly') {
        const weeklySummary = response.data.reports.weeklySummary;

        const data = [
          weeklySummary.totalPatientCreateCount || 0,
          weeklySummary.totalSmsSendCount || 0,
          weeklySummary.totalExistingPatientRetrievedCount || 0,
          weeklySummary.totalScheduleAppointmentCount || 0,
          weeklySummary.totalUpdatePatientPiForm || 0
        ];

        setChartTitle('Weekly Summary Report');
        setSubtitle('Last 7 days'); // Set subtitle for weekly report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            'Patient Created',
            'SMS Sent',
            'Existing Patients Retrieved',
            'Appointments Scheduled',
            'Patient Intake Form Submitted'
          ]
        }));
      } else if (selectedReport === 'custom') {
        const customReport = response.data.reports.totalCustomReport;

        const data = [
          customReport.totalPatientCreateCount || 0,
          customReport.totalSmsSendCount || 0,
          customReport.totalExistingPatientRetrievedCount || 0,
          customReport.totalScheduleAppointmentCount || 0,
          customReport.totalUpdatePatientPiForm || 0
        ];

        setChartTitle('Custom Date Range Report');
        setSubtitle(''); // Clear subtitle for custom report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            'Patient Created',
            'SMS Sent',
            'Existing Patients Retrieved',
            'Appointments Scheduled',
            'Patient Intake Form Submitted'
          ]
        }));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedReport === 'custom' && fromDate && toDate) {
      fetchReportData();
    } else if (selectedReport !== 'custom') {
      fetchReportData();
    }
  }, [selectedReport, fromDate, toDate]);

  return (
    <>
      <Helmet>
        <title>Overall Reports</title>
      </Helmet>
      <Card sx={{ p: 3, mb: 3 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              p: 2
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              Loading...
            </Typography>
          </Box>
        ) : (
          <Box position="relative">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Grid item>
                <Typography variant="h4">{chartTitle}</Typography>
                {subtitle && ( // Conditionally render subtitle
                  <Typography variant="subtitle1" color="textSecondary">
                    {subtitle}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <FormControl>
                  <InputLabel id="report-type-select-label">
                    Report Type
                  </InputLabel>
                  <Select
                    labelId="report-type-select-label"
                    value={selectedReport}
                    label="Report Type"
                    onChange={(e) => {
                      setSelectedReport(e.target.value);
                      setFromDate(null);
                      setToDate(null);
                    }}
                  >
                    <MenuItem value="monthly">Monthly Report</MenuItem>
                    <MenuItem value="weekly">Weekly Report</MenuItem>
                    <MenuItem value="custom">Custom Date Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {selectedReport === 'custom' && (
              <Grid container spacing={2} mb={2}>
                <Grid item>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    format="MM/DD/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="MM/DD/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            )}

            {chartData && (
              <Chart
                options={chartOptions}
                series={chartData}
                type="pie"
                height={300}
              />
            )}
          </Box>
        )}
      </Card>
    </>
  );
}

export default Reports;
