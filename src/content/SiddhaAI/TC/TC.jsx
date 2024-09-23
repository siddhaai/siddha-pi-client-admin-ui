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
  Box
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // Import html2canvas for converting HTML to canvas
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { styled } from '@mui/material/styles'; // For hover effects
import 'react-quill/dist/quill.snow.css';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover, // Add hover effect
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
      <button className="ql-image"></button>
      {/* <button className="ql-video"></button> */}
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
  const [agreements, setAgreements] = useState([]); // Store agreements
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false); // Control table visibility based on agreement length

  const token = localStorage.getItem('token');

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get(`/drchronoDoctorDetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { drchronoDoctoresDetail } = response.data;
      if (drchronoDoctoresDetail && drchronoDoctoresDetail.results) {
        setDoctors(drchronoDoctoresDetail.results);
      } else {
        toast.error('Unexpected data structure from API');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Error fetching doctors');
    }
  }, [axios, token]);

  // Fetch agreements and set the table visibility
  const fetchAgreements = useCallback(async () => {
    try {
      const response = await axios.get('/agreement/getAgreementClientAdmin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 200) {
        setAgreements(response.data.data); // Store agreements
        setShowTable(response.data.data.length > 0); // Only show table if agreements exist
      } else {
        toast.error('Failed to fetch agreements');
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
      toast.error('Error fetching agreements');
    }
  }, [axios, token]);

  useEffect(() => {
    fetchDoctors();
    fetchAgreements(); // Fetch agreements on mount
  }, [fetchDoctors, fetchAgreements]);

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setIsLoading(true);
    try {
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
        toast.success('Agreement created successfully');
        fetchAgreements(); // Refresh the agreements after successful submission
      }
    } catch (error) {
      console.error('Error submitting the content:', error);
      toast.error('Error creating agreement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPdf = (title, body) => {
    const container = document.createElement('div');
    container.innerHTML = body; // Use the body content as HTML

    document.body.appendChild(container); // Add the container to the DOM temporarily

    html2canvas(container, { useCORS: true })
      .then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const margin = 15; // Margin on all sides
        const lineHeight = 10; // Space between title and body

        // Add title at the top and center it
        pdf.setFontSize(16);
        pdf.text(title, pdf.internal.pageSize.getWidth() / 2, margin, {
          align: 'center'
        });

        const imgHeight =
          (canvas.height * (imgWidth - 2 * margin)) / canvas.width; // Adjust for margins
        let heightLeft = imgHeight;
        let position = margin + lineHeight; // Position below the title with extra space

        // Add the body image below the title with margins
        pdf.addImage(
          canvas,
          'PNG',
          margin,
          position,
          imgWidth - 2 * margin,
          imgHeight
        );
        heightLeft -= pageHeight - margin;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + margin;
          pdf.addPage();
          pdf.addImage(
            canvas,
            'PNG',
            margin,
            position,
            imgWidth - 2 * margin,
            imgHeight
          );
          heightLeft -= pageHeight - margin;
        }

        const pdfUrl = pdf.output('bloburl'); // Get the PDF URL as a blob
        window.open(pdfUrl); // Open the PDF in a new tab
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF');
      })
      .finally(() => {
        document.body.removeChild(container); // Remove the container after processing
      });
  };

  // Quill editor modules with custom toolbar
  const quillModules = {
    toolbar: {
      container: '#toolbar-container' // Attach the custom toolbar to Quill
    }
  };

  return (
    <Box p={4}>
      <Toaster position="bottom-right" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Select Doctor and Create Agreement
          </Typography>
        </Grid>

        {/* Dropdown for selecting doctor */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Preferred Doctor"
            value={selectedDoctor}
            onChange={(event) => setSelectedDoctor(event.target.value)}
            placeholder="Select a doctor"
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
            placeholder="Enter title"
            label="Agreement Title"
            variant="outlined"
            disabled={!selectedDoctor} // Disable if no doctor is selected
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
            onChange={setContent}
            style={{ marginBottom: '20px', height: '300px' }}
            modules={quillModules} // Attach custom toolbar modules
          />
        </Grid>

        {/* Submit button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading || !title || !content || !selectedDoctor}
            fullWidth
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box my={4}>
        <Divider />
      </Box>

      {/* Conditionally show the AgreementTable if agreements exist */}
      {showTable && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>
                  Agreement Title
                </TableCell>
                {/* <TableCell align="right">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {agreements.map((agreement) => (
                <StyledTableRow key={agreement._id}>
                  <TableCell>{agreement.title}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleViewPdf(agreement.title, agreement.body)
                      }
                    >
                      View PDF
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TC;
