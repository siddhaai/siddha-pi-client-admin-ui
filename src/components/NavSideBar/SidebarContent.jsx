import DashboardIcon from "@mui/icons-material/Dashboard";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PersonAdd from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import { ReactComponent as FormIcon } from "../../assets/existingpatient.svg";

const SidebarContent = ({ handleToggle, open }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);

    const target = e.currentTarget;
    if (!target || !target.href) {
      console.error("Link is null or href is missing");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      navigate(target.getAttribute("href"));
    }, 2000); // Adjust the timeout as needed
  };

  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: theme === "dark" ? "#12171e" : "#fff",
          color: theme === "dark" ? "#fff" : "#12171e",
          position: "fixed",
          height: "100vh",
        }}
      >
        <Avatar
          alt="John Doe"
          src="https://via.placeholder.com/100"
          sx={{ width: 100, height: 100, my: 2 }}
        />
        <Typography variant="h6">John Doe</Typography>
        <Typography variant="body2" color="grey">
          john@siddha.com
        </Typography>
        <Divider sx={{ my: 2, width: "100%" }} />

        {/* <IconButton
          onClick={toggleTheme}
          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
        >
          {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>  */}

        <List sx={{ padding: "5px" }}>
          {/* Home */}
          {/* <ListItem
            component="a"
            onClick={handleClick}
            href="/drchrono/doctor/home"
            className={isActive("/drchrono/doctor/home") ? "active" : ""}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("home")} />
          </ListItem> */}
          {/* Dashboard */}
          <ListItem
            component="a"
            onClick={handleClick}
            href="/"
            className={isActive("/") ? "active" : ""}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",

              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={t("dashboard")} />
          </ListItem>

          {/* accounts */}
          <ListItem
            component="a"
            href="/drchrono/profile"
            onClick={handleClick}
            className={isActive("/drchrono/profile") ? "active" : ""}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={t("Profile")} />
          </ListItem>

          {/* add Doctor */}
          <ListItem
            component="a"
            href="/drchrono/addDoctor"
            onClick={handleClick}
            className={isActive("/drchrono/addDoctor") ? "active" : ""}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={t("Add Doctor")} />
          </ListItem>

          {/* Patient Intake Form */}
          <ListItem
            onClick={handleToggle}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <FormIcon style={{ fill: theme === "dark" ? "#fff" : "#000" }} />
            </ListItemIcon>
            <ListItemText primary={t("Patient Intake")} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component="a"
                href="/patient-intake/drchrono/patient-create"
                onClick={handleClick}
                className={
                  isActive("/patient-intake/drchrono/patient-create")
                    ? "active"
                    : ""
                }
                sx={{
                  pl: 4,
                  color: theme === "dark" ? "#fff" : "#000",
                  "&:hover": {
                    backgroundColor: "#407bff",
                    borderRadius: "15px",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                >
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary={t("New patient")} />
              </ListItem>
              <ListItem
                component="a"
                onClick={handleClick}
                href="/patient-intake/drchrono/existing-patient"
                className={
                  isActive("/patient-intake/drchrono/existing-patient")
                    ? "active"
                    : ""
                }
                sx={{
                  pl: 4,
                  color: theme === "dark" ? "#fff" : "#000",
                  "&:hover": {
                    backgroundColor: "#407bff",
                    borderRadius: "15px",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={t("Existing patient")} />
              </ListItem>
            </List>
          </Collapse>

          {/* Custom form  */}
          <ListItem
            component="a"
            href="/drchrono/doctor/custom-form"
            onClick={handleClick}
            className={isActive("/drchrono/doctor/custom-form") ? "active" : ""}
            sx={{
              color: theme === "dark" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }}>
              <DynamicFormIcon />
            </ListItemIcon>
            <ListItemText primary={t("Custom Form")} />
          </ListItem>

          {/* <ListItem
            component="a"
            href="#addExistingPatient"
            onClick={handleClick}
            className={isActive("#addExistingPatient") ? "active" : ""}
            sx={{
              color: theme === 'dark' ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#407bff",
                borderRadius: "15px",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme === 'dark' ? "#fff" : "#000" }}>
              <FormIcon style={{ fill: theme === 'dark' ? "#fff" : "#000" }} />
            </ListItemIcon>
            <ListItemText primary={t("addExistingPatient")} />
          </ListItem> */}
        </List>
      </Box>
    </div>
  );
};

export default SidebarContent;
