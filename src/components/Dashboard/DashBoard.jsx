import { Box, Button } from "@mui/material";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function DashBoard() {
  return (
    <Box sx={{ marginLeft: "300px", marginTop: 4 }}>
      <Toaster />
      <h5>Hospital DashBoard</h5>
    </Box>
  );
}
