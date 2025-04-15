import styles from './SideDrawer.module.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export default function SideDrawer({
  open,
  handleDrawerClose,
  menuItems = [],
  menuIcons = [],
  onMenuItemClick,
  selectedText
}) {
  const theme = useTheme();

  return (
    <Drawer
      className={styles.drawer}
      variant='persistent'
      anchor='left'
      open={open}
      classes={{ paper: styles.drawerPaper }}
    >
      <DrawerHeader className={styles.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon className={styles.icon} />
          ) : (
            <ChevronRightIcon className={styles.icon} />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider className={styles.divider} />
      <List>
        {menuItems.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              className={`${text === selectedText ? styles.selectedMenuItem : ''} ${styles.listItemButton}`}
              onClick={() => onMenuItemClick(text)}
            >
              <ListItemIcon className={styles.icon}>{menuIcons[index]}</ListItemIcon>
              <ListItemText primary={text} className={styles.listItemText} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
