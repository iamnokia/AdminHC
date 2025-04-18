import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import LOGO from "../../../../src/assets/icons/HomeCareLogo.png"

// Lao language translations
const laoTranslations = {
  title: "ເຂົ້າສູ່ລະບົບ",
  subtitle: "ເຂົ້າສູ່ລະບົບເພື່ອເຂົ້າເຖິງລະບົບ",
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
      py: 1.8, // Increased padding for larger button
      '&:hover': {
        bgcolor: '#4a0e4d'
      }
    }
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      height: '56px', // Increased height for input fields
      '&.Mui-focused fieldset': {
        borderColor: PRIMARY_COLOR
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '1.1rem', // Larger font size for better readability
      padding: '14px 14px 14px 0' // Increased padding
    },
    '& .MuiInputAdornment-root': {
      marginLeft: '12px' // More space for icons
    }
  }
};

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'johndoe@example.com',
    password: 'securePass123'
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = laoTranslations.validation.email.required;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = laoTranslations.validation.email.invalid;
    }
    
    if (!formData.password) {
      newErrors.password = laoTranslations.validation.password.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Check credentials
      if (formData.email === 'johndoe@example.com' && formData.password === 'securePass123') {
        setSnackbar({
          open: true,
          message: laoTranslations.successMessage,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: laoTranslations.errorMessage,
          severity: 'error'
        });
      }
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: BACKGROUND_COLOR
    }}>
      <Container maxWidth="sm" sx={{ // Increased from xs to sm for wider container
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 }
      }}>
        <Paper elevation={3} sx={{ 
          borderRadius: 2, 
          overflow: 'hidden', 
          boxShadow: '0 6px 20px rgba(97, 20, 99, 0.15)',
          width: '100%'
        }}>
          {/* Header with Logo */}
          <Box sx={{
            p: { xs: 3, sm: 4 }, // Increased padding
            background: PRIMARY_COLOR,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <Avatar 
              src={LOGO} 
              alt="HomeCare Logo"
              sx={{ 
                width: 80, // Increased logo size
                height: 80, // Increased logo size
                mb: 2,
                border: `2px solid ${SECONDARY_COLOR}`,
                bgcolor: 'white',
                padding: '6px' // Increased padding
              }}
            />
            <Typography variant="h4" fontWeight="bold"> {/* Increased from h5 to h4 */}
              {laoTranslations.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.8 }}> {/* Increased from body2 to body1 */}
              {laoTranslations.subtitle}
            </Typography>
          </Box>

          {/* Form content */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, sm: 4 }, // Increased padding
              bgcolor: 'white'
            }}
          >
            <Grid container spacing={3}> {/* Increased spacing from 2 to 3 */}
              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder={laoTranslations.email}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" sx={{ fontSize: 24 }} /> {/* Larger icon */}
                      </InputAdornment>
                    )
                  }}
                  sx={formStyles.input}
                  required
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder={laoTranslations.password}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" sx={{ fontSize: 24 }} /> {/* Larger icon */}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="medium" // Changed from small to medium
                        >
                          {showPassword ? 
                            <VisibilityOff sx={{ fontSize: 22 }} /> : 
                            <Visibility sx={{ fontSize: 22 }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={formStyles.input}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}> {/* Increased margin from 3 to 4 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  ...formStyles.button.primary,
                  py: 1.8, // Taller button
                  textTransform: 'none',
                  fontSize: '1.15rem', // Larger font size
                  borderRadius: '4px', // Slightly rounded corners
                  height: '56px' // Fixed height for button
                }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? 
                  <CircularProgress size={24} color="inherit" /> : 
                  <LoginIcon sx={{ fontSize: 24 }} />
                }
              >
                {isSubmitting ? laoTranslations.loggingIn : laoTranslations.login}
              </Button>
            </Box>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              sx={{ width: '100%', boxShadow: theme.shadows[3] }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;