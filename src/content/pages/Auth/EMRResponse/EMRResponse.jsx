import React, { useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { Link } from "react-router-dom";
import AuthContext from "src/contexts/AuthContext";
import EmrBg from "../../../../assets/EmrBg.jpg";

function EMRResponse() {
  const { openDialog2 } = useContext(AuthContext);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${EmrBg})`, // Add your image path here
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dialog for Open Dialog */}
      <Dialog open={openDialog2} maxWidth="xs">
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
            textAlign: "center",
            fontWeight: "bold",
            mt: 2,
          }}
        >
          Configure Your EMR First!
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {/* Yellow Error Icon */}
            <ErrorIcon sx={{ color: "#f2c94c", fontSize: 50 }} />

            {/* Text Content */}
            <Typography variant="h6" sx={{ margin: "20px 0" }}>
              The Siddha PI web app must integrate with an EMR system to
              efficiently manage and expand the patient intake process.
            </Typography>

            {/* Button */}
            <Link
              to="/account/emr-configure"
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="primary">
                Configure
              </Button>
            </Link>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default EMRResponse;
