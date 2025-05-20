// src/layout/ResponsiveAppBar.tsx
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import AddBusinessSharpIcon from '@mui/icons-material/AddBusinessSharp';
import FlagCircleSharpIcon from '@mui/icons-material/FlagCircleSharp';
import PeopleOutlineSharpIcon from '@mui/icons-material/PeopleOutlineSharp';
import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import FreeIcon from "../../assets/icons/HomeCareLogo.png";
import { HOME_PATH, REPORT_PATH, SHOW_SERVICE_PATH, LOGIN_PATH, CAR_PATH, SELECT_EMPLOYEE_PATH } from "../../routes/path";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../../store/slices/userSlice";
import { RootState } from "../../store";

// Constants with color scheme
const PRIMARY_COLOR = '#611463';  // Purple
const SECONDARY_COLOR = '#f7931e';  // Orange
const BACKGROUND_COLOR = '#f9f5fa';  // Light purple tint

const drawerWidth = 240;

function ResponsiveAppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.user.data);
  
  // State for user dropdown menu
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  
  // State for logout confirmation dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  // Navigation items
  const navItems = [
    { to: SHOW_SERVICE_PATH, label: "ຈັດການຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ", icon: <PeopleOutlineSharpIcon /> },
    { to: HOME_PATH, label: "ເພີ່ມຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ", icon: <AddBusinessSharpIcon /> },
    { to: SELECT_EMPLOYEE_PATH, label: "ເພີ່ມຂໍ້ມູນລົດ", icon: <AirportShuttleRoundedIcon /> },
    { to: REPORT_PATH, label: "ລາຍງານ", icon: <FlagCircleSharpIcon /> },
  ];

  // User menu handlers
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Logout dialog handlers
  const handleOpenLogoutDialog = () => {
    handleCloseUserMenu();
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  // Logout function
  const handleLogout = () => {
    // Clear user data from Redux
    dispatch(clearUserData());
    
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');
    
    // Close the dialog
    handleCloseLogoutDialog();
    
    // Navigate to login page
    navigate(LOGIN_PATH);
  };

  // Get first letter of email for avatar fallback
  const getAvatarLetter = () => {
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user's email to display
  const getUserEmail = () => {
    return userData?.email || "";
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
                color: PRIMARY_COLOR,
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
                  color: location.pathname === item.to ? PRIMARY_COLOR : "inherit",
                  py: 2.5, // Add more vertical padding
                  '&.Mui-selected': {
                    backgroundColor: `${PRIMARY_COLOR}1A`, // 10% opacity
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.to ? PRIMARY_COLOR : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: PRIMARY_COLOR, boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Display email address */}
              <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
                {getUserEmail()}
              </Typography>
              
              {/* User Avatar with Menu */}
              <Tooltip title="ເມນູຜູ້ໃຊ້">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userData?.email || 'User'}
                    src={userData?.avatar || ''}
                    sx={{ 
                      bgcolor: SECONDARY_COLOR,
                      color: '#fff',
                      fontWeight: 'bold',
                      width: 40,
                      height: 40,
                      border: '2px solid white'
                    }}
                  >
                    {getAvatarLetter()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              {/* User Menu */}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 180,
                    borderRadius: 2,
                    overflow: 'visible',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {userData?.email || ''}
                  </Typography>
                </Box>
                <Divider />
                
                {/* Logout Option */}
                <MenuItem onClick={handleOpenLogoutDialog}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="ອອກຈາກລະບົບ" 
                    primaryTypographyProps={{ color: 'error' }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Main Content Children will go here */}
      </Box>
      
      {/* Enhanced Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '320px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            bgcolor: PRIMARY_COLOR,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            <Typography variant="h6">{"ຍືນຍັນການອອກຈາກລະບົບ"}</Typography>
          </Box>
          <IconButton 
            onClick={handleCloseLogoutDialog} 
            sx={{ color: 'white' }}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 1 }}>
                    
          <DialogContentText id="alert-dialog-description" sx={{ mb: 2, mt: 3 }}>
            ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ຫຼືບໍ່? ທ່ານຈະຕ້ອງເຂົ້າສູ່ລະບົບໃໝ່ອີກຄັ້ງເພື່ອເຂົ້າໃຊ້ງານລະບົບ.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseLogoutDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              borderColor: 'grey.400',
              color: 'grey.700',
              '&:hover': {
                borderColor: 'grey.500',
                bgcolor: 'grey.50'
              }
            }}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleLogout} 
            color="error" 
            variant="contained"
            autoFocus
            startIcon={<LogoutIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              textTransform: 'none',
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark'
              }
            }}
          >
            ອອກຈາກລະບົບ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResponsiveAppBar;