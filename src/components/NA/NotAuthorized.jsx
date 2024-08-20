import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import NA from "../../assets/NA.svg";

export default function NotAuthorized() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: `url(${NA}) no-repeat center`,
          backgroundSize: "contain",
          width: "100%",
          maxWidth: "400px",
          height: "300px",
        }}
      ></div>
      <div style={{ marginTop: "20px" }}>Sorry, You are Not Authorized</div>
      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: "#407bff",
          "&:hover": {
            backgroundColor: "#12171e",
            transition: "background-color 0.3s ease",
          },
        }}
      >
        <Link
          to="/admin-signin"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Sign In
        </Link>
      </Button>
    </div>
  );
}
