// import React, { useState, useEffect } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CheckIcon from "@mui/icons-material/Check";
// import AddIcon from "@mui/icons-material/Add";
// import { toast, Toaster } from "react-hot-toast";
// import axios from "axios";
// import Loader from "../Loader/Loader";
// import { ApiUrl } from "../ApiUrl";

// const Account = () => {
//   const [user, setUser] = useState({
//     clientName: "",
//     profilePhoto: "",
//     officeLocations: [],
//   });
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [isEditingOffice, setIsEditingOffice] = useState(null);
//   const [isAddingLocation, setIsAddingLocation] = useState(false);
//   const [newLocation, setNewLocation] = useState("");
//   const [newTimeZone, setNewTimeZone] = useState("");
//   const [imagePreviewUrl, setImagePreviewUrl] = useState("");
//   const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     // Fetch user data from API
//     const token = localStorage.getItem("token");
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`${ApiUrl}/getClientDoctorDetails`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const firstName = response.data.client.client_firstName;
//         const lastName = response.data.client.client_lastName;
//         const fullName = `${firstName} ${lastName}`;

//         // Set the full name and other user data
//         setUser({
//           clientName: fullName,
//           profilePhoto: "", // or response.data.profilePhoto if available
//           officeLocations: [], // initialize or use response data if available
//         });
//         setImagePreviewUrl(response.data.profilePhoto || ""); // Assuming response.data.profilePhoto is available
//       } catch (error) {
//         toast.error("Failed to fetch user data");
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     formikProfile.setValues({
//       clientName: user.clientName,
//       profilePhoto: null, // Or user.profilePhoto if needed
//     });
//   }, [user.clientName]); // This will re-run when user.clientName changes

//   const validationSchemaProfile = Yup.object().shape({
//     clientName: Yup.string().required("Full name is required"),
//     imageUrl: Yup.mixed()
//       .test(
//         "fileSize",
//         "File size is too large, max size is 3MB",
//         (value) => !value || (value && value.size <= 3 * 1024 * 1024)
//       )
//       .test(
//         "fileType",
//         "Unsupported file type",
//         (value) =>
//           !value ||
//           (value &&
//             [
//               "image/jpeg",
//               "image/png",
//               "image/gif",
//               "image/webp",
//               "image/svg+xml",
//             ].includes(value.type))
//       ),
//   });

//   const formikProfile = useFormik({
//     initialValues: {
//       clientName: user.clientName,
//       profilePhoto: null,
//     },
//     validationSchema: validationSchemaProfile,
//     onSubmit: async (values) => {
//       console.log(values);

//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");

//         const formData = new FormData();
//         formData.append("clientName", values.clientName);

//         if (values.profilePhoto) {
//           formData.append("profilePhoto", values.profilePhoto);
//         }

//         const response = await axios.put(
//           `${ApiUrl}/adminProfile/updateProfilePhotoName`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         console.log("img res", response.data);

//         const { clientName, imageBase64 } = response.data;

//         setUser({
//           ...user,
//           clientName,
//           profilePhoto: imageBase64
//             ? `data:image/jpeg;base64,${imageBase64}`
//             : user.profilePhoto,
//         });

//         toast.success("Profile updated successfully!");
//         setIsEditingProfile(false);
//       } catch (error) {
//         toast.error("Failed to update profile");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   });

//   useEffect(() => {
//     if (user.profilePhoto) {
//       setImagePreviewUrl(user.profilePhoto);
//     }
//   }, [user.profilePhoto]);

//   const handleProfileEditToggle = () => {
//     setIsEditingProfile(!isEditingProfile);
//   };

//   const handleImageChange = (event) => {
//     const file = event.currentTarget.files[0];
//     formikProfile.setFieldValue("profilePhoto", file);

//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreviewUrl(previewUrl);
//     }
//   };

//   const handleAddLocation = () => {
//     if (newLocation && newTimeZone) {
//       setUser({
//         ...user,
//         officeLocations: [
//           ...user.officeLocations,
//           { id: Date.now(), location: newLocation, timeZone: newTimeZone },
//         ],
//       });
//       setNewLocation("");
//       setNewTimeZone("");
//       setIsAddingLocation(false);
//     } else {
//       toast.error("Both location and time zone are required");
//     }
//   };

//   const handleEditLocation = (index, field, value) => {
//     const updatedLocations = [...user.officeLocations];
//     updatedLocations[index] = {
//       ...updatedLocations[index],
//       [field]: value,
//     };
//     setUser({
//       ...user,
//       officeLocations: updatedLocations,
//     });
//   };

//   const handleSubmitAll = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post(
//         "/api/office",
//         {
//           officeLocations: user.officeLocations,
//         },
//         {
//           headers: {
//             Authorization: `Bearer YOUR_TOKEN_HERE`,
//           },
//         }
//       );
//       toast.success("All data submitted successfully!");
//     } catch (error) {
//       toast.error("Failed to submit data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOfficeEditToggle = (index) => {
//     setIsEditingOffice(index);
//   };

//   const handleDeleteOpen = (index) => {
//     setDeleteIndex(index);
//     setOpenDeleteConfirm(true);
//   };

//   const handleDeleteClose = () => {
//     setOpenDeleteConfirm(false);
//     setDeleteIndex(null);
//   };

//   const handleDeleteConfirm = async () => {
//     setIsLoading(true);
//     try {
//       await axios.delete(
//         `/api/office/${user.officeLocations[deleteIndex].id}`,
//         {
//           headers: {
//             Authorization: `Bearer YOUR_TOKEN_HERE`,
//           },
//         }
//       );

//       const updatedOffices = user.officeLocations.filter(
//         (_, i) => i !== deleteIndex
//       );
//       setUser({ ...user, officeLocations: updatedOffices });
//       toast.success("Office location deleted successfully!");
//     } catch (error) {
//       toast.error("Failed to delete office location");
//     } finally {
//       setIsLoading(false);
//       setOpenDeleteConfirm(false);
//       setDeleteIndex(null);
//     }
//   };

//   const handleOfficeSave = async (index) => {
//     setIsLoading(true);
//     try {
//       const updatedOffice = user.officeLocations[index];
//       await axios.put(`/api/office/${updatedOffice.id}`, updatedOffice, {
//         headers: {
//           Authorization: `Bearer YOUR_TOKEN_HERE`,
//         },
//       });
//       setIsEditingOffice(null);
//       toast.success("Office location updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update office location");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const getInitials = (clientName) => {
//     if (!clientName) return ""; // Return an empty string if clientName is undefined
//     const names = clientName.split(" ");
//     if (names.length > 1) {
//       return `${names[0][0]}${names[1][0]}`;
//     }
//     return names[0][0];
//   };

//   return (
//     <Box sx={{ ml: 35 }}>
//       <Container>
//         <Toaster position="top-center" />
//         <Typography variant="h4" gutterBottom>
//           Sample Hospital Name
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom>
//           Specialization of Hospital and about Institution
//         </Typography>

//         <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
//           <Box sx={{ position: "relative", mr: 2 }}>
//             <Avatar
//               sx={{ width: 100, height: 100 }} // Increased width and height
//               src={imagePreviewUrl}
//               alt={user.clientName}
//             >
//               {!imagePreviewUrl && getInitials(user.clientName)}
//             </Avatar>
//             <IconButton
//               sx={{
//                 position: "absolute",
//                 top: 0,
//                 right: 0,
//                 bgcolor: "rgba(255, 255, 255, 0.7)",
//               }}
//               size="small"
//               onClick={handleProfileEditToggle}
//             >
//               <EditIcon />
//             </IconButton>
//           </Box>
//           {isEditingProfile ? (
//             <form onSubmit={formikProfile.handleSubmit}>
//               <TextField
//                 label="Full Name"
//                 name="clientName"
//                 value={formikProfile.values.clientName}
//                 onChange={formikProfile.handleChange}
//                 error={
//                   formikProfile.touched.clientName &&
//                   Boolean(formikProfile.errors.clientName)
//                 }
//                 helperText={
//                   formikProfile.touched.clientName &&
//                   formikProfile.errors.clientName
//                 }
//                 variant="outlined"
//                 size="small"
//                 sx={{ mr: 2 }}
//               />
//               <input
//                 accept="image/*"
//                 id="image-upload"
//                 type="file"
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//                 className="image-upload"
//               />
//               <label htmlFor="image-upload">
//                 <Button
//                   variant="contained"
//                   component="span"
//                   sx={{
//                     mb: 2,
//                     color: "#ffff",
//                     background: "#407BFF",
//                     "&:hover": {
//                       color: "#ffff",
//                       background: "#12171e",
//                     },
//                   }}
//                 >
//                   Upload Image
//                 </Button>
//               </label>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 sx={{
//                   ml: 2,
//                   mb: 2,
//                   color: "#ffff",
//                   background: "#407BFF",
//                   "&:hover": {
//                     color: "#ffff",
//                     background: "#12171e",
//                     border: "1px solid #407BFF",
//                   },
//                 }}
//                 disabled={isLoading}
//               >
//                 Save
//               </Button>
//             </form>
//           ) : (
//             <Typography variant="h6">{user.clientName}</Typography>
//           )}
//         </Box>

//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Office Locations
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setIsAddingLocation(true)}
//             startIcon={<AddIcon />}
//             sx={{
//               mb: 2,
//               color: "#ffff",
//               background: "#407BFF",
//               "&:hover": {
//                 color: "#ffff",
//                 background: "#12171e",
//               },
//             }}
//           >
//             Add Location
//           </Button>
//           {isAddingLocation && (
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Location"
//                 value={newLocation}
//                 onChange={(e) => setNewLocation(e.target.value)}
//                 variant="outlined"
//                 size="small"
//                 sx={{ mr: 1 }}
//               />
//               <TextField
//                 label="Time Zone"
//                 value={newTimeZone}
//                 onChange={(e) => setNewTimeZone(e.target.value)}
//                 variant="outlined"
//                 size="small"
//                 sx={{ mr: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleAddLocation}
//                 sx={{
//                   mb: 2,
//                   color: "#ffff",
//                   background: "#407BFF",
//                   "&:hover": {
//                     color: "#ffff",
//                     background: "#12171e",
//                   },
//                 }}
//               >
//                 Add Location
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 sx={{
//                   ml: 1,
//                   mb: 2,
//                   color: "#ffff",
//                   background: "#407BFF",
//                   "&:hover": {
//                     color: "#ffff",
//                     background: "#12171e",
//                     border: "1px solid #407BFF",
//                   },
//                 }}
//                 onClick={() => setIsAddingLocation(false)}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           )}

//           <TableContainer component={Paper} sx={{ mt: 2 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{bgcolor:"grey"}}>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Location</TableCell>
//                   <TableCell>Time Zone</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {user.officeLocations.map((office, index) => (
//                   <TableRow key={office.id}>
//                     <TableCell>{office.id}</TableCell>
//                     <TableCell>
//                       {isEditingOffice === index ? (
//                         <TextField
//                           value={office.location}
//                           onChange={(e) =>
//                             handleEditLocation(
//                               index,
//                               "location",
//                               e.target.value
//                             )
//                           }
//                           variant="outlined"
//                           size="small"
//                         />
//                       ) : (
//                         office.location
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {isEditingOffice === index ? (
//                         <TextField
//                           value={office.timeZone || ""}
//                           onChange={(e) =>
//                             handleEditLocation(
//                               index,
//                               "timeZone",
//                               e.target.value
//                             )
//                           }
//                           variant="outlined"
//                           size="small"
//                         />
//                       ) : (
//                         office.timeZone || "N/A"
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {isEditingOffice === index ? (
//                         <IconButton
//                           color="primary"
//                           onClick={() => handleOfficeSave(index)}
//                         >
//                           <CheckIcon />
//                         </IconButton>
//                       ) : (
//                         <>
//                           <Tooltip title="Edit">
//                             <IconButton
//                               color="primary"
//                               onClick={() => handleOfficeEditToggle(index)}
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               onClick={() => handleDeleteOpen(index)}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>

//         <Dialog
//           open={openDeleteConfirm}
//           onClose={handleDeleteClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">
//             {"Confirm Deletion"}
//           </DialogTitle>
//           <DialogContent>
//             <Typography>
//               Are you sure you want to delete this office location?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDeleteClose}>Cancel</Button>
//             <Button onClick={handleDeleteConfirm} color="error">
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Box sx={{ mt: 4 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmitAll}
//             disabled={isLoading}
//           >
//             Submit All
//           </Button>
//         </Box>
//       </Container>
//       {isLoading && <Loader />}
//     </Box>
//   );
// };
// export default Account;


import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader/Loader";
import { ApiUrl } from "../ApiUrl";

const Account = () => {
  const [user, setUser] = useState({
    clientName: "",
    profilePhoto: "",
    officeLocations: [],
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingOffice, setIsEditingOffice] = useState(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newTimeZone, setNewTimeZone] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/getClientDoctorDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const imageUrl = response.data.clientProfile[0].profilePhoto
          ? `data:image/jpeg;base64,${response.data.clientProfile[0].profilePhoto}`
          : "";

        setUser({
          clientName: response.data.clientProfile[0].clientName,
          profilePhoto: imageUrl,
          officeLocations: response.data.clientProfile[0].officeLocations || [],
        });
        setImagePreviewUrl(imageUrl || "");
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    formikProfile.setValues({
      clientName: user.clientName,
      profilePhoto: null,
    });
  }, [user.clientName]);

  const validationSchemaProfile = Yup.object().shape({
    clientName: Yup.string().required("Full name is required"),
    profilePhoto: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, max size is 3MB",
        (value) => !value || (value && value.size <= 3 * 1024 * 1024)
      )
      .test(
        "fileType",
        "Unsupported file type",
        (value) =>
          !value ||
          (value &&
            [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
              "image/svg+xml",
            ].includes(value.type))
      ),
  });

  const formikProfile = useFormik({
    initialValues: {
      clientName: user.clientName,
      profilePhoto: null,
    },
    validationSchema: validationSchemaProfile,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("clientName", values.clientName);

        if (values.profilePhoto) {
          formData.append("profilePhoto", values.profilePhoto);
        }
        const response = await axios.put(
          `${ApiUrl}/adminProfile/updateProfilePhotoName`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const imageUrl = response.data.imageBase64
          ? `data:image/jpeg;base64,${response.data.imageBase64}`
          : user.profilePhoto;

        setUser({
          ...user,
          clientName: response.data.clientName,
          profilePhoto: imageUrl,
        });

        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (user.profilePhoto) {
      setImagePreviewUrl(user.profilePhoto);
    }
  }, [user.profilePhoto]);

  const handleProfileEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formikProfile.setFieldValue("profilePhoto", file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleAddLocation = () => {
    if (newLocation && newTimeZone) {
      setUser({
        ...user,
        officeLocations: [
          ...user.officeLocations,
          { id: Date.now(), location: newLocation, timeZone: newTimeZone },
        ],
      });
      setNewLocation("");
      setNewTimeZone("");
      setIsAddingLocation(false);
    } else {
      toast.error("Both location and time zone are required");
    }
  };

  const handleEditLocation = (index, field, value) => {
    const updatedLocations = [...user.officeLocations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value,
    };
    setUser({
      ...user,
      officeLocations: updatedLocations,
    });
  };

  const handleSubmitAll = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${ApiUrl}/adminProfile/updateProfile`,
        {
          officeLocations: user.officeLocations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("All data submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfficeEditToggle = (index) => {
    setIsEditingOffice(index);
  };

  const handleDeleteOpen = (index) => {
    setDeleteIndex(index);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${ApiUrl}/office/${user.officeLocations[deleteIndex].id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOffices = user.officeLocations.filter(
        (_, i) => i !== deleteIndex
      );
      setUser({ ...user, officeLocations: updatedOffices });
      toast.success("Office location deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete office location");
    } finally {
      setIsLoading(false);
      setOpenDeleteConfirm(false);
      setDeleteIndex(null);
    }
  };

  const handleOfficeSave = async (index) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const updatedOffice = user.officeLocations[index];
      await axios.put(`${ApiUrl}/office/${updatedOffice.id}`, updatedOffice, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditingOffice(null);
      toast.success("Office location updated successfully!");
    } catch (error) {
      toast.error("Failed to update office location");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (clientName) => {
    if (!clientName) return "";
    const names = clientName.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0][0];
  };

  return (
    <Box sx={{ ml: 35 }}>
      <Container>
        <Toaster position="top-center" />
        <Typography variant="h4" gutterBottom>
          Sample Hospital Name
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Specialization of Hospital and about Institution
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Box sx={{ position: "relative", mr: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={imagePreviewUrl}
              alt={user.clientName}
            >
              {!imagePreviewUrl && getInitials(user.clientName)}
            </Avatar>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                },
              }}
              size="small"
              onClick={handleProfileEditToggle}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="h6">{user.clientName}</Typography>
        </Box>

        {isEditingProfile && (
          <Box
            component="form"
            onSubmit={formikProfile.handleSubmit}
            sx={{ mt: 4 }}
          >
            <TextField
              fullWidth
              margin="normal"
              id="clientName"
              name="clientName"
              label="Full Name"
              value={formikProfile.values.clientName}
              onChange={formikProfile.handleChange}
              error={
                formikProfile.touched.clientName &&
                Boolean(formikProfile.errors.clientName)
              }
              helperText={
                formikProfile.touched.clientName &&
                formikProfile.errors.clientName
              }
            />
            <input
              accept="image/*"
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="profilePhoto">
              <Button variant="outlined" color="primary" component="span">
                {formikProfile.values.profilePhoto
                  ? "Change Profile Photo"
                  : "Upload Profile Photo"}
              </Button>
            </label>
            {formikProfile.errors.profilePhoto && (
              <Typography color="error" variant="body2">
                {formikProfile.errors.profilePhoto}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleProfileEditToggle}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Office Locations</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Time Zone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.officeLocations.map((office, index) => (
                  <TableRow key={office.id}>
                    <TableCell>
                      {isEditingOffice === index ? (
                        <TextField
                          value={office.location}
                          onChange={(e) =>
                            handleEditLocation(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        office.location
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditingOffice === index ? (
                        <TextField
                          value={office.timeZone}
                          onChange={(e) =>
                            handleEditLocation(
                              index,
                              "timeZone",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        office.timeZone
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditingOffice === index ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton onClick={() => handleOfficeSave(index)}>
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              onClick={() => setIsEditingOffice(null)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOfficeEditToggle(index)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteOpen(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isAddingLocation ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                sx={{ mr: 2 }}
              />
              <TextField
                label="Time Zone"
                value={newTimeZone}
                onChange={(e) => setNewTimeZone(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddLocation}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsAddingLocation(false)}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<AddIcon />}
              onClick={() => setIsAddingLocation(true)}
            >
              Add Location
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSubmitAll}>
            Submit All Data
          </Button>
        </Box>

        <Dialog
          open={openDeleteConfirm}
          onClose={handleDeleteClose}
          aria-labelledby="delete-confirm-dialog-title"
        >
          <DialogTitle id="delete-confirm-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this office location?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {isLoading && <Loader />}
      </Container>
    </Box>
  );
};

export default Account;
