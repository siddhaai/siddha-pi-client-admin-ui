import React from "react";
import NotFoundImage from "../../assets/404.svg";
import { Button } from "@mui/material";
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={NotFoundImage}
        style={{ width: "600px", height: "auto" }}
        alt="Page Not Found"
      />
      <Button
        component="a"
        href="/drchrono/doctor/home"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: "#407bff",
          "&:hover": {
            backgroundColor: "#12171e",
            transition: "background-color 0.3s ease",
          },
        }}
      >
        Go to home
      </Button>
    </div>
  );
}
