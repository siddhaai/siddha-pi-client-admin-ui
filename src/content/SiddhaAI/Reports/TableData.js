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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const [chartOptions, setChartOptions] = useState({
    chart: {
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true
        },
        export: {
          csv: {
            filename: 'Overall Report'
          },
          svg: {
            filename: 'Overall Report'
          },
          png: {
            filename: 'Overall Report'
          }
        },
        events: {
          beforeDownload: (chartContext, options) => {
            const canvas = chartContext.el.querySelector('canvas');
            const ctx = canvas.getContext('2d');

            // Add custom title text to the canvas before downloading
            ctx.font = '20px Arial';
            ctx.fillText('Overall Report', 10, 30); // Position the title at (10, 30)
          }
        }
      },
      zoom: {
        enabled: false
      }
    },
    labels: [], // Labels for pie chart
    colors: [
      '#fd7f6f',
      '#7eb0d5',
      '#b2e061',
      '#bd7ebe',
      '#ffb55a'
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
          totalExistingPatientRetrievedCount,
          totalScheduleAppointmentCount,
          totalSmsSendCount,
          totalUpdatePatientPiForm
        } = response.data.monthlySummary;

        const data = [
          totalPatientCreateCount,
          totalExistingPatientRetrievedCount,
          totalScheduleAppointmentCount,
          totalSmsSendCount,
          totalUpdatePatientPiForm
        ];

        setChartTitle(t('Monthly Summary Report'));
        setSubtitle(t('Last 30 days')); // Set subtitle for monthly report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            t('Patients Created'),
            t('Existing Patients Retrieved'),
            t('Appointments Scheduled'),
            t('SMS Sent'),
            t('Patient Intake Form Submitted')
          ]
        }));
      } else if (selectedReport === 'weekly') {
        const weeklySummary = response.data.reports.weeklySummary;

        const data = [
          weeklySummary.totalPatientCreateCount || 0,
          weeklySummary.totalExistingPatientRetrievedCount || 0,
          weeklySummary.totalScheduleAppointmentCount || 0,
          weeklySummary.totalSmsSendCount || 0,
          weeklySummary.totalUpdatePatientPiForm || 0,
        ];

        setChartTitle(t('Weekly Summary Report'));
        setSubtitle(t('Last 7 days')); // Set subtitle for weekly report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            t('Patients Created'),
            t('Existing Patients Retrieved'),
            t('Appointments Scheduled'),
            t('SMS Sent'),
            t('Patient Intake Form Submitted')
          ]
        }));
      } else if (selectedReport === 'custom') {
        const customReport = response.data.reports.totalCustomReport;

        const data = [
          customReport.totalPatientCreateCount || 0,
          customReport.totalExistingPatientRetrievedCount || 0,
          customReport.totalScheduleAppointmentCount || 0,
          customReport.totalSmsSendCount || 0,
          customReport.totalUpdatePatientPiForm || 0
        ];

        setChartTitle(t('Custom Date Range Report'));
        setSubtitle(''); // Clear subtitle for custom report
        setChartData(data);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: [
            t('Patients Created'),
            t('Existing Patients Retrieved'),
            t('Appointments Scheduled'),
            t('SMS Sent'),
            t('Patient Intake Form Submitted')
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
            {/* <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {t('Loading...')}
            </Typography> */}
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
                    {t('Report Type')}
                  </InputLabel>
                  <Select
                    labelId="report-type-select-label"
                    value={selectedReport}
                    label={t('Report Type')}
                    onChange={(e) => {
                      setSelectedReport(e.target.value);
                      setFromDate(null);
                      setToDate(null);
                    }}
                  >
                    <MenuItem value="monthly">{t('Monthly Report')}</MenuItem>
                    <MenuItem value="weekly">{t('Weekly Report')}</MenuItem>
                    <MenuItem value="custom">{t('Custom Date Range')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {selectedReport === 'custom' && (
              <Grid container spacing={2} mb={2}>
                <Grid item>
                  <DatePicker
                    label={t('From Date')}
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    format="MM/DD/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label={t('To Date')}
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="MM/DD/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            )}

            {/* {chartData && (
              <Chart
                options={chartOptions}
                series={chartData}
                type="pie"
                height={300}
              />
            )} */}

            {/* Render chart or message for custom report */}
{/* {selectedReport === 'custom' && chartData && chartData.every((value) => value === 0) ? (
  <Box sx={{ textAlign: 'center', mt: 4 }}>
    <Typography variant="h6">{t('No data available for the selected date range')}</Typography>
  </Box>
) : (
  chartData && (
    <Chart
      options={chartOptions}
      series={chartData}
      type="pie"
      height={300}
    />
  )
)} */}
{/* Render chart or "No records found" message */}
{chartData && chartData.every((value) => value === 0) ? (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6">
        {selectedReport === 'monthly'
          ? t('No records found for the Monthly Report')
          : selectedReport === 'weekly'
          ? t('No records found for the Weekly Report')
          : t('No records found for the selected date range')}
      </Typography>
    </Box>
  ) : (
    chartData && (
      <Chart
        options={chartOptions}
        series={chartData}
        type="pie"
        height={300}
      />
    )
  )}
          </Box>
        )}
      </Card>
    </>
  );
}

export default Reports;
