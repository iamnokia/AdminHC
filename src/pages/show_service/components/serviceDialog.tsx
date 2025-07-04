import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  alpha,
  Switch,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DirectionsCar as CarIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CameraAlt as CameraAltIcon
} from '@mui/icons-material';
import { ServiceProvider, getCategoryIcon, displayCityInLao, formatPrice, getCategoryTypeFromName } from './service';
import { CarModel } from '../../../models/car';

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

// Available genders
const genders = [
  { en: 'Male', lo: 'ຊາຍ' },
  { en: 'Female', lo: 'ຍິງ' },
  { en: 'Other', lo: 'ອື່ນໆ' }
];

// Helper function to translate English gender values to Lao for display
const displayGenderInLao = (englishGender: string | undefined): string => {
  if (!englishGender) return '';
  const genderObj = genders.find(g => g.en === englishGender);
  return genderObj ? genderObj.lo : englishGender;
};

// Define Category interface from API
interface Category {
  id: number;
  name: string;
  des?: string;
  image?: string;
}

interface ServiceProviderDetailDialogProps {
  open: boolean;
  provider: ServiceProvider;
  categories: Category[];
  onClose: () => void;
  onUpdateStatus: (id: number, newStatus: 'active' | 'inactive') => void;
  onUpdateEmployee: (id: number, data: any, imageFile?: File) => Promise<any>;
  onUpdateCar: (id: number, data: any, imageFile?: File) => Promise<any>;
  onDeleteEmployee: (id: number) => Promise<any>;
  onSuccess: (message: string) => void;
  getEmployeeRating: (employeeId: string | number) => number; // Add rating function
}

const ServiceProviderDetailDialog: React.FC<ServiceProviderDetailDialogProps> = ({
  open,
  provider,
  categories,
  onClose,
  onUpdateStatus,
  onUpdateEmployee,
  onUpdateCar,
  onDeleteEmployee,
  onSuccess,
  getEmployeeRating // Add rating function prop
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProvider, setEditedProvider] = useState<ServiceProvider | null>(null);
  const [editedCar, setEditedCar] = useState<CarModel | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [carImageFile, setCarImageFile] = useState<File | null>(null);
  const [carImagePreview, setCarImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get actual rating for this provider
  const actualRating = getEmployeeRating ? getEmployeeRating(provider.id) : 5;

  // Debug the props
  console.log("Dialog opened with categories:", categories);
  console.log("Provider:", provider);
  console.log("Provider actual rating:", actualRating);

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

  // Initialize edited provider when dialog opens
  useEffect(() => {
    if (open && provider) {
      setEditedProvider({ ...provider });
      if (provider.car) {
        setEditedCar({ ...provider.car });
      } else {
        setEditedCar(null);
      }
      setImageFile(null);
      setImagePreview(null);
      setCarImageFile(null);
      setCarImagePreview(null);
      setIsEditing(false);
      setErrors({});
    }
  }, [open, provider]);

  // Close detail dialog
  const handleCloseDialog = () => {
    onClose();
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setCarImageFile(null);
    setCarImagePreview(null);
    setErrors({});
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (provider) {
      setEditedProvider({ ...provider });
      if (provider.car) {
        setEditedCar({ ...provider.car });
      } else {
        setEditedCar(null);
      }
    }
    setImageFile(null);
    setImagePreview(null);
    setCarImageFile(null);
    setCarImagePreview(null);
    setIsEditing(false);
    setErrors({});
  };

  // Validate form fields
  const validateField = (field: string, value: any): string | null => {
    if (!value && field !== 'avatar' && field !== 'car_image') {
      return 'This field is required';
    }
    
    if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    
    if (field === 'tel' && value && !/^\+85620\d{8}$/.test(value.toString().replace(/\s/g, ""))) {
      return 'Please enter a valid phone number with 8 digits after +85620';
    }
    
    if (field === 'price' && (isNaN(value) || value <= 0)) {
      return 'Please enter a valid price';
    }
    
    return null;
  };

  // Handle field change in edit mode with validation
  const handleFieldChange = (field: keyof ServiceProvider, value: any) => {
    if (editedProvider) {
      // Validate the field
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      if (field === 'cat_id') {
        // When changing category, also update cat_name and categoryType
        const categoryList = [
          { id: 1, name: "ທຳຄວາມສະອາດ" },
          { id: 2, name: "ສ້ອມແປງໄຟຟ້າ" },
          { id: 3, name: "ສ້ອມແປງແອ" },
          { id: 4, name: "ສ້ອມແປງນ້ຳປະປາ" },
          { id: 5, name: "ແກ່ເຄື່ອງ" },
          { id: 6, name: "ດູດສ້ວມ" },
          { id: 7, name: "ກຳຈັດປວກ" }
        ];
        
        const selectedCategory = categoryList.find(cat => cat.id === parseInt(value.toString()));
        console.log("Selected category:", selectedCategory);
        
        const categoryName = selectedCategory ? selectedCategory.name : '';
        const categoryType = getCategoryTypeFromName(categoryName);
        
        setEditedProvider({
          ...editedProvider,
          [field]: parseInt(value.toString()),
          cat_name: categoryName,
          categoryType: categoryType
        });
        
        // If switching to or from moving service, handle car data
        if (parseInt(value.toString()) === 5 && !editedCar) {
          // Create empty car data if switching to moving service
          setEditedCar({
            id: 0, // Will be assigned by backend
            emp_id: editedProvider.id,
            car_brand: '',
            model: '',
            license_plate: '',
            car_image: ''
          });
        } else if (parseInt(value.toString()) !== 5 && editedCar) {
          // Clear car data if switching from moving service
          setEditedCar(null);
        }
      } else {
        setEditedProvider({
          ...editedProvider,
          [field]: value
        });
      }
    }
  };

  // Handle car field change in edit mode
  const handleCarFieldChange = (field: keyof CarModel, value: any) => {
    if (editedCar) {
      // Validate the field
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      setEditedCar({
        ...editedCar,
        [field]: value
      });
    }
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle car image selection
  const handleCarImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCarImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['first_name', 'last_name', 'email', 'tel', 'address', 'cat_id', 'price', 'city'];
    
    if (editedProvider) {
      requiredFields.forEach(field => {
        const value = editedProvider[field as keyof ServiceProvider];
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      });
    }
    
    // Validate car fields if it's a moving service
    if (editedProvider?.cat_id === 5 && editedCar) {
      ['car_brand', 'model', 'license_plate'].forEach(field => {
        const value = editedCar[field as keyof CarModel];
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save provider
  const handleSaveProvider = async () => {
    try {
      if (!editedProvider) return;
      
      // Validate form before submission
      if (!validateForm()) {
        return;
      }

      // Convert the price to a number if it's a string
      const price = typeof editedProvider.price === 'string' 
        ? parseFloat(editedProvider.price) 
        : editedProvider.price;

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
        cat_id: parseInt(editedProvider.cat_id.toString()), // Ensure it's a number
        price: price,
        status: editedProvider.status,
        city: editedProvider.city
      };

      console.log("Sending data to update:", dataToUpdate);

      // Call controller function with optional image file
      await onUpdateEmployee(editedProvider.id, dataToUpdate, imageFile || undefined);

      // If provider is moving service (cat_id 5) and car data exists
      if (parseInt(editedProvider.cat_id.toString()) === 5 && editedCar) {
        console.log("Updating car data for moving service provider");
        
        // For new car (id is 0) - use handleCreateCar controller method
        if (editedCar.id === 0) {
          console.log("Creating new car for employee ID:", editedProvider.id);
          const newCarData = {
            emp_id: editedProvider.id,
            car_brand: editedCar.car_brand,
            model: editedCar.model,
            license_plate: editedCar.license_plate
          };
          
          console.log("New car data:", newCarData);
          await handleCreateCar(newCarData, carImageFile || undefined);
        } else {
          // Update existing car
          console.log("Updating existing car ID:", editedCar.id);
          const existingCarData = {
            car_brand: editedCar.car_brand,
            model: editedCar.model,
            license_plate: editedCar.license_plate
          };
          
          console.log("Car update data:", existingCarData);
          await onUpdateCar(editedCar.id, existingCarData, carImageFile || undefined);
        }
      }

      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      setCarImageFile(null);
      setCarImagePreview(null);
      setErrors({});
      
      onSuccess("ການແກ້ຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດ");
    } catch (error) {
      console.error("Error saving provider:", error);
      setErrors({ general: "Failed to save provider information. Please check console for details." });
    }
  };

  // Handle provider status change
  const handleProviderStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      await onUpdateStatus(id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  // Make sure we have both provider and categories data
  if (!editedProvider) return null;

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: '#611463',
          color: 'white',
          display:'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {getCategoryIcon(editedProvider.cat_name)}
          <Typography variant="h6">
            ຂໍ້ມູນການໃຫ້ບໍລິການຂອງ {editedProvider.first_name} {editedProvider.last_name}
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
                onClick={() => onDeleteEmployee(editedProvider.id)}
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
      <DialogContent sx={{ p: 0 }}>
        {errors.general && (
          <Box sx={{ p: 2, bgcolor: alpha('#f44336', 0.1) }}>
            <Typography color="error">{errors.general}</Typography>
          </Box>
        )}
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
                {/* Avatar with edit capability */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Box
                    component="img"
                    src={imagePreview || editedProvider.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: '4px solid',
                      borderColor: '#f7931e',
                      objectFit: 'cover'
                    }}
                    alt={`${editedProvider.first_name} ${editedProvider.last_name}`}
                  />
                  
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: '#611463',
                        color: 'white',
                        '&:hover': { bgcolor: '#4e1050' },
                        padding: '8px',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }}
                      component="label"
                    >
                      <CameraAltIcon fontSize="small" />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleImageSelect}
                      />
                    </IconButton>
                  )}
                </Box>
                
                {isEditing ? (
                  <>
                    <TextField
                      label="ຊື່"
                      value={editedProvider.first_name}
                      onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      fullWidth
                      margin="normal"
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                    />
                    <TextField
                      label="ນາມສະກຸນ"
                      value={editedProvider.last_name}
                      onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      fullWidth
                      margin="normal"
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                    />
                  </>
                ) : (
                  <Typography variant="h5" fontWeight="bold">
                    {editedProvider.first_name} {editedProvider.last_name}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" mt={1} flexDirection="column" gap={1}>
                  <Chip
                    icon={getCategoryIcon(editedProvider.cat_name) as React.ReactElement}
                    label={editedProvider.cat_name}
                    sx={{
                      bgcolor: alpha('#611463', 0.1),
                      color: '#611463',
                      fontWeight: 'bold'
                    }}
                  />
                  {/* Dynamic star rating display */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}>
                    {renderStars()}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        ml: 0.5, 
                        fontWeight: 'bold', 
                        color: '#FF8C00',
                        fontSize: '0.75rem'
                      }}
                    >
                      {actualRating}/5
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Status */}
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
                    if (!isEditing) {
                      handleProviderStatusChange(editedProvider.id, newStatus);
                    }
                  }}
                  color={editedProvider.status === 'active' ? 'success' : 'error'}
                />
              </Paper>

              {/* Service Category */}
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="h6" color="#611463" fontWeight="bold">
                  ປະເພດການບໍລິການ
                </Typography>
                {isEditing ? (
                  <Box sx={{ position: 'relative' }}>
                    <FormControl fullWidth margin="normal" error={!!errors.cat_id}>
                      <InputLabel id="category-select-label">ເລືອກປະເພດການບໍລິການ</InputLabel>
                      <Select
                        labelId="category-select-label"
                        value={editedProvider.cat_id}
                        label="ເລືອກປະເພດການບໍລິການ"
                        onChange={(e) => handleFieldChange('cat_id', e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 'auto',
                              zIndex: 9999
                            },
                          },
                        }}
                      >
                        {[
                          { id: 1, name: "ທຳຄວາມສະອາດ" },
                          { id: 2, name: "ສ້ອມແປງໄຟຟ້າ" },
                          { id: 3, name: "ສ້ອມແປງແອ" },
                          { id: 4, name: "ສ້ອມແປງນ້ຳປະປາ" },
                          { id: 5, name: "ແກ່ເຄື່ອງ" },
                          { id: 6, name: "ດູດສ້ວມ" },
                          { id: 7, name: "ກຳຈັດປວກ" }
                        ].map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.cat_id && <FormHelperText>{errors.cat_id}</FormHelperText>}
                    </FormControl>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" mt={1}>
                    {getCategoryIcon(editedProvider.cat_name)}
                    <Typography sx={{ ml: 1 }}>
                      {editedProvider.cat_name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* General Info */}
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
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <TextField
                      label="ເບີໂທລະສັບ"
                      value={editedProvider.tel}
                      onChange={(e) => handleFieldChange('tel', e.target.value)}
                      fullWidth
                      margin="normal"
                      error={!!errors.tel}
                      helperText={errors.tel}
                    />
                    <TextField
                      label="ທີ່ຢູ່"
                      value={editedProvider.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address}
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
                  <FormControl fullWidth margin="normal" error={!!errors.city}>
                    <InputLabel>ເມືອງ</InputLabel>
                    <Select
                      value={editedProvider.city || ''}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      label="ເມືອງ"
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.en} value={city.en}>
                          {city.lo}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                  </FormControl>
                ) : (
                  <Typography mt={1}>
                    {displayCityInLao(editedProvider.city)}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="#611463" fontWeight="bold">
                  ເພດ
                </Typography>
                {isEditing ? (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>ເພດ</InputLabel>
                    <Select
                      value={editedProvider.gender || ''}
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
                      label="ເພດ"
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender.en} value={gender.en}>
                          {gender.lo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    error={!!errors.price}
                    helperText={errors.price}
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
                  value={editedProvider.cv || ''}
                  onChange={(e) => handleFieldChange('cv', e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!errors.cv}
                  helperText={errors.cv}
                />
              ) : (
                <Typography paragraph mt={1}>
                  {editedProvider.cv || 'ບໍ່ມີລາຍລະອຽດ'}
                </Typography>
              )}

              {/* Car details section - Only show for Moving Service (cat_id === 5) */}
              {editedProvider.cat_id === 5 && (
                <>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="#611463" fontWeight="bold" display="flex" alignItems="center">
                      <CarIcon sx={{ mr: 1 }} />
                      ຂໍ້ມູນລົດ
                    </Typography>

                    {/* If car data exists, show it, otherwise show a message to create it */}
                    {editedCar ? (
                      <Box
                        sx={{
                          mt: 2,
                          border: '1px solid',
                          borderColor: alpha('#611463', 0.2),
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={carImagePreview || editedCar.car_image}
                            alt={`${editedCar.car_brand} ${editedCar.model}`}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover'
                            }}
                          />
                          
                          {isEditing && (
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: '#611463',
                                color: 'white',
                                '&:hover': { bgcolor: '#4e1050' },
                                padding: '8px',
                                borderRadius: '50%',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                              component="label"
                            >
                              <CameraAltIcon fontSize="small" />
                              <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleCarImageSelect}
                              />
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ p: 2, bgcolor: 'white' }}>
                          <Grid container spacing={2}>
                            {isEditing ? (
                              <>
                                <Grid item xs={6}>
                                  <TextField
                                    label="ຍີ່ຫໍ້"
                                    value={editedCar.car_brand || ''}
                                    onChange={(e) => handleCarFieldChange('car_brand', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.car_brand}
                                    helperText={errors.car_brand}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    label="ຮຸ່ນ"
                                    value={editedCar.model || ''}
                                    onChange={(e) => handleCarFieldChange('model', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.model}
                                    helperText={errors.model}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    label="ປ້າຍທະບຽນ"
                                    value={editedCar.license_plate || ''}
                                    onChange={(e) => handleCarFieldChange('license_plate', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.license_plate}
                                    helperText={errors.license_plate}
                                  />
                                </Grid>
                              </>
                            ) : (
                              <>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    ຍີ່ຫໍ້ ແລະ ຮຸ່ນ
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {editedCar.car_brand} {editedCar.model}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
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
                              </>
                            )}
                          </Grid>
                        </Box>
                      </Box>
                    ) : (
                      // If car data doesn't exist for a moving service provider
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 2,
                          p: 3,
                          borderRadius: 2,
                          bgcolor: 'white',
                          border: '1px dashed',
                          borderColor: alpha('#611463', 0.3),
                          textAlign: 'center'
                        }}
                      >
                        <Typography color="text.secondary" gutterBottom>
                          ຍັງບໍ່ມີຂໍ້ມູນລົດສຳລັບຜູ້ໃຫ້ບໍລິການນີ້
                        </Typography>
                        {isEditing && (
                          <Button
                            variant="contained"
                            sx={{
                              mt: 1,
                              bgcolor: '#611463',
                              '&:hover': {
                                bgcolor: '#4e1050'
                              }
                            }}
                            onClick={() => {
                              // Create a new car object for this provider
                              setEditedCar({
                                id: 0, // Will be assigned by backend
                                emp_id: editedProvider.id,
                                car_brand: '',
                                model: '',
                                license_plate: '',
                                car_image: ''
                              });
                            }}
                          >
                            ເພີ່ມຂໍ້ມູນລົດ
                          </Button>
                        )}
                      </Paper>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
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
        {!isEditing ? (
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
        ) : (
          <Button
            variant="contained"
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#388E3C'
              }
            }}
            onClick={handleSaveProvider}
            startIcon={<SaveIcon />}
          >
            ບັນທຶກ
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ServiceProviderDetailDialog;