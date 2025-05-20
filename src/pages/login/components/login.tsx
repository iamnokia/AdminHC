// src/pages/login/components/AdminLogin.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import LOGO from "../../../assets/icons/HomeCareLogo.png";
import useLoginController from '../controller/index';

// Lao language translations
const laoTranslations = {
  title: "ເຂົ້າສູ່ລະບົບ",
  subtitle: "ເຂົ້າສູ່ລະບົບຂອງຜູ້ດູແລລະບົບ",
  email: "ອີເມວ",
  password: "ລະຫັດຜ່ານ",
  login: "ເຂົ້າສູ່ລະບົບ",
  loggingIn: "ກຳລັງເຂົ້າສູ່ລະບົບ...",
  successMessage: "ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ!",
  errorMessage: "ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
  validation: {
    email: {
      required: "ຕ້ອງມີອີເມວ",
      invalid: "ອີເມວບໍ່ຖືກຕ້ອງ"
    },
    password: {
      required: "ຕ້ອງມີລະຫັດຜ່ານ"
    }
  }
};

// Constants with color scheme
const PRIMARY_COLOR = '#611463';  // Purple
const SECONDARY_COLOR = '#f7931e';  // Orange
const BACKGROUND_COLOR = '#f9f5fa';  // Light purple tint

// Enhanced form styles with larger input boxes
const formStyles = {
  button: {
    primary: {
      bgcolor: PRIMARY_COLOR,
      color: 'white',
      py: 1.5,
      '&:hover': {
        bgcolor: '#4a0e4d'
      }
    },
    secondary: {
      color: PRIMARY_COLOR,
      border: `1px solid ${PRIMARY_COLOR}`,
      py: 1.5,
      '&:hover': {
        bgcolor: 'rgba(97, 20, 99, 0.04)'
      }
    }
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      height: '52px',
      '&.Mui-focused fieldset': {
        borderColor: PRIMARY_COLOR
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '1rem',
      padding: '12px 12px 12px 0'
    },
    '& .MuiInputAdornment-root': {
      marginLeft: '12px'
    }
  },
  iconButton: {
    bgcolor: PRIMARY_COLOR,
    color: 'white',
    width: '52px',
    height: '52px',
    borderRadius: '4px',
    ml: 1,
    '&:hover': {
      bgcolor: '#4a0e4d'
    }
  }
};

const AdminLogin: React.FC = () => {
  const theme = useTheme();
  const {
    email,
    password,
    showPassword,
    loading,
    error,
    handleClickShowPassword,
    handleSubmit,
    handleChangeEmail,
    handleChangePassword
  } = useLoginController();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  // Show snackbar when error changes
  React.useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: BACKGROUND_COLOR
    }}>
      <Container maxWidth="lg" sx={{ p: 10, boxShadow: 10, borderRadius: 5, height: 600 }}>
        <Grid container spacing={0}>
          {/* Left side - Form */}
          <Grid item xs={12} md={6} lg={5}>
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ p: { xs: 2, sm: 4 } }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                  {laoTranslations.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {laoTranslations.subtitle}
                </Typography>
              </Box>
              
              {/* Email */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  placeholder={laoTranslations.email}
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChangeEmail}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={formStyles.input}
                  required
                />
                <IconButton sx={formStyles.iconButton}>
                  <EmailIcon />
                </IconButton>
              </Box>

              {/* Password */}
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  placeholder={laoTranslations.password}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChangePassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={formStyles.input}
                  required
                />
                <IconButton sx={formStyles.iconButton}>
                  <LockIcon />
                </IconButton>
              </Box>

              {/* Login Button */}
              <Box sx={{ mb: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    ...formStyles.button.primary,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    height: '52px'
                  }}
                  disabled={loading}
                  startIcon={loading ? 
                    <CircularProgress size={24} color="inherit" /> : 
                    <LoginIcon />
                  }
                >
                  {loading ? laoTranslations.loggingIn : laoTranslations.login}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Logo */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            lg={7} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: PRIMARY_COLOR,
              borderRadius: { md: '16px' }
            }}
          >
            <Box 
              sx={{ 
                p: 6, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <Avatar
                src={LOGO}
                alt="HomeCare Logo"
                sx={{
                  width: 180,
                  height: 180,
                  border: `4px solid ${SECONDARY_COLOR}`,
                  bgcolor: 'white',
                  padding: '12px',
                  mb: 3
                }}
              />
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                HomeCare
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', textAlign: 'center' }}>
                ເຂົ້າສູ່ລະບົບຂອງຜູ້ດູແລລະບົບ
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%', boxShadow: theme.shadows[3] }}
          variant="filled"
        >
          {error || laoTranslations.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;