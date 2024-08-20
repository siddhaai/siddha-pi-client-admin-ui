// export default SmsForm;
import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  CssBaseline,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const ExistingPatientSmsForm = ({ onSubmit, smsText }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(smsText);
    toast.success("SMS copied Successfully");
  };

  return (
    <Grid
      container
      component="main"
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Toaster />
      <CssBaseline />

      <Grid item xs={12} sm={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Send SMS
          </Typography>
          <Box component="div" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <textarea
                  rows={10}
                  cols={70}
                  id="smsText"
                  name="smsText"
                  type="text"
                  value={smsText}
                  disabled={!smsText}
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {smsText && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCopy}
                      sx={{
                        mb: 2,
                        color: "#ffff",
                        background: "#407BFF",
                        "&:hover": {
                          color: "#ffff",
                          background: "#12171e",
                          border: "1px solid #407BFF",
                        },
                      }}
                    >
                      <ContentCopyIcon />
                      Copy Text
                    </Button>
                    {/* <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mb: 2,
                        color: "#ffff",
                        background: "#407BFF",
                        "&:hover": {
                          color: "#ffff",
                          background: "#12171e",
                          border: "1px solid #407BFF",
                        },
                      }}
                    > */}
                    <Link to="/">
                      <Button
                        sx={{
                          mb: 2,
                          color: "#ffff",
                          background: "#407BFF",
                          "&:hover": {
                            color: "#ffff",
                            background: "#12171e",
                            border: "1px solid #407BFF",
                          },
                        }}
                      >
                        Patient Intake
                      </Button>
                    </Link>
                    {/* </Button> */}
                  </Grid>
                )}
                <Button
                  onClick={onSubmit}
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    color: "#ffff",
                    background: "#407BFF",
                    "&:hover": {
                      color: "#ffff",
                      background: "#12171e",
                    },
                  }}
                >
                  Send SMS
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExistingPatientSmsForm;
