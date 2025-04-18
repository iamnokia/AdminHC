import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  FormHelperText,
  Divider,
  CircularProgress,
  Tooltip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Info as InfoIcon,
  PersonAdd as PersonAddIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Wc as GenderIcon
} from '@mui/icons-material';
import LOGO from "../../../../src/assets/icons/HomeCareLogo.png"

// Lao language translations
const laoTranslations = {
  title: "ລົງທະບຽນຜູ້ດູແລລະບົບ",
  subtitle: "ສ້າງບັນຊີຜູ້ດູແລລະບົບໃຫມ່",
  requiredFields: "ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ <span style='color: #ff1744'>*</span>",
  username: "ຊື່ຜູ້ໃຊ້",
  firstName: "ຊື່",
  lastName: "ນາມສະກຸນ",
  email: "ອີເມວ",
  phoneNumber: "ເບີໂທລະສັບ",
  password: "ລະຫັດຜ່ານ",
  confirmPassword: "ຢືນຢັນລະຫັດຜ່ານ",
  gender: "ເພດ",
  genderOptions: {
    male: "ຊາຍ",
    female: "ຍີງ",
    other: "ອື່ນໆ"
  },
  passwordHint: "ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ",
  clearForm: "ລ້າງຟອມ",
  createAccount: "ສ້າງບັນຊີ",
  creating: "ກຳລັງສ້າງ...",
  successMessage: "ສ້າງບັນຊີສຳເລັດແລ້ວ!",
  validation: {
    username: "ຕ້ອງມີຊື່ຜູ້ໃຊ້",
    firstName: "ຕ້ອງມີຊື່",
    lastName: "ຕ້ອງມີນາມສະກຸນ",
    email: {
      required: "ຕ້ອງມີອີເມວ",
      invalid: "ອີເມວບໍ່ຖືກຕ້ອງ"
    },
    password: {
      required: "ຕ້ອງມີລະຫັດຜ່ານ",
      length: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
    },
    confirmPassword: "ລະຫັດຜ່ານບໍ່ກົງກັນ",
    phoneNumber: {
      required: "ຕ້ອງມີເບີໂທລະສັບ",
      invalid: "ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ"
    }
  }
};

// Constants with new color scheme
const PRIMARY_COLOR = '#611463';  // Purple
const SECONDARY_COLOR = '#f7931e';  // Orange
const BACKGROUND_COLOR = '#f9f5fa';  // Light purple tint

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
      borderColor: PRIMARY_COLOR,
      color: PRIMARY_COLOR,
      py: 1.5,
      '&:hover': {
        borderColor: SECONDARY_COLOR,
        color: SECONDARY_COLOR,
        bgcolor: 'rgba(247, 147, 30, 0.04)'
      }
    }
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&.Mui-focused fieldset': {
        borderColor: PRIMARY_COLOR
      }
    }
  }
};

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: string;
}

const AdminRegister: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: 'male'
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
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
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.username.trim()) newErrors.username = laoTranslations.validation.username;
    if (!formData.firstName.trim()) newErrors.firstName = laoTranslations.validation.firstName;
    if (!formData.lastName.trim()) newErrors.lastName = laoTranslations.validation.lastName;
    if (!formData.email.trim()) {
      newErrors.email = laoTranslations.validation.email.required;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = laoTranslations.validation.email.invalid;
    }
    if (!formData.password) {
      newErrors.password = laoTranslations.validation.password.required;
    } else if (formData.password.length < 8) {
      newErrors.password = laoTranslations.validation.password.length;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = laoTranslations.validation.confirmPassword;
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = laoTranslations.validation.phoneNumber.required;
    } else if (!/^[\d\s+\-().]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = laoTranslations.validation.phoneNumber.invalid;
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
      setSnackbar({
        open: true,
        message: laoTranslations.successMessage,
        severity: 'success'
      });
      // Reset form after successful submission
      handleReset();
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      gender: 'male'
    });
    setErrors({});
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Container maxWidth="md" sx={{ 
      py: 6, 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f9f5fa 0%, #f0e4f1 100%)'
    }}>
      <Paper elevation={10} sx={{ 
        borderRadius: 4, 
        overflow: 'hidden', 
        boxShadow: '0 8px 32px rgba(97, 20, 99, 0.2)',
        width: '100%',
        maxWidth: 900
      }}>
        {/* Header with Logo */}
        <Box sx={{
          p: 3,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #7a1b7d 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`
          }
        }}>
          <Avatar 
            src={LOGO} 
            alt="HomeCare Logo"
            sx={{ 
              width: 80, 
              height: 80,
              mb: 2,
              border: '3px solid white',
              boxShadow: theme.shadows[4],
              bgcolor: SECONDARY_COLOR
            }}
            variant="rounded"
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {laoTranslations.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {laoTranslations.subtitle}
          </Typography>
        </Box>

        {/* Form content */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: 'white'
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            <span dangerouslySetInnerHTML={{ __html: laoTranslations.requiredFields }} />
          </Typography>

          <Grid container spacing={3}>
            {/* Username */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.username}
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={formStyles.input}
                required
              />
            </Grid>

            {/* First Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.firstName}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={formStyles.input}
                required
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.lastName}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={formStyles.input}
                required
              />
            </Grid>

            {/* Gender - Moved here */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={formStyles.input}>
                <InputLabel>{laoTranslations.gender}</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  label={laoTranslations.gender}
                  startAdornment={
                    <InputAdornment position="start">
                      <GenderIcon color="action" sx={{ mr: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="male">{laoTranslations.genderOptions.male}</MenuItem>
                  <MenuItem value="female">{laoTranslations.genderOptions.female}</MenuItem>
                  <MenuItem value="other">{laoTranslations.genderOptions.other}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.email}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.phoneNumber}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={formStyles.input}
                required
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.password}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || laoTranslations.passwordHint}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
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
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={laoTranslations.confirmPassword}
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  )
                }}
                sx={formStyles.input}
                required
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReset}
                sx={formStyles.button.secondary}
                disabled={isSubmitting}
              >
                {laoTranslations.clearForm}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={formStyles.button.primary}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              >
                {isSubmitting ? laoTranslations.creating : laoTranslations.createAccount}
              </Button>
            </Grid>
          </Grid>
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
            sx={{ width: '100%', boxShadow: theme.shadows[6] }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AdminRegister;