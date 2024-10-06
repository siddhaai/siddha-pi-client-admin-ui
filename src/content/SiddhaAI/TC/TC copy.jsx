// import React, { useState, useEffect, useCallback } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { toast, Toaster } from 'react-hot-toast';
// import {
//   Grid,
//   MenuItem,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Divider,
//   Box
// } from '@mui/material';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas'; // Import html2canvas for converting HTML to canvas
// import useAxiosInterceptor from 'src/contexts/Interceptor';
// import { styled } from '@mui/material/styles'; // For hover effects
// import 'react-quill/dist/quill.snow.css';

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover, // Add hover effect
//     cursor: 'pointer'
//   }
// }));

// // Custom Toolbar component
// const CustomToolbar = () => (
//   <div id="toolbar-container">
//     <span className="ql-formats">
//       <select className="ql-font"></select>
//       <select className="ql-size"></select>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-bold"></button>
//       <button className="ql-italic"></button>
//       <button className="ql-underline"></button>
//       <button className="ql-strike"></button>
//     </span>
//     <span className="ql-formats">
//       <select className="ql-color"></select>
//       <select className="ql-background"></select>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-script" value="sub"></button>
//       <button className="ql-script" value="super"></button>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-header" value="1"></button>
//       <button className="ql-header" value="2"></button>
//       <button className="ql-blockquote"></button>
//       <button className="ql-code-block"></button>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-list" value="ordered"></button>
//       <button className="ql-list" value="bullet"></button>
//       <button className="ql-indent" value="-1"></button>
//       <button className="ql-indent" value="+1"></button>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-direction" value="rtl"></button>
//       <select className="ql-align"></select>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-link"></button>
//       {/* <button className="ql-image"></button> */}
//       {/* <button className="ql-video"></button> */}
//       <button className="ql-formula"></button>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-clean"></button>
//     </span>
//   </div>
// );

// const TC = () => {
//   const { axios } = useAxiosInterceptor();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [agreements, setAgreements] = useState([]); // Store agreements
//   const [isLoading, setIsLoading] = useState(false);
//   const [showTable, setShowTable] = useState(false); // Control table visibility based on agreement length

//   const token = localStorage.getItem('token');

//   // Fetch doctors
//   const fetchDoctors = useCallback(async () => {
//     try {
//       const response = await axios.get(`/drchronoDoctorDetails`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const { drchronoDoctoresDetail } = response.data;
//       if (drchronoDoctoresDetail && drchronoDoctoresDetail.results) {
//         setDoctors(drchronoDoctoresDetail.results);
//       } else {
//         toast.error('Unexpected data structure from API');
//       }
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       toast.error('Error fetching doctors');
//     }
//   }, [axios, token]);

//   // Fetch agreements and set the table visibility
//   const fetchAgreements = useCallback(async () => {
//     setIsLoading(true);

//     try {
//       const response = await axios.get('/agreement/getAgreementClientAdmin', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log('Agreement response', response);

//       if (response.data.status === 200) {
//         setIsLoading(false);
//         setAgreements(response.data.data); // Store agreements
//         setShowTable(response.data.data.length > 0); // Only show table if agreements exist
//       } else {
//         toast.error('Failed to fetch agreements');
//       }
//     } catch (error) {
//       console.error('Error fetching agreements:', error);
//       toast.error('Error fetching agreements');
//     }
//   }, [axios, token]);

//   useEffect(() => {
//     fetchDoctors();
//     fetchAgreements(); // Fetch agreements on mount
//   }, [fetchDoctors, fetchAgreements]);

//   const handleSubmit = async () => {
//     if (!selectedDoctor) {
//       toast.error('Please select a doctor');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         '/agreement',
//         {
//           title,
//           body: content,
//           emr_doctorId: selectedDoctor
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (response.status === 201) {
//         toast.success('Agreement created successfully');
//         fetchAgreements(); // Refresh the agreements after successful submission
//       }
//     } catch (error) {
//       console.error('Error submitting the content:', error);
//       toast.error('Error creating agreement');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper function to process HTML and generate PDF content
//   const processHtmlForPdf = (html, pdf, startY) => {
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = html;

//     let currentY = startY;

//     const traverseNodes = (node) => {
//       if (currentY > 270) {
//         // New page if content exceeds available height
//         pdf.addPage();
//         currentY = 20;
//       }

//       const text = node.textContent.trim();
//       if (!text) return;

//       switch (node.nodeName.toLowerCase()) {
//         case 'h1':
//           pdf.setFontSize(20);
//           pdf.setFont('helvetica', 'bold');
//           currentY += 12;
//           pdf.text(text, 10, currentY);
//           currentY += 20;
//           break;
//         case 'h2':
//           pdf.setFontSize(16);
//           pdf.setFont('helvetica', 'bold');
//           currentY += 10;
//           pdf.text(text, 10, currentY);
//           currentY += 15;
//           break;
//         case 'p':
//           pdf.setFontSize(12);
//           pdf.setFont('helvetica', 'normal');
//           const lines = pdf.splitTextToSize(text, 180);
//           lines.forEach((line) => {
//             pdf.text(line, 10, currentY);
//             currentY += 7;
//           });
//           currentY += 10;
//           break;
//         case 'li':
//           pdf.setFontSize(12);
//           pdf.setFont('helvetica', 'normal');
//           pdf.text(`• ${text}`, 15, currentY); // Indent list items
//           currentY += 7;
//           break;
//         case 'a':
//           if (node.href) {
//             pdf.setTextColor(0, 0, 255); // Blue for links
//             pdf.textWithLink(text, 10, currentY, { url: node.href });
//             pdf.setTextColor(0, 0, 0); // Reset text color after the link
//           }
//           currentY += 7;
//           break;
//         default:
//           if (node.childNodes) {
//             node.childNodes.forEach(traverseNodes);
//           }
//           break;
//       }
//     };

//     tempDiv.childNodes.forEach(traverseNodes);
//     return currentY;
//   };

//   // const handleViewPdf = (title, body) => {
//   //   console.log(title, body);

//   //   const container = document.createElement('div');
//   //   container.innerHTML = body; // Use the body content as HTML

//   //   document.body.appendChild(container); // Add the container to the DOM temporarily

//   //   html2canvas(container, { useCORS: true })
//   //     .then((canvas) => {
//   //       const pdf = new jsPDF('p', 'mm', 'a4');
//   //       const imgWidth = 210; // A4 width in mm
//   //       const pageHeight = 295; // A4 height in mm
//   //       const margin = 15; // Margin on all sides
//   //       const lineHeight = 10; // Space between title and body

//   //       // Add title at the top and center it
//   //       pdf.setFontSize(16);
//   //       pdf.text(title, pdf.internal.pageSize.getWidth() / 2, margin, {
//   //         align: 'center'
//   //       });

//   //       const imgHeight =
//   //         (canvas.height * (imgWidth - 2 * margin)) / canvas.width; // Adjust for margins
//   //       let heightLeft = imgHeight;
//   //       let position = margin + lineHeight; // Position below the title with extra space

//   //       // Add the body image below the title with margins
//   //       pdf.addImage(
//   //         canvas,
//   //         'PNG',
//   //         margin,
//   //         position,
//   //         imgWidth - 2 * margin,
//   //         imgHeight
//   //       );
//   //       heightLeft -= pageHeight - margin;

//   //       while (heightLeft >= 0) {
//   //         position = heightLeft - imgHeight + margin;
//   //         pdf.addPage();
//   //         pdf.addImage(
//   //           canvas,
//   //           'PNG',
//   //           margin,
//   //           position,
//   //           imgWidth - 2 * margin,
//   //           imgHeight
//   //         );
//   //         heightLeft -= pageHeight - margin;
//   //       }

//   //       const pdfUrl = pdf.output('bloburl'); // Get the PDF URL as a blob
//   //       window.open(pdfUrl); // Open the PDF in a new tab
//   //     })
//   //     .catch((error) => {
//   //       console.error('Error generating PDF:', error);
//   //       toast.error('Failed to generate PDF');
//   //     })
//   //     .finally(() => {
//   //       document.body.removeChild(container); // Remove the container after processing
//   //     });
//   // };

//   const handleViewPdf = (title, body) => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     let startY = 20;

//     // Set the PDF title
//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(title, 10, startY);
//     startY += 15;

//     // Process the body content and add it to the PDF
//     processHtmlForPdf(body, pdf, startY);

//     // Generate the PDF as a Blob URL
//     const pdfBlob = pdf.output('blob');
//     const pdfUrl = URL.createObjectURL(pdfBlob);

//     // Create a new window with a custom title
//     const newWindow = window.open('', '_blank');
//     if (newWindow) {
//       // Set the title of the new window
//       newWindow.document.title = title;

//       // Embed the PDF using an iframe for better control over the appearance
//       newWindow.document.body.innerHTML = `
//         <iframe width="100%" height="100%" style="border:none;" src="${pdfUrl}"></iframe>
//       `;

//       // Optionally, you can style the window or iframe further if needed
//     } else {
//       console.error('Failed to open the new window');
//     }
//   };

//   // Quill editor modules with custom toolbar
//   const quillModules = {
//     toolbar: {
//       container: '#toolbar-container' // Attach the custom toolbar to Quill
//     }
//   };

//   return (
//     <Box p={4}>
//       <Toaster position="bottom-right" />
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Typography variant="h5" gutterBottom>
//             Select Doctor and Create Agreement
//           </Typography>
//         </Grid>

//         {/* Dropdown for selecting doctor */}
//         <Grid item xs={12} sm={6}>
//           <TextField
//             select
//             fullWidth
//             label="Preferred Doctor"
//             value={selectedDoctor}
//             onChange={(event) => setSelectedDoctor(event.target.value)}
//             placeholder="Select a doctor"
//             variant="outlined"
//           >
//             {doctors?.map((doctor) => (
//               <MenuItem key={doctor?.id} value={doctor?.id}>
//                 {`${doctor?.first_name} ${doctor?.last_name}`}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>

//         {/* Title input */}
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter title"
//             label="Agreement Title"
//             variant="outlined"
//             disabled={!selectedDoctor} // Disable if no doctor is selected
//           />
//         </Grid>

//         {/* Custom toolbar */}
//         <Grid item xs={12}>
//           <CustomToolbar />
//         </Grid>

//         {/* Content editor */}
//         <Grid item xs={12}>
//           <ReactQuill
//             value={content}
//             onChange={setContent}
//             style={{ marginBottom: '20px', height: '300px' }}
//             modules={quillModules} // Attach custom toolbar modules
//           />
//         </Grid>

//         {/* Submit button */}
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//             disabled={isLoading || !title || !content || !selectedDoctor}
//             fullWidth
//           >
//             {isLoading ? 'Submitting...' : 'Submit'}
//           </Button>
//         </Grid>
//       </Grid>

//       {/* Divider */}
//       <Box my={4}>
//         <Divider />
//       </Box>

//       {/* Conditionally show the AgreementTable if agreements exist */}
//       {showTable && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ textAlign: 'center' }}>
//                   Agreement Title
//                 </TableCell>
//                 {/* <TableCell align="right">Actions</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {agreements.map((agreement) => (
//                 <StyledTableRow key={agreement._id}>
//                   <TableCell>{agreement.title}</TableCell>
//                   <TableCell align="right">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() =>
//                         handleViewPdf(agreement.title, agreement.body)
//                       }
//                     >
//                       View PDF
//                     </Button>
//                   </TableCell>
//                 </StyledTableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default TC;
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
import useAxiosInterceptor from 'src/contexts/Interceptor';
import { styled } from '@mui/material/styles'; // For hover effects

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
        toast.error('Unexpected data structure from API');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Error fetching doctors');
    }
  }, [axios, token]);

  const fetchAgreements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/agreement/getAgreementClientAdmin', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        setIsLoading(false);
        setAgreements(response.data.data);
        setShowTable(response.data.data.length > 0);
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
      toast.error('Please select a doctor');
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
          toast.success('Agreement updated successfully');
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
          toast.success('Agreement created successfully');
          fetchAgreements();
          setTitle('');
          setContent('');
          setSelectedDoctor('');
        }
      }
    } catch (error) {
      console.error('Error submitting the content:', error);
      toast.error('Error creating or updating agreement');
    } finally {
      setIsLoading(false);
    }
  };

  const processHtmlForPdf = (html, pdf, startY) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let currentY = startY;

    const traverseNodes = (node) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = 20;
      }

      const text = node.textContent.trim();
      if (!text) return;

      switch (node.nodeName.toLowerCase()) {
        case 'h1':
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          currentY += 12;
          pdf.text(text, 10, currentY);
          currentY += 20;
          break;
        case 'h2':
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          currentY += 10;
          pdf.text(text, 10, currentY);
          currentY += 15;
          break;
        case 'p':
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          const lines = pdf.splitTextToSize(text, 180);
          lines.forEach((line) => {
            pdf.text(line, 10, currentY);
            currentY += 7;
          });
          currentY += 10;
          break;
        case 'li':
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`• ${text}`, 15, currentY);
          currentY += 7;
          break;
        case 'a':
          if (node.href) {
            pdf.setTextColor(0, 0, 255);
            pdf.textWithLink(text, 10, currentY, { url: node.href });
            pdf.setTextColor(0, 0, 0);
          }
          currentY += 7;
          break;
        default:
          if (node.childNodes) {
            node.childNodes.forEach(traverseNodes);
          }
          break;
      }
    };

    tempDiv.childNodes.forEach(traverseNodes);
    return currentY;
  };

  const handleViewPdf = (title, body) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let startY = 20;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 10, startY);
    startY += 15;

    processHtmlForPdf(body, pdf, startY);

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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {editMode ? 'Edit Agreement' : 'Select Doctor and Create Agreement'}
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
            disabled={!selectedDoctor}
          />
        </Grid>

        {/* Custom toolbar */}
        <Grid item xs={12}>
          <CustomToolbar disabled={!selectedDoctor} />
        </Grid>

        {/* Content editor */}
        <Grid item xs={12}>
          <ReactQuill
            disabled={!selectedDoctor}
            value={content}
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
            // fullWidth
          >
            {isLoading
              ? editMode
                ? 'Updating...'
                : 'Submitting...'
              : editMode
              ? 'Update'
              : 'Submit'}
          </Button>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box my={4}>
        <Divider />
      </Box>

      {/* Conditionally show the AgreementTable if agreements exist */}
      {showTable && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={10}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 450 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Agreement Title</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agreements.map((agreement) => (
                    <StyledTableRow key={agreement._id}>
                      <TableCell align="center">{agreement.title}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleViewPdf(agreement.title, agreement.body)
                          }
                        >
                          View PDF
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEditAgreement(agreement)}
                          style={{ marginLeft: '8px' }} // Add spacing
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TC;
