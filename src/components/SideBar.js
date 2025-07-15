import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import QueueIcon from '@mui/icons-material/Queue';
import { Link, useLocation } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 200;

const menu = [
  { text: 'Test Cases', icon: <AssignmentIcon />, path: '/test-cases' },
  { text: 'Run & View', icon: <PlayArrowIcon />, path: '/run-test-cases' },
  { text: 'Files', icon: <InsertDriveFileIcon />, path: '/files' },
  { text: 'Queue', icon: <QueueIcon />, path: '/queue' }
];

const SideBar = () => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {menu.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isSelected}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default SideBar;
