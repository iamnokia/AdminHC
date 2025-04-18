import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import BookIcon from "@mui/icons-material/Book";
import AddBusinessSharpIcon from '@mui/icons-material/AddBusinessSharp';
import FlagCircleSharpIcon from '@mui/icons-material/FlagCircleSharp';
import PeopleOutlineSharpIcon from '@mui/icons-material/PeopleOutlineSharp';
import FreeIcon from "../../assets/icons/HomeCareLogo.png";
import { HOME_PATH, REPORT_PATH, SHOW_SERVICE_PATH, SERVICE_STATUS_PATH } from "../../routes/path";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

function ResponsiveAppBar() {
  const location = useLocation();

  // Navigation items
  const navItems = [
    { to: SHOW_SERVICE_PATH, label: "ຈັດການຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ", icon: <PeopleOutlineSharpIcon /> },
    { to: HOME_PATH, label: "ເພີ່ມຂໍ້ມູນ", icon: <AddBusinessSharpIcon /> },
    { to: SERVICE_STATUS_PATH, label: "ສະຖານະການບໍລິການ", icon: <BookIcon /> },
    { to: REPORT_PATH, label: "ການລາຍງານ", icon: <FlagCircleSharpIcon /> },

  ];

  // Login dialog handlers
  const handleOpenLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center'
          }}>
            <img
              src={FreeIcon}
              alt="PetHub"
              style={{ width: '70px', height: '70px' }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                ml: 1,
                mr: 2,
                fontWeight: 'bold',
                fontSize: { xs: 14, sm: 14, md: 16 },
                color: '#611463',
                whiteSpace: 'nowrap'
              }}
            >
              ຜູ້ດູແລລະບົບ
            </Typography>
          </Box>
        </Toolbar >
        <Divider />
        <List sx={{ mt: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.to}
              disablePadding
              sx={{
                mb: 0 // Add margin-bottom for spacing between items
              }}
            >
              <ListItemButton
                component={Link}
                to={item.to}
                selected={location.pathname === item.to}
                sx={{
                  color: location.pathname === item.to ? "#611463" : "inherit",
                  py: 2.5, // Add more vertical padding
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(97, 20, 99, 0.08)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.to ? "#611463" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenLoginDialog}>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#611463", boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
}

export default ResponsiveAppBar;