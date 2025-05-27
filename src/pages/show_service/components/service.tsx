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
  IconButton,
  Paper,
  Tabs,
  Tab,
  alpha,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  CleaningServices as RepairIcon,
  ElectricBolt as ElectricalIcon,
  AcUnit as AirconIcon,
  Plumbing as PlumbingIcon,
  LocalShipping as MovingIcon,
  Bathroom as BathroomIcon,
  PestControl as PestIcon,
  DirectionsCar as CarIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import useMainController from '../controllers/index';
import { CarModel } from '../../../models/car';
import axios from 'axios';
import ServiceProviderDetailDialog from './serviceDialog';

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

// Define service category interface
interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  categoryType: string;
}

// Define Category interface from API
export interface Category {
  id: number;
  name: string;
  des?: string;
  image?: string;
}

// Define ServiceProvider interface
export interface ServiceProvider {
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
  actualRating?: number; // Add actual rating field
}

// Helper function to translate English city names to Lao for display
export const displayCityInLao = (englishCity: string | undefined): string => {
  if (!englishCity) return '';
  const cityObj = cities.find(c => c.en === englishCity);
  return cityObj ? cityObj.lo : englishCity;
};

// Format price with currency
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice ? `${numPrice.toLocaleString()} LAK` : '0 LAK';
};

// Get appropriate icon for category
export const getCategoryIcon = (categoryName: string | undefined): React.ReactNode => {
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

// Get category type from name for filtering
export const getCategoryTypeFromName = (catName: string | undefined): string => {
  const normalizedName = (catName || '').toLowerCase();
  
  if (normalizedName.includes('cleaning') || normalizedName.includes('ທຳຄວາມສະອາດ')) return 'cleaning';
  if (normalizedName.includes('electrical') || normalizedName.includes('ສ້ອມແປງໄຟຟ້າ')) return 'electrical';
  if (normalizedName.includes('aircon') || normalizedName.includes('ສ້ອງແປງແອ') || normalizedName.includes('ແອ')) return 'aircon';
  if (normalizedName.includes('plumbing') || normalizedName.includes('ສ້ອມແປງນ້ຳປະປາ')) return 'plumbing';
  if (normalizedName.includes('moving') || normalizedName.includes('ແກ່ເຄື່ອງ')) return 'moving';
  if (normalizedName.includes('bathroom') || normalizedName.includes('ດູດສ້ວມ')) return 'bathroom';
  if (normalizedName.includes('pest') || normalizedName.includes('ກຳຈັດປວກ')) return 'pest';
  return 'other';
};

// Main Service Provider Management Component
const ServiceProviderAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { 
    loading, 
    error, 
    serviceProviders, 
    handleNavigate,
    handleUpdateEmployee,
    handleUpdateCar,
    handleUpdateStatus,
    handleDeleteEmployee,
    getEmployeeRating // Add rating function
  } = useMainController();

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Fetch categories from API
  const fetchCategories = async (): Promise<void> => {
    try {
      console.log("Fetching categories...");
      const res = await axios.get(
        "https://homecare-pro.onrender.com/categories/read_categories",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Categories fetched:", res.data);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSnackbar({
        open: true,
        message: "ບໍ່ສາມາດດຶງຂໍ້ມູນປະເພດບໍລິການໄດ້",
        severity: "error"
      });
    }
  };
  
  // Load categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Define service categories for tabs
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
      title: 'ສ້ອມແປງແອ',
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
  const handleCategoryChange = (event: React.SyntheticEvent, categoryId: string) => {
    setActiveTab(categoryId);
  };

  // View provider details
  const handleViewDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  // Close detail dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle status change using controller
  const handleProviderStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      await handleUpdateStatus(id, newStatus);
      setSnackbar({
        open: true,
        message: `ການອັບເດດສະຖານະສຳເລັດ ${newStatus}`,
        severity: "success"
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: "ການອັບເດດສະຖານະລົ້ມເຫຼວ",
        severity: "error"
      });
    }
  };

  // Handle delete using controller
  const handleDeleteProviderAction = async (id: number) => {
    try {
      await handleDeleteEmployee(id);
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: "ລຶບຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດ",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting provider:", error);
      setSnackbar({
        open: true,
        message: "ລຶບຂໍ້ມູນຜູ້ໃຫ້ບໍລິການລົ້ມເຫຼວ",
        severity: "error"
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter providers based on active category and search query
  const getFilteredProviders = () => {
    let filtered = serviceProviders;
    
    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(provider => provider.categoryType === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(provider => 
        // Search by name
        `${provider.first_name} ${provider.last_name}`.toLowerCase().includes(query) ||
        // Search by category
        (provider.cat_name && provider.cat_name.toLowerCase().includes(query)) ||
        // Search by city
        (provider.city && displayCityInLao(provider.city).toLowerCase().includes(query)) ||
        // Search by address
        (provider.address && provider.address.toLowerCase().includes(query)) ||
        // Search by price
        (provider.price && provider.price.toString().includes(query)) ||
        // Search by status
        (provider.status && provider.status.toLowerCase().includes(query)) ||
        // Search by car details (if available)
        (provider.car && provider.car.car_brand && provider.car.car_brand.toLowerCase().includes(query)) ||
        (provider.car && provider.car.model && provider.car.model.toLowerCase().includes(query)) ||
        (provider.car && provider.car.license_plate && provider.car.license_plate.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Handle successful update
  const handleSuccessfulUpdate = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "success"
    });
    setDialogOpen(false);
  };

  const filteredProviders = getFilteredProviders();

  // Get counts for stats
  const totalProviders = serviceProviders.length;
  const movingProviders = serviceProviders.filter(p => p.cat_id === 5).length;
  const activeProviders = serviceProviders.filter(p => p.status === 'active').length;

  console.log("Current categories:", categories); // Debug categories
  
  return (
    <Box sx={{
      bgcolor: '#f9f9f9',
      minHeight: '100%',
      position: 'relative',
      marginLeft: '240px',
      width: 'calc(100% - 240px)'
    }}>
      {/* Category Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleCategoryChange}
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
          '& .Mui-selected': { color: '#f7931e' },
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
      
      {/* Search Box - Modern Design */}
      <Box sx={{ 
        my: 3, 
        px: { xs: 20, md: 3 },
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -15,
            left: -15,
            right: -15,
            bottom: -15,
            borderRadius: '50px',
            background: 'linear-gradient(135deg, rgba(97, 20, 99, 0.1), rgba(247, 147, 30, 0.1))',
            filter: 'blur(20px)',
            opacity: 0.6,
            zIndex: 0,
          }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ຄົ້ນຫາ..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #611463, #f7931e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    boxShadow: '0 4px 15px rgba(97, 20, 99, 0.3)',
                  }}>
                    <SearchIcon sx={{ color: '#fff', fontSize: '1.4rem' }} />
                  </Box>
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <Box
                    onClick={handleClearSearch}
                    sx={{ 
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(97, 20, 99, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        background: '#611463',
                        transform: 'scale(1.1)',
                        '& .MuiSvgIcon-root': {
                          color: '#fff'
                        }
                      }
                    }}
                  >
                    <ClearIcon sx={{ color: '#611463', fontSize: '1.2rem', transition: 'color 0.3s ease' }} />
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              position: 'relative',
              zIndex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(97, 20, 99, 0.08)',
                height: '60px',
                '& fieldset': {
                  border: '1px solid rgba(97, 20, 99, 0.1)',
                  transition: 'all 0.3s ease',
                },
                '&:hover fieldset': {
                  borderColor: '#f7931e',
                  boxShadow: '0 0 0 1px rgba(247, 147, 30, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#611463',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 3px rgba(97, 20, 99, 0.15)',
                },
              },
              '& .MuiInputBase-input': {
                padding: '12px 10px',
                fontSize: '1.1rem',
                color: '#611463',
                fontWeight: 500,
                '&::placeholder': {
                  opacity: 0.7,
                  color: '#611463',
                  fontWeight: 400,
                  fontSize: '1rem',
                },
              },
            }}
          />
          
          {/* Search helper text */}
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              bottom: '-24px',
              left: '20px',
              color: 'rgba(97, 20, 99, 0.6)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&::before': {
                content: '"✨"',
                fontSize: '0.8rem',
              }
            }}
          >
            ຄົ້ນຫາຕາມຊື່, ປະເພດບໍລິການ, ທີ່ຢູ່, ແລະອື່ນໆ...
          </Typography>
        </Box>
      </Box>

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
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ໝວດໝູ່ການບໍລິການ
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Current Category Title with Search Results */}
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
            {searchQuery ? 
              `ຜົນຄົ້ນຫາສຳລັບ "${searchQuery}"` : 
              activeTab === 'all' ?
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
                    onStatusChange={handleProviderStatusChange}
                    getEmployeeRating={getEmployeeRating} // Pass rating function
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
                    {searchQuery ? 
                      `ບໍ່ພົບຜົນຄົ້ນຫາສຳລັບ "${searchQuery}"` : 
                      'ບໍ່ມີຜູ້ໃຫ້ບໍລິການໃນໝວດໝູ່ການບໍລິການນີ້'
                    }
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
                    onClick={() => {
                      setActiveTab('all');
                      setSearchQuery('');
                    }}
                  >
                    ເບິ່ງຜູ້ໃຫ້ບໍລິການທັງໝົດ
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Detail Dialog - Now a separate component */}
      {selectedProvider && (
        <ServiceProviderDetailDialog
          open={dialogOpen}
          provider={selectedProvider}
          categories={categories} // Pass categories here
          onClose={handleCloseDialog}
          onUpdateStatus={handleProviderStatusChange}
          onUpdateEmployee={handleUpdateEmployee}
          onUpdateCar={handleUpdateCar}
          onDeleteEmployee={handleDeleteProviderAction}
          onSuccess={handleSuccessfulUpdate}
          getEmployeeRating={getEmployeeRating} // Pass rating function
        />
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

// Service provider card component with dynamic ratings
const ServiceProviderCard: React.FC<{
  provider: ServiceProvider;
  onViewDetails: (provider: ServiceProvider) => void;
  onStatusChange: (id: number, newStatus: 'active' | 'inactive') => void;
  getEmployeeRating: (employeeId: string | number) => number;
}> = ({ provider, onViewDetails, onStatusChange, getEmployeeRating }) => {
  const isMovingService = provider.cat_id === 5;
  const [status, setStatus] = useState<'active' | 'inactive'>(provider.status as 'active' | 'inactive');

  // Get actual rating for this provider
  const actualRating = getEmployeeRating(provider.id);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'active' : 'inactive';
    setStatus(newStatus);
    onStatusChange(provider.id, newStatus);
    event.stopPropagation();
  };

  // Helper function to render stars with actual rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box key={i} sx={{ position: 'relative', display: 'inline-block' }}>
          {i <= actualRating ? (
            <StarIcon
              fontSize="small"
              sx={{ 
                color: '#f7931e',
                filter: 'drop-shadow(0 1px 2px rgba(247, 147, 30, 0.3))'
              }}
            />
          ) : (
            <StarOutlineIcon
              fontSize="small"
              sx={{ 
                color: '#E0E0E0',
                opacity: 0.6
              }}
            />
          )}
        </Box>
      );
    }
    return stars;
  };

  console.log(`Admin Card - Provider ${provider.id}: ${provider.first_name} ${provider.last_name}, Rating: ${actualRating}`);

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

        {/* Rating & price with actual rating */}
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2px 6px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {renderStars()}
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 0.5, 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '0.7rem'
              }}
            >
              {actualRating}/5
            </Typography>
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
            {displayCityInLao(provider.city)}
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

export default ServiceProviderAdmin;