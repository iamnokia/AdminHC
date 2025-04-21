import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FilterAlt as FilterIcon,
  FileDownload as DownloadIcon,
  Print as PrintIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Male as MaleIcon,
  Female as FemaleIcon
} from '@mui/icons-material';

// Sample data for providers
const providerData = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com",
    tel: "1234567890",
    password: "securePass123",
    address: "123 Main St, City, Country",
    gender: "male",
    cv: "cv.pdf",
    avatar: "avatar.jpg",
    cat_id: 2, // Moving category
    price: 100,
    status: "active",
    city: "SIKHOTTABONG",
    car: {
      emp_id: 1,
      car_brand: "Toyota",
      model: "Camry",
      license_plate: "ABC-1234",
      status: "ACTIVE"
    }
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "janesmith@example.com",
    tel: "0987654321",
    password: "securePass456",
    address: "456 Oak St, Town, Country",
    gender: "female",
    cv: "cv2.pdf",
    avatar: "avatar2.jpg",
    cat_id: 1, // Cleaning category
    price: 75,
    status: "inactive",
    city: "CHANTHABULY"
  },
  {
    id: 3,
    first_name: "Mike",
    last_name: "Johnson",
    email: "mikejohnson@example.com",
    tel: "5556667777",
    password: "securePass789",
    address: "789 Pine St, Village, Country",
    gender: "male",
    cv: "cv3.pdf",
    avatar: "avatar3.jpg",
    cat_id: 2, // Moving category
    price: 120,
    status: "active",
    city: "NAXAITHONG",
    car: {
      emp_id: 3,
      car_brand: "Honda",
      model: "Accord",
      license_plate: "XYZ-5678",
      status: "ACTIVE"
    }
  },
  {
    id: 4,
    first_name: "Sarah",
    last_name: "Williams",
    email: "sarahwilliams@example.com",
    tel: "1112223333",
    password: "securePass101",
    address: "101 Elm St, County, Country",
    gender: "female",
    cv: "cv4.pdf",
    avatar: "avatar4.jpg",
    cat_id: 3, // Plumbing category
    price: 90,
    status: "active",
    city: "XAYSETHA"
  },
  {
    id: 5,
    first_name: "David",
    last_name: "Brown",
    email: "davidbrown@example.com",
    tel: "4445556666",
    password: "securePass202",
    address: "202 Maple St, District, Country",
    gender: "male",
    cv: "cv5.pdf",
    avatar: "avatar5.jpg",
    cat_id: 2, // Moving category
    price: 110,
    status: "active",
    city: "HADXAIFONG",
    car: {
      emp_id: 5,
      car_brand: "Ford",
      model: "F-150",
      license_plate: "DEF-9012",
      status: "MAINTENANCE"
    }
  }
];

// Category mapping
const categoryMap = {
  1: "Cleaning",
  2: "Moving",
  3: "Plumbing",
  4: "Electrical",
  5: "Gardening"
};

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22'];

const ServiceProviderReport = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  
  // Reusable filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2, display: filterOpen ? 'block' : 'none' }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>Filter Options</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select label="Category" defaultValue="">
                <MenuItem value="">ປະເພດການບໍລິການທັງໝົດ</MenuItem>
                <MenuItem value="1">ອະນາໄມ</MenuItem>
                <MenuItem value="2">ຂົນຍ້າຍເຄື່ຶອງ</MenuItem>
                <MenuItem value="3">ດູດສ້ວມ</MenuItem>
                <MenuItem value="4">ສ້ອມແປງໄຟຟ້າ</MenuItem>
                <MenuItem value="5">ຕັດຫຍ້າ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select label="City" defaultValue="">
                <MenuItem value="">All Cities</MenuItem>
                <MenuItem value="CHANTHABULY">CHANTHABULY</MenuItem>
                <MenuItem value="SIKHOTTABONG">SIKHOTTABONG</MenuItem>
                <MenuItem value="XAYSETHA">XAYSETHA</MenuItem>
                <MenuItem value="SISATTANAK">SISATTANAK</MenuItem>
                <MenuItem value="NAXAITHONG">NAXAITHONG</MenuItem>
                <MenuItem value="XAYTANY">XAYTANY</MenuItem>
                <MenuItem value="HADXAIFONG">HADXAIFONG</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#611463', 
                  '&:hover': { bgcolor: '#4a0d4c' } 
                }}
                fullWidth
              >
                Apply
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  color: '#611463', 
                  borderColor: '#611463',
                  '&:hover': { borderColor: '#4a0d4c' } 
                }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
  // Reusable action buttons
  const ActionButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Button
        startIcon={<FilterIcon />}
        onClick={() => setFilterOpen(!filterOpen)}
        sx={{ 
          color: '#611463', 
          borderColor: '#611463',
          '&:hover': { borderColor: '#4a0d4c' } 
        }}
        variant="outlined"
      >
        Filters
      </Button>
      <Box>
        <Button
          startIcon={<DownloadIcon />}
          sx={{ 
            mr: 1,
            color: '#611463', 
            borderColor: '#611463',
            '&:hover': { borderColor: '#4a0d4c' } 
          }}
          variant="outlined"
        >
          Export
        </Button>
        <Button
          startIcon={<PrintIcon />}
          sx={{ 
            bgcolor: '#f7981e', 
            '&:hover': { bgcolor: '#e58b17' } 
          }}
          variant="contained"
        >
          Print
        </Button>
      </Box>
    </Box>
  );
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleRowExpansion = (id) => {
    setExpandedRows({
      ...expandedRows,
      [id]: !expandedRows[id]
    });
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === 'active') {
      return { bg: '#e6f7ee', text: '#2e7d32' };
    } else if (status?.toLowerCase() === 'maintenance') {
      return { bg: '#fff4e5', text: '#ed6c02' };
    } else {
      return { bg: '#ffebee', text: '#d32f2f' };
    }
  };
  
  // Category distribution data for the pie chart
  const categoryDistribution = [
    { name: 'Cleaning', value: providerData.filter(p => p.cat_id === 1).length },
    { name: 'Moving', value: providerData.filter(p => p.cat_id === 2).length },
    { name: 'Plumbing', value: providerData.filter(p => p.cat_id === 3).length },
    { name: 'Electrical', value: providerData.filter(p => p.cat_id === 4).length },
    { name: 'Gardening', value: providerData.filter(p => p.cat_id === 5).length }
  ].filter(item => item.value > 0);
  
  // Status distribution data
  const statusDistribution = [
    { name: 'Active', value: providerData.filter(p => p.status?.toLowerCase() === 'active').length },
    { name: 'Inactive', value: providerData.filter(p => p.status?.toLowerCase() === 'inactive').length }
  ];
  
  // Price range data
  const priceRangeData = [
    { range: '0-50', count: providerData.filter(p => p.price <= 50).length },
    { range: '51-100', count: providerData.filter(p => p.price > 50 && p.price <= 100).length },
    { range: '101-150', count: providerData.filter(p => p.price > 100 && p.price <= 150).length },
    { range: '151+', count: providerData.filter(p => p.price > 150).length }
  ];
  
  return (
    <Box>
      <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
        ລາຍງານຜູ້ໃຫ້ບໍລິການ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ 
          mb: 2,
          '& .MuiTabs-indicator': {
            backgroundColor: '#611463',
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#611463',
          }
        }}
      >
        <Tab label="ຜູ້ໃຊ້ບໍລິການທັງໝົດ" />
        <Tab label="ຜູ້ໃຊ້ບໍລິການຂົນຍ້າຍ" />
        <Tab label="ສະຖິຕິຂອງຜູ້ໃຊ້ບໍລິການ" />
      </Tabs>
      
      {/* Tab 1: All Providers */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle1" mb={3} fontWeight="bold">
            ລາຍຊື່ຜູ້ໃຫ້ບໍລິການ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ຜູ້ໃຫ້ບໍລິການ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ປະເພດ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ຕິດຕໍ່</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ລາຄາ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ເມືອງ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ສະຖານະ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ການຈັດການ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providerData.map((provider) => {
                  const statusColor = getStatusColor(provider.status);
                  return (
                    <React.Fragment key={provider.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(provider.id)}
                          >
                            {expandedRows[provider.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, bgcolor: provider.gender === 'male' ? '#1976d2' : '#e91e63' }}>
                              {provider.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {provider.first_name} {provider.last_name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {provider.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={categoryMap[provider.cat_id] || 'Unknown'} 
                            size="small"
                            sx={{ 
                              bgcolor: provider.cat_id === 2 ? '#f7981e' : '#611463',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{provider.email}</Typography>
                          <Typography variant="caption">{provider.tel}</Typography>
                        </TableCell>
                        <TableCell>${provider.price}/hr</TableCell>
                        <TableCell>{provider.city}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: statusColor.bg,
                            color: statusColor.text,
                            width: 'fit-content'
                          }}>
                            {provider.status?.toLowerCase() === 'active' ? 
                              <ActiveIcon fontSize="small" sx={{ mr: 0.5 }} /> : 
                              <InactiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                            }
                            <Typography variant="caption" fontWeight="bold">
                              {provider.status?.toUpperCase()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#611463', 
                              color: '#611463',
                              textTransform: 'none',
                              mr: 1
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ 
                              bgcolor: '#f7981e',
                              textTransform: 'none'
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                          <Collapse in={expandedRows[provider.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 2, px: 4, bgcolor: '#f9f9f9' }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Address
                                  </Typography>
                                  <Typography variant="body2" paragraph>
                                    {provider.address}
                                  </Typography>
                                  
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Documents
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ textTransform: 'none' }}
                                    >
                                      View CV
                                    </Button>
                                  </Box>
                                </Grid>
                                {provider.cat_id === 2 && provider.car && (
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                      Vehicle Information
                                    </Typography>
                                    <Box sx={{ mb: 1 }}>
                                      <Typography variant="body2">
                                        <strong>Brand:</strong> {provider.car.car_brand}
                                      </Typography>
                                      <Typography variant="body2">
                                        <strong>Model:</strong> {provider.car.model}
                                      </Typography>
                                      <Typography variant="body2">
                                        <strong>License Plate:</strong> {provider.car.license_plate}
                                      </Typography>
                                      <Typography variant="body2">
                                        <strong>Status:</strong>{' '}
                                        <Box component="span" sx={{ 
                                          px: 1, 
                                          py: 0.2, 
                                          borderRadius: 1,
                                          bgcolor: getStatusColor(provider.car.status).bg,
                                          color: getStatusColor(provider.car.status).text,
                                          fontSize: '0.8rem'
                                        }}>
                                          {provider.car.status}
                                        </Box>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {providerData.length} of {providerData.length} providers
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined"
                sx={{ 
                  minWidth: 0, 
                  p: 1,
                  color: '#611463',
                  borderColor: '#611463'
                }}
              >
                &lt;
              </Button>
              <Button 
                size="small" 
                variant="contained"
                sx={{ 
                  minWidth: 0, 
                  p: 1,
                  bgcolor: '#611463'
                }}
              >
                1
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                sx={{ 
                  minWidth: 0, 
                  p: 1,
                  color: '#611463',
                  borderColor: '#611463'
                }}
              >
                &gt;
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Tab 2: Moving Providers with Car Information */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle1" mb={3} fontWeight="bold">
            ລາຍຊື່ຜູ້ໃຫ້ບໍລິການດ້ວຍຍານພາຫະນະ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ລາຍຊື່ຜູ້ໃຫ້ບໍລິການ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ຕິດຕໍ່</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ລາຄາ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ລູ້ນລົດ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ຍີຫໍ້ລົດ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ປ້າຍທະບຽນ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ສະຖານະ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ການຈັດການ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providerData
                  .filter(provider => provider.cat_id === 2 && provider.car)
                  .map((provider) => {
                    const carStatusColor = getStatusColor(provider.car.status);
                    return (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, bgcolor: '#f7981e' }}>
                              {provider.first_name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {provider.first_name} {provider.last_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{provider.email}</Typography>
                          <Typography variant="caption">{provider.tel}</Typography>
                        </TableCell>
                        <TableCell>${provider.price}/hr</TableCell>
                        <TableCell>{provider.car.car_brand}</TableCell>
                        <TableCell>{provider.car.model}</TableCell>
                        <TableCell>{provider.car.license_plate}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: carStatusColor.bg,
                            color: carStatusColor.text,
                            fontSize: '0.875rem'
                          }}>
                            {provider.car.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#611463', 
                              color: '#611463',
                              textTransform: 'none',
                              mr: 1
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ 
                              bgcolor: '#f7981e',
                              textTransform: 'none'
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {/* Tab 3: Provider Statistics */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ຜູ້ໃຊ້ບໍລິການຕາມໝວດໝູ່
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ສະຖານະຂອງຜູ້ໃຫ້ບໍລິການແບບສະເລ່ຍ
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#4caf50" />
                    <Cell fill="#f44336" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ອັດຕາທີ່ເພີ່ມຂຶ້ນຂອງລາຄາແຕ່ລະໄລຍະ
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" label={{ value: 'Price Range ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Number of Providers', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#611463" name="Providers" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ServiceProviderReport;