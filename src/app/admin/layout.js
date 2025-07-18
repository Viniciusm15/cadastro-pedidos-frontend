'use client';

import SideDrawer from '../../components/SideDrawer/SideDrawer';
import '../../styles/base/pages/adminLayout.module.css';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProductsIcon from '@mui/icons-material/LocalShipping';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import { Box, CssBaseline, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  marginTop: '64px',
  backgroundColor: '#f5f7fa',
  minHeight: 'calc(100vh - 64px)'
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#ffffff',
  color: '#2d3748',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({
    open: true,
    selectedText: 'Dashboard'
  });

  useEffect(() => {
    const pathToText = {
      '/admin': 'Dashboard',
      '/admin/products': 'Products',
      '/admin/categories': 'Categories',
      '/admin/clients': 'Clients',
      '/admin/orders': 'Orders'
    };
    setState((prevState) => ({
      ...prevState,
      selectedText: pathToText[pathname] || 'Dashboard'
    }));
  }, [pathname]);

  const menuItems = useMemo(() => ['Dashboard', 'Products', 'Categories', 'Clients', 'Orders'], []);

  const menuIcons = useMemo(
    () => [<DashboardIcon />, <ProductsIcon />, <CategoryIcon />, <PeopleIcon />, <AssignmentIcon />],
    []
  );

  const handleMenuItemClick = (text) => {
    const path = text === 'Dashboard' ? '/admin' : `/admin/${text.toLowerCase()}`;
    setState((prevState) => ({ ...prevState, selectedText: text }));
    router.push(path);
  };

  const toggleDrawer = () => {
    setState((prevState) => ({ ...prevState, open: !prevState.open }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={state.open}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {state.selectedText}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#4f46e5' }}>VH</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <SideDrawer
        open={state.open}
        handleDrawerClose={() => setState((prevState) => ({ ...prevState, open: false }))}
        menuItems={menuItems}
        menuIcons={menuIcons}
        onMenuItemClick={handleMenuItemClick}
        selectedText={state.selectedText}
        drawerWidth={drawerWidth}
      />

      <Main open={state.open}>
        {children}
      </Main>
    </Box>
  );
}
