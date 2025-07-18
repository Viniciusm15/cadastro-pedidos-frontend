import { Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import styles from './SideDrawer.module.css';

export default function SideDrawer({
  open,
  handleDrawerClose,
  menuItems = [],
  menuIcons = [],
  onMenuItemClick,
  selectedText,
  drawerWidth = 280
}) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: 'white',
          borderRight: 'none'
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <div className={styles.drawerHeader}>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          Admin Panel
        </Typography>
        <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider sx={{ borderColor: '#334155' }} />
      <List sx={{ pt: 1 }}>
        {menuItems.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedText === text}
              onClick={() => onMenuItemClick(text)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: '#334155',
                  '&:hover': {
                    backgroundColor: '#334155'
                  }
                },
                '&:hover': {
                  backgroundColor: '#334155'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                {menuIcons[index]}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: selectedText === text ? 500 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
