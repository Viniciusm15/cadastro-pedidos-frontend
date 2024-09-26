"use client";

import SideDrawer from "../../components/SideDrawer/SideDrawer";
import "../../styles/base/pages/adminLayout.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ProductsIcon from '@mui/icons-material/LocalShipping';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ open }) => ({
    flexGrow: 1,
    padding: "24px",
    marginLeft: open ? 0 : `-${drawerWidth}px`,
    marginTop: "64px",
    transition: "margin 0.3s ease-out",
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  transition: "margin 0.3s ease-out, width 0.3s ease-out",
  width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
  marginLeft: open ? `${drawerWidth}px` : 0,
}));

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({
    open: false,
    selectedText: "Dashboard",
  });

  useEffect(() => {
    const pathToText = {
      "/admin": "Dashboard",
      "/admin/products": "Products",
      "/admin/categories": "Categories",
      "/admin/clients": "Clients",
      "/admin/orders": "Orders",
    };
    setState((prevState) => ({
      ...prevState,
      selectedText: pathToText[pathname] || "Dashboard",
    }));
  }, [pathname]);

  const menuItems = useMemo(
    () => ["Dashboard", "Products", "Categories", "Clients", "Orders"],
    [],
  );

  const menuIcons = useMemo(
    () => [
      <DashboardIcon />,
      <ProductsIcon />,
      <CategoryIcon />,
      <PeopleIcon />,
      <AssignmentIcon />,
    ],
    [],
  );

  const handleMenuItemClick = (text) => {
    setState((prevState) => ({ ...prevState, selectedText: text }));
    router.push(`/admin/${text.toLowerCase()}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={state.open}
        sx={{ backgroundColor: "#48494f" }}
      >
        <Toolbar sx={{ backgroundColor: "#48494f" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() =>
              setState((prevState) => ({ ...prevState, open: true }))
            }
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
        handleDrawerClose={() =>
          setState((prevState) => ({ ...prevState, open: false }))
        }
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
