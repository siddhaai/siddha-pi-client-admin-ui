import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, Toaster } from 'react-hot-toast';
import {
  Grid,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';
import jsPDF from 'jspdf';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { styled } from '@mui/material/styles'; // For hover effects
import { Helmet } from 'react-helmet-async';
import { t } from 'i18next';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#eef1f6', // Add hover effect
    cursor: 'pointer'
  }
}));

// Custom Toolbar component
const CustomToolbar = () => (
  <div id="toolbar-container">
    <span className="ql-formats">
      <select className="ql-font"></select>
      <select className="ql-size"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="sub"></button>
      <button className="ql-script" value="super"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-header" value="1"></button>
      <button className="ql-header" value="2"></button>
      <button className="ql-blockquote"></button>
      <button className="ql-code-block"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-direction" value="rtl"></button>
      <select className="ql-align"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-link"></button>
      <button className="ql-formula"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-clean"></button>
    </span>
  </div>
);

const TC = () => {
  const { axios } = useAxiosInterceptor();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAgreementId, setCurrentAgreementId] = useState(null);
  const [initialLoader, setInitialLoader] = useState(true); // New state for initial loader

  const token = localStorage.getItem('token');

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { drchronoDoctoresDetail } = response.data;
      if (drchronoDoctoresDetail && drchronoDoctoresDetail.results) {
        setDoctors(drchronoDoctoresDetail.results);
      } else {
        console.error('Unexpected data structure from API');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, [axios, token]);

  const fetchAgreements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/agreement/getAgreementClientAdmin', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        const fetchedAgreements = response.data.data;
        setAgreements(fetchedAgreements);
        setShowTable(fetchedAgreements.length > 0);
      } else {
        console.error('Failed to fetch agreements');
        setShowTable(false);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setIsLoading(false);
      setInitialLoader(false); // Stop the initial loader after fetching
    }
  }, [axios, token]);

  useEffect(() => {
    fetchDoctors();
    fetchAgreements();
  }, [fetchDoctors, fetchAgreements]);

  const handleEditAgreement = (agreement) => {
    setEditMode(true);
    setCurrentAgreementId(agreement._id);
    setTitle(agreement.title);
    setContent(agreement.body);
    setSelectedDoctor(agreement.emr_doctorId);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      toast.error(t('Please select a doctor'));
      return;
    }

    setIsLoading(true);
    try {
      if (editMode) {
        const response = await axios.put(
          `/agreement`,
          {
            title,
            body: content,
            emr_doctorId: selectedDoctor,
            _id: currentAgreementId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          toast.success(t('Agreement updated successfully'));
          fetchAgreements();
          setEditMode(false);
          setCurrentAgreementId(null);
          setTitle('');
          setContent('');
          setSelectedDoctor('');
        }
      } else {
        const response = await axios.post(
          '/agreement',
          {
            title,
            body: content,
            emr_doctorId: selectedDoctor
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 201) {
          toast.success(t('Agreement created successfully'));
          fetchAgreements();
          setTitle('');
          setContent('');
          setSelectedDoctor('');
        }
      }
    } catch (error) {
      console.error('Error submitting the content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processHtmlForPdf = (html, pdf, startY) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let currentY = startY;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const marginLeft = 15;
    const marginRight = pageWidth - 15;
    let listCounter = 1; // For numbered lists

    const traverseNodes = (node) => {
      const text = node.textContent.trim();
      if (!text) return;

      switch (node.nodeName.toLowerCase()) {
        case 'h1':
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          currentY += 10;
          break;

        case 'p':
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const lines = pdf.splitTextToSize(text, marginRight - marginLeft);
          lines.forEach((line) => {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = 20;
              addCustomPageNumber(pdf);
            }
            pdf.text(line, marginLeft, currentY);
            currentY += 7;
          });
          currentY += 5;
          break;

        case 'ul': // Unordered list
          node.childNodes.forEach((liNode) => {
            const liText = liNode.textContent.trim();
            if (liText) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              const bulletText = `• ${liText}`; // Add bullet character
              const lines = pdf.splitTextToSize(
                bulletText,
                marginRight - marginLeft
              );
              lines.forEach((line) => {
                if (currentY > pageHeight - 30) {
                  pdf.addPage();
                  currentY = 20;
                  addCustomPageNumber(pdf);
                }
                pdf.text(line, marginLeft, currentY);
                currentY += 7;
              });
            }
          });
          currentY += 5;
          break;
        case 'ol': // Ordered list
          listCounter = 1; // Reset list counter
          node.childNodes.forEach((liNode) => {
            const liText = liNode.textContent.trim();
            if (liText) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              const numberedText = `${listCounter}. ${liText}`; // Add list number
              const lines = pdf.splitTextToSize(
                numberedText,
                marginRight - marginLeft
              );
              lines.forEach((line) => {
                if (currentY > pageHeight - 30) {
                  pdf.addPage();
                  currentY = 20;
                  addCustomPageNumber(pdf);
                }
                pdf.text(line, marginLeft, currentY);
                currentY += 7;
              });
              listCounter++; // Increment list counter
            }
          });
          currentY += 5;
          break;

        case 'a': // Links
          const linkText = node.textContent.trim();
          const linkHref = node.getAttribute('href');
          if (linkText && linkHref) {
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 255); // Set link color to blue
            pdf.setFont('helvetica', 'normal');
            pdf.textWithLink(linkText, marginLeft, currentY, { url: linkHref });
            currentY += 7;
          }
          pdf.setTextColor(0, 0, 0); // Reset color to black
          currentY += 5;
          break;

        case 'u': // Underlined text
          const underlineText = node.textContent.trim();
          if (underlineText) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const underlineLines = pdf.splitTextToSize(
              underlineText,
              marginRight - marginLeft
            );
            pdf.text(underlineLines.join(' '), marginLeft, currentY);
            pdf.line(
              marginLeft,
              currentY + 1,
              marginLeft + pdf.getTextWidth(underlineLines.join(' ')),
              currentY + 1
            ); // Draw underline
            currentY += 7;
          }
          currentY += 5;
          break;

        default:
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const defaultLines = pdf.splitTextToSize(
            text,
            marginRight - marginLeft
          );
          defaultLines.forEach((line) => {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = 20;
              addCustomPageNumber(pdf);
            }
            pdf.text(line, marginLeft, currentY);
            currentY += 7;
          });
          currentY += 5;
          break;
      }
    };

    tempDiv.childNodes.forEach(traverseNodes);
    return currentY;
  };

  const addCustomPageNumber = (pdf) => {
    const pageCount = pdf.internal.getNumberOfPages();
    const pageWidth = pdf.internal.pageSize.width;
    pdf.setFontSize(10);
    pdf.text(`${pageCount}`, pageWidth / 2, pdf.internal.pageSize.height - 10, {
      align: 'center'
    });
  };

  const handleViewPdf = (title, body) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    let startY = 20;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, startY);
    startY += 15;

    processHtmlForPdf(body, pdf, startY);

    addCustomPageNumber(pdf);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.title = title;
      newWindow.document.body.innerHTML = `
        <iframe width="100%" height="100%" style="border:none;" src="${pdfUrl}"></iframe>
      `;
    } else {
      console.error('Failed to open the new window');
    }
  };

  const quillModules = {
    toolbar: {
      container: '#toolbar-container'
    }
  };

  return (
    <Box p={4}>
      <Toaster position="bottom-right" />
      <Helmet>
        <title>Agreement</title>
      </Helmet>

      {initialLoader ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {editMode
                ? t('Edit Agreement')
                : t('Select Doctor and Create Agreement')}
            </Typography>
          </Grid>

          {/* Doctor selection dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t('Preferred Doctor')}
              value={selectedDoctor}
              onChange={(event) => setSelectedDoctor(event.target.value)}
              placeholder={t('Select a doctor')}
              variant="outlined"
            >
              {doctors?.map((doctor) => (
                <MenuItem key={doctor?.id} value={doctor?.id}>
                  {`${doctor?.first_name} ${doctor?.last_name}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Title input */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('Enter title')}
              label={t('Agreement Title')}
              variant="outlined"
              disabled={!selectedDoctor}
            />
          </Grid>

          {/* Custom toolbar */}
          <Grid item xs={12}>
            <CustomToolbar />
          </Grid>

          {/* Content editor */}
          <Grid item xs={12}>
            <ReactQuill
              value={content}
              readOnly={!selectedDoctor}
              onChange={setContent}
              style={{ marginBottom: '20px', height: '300px' }}
              modules={quillModules}
            />
          </Grid>

          {/* Submit button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading || !title || !content || !selectedDoctor}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : editMode ? (
                t('Update')
              ) : (
                t('Submit')
              )}
            </Button>
          </Grid>

          {/* Divider */}
          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Agreement table */}
          <Grid item xs={12}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : showTable ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {t('S.no')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {t('Agreement Title')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {t('Actions')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agreements.map((agreement, index) => (
                      <StyledTableRow key={index}>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {agreement.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            onClick={() => handleEditAgreement(agreement)}
                          >
                            <Tooltip title={t('Edit')}>
                              <EditIcon />
                            </Tooltip>
                          </Button>
                          <Button
                            onClick={() =>
                              handleViewPdf(agreement.title, agreement.body)
                            }
                          >
                            <Typography sx={{ textDecoration: 'underline' }}>
                              {t('View')}
                            </Typography>
                          </Button>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                {t('No Agreement')}
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TC;
