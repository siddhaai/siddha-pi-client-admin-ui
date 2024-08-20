import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SidebarContent from "./SidebarContent";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

const drawerWidth = 243;

// const loaderStyles = `
// .loader {
//   width: 40px;
//   height: 40px;
//   position: relative;
//   --c: no-repeat linear-gradient(#407bff 0 0);
//   background: var(--c) center/100% 10px, var(--c) center/10px 100%;
// }

// .loader:before {
//   content: "";
//   position: absolute;
//   inset: 0;
//   background: var(--c) 0 0, var(--c) 100% 0, var(--c) 0 100%, var(--c) 100% 100%;
//   background-size: 15.5px 15.5px;
//   animation: l16 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
// }

// @keyframes l16 {
//   33% {
//     inset: -10px;
//     transform: rotate(0deg);
//   }
//   66% {
//     inset: -10px;
//     transform: rotate(90deg);
//   }
//   100% {
//     inset: 0;
//     transform: rotate(90deg);
//   }
// }

// .loader-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 9999;
// }
// `;

const NavSideBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false); // State for collapsing
  const [loading, setLoading] = useState(false); // State for loader
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 960px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    handleMenuClose();
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setLoading(false);
      navigate("/admin-signin");
      toast.success("Logout successful!");
    }, 2000); // Simulating a delay for the loader animation
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && <Loader />}
      <AppBar
        position="fixed"
        sx={{
          background: "#12171e",
          position: "fixed",
          overflow: "auto",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {t("responsiveSidebar")}
          </Typography>
          <Tooltip title={t("language")}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <GTranslateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("logout")}>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleLanguageChange("en")}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("es")}>
              Spanish
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("zh")}>
              Chinese
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("tl")}>
              Tagalog
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("vi")}>
              Vietnamese
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("fr")}>
              French
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <SidebarContent handleToggle={handleToggle} open={open} />
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NavSideBar;
