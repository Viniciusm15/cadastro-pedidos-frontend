"use client";

import SideDrawer from "../../components/SideDrawer/SideDrawer";
import "../../styles/base/pages/adminLayout.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ open }) => ({
    ...{
      flexGrow: 1,
      padding: "24px",
      marginLeft: "-240px",
      marginTop: "64px",
      transition: "margin 0.3s ease-out",
    },
    ...(open && {
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  ...{
    transition: "margin 0.3s ease-out, width 0.3s ease-out",
  },
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  }),
}));

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [state, setState] = useState({
    open: false,
    selectedText: "Dashboard",
  });

  const menuIcons = useMemo(
    () => [
      <DashboardIcon />,
      <CategoryIcon />,
      <PeopleIcon />,
      <AssignmentIcon />,
    ],
    [],
  );

  const menuItems = useMemo(
    () => ["Dashboard", "Categories", "Clients", "Orders"],
    [],
  );

  const handleDrawerOpen = () => {
    setState((prevState) => ({ ...prevState, open: true }));
  };

  const handleDrawerClose = () => {
    setState((prevState) => ({ ...prevState, open: false }));
  };

  const handleMenuItemClick = (text) => {
    setState((prevState) => ({ ...prevState, selectedText: text }));
    switch (text) {
      case "Dashboard":
        router.push("/admin");
        break;
      case "Categories":
        router.push("/admin/categories");
        break;
      case "Clients":
        router.push("/admin/clients");
        break;
      case "Orders":
        router.push("/admin/orders");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={state.open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(state.open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {state.selectedText}
          </Typography>
        </Toolbar>
      </AppBar>
      <SideDrawer
        open={state.open}
        handleDrawerClose={handleDrawerClose}
        menuItems={menuItems}
        menuIcons={menuIcons}
        onMenuItemClick={handleMenuItemClick}
        selectedText={state.selectedText}
      />
      <Main open={state.open}>
        <div style={{ paddingTop: "20px" }}>{children}</div>
      </Main>
    </Box>
  );
}
