import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DirectionsCar as CarIcon,
  HomeRepairService as RepairIcon,
  ElectricBolt as ElectricalIcon,
  AcUnit as AirconIcon,
  Plumbing as PlumbingIcon,
  LocalShipping as MovingIcon,
  Bathroom as BathroomIcon,
  PestControl as PestIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import useMainController from '../controllers/index';
import { CarModel } from '../../../models/car';
import axios from 'axios';

// Available cities for dropdown with English and Lao names
const cities = [
  { en: 'CHANTHABULY', lo: 'ຈັນທະບູລີ' },
  { en: 'SIKHOTTABONG', lo: 'ສີໂຄດຕະບອງ' },
  { en: 'XAYSETHA', lo: 'ໄຊເສດຖາ' },
  { en: 'SISATTANAK', lo: 'ສີສັດຕະນາກ' },
  { en: 'NAXAITHONG', lo: 'ນາຊາຍທອງ' },
  { en: 'XAYTANY', lo: 'ໄຊທານີ' },
  { en: 'HADXAIFONG', lo: 'ຫາດຊາຍຟອງ' }
];

// Helper function to translate English city names to Lao for display
const displayCityInLao = (englishCity) => {
  const cityObj = cities.find(c => c.en === englishCity);
  return cityObj ? cityObj.lo : englishCity;
};
// You'll need to add this const at the component level or in a separate constants file
const genders = [
  { en: 'Male', lo: 'ຊາຍ' },
  { en: 'Female', lo: 'ຍິງ' },
  { en: 'Other', lo: 'ອື່ນໆ' }
];

// Add this helper function to translate English gender values to Lao for display
const displayGenderInLao = (englishGender) => {
  const genderObj = genders.find(g => g.en === englishGender);
  return genderObj ? genderObj.lo : englishGender;
};

// Format price with currency
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice ? `${numPrice.toLocaleString()} LAK` : '0 LAK';
};

// Get appropriate icon for category
const getCategoryIcon = (categoryName: string | undefined): React.ReactNode => {
  const category = (categoryName || '').toLowerCase();

  if (category.includes('cleaning')) return <RepairIcon />;
  if (category.includes('electrical')) return <ElectricalIcon />;
  if (category.includes('aircon')) return <AirconIcon />;
  if (category.includes('plumbing')) return <PlumbingIcon />;
  if (category.includes('moving')) return <MovingIcon />;
  if (category.includes('bathroom')) return <BathroomIcon />;
  if (category.includes('pest')) return <PestIcon />;

  return <CategoryIcon />;
};

// Main Service Provider Management Component
const ServiceProviderAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProvider, setEditedProvider] = useState<ServiceProvider | null>(null);
  const [editedCar, setEditedCar] = useState<CarModel | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { loading, error, serviceProviders, handleNavigate } = useMainController();

  // Define service categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'all',
      title: 'ທັງຫມົດ',
      icon: <CategoryIcon />,
      categoryType: 'all'
    },
    {
      id: 'cleaning',
      title: 'ທຳຄວາມສະອາດ',
      icon: <RepairIcon />,
      categoryType: 'cleaning'
    },
    {
      id: 'electrical',
      title: 'ສ້ອມແປງໄຟຟ້າ',
      icon: <ElectricalIcon />,
      categoryType: 'electrical'
    },
    {
      id: 'aircon',
      title: 'ສ້ອມແປງແອອາກາດ',
      icon: <AirconIcon />,
      categoryType: 'aircon'
    },
    {
      id: 'plumbing',
      title: 'ສ້ອມແປງປະປາ',
      icon: <PlumbingIcon />,
      categoryType: 'plumbing'
    },
    {
      id: 'moving',
      title: 'ແກ່ເຄື່ອງ',
      icon: <MovingIcon />,
      categoryType: 'moving'
    },
    {
      id: 'bathroom',
      title: 'ດູດສ້ວມ',
      icon: <BathroomIcon />,
      categoryType: 'bathroom'
    },
    {
      id: 'pest',
      title: 'ກຳຈັດປວກ',
      icon: <PestIcon />,
      categoryType: 'pest'
    },
  ];

  // Handle category tab change
  const handleCategoryChange = (categoryId: string) => {
    setActiveTab(categoryId);
  };

  // View provider details
  const handleViewDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setEditedProvider({ ...provider });
    if (provider.car) {
      setEditedCar({ ...provider.car });
    } else {
      setEditedCar(null);
    }
    setDialogOpen(true);
  };

  // Close detail dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditing(false);
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (selectedProvider) {
      setEditedProvider({ ...selectedProvider });
      if (selectedProvider.car) {
        setEditedCar({ ...selectedProvider.car });
      }
    }
    setIsEditing(false);
  };

  // Handle field change in edit mode
  const handleFieldChange = (field: keyof ServiceProvider, value: any) => {
    if (editedProvider) {
      setEditedProvider({
        ...editedProvider,
        [field]: value
      });
    }
  };

  // Update provider status (active/inactive)
  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      // In a real implementation, you would use:
      // await axios.patch(`https://homecare-pro.onrender.com/employees/update_employees/${id}`, { status: newStatus });

      // For demo purposes, we'll just show a success message
      setSnackbar({
        open: true,
        message: `ການອັບເດດສະຖານະສຳເລັດ ${newStatus}`,
        severity: "success"
      });
    } catch (error) {
      console.error("ລົ້ມເຫຼວການອັບເດດ:", error);
      setSnackbar({
        open: true,
        message: "ການອັບເດດສະຖານະລົ້ມເຫຼວ",
        severity: "error"
      });
    }
  };

  // Save edited provider
  const handleSaveProvider = async () => {
    try {
      if (!editedProvider) return;

      // Prepare data for API in the expected format
      const dataToUpdate = {
        id: editedProvider.id,
        first_name: editedProvider.first_name,
        last_name: editedProvider.last_name,
        email: editedProvider.email,
        tel: editedProvider.tel,
        password: editedProvider.password,
        address: editedProvider.address,
        gender: editedProvider.gender,
        cv: editedProvider.cv,
        avatar: editedProvider.avatar,
        cat_id: editedProvider.cat_id,
        price: editedProvider.price,
        status: editedProvider.status
      };

      // Make the actual API call to update the employee
      await axios.put(
   `https://homecare-pro.onrender.com/employees/update_employees/${editedProvider.id}`,
        dataToUpdate,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSelectedProvider(editedProvider);
      setIsEditing(false);

      setSnackbar({
        open: true,
        message: "ການແກ້ຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດ",
        severity: "success"
      });
    } catch (error) {
      console.error("ລົ້ມເຫຼວໃນການແກ້ໄຂ:", error);
      setSnackbar({
        open: true,
        message: "ການແກ້ໄຂຂໍ້ມູນຜູ້ໃຫ້ບໍລິການລົ້ມເຫຼວ",
        severity: "error"
      });
    }
  };

  // Delete provider
  const handleDeleteProvider = async (id: number) => {
    try {
      // In a real implementation, you would use:
      // await axios.delete(`https://homecare-pro.onrender.com/employees/delete_employees/${id}`);

      setDialogOpen(false);

      setSnackbar({
        open: true,
        message: "Provider deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting provider:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete provider",
        severity: "error"
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter providers based on active category
  const getFilteredProviders = () => {
    if (activeTab === 'all') return serviceProviders;
    return serviceProviders.filter(provider => provider.categoryType === activeTab);
  };

  const filteredProviders = getFilteredProviders();

  // Get counts for stats
  const totalProviders = serviceProviders.length;
  const movingProviders = serviceProviders.filter(p => p.cat_id === 5).length;
  const activeProviders = serviceProviders.filter(p => p.status === 'active').length;

  return (
    <Box sx={{
      bgcolor: '#f9f9f9',
      minHeight: '100%',
      position: 'relative',
      marginLeft: '240px', // Add margin to avoid blocking left sidebar
      width: 'calc(100% - 240px)' // Adjust width to fit the available space
    }}>
      {/* Category Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => handleCategoryChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: '#611463',
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'none',
            minHeight: 48,
            py: 1
          },
          '& .Mui-selected': { color: 'white' },
          '& .MuiTabs-indicator': { bgcolor: '#f7931e' }
        }}
      >
        {serviceCategories.map(category => (
          <Tab
            key={category.id}
            value={category.id}
            label={
              <Box display="flex" alignItems="center">
                {category.icon}
                <Box ml={1}>{category.title}</Box>
              </Box>
            }
          />
        ))}
      </Tabs>

      <Box sx={{ p: 2 }}>
        {/* Stats Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: alpha('#611463', 0.05),
                border: '1px solid',
                borderColor: alpha('#611463', 0.2),
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#611463', 0.2),
                  color: '#611463',
                  mr: 2
                }}
              >
                <CategoryIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#611463">
                  {totalProviders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ຜູ້ໃຫ້ບໍລິການທັງໝົດ
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: alpha('#f7931e', 0.05),
                border: '1px solid',
                borderColor: alpha('#f7931e', 0.2),
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#f7931e', 0.2),
                  color: '#f7931e',
                  mr: 2
                }}
              >
                <MovingIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#f7931e">
                  {movingProviders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ຜູ້ໃຫ້ບໍລິການແກ່ເຄື່ອງ
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: alpha('#4CAF50', 0.05),
                border: '1px solid',
                borderColor: alpha('#4CAF50', 0.2),
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#4CAF50', 0.2),
                  color: '#4CAF50',
                  mr: 2
                }}
              >
                <CategoryIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#4CAF50">
                  {activeProviders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ຜູ້ໃຫ້ບໍລິການທີ່ພ້ອມຕອນນີ້
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: alpha('#2196F3', 0.05),
                border: '1px solid',
                borderColor: alpha('#2196F3', 0.2),
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#2196F3', 0.2),
                  color: '#2196F3',
                  mr: 2
                }}
              >
                <CategoryIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#2196F3">
                  {serviceCategories.length - 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ໝວດໝູ່ການບໍລິການ
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Current Category Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            mt: 6,
            borderLeft: '4px solid',
            borderColor: activeTab === 'all' ? '#611463' :
              serviceCategories.find(cat => cat.id === activeTab)?.id === 'moving' ? '#f7931e' : '#611463',
            pl: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#611463',
              fontWeight: 'bold'
            }}
          >
            {activeTab === 'all' ?
              'ຜູ້ໃຫ້ບໍລິການທັງໝົດ' :
              `${serviceCategories.find(cat => cat.id === activeTab)?.title} `
            }
          </Typography>

          <Chip
            label={`${filteredProviders.length} ຜູ້ໃຫ້ບໍລິການ`}
            size="small"
            sx={{
              ml: 2,
              bgcolor: alpha('#611463', 0.1),
              color: '#611463',
              fontWeight: 'medium'
            }}
          />
        </Box>

        {/* Service Providers Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress sx={{ color: '#611463' }} />
          </Box>
        ) : error ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 1,
              bgcolor: alpha('#f44336', 0.05),
              border: '1px dashed',
              borderColor: alpha('#f44336', 0.2)
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => window.location.reload()}
            >
              ລອງໃຫມ່
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredProviders.length > 0 ? (
              filteredProviders.map(provider => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={provider.id}>
                  <ServiceProviderCard
                    provider={provider}
                    onViewDetails={handleViewDetails}
                    onStatusChange={handleStatusChange}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 1,
                    bgcolor: alpha('#611463', 0.02),
                    border: '1px dashed',
                    borderColor: alpha('#611463', 0.2)
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    ບໍ່ມີຜູ້ໃຫ້ບໍລິການໃນໝວດໝູ່ການບໍລິການນີ້
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: '#611463',
                      '&:hover': {
                        bgcolor: '#4e1050'
                      }
                    }}
                    onClick={() => setActiveTab('all')}
                  >
                    ເບິ່ງຜູ້ໃຫ້ບໍລິການທັງໝົດ
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Detail Dialog */}
      {selectedProvider && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              bgcolor: '#611463',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {getCategoryIcon(selectedProvider.cat_name)}
              <Typography variant="h6">
                ຂໍ້ມູນການໃຫ້ບໍລິການຂອງ {selectedProvider.cat_name}
              </Typography>
            </Box>
            <Box>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleCancelEdit}
                    sx={{ mr: 1 }}
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleSaveProvider}
                    startIcon={<SaveIcon />}
                  >
                    ບັນທຶກ
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleEditClick}
                    aria-label="edit"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => handleDeleteProvider(selectedProvider.id)}
                    aria-label="delete"
                    sx={{ mr: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          {editedProvider && (
            <DialogContent sx={{ p: 0 }}>
              <Grid container>
                {/* Service Provider Info */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mb={3}
                    >
                      <Box
                        component="img"
                        src={editedProvider.avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          borderRadius: '50%',
                          border: '4px solid',
                          borderColor: '#f7931e',
                          objectFit: 'cover'
                        }}
                        alt={`${editedProvider.first_name} ${editedProvider.last_name}`}
                      />
                      {isEditing ? (
                        <>
                          <TextField
                            label="ຊື່"
                            value={editedProvider.first_name}
                            onChange={(e) => handleFieldChange('first_name', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="ນາມສະກຸນ"
                            value={editedProvider.last_name}
                            onChange={(e) => handleFieldChange('last_name', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                        </>
                      ) : (
                        <Typography variant="h5" fontWeight="bold">
                          {editedProvider.first_name} {editedProvider.last_name}
                        </Typography>
                      )}
                      <Box display="flex" alignItems="center" mt={1}>
                        <Chip
                          icon={getCategoryIcon(editedProvider.cat_name) as React.ReactElement}
                          label={editedProvider.cat_name}
                          sx={{
                            bgcolor: alpha('#611463', 0.1),
                            color: '#611463',
                            fontWeight: 'bold'
                          }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            ml: 1,
                            color: '#f7931e'
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} fontSize="small" />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid',
                        borderColor: editedProvider.status === 'active' ? alpha('#4caf50', 0.3) : alpha('#f44336', 0.3),
                        bgcolor: editedProvider.status === 'active' ? alpha('#4caf50', 0.05) : alpha('#f44336', 0.05),
                        borderRadius: 1
                      }}
                    >
                      <Box>
                        <Typography fontWeight="medium">
                          ສະຖານະ
                        </Typography>
                        <Typography variant="body2" color={editedProvider.status === 'active' ? 'success.main' : 'error.main'}>
                          {editedProvider.status === 'active' ? 'Available for service' : 'Not available'}
                        </Typography>
                      </Box>
                      <Switch
                        checked={editedProvider.status === 'active'}
                        onChange={(e) => {
                          const newStatus = e.target.checked ? 'active' : 'inactive';
                          handleFieldChange('status', newStatus);
                          handleStatusChange(editedProvider.id, newStatus);
                        }}
                        color={editedProvider.status === 'active' ? 'success' : 'error'}
                        disabled={isEditing}
                      />
                    </Paper>

                    <Box>
                      <Typography variant="h6" color="#611463" fontWeight="bold">
                        ຂໍ້ມູນທົ່ວໄປ
                      </Typography>

                      {isEditing ? (
                        <>
                          <TextField
                            label="ອີເມລ"
                            value={editedProvider.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="ເບີໂທລະສັບ"
                            value={editedProvider.tel}
                            onChange={(e) => handleFieldChange('tel', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="ທີ່ຢູ່"
                            value={editedProvider.address}
                            onChange={(e) => handleFieldChange('address', e.target.value)}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                          />
                        </>
                      ) : (
                        <>
                          <Box display="flex" alignItems="center" mt={2}>
                            <LocationIcon sx={{ color: '#611463', mr: 1 }} />
                            <Typography>
                              {editedProvider.address}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" mt={1}>
                            <PhoneIcon sx={{ color: '#611463', mr: 1 }} />
                            <Typography>
                              {editedProvider.tel}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" mt={1}>
                            <EmailIcon sx={{ color: '#611463', mr: 1 }} />
                            <Typography>
                              {editedProvider.email}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" color="#611463" fontWeight="bold">
                        ເມືອງ
                      </Typography>
                      {isEditing ? (
                        <TextField
                          select
                          value={editedProvider.city || ''}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          fullWidth
                          margin="normal"
                        >
                          {cities.map((city) => (
                            <MenuItem key={city.en} value={city.en}>
                              {city.lo}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography mt={1}>
                          {displayCityInLao(editedProvider.city)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" color="`#611463`" fontWeight="bold">
                        ເພດ
                      </Typography>
                      {isEditing ? (
                        <TextField
                          select
                          value={editedProvider.gender || ''}
                          onChange={(e) => handleFieldChange('gender', e.target.value)}
                          fullWidth
                          margin="normal"
                        >
                          {genders.map((gender) => (
                            <MenuItem key={gender.en} value={gender.en}>
                              {gender.lo}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography mt={1}>
                          {displayGenderInLao(editedProvider.gender)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" color="#611463" fontWeight="bold">
                        ລາຄາ
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="ລາຄາ (ກີບ)"
                          type="number"
                          value={editedProvider.price}
                          onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                          fullWidth
                          margin="normal"
                          InputProps={{
                            endAdornment: 'ກີບ'
                          }}
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="#f7931e"
                          mt={1}
                        >
                          {formatPrice(editedProvider.price)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={6} sx={{ bgcolor: alpha('#f7931e', 0.05) }}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" color="#611463" fontWeight="bold">
                      ລາຍລະອຽດ
                    </Typography>
                    {isEditing ? (
                      <TextField
                        label="ຄຳອະທິບາຍ"
                        value={editedProvider.cv}
                        onChange={(e) => handleFieldChange('cv', e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                      />
                    ) : (
                      <Typography paragraph mt={1}>
                        {editedProvider.cv}
                      </Typography>
                    )}

                    {editedProvider.cat_id === 5 && editedCar && (
                      <>
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" color="#611463" fontWeight="bold" display="flex" alignItems="center">
                            <CarIcon sx={{ mr: 1 }} />
                            ຂໍ້ມູນລົດ (ບໍ່ສາມາດແກ້ໄຂໄດ້)
                          </Typography>

                          <Box
                            sx={{
                              mt: 2,
                              border: '1px solid',
                              borderColor: alpha('#611463', 0.2),
                              borderRadius: 2,
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              component="img"
                              src={editedCar.car_image}
                              alt={`${editedCar.car_brand} ${editedCar.model}`}
                              sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover'
                              }}
                            />

                            <Box sx={{ p: 2, bgcolor: 'white' }}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    ຍີ່ຫໍ້
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {editedCar.car_brand}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    ຮຸ່ນ
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {editedCar.model}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">
                                    ປ້າຍທະບຽນ
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{
                                      display: 'inline-block',
                                      bgcolor: '#611463',
                                      color: 'white',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 1,
                                      mt: 0.5
                                    }}
                                  >
                                    {editedCar.license_plate}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          )}
          <DialogActions sx={{ bgcolor: '#f5f5f5', px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              sx={{
                borderColor: '#611463',
                color: '#611463'
              }}
            >
              ຍົກເລີກ
            </Button>
            {!isEditing && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#611463',
                  '&:hover': {
                    bgcolor: '#4e1050'
                  }
                }}
                onClick={handleEditClick}
                startIcon={<EditIcon />}
              >
                ແກ້ໄຂຂໍ້ມູນ
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Status Change Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Service provider card component
const ServiceProviderCard: React.FC<{
  provider: ServiceProvider;
  onViewDetails: (provider: ServiceProvider) => void;
  onStatusChange: (id: number, newStatus: 'active' | 'inactive') => void;
}> = ({ provider, onViewDetails, onStatusChange }) => {
  const isMovingService = provider.cat_id === 5;
  const [status, setStatus] = useState<'active' | 'inactive'>(provider.status as 'active' | 'inactive');

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'active' : 'inactive';
    setStatus(newStatus);
    onStatusChange(provider.id, newStatus);
    event.stopPropagation();
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid',
        borderColor: alpha('#000', 0.08),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px -6px rgba(97, 20, 99, 0.25)'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: status === 'active' ? alpha('#4caf50', 0.9) : alpha('#f44336', 0.9),
          color: 'white',
          borderRadius: 5,
          px: 1,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}
      >
        <Switch
          size="small"
          checked={status === 'active'}
          onChange={handleStatusChange}
          sx={{
            mr: 0.5,
            '& .MuiSwitch-thumb': {
              bgcolor: 'white'
            },
            '& .MuiSwitch-track': {
              bgcolor: 'rgba(255, 255, 255, 0.3) !important'
            }
          }}
        />
        {status === 'active' ? 'Available' : 'Unavailable'}
      </Box>

      {/* Provider image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={provider.avatar}
          alt={`${provider.first_name} ${provider.last_name}`}
        />

        {/* Category chip */}
        <Chip
          icon={getCategoryIcon(provider.cat_name) as React.ReactElement}
          label={provider.cat_name}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'bold',
            color: '#611463',
            border: '1px solid',
            borderColor: alpha('#611463', 0.3)
          }}
        />

        {/* Rating & price */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display="flex" alignItems="center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                fontSize="small"
                sx={{ color: '#f7931e' }}
              />
            ))}
          </Box>
          <Typography variant="body2" fontWeight="medium">
            {formatPrice(provider.price)}
          </Typography>
        </Box>

        {/* Moving service badge */}
        {isMovingService && provider.car && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              bgcolor: '#f7931e',
              color: 'white',
              py: 0.5,
              px: 1,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <CarIcon fontSize="small" />
            <Typography variant="caption" fontWeight="bold">
              ຂໍ້ມູນລົດ
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#611463',
            fontSize: '1rem'
          }}
        >
          {provider.first_name} {provider.last_name}
        </Typography>

        <Box display="flex" alignItems="center" mt={0.5} mb={1}>
          <LocationIcon sx={{ fontSize: 16, color: '#f7931e', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {provider.city}
          </Typography>
        </Box>

        {/* Car details for moving services */}
        {isMovingService && provider.car && (
          <Paper
            elevation={0}
            sx={{
              p: 1,
              mb: 1,
              borderRadius: 1,
              bgcolor: alpha('#f7931e', 0.05),
              border: '1px solid',
              borderColor: alpha('#f7931e', 0.1)
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  ລາຍລະອຽດລົດ
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                  {provider.car.car_brand} {provider.car.model}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  ປ້າຍທະບຽນ
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: 'inline-block',
                    bgcolor: '#611463',
                    color: 'white',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: '0.7rem'
                  }}
                >
                  {provider.car.license_plate}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={() => onViewDetails(provider)}
          sx={{
            mt: 'auto',
            bgcolor: '#611463',
            '&:hover': {
              bgcolor: '#4e1050'
            },
            textTransform: 'none'
          }}
        >
          ເບິ່ງລາຍລະອຽດ
        </Button>
      </CardContent>
    </Card>
  );
};

// Define service category interface
interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  categoryType: string;
}

// Define ServiceProvider interface
interface ServiceProvider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password?: string;
  address: string;
  gender?: string;
  cv: string;
  avatar: string;
  cat_id: number;
  cat_name?: string;
  price: number;
  status: string;
  city?: string;
  categoryType: string;
  car?: CarModel;
}

export default ServiceProviderAdmin;