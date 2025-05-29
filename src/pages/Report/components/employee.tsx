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
  IconButton,
  CircularProgress
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

import { useServiceProviderReportController } from '../controllers/employee';
import '../css/employee.css';

// Category mapping
const categoryMap = {
  1: "ທຳຄວາມສະອາດ",
  2: "ສ້ອມແປງໄຟຟ້າ",
  3: "ສ້ອງແປງແອ",
  4: "ສ້ອມແປງນ້ຳປະປາ",
  5: "ແກ່ເຄື່ອງ",
  6: "ດູດສ້ວມ",
  7: "ກຳຈັດປວກ"
};

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22', '#3498db', '#e74c3c'];

const ServiceProviderReport = () => {
  const {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleCategoryChange,
    handleStatusChange,
    handleCityChange,
    applyFilters,
    resetFilters,
    loading,
    error,
    debugInfo,
    providerData,
    categoryDistribution,
    statusDistribution,
    priceRangeData,
    carProviders,
    tabValue,
    setTabValue,
    expandedRows,
    toggleRowExpansion,
    handleExport,
    handlePrint,
    useMockData,
    testAPI
  } = useServiceProviderReportController();
  
  // Reusable filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2, display: filterOpen ? 'block' : 'none' }} className="filter-panel no-print">
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>ຕົວເລືອກການຟິວເຕີ</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="ວັນທີເລີ່ມຕົ້ນ"
              type="date"
              name="startDate"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filterParams.startDate || ''}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="ວັນທີສິ້ນສຸດ"
              type="date"
              name="endDate"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filterParams.endDate || ''}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>ປະເພດການບໍລິການ</InputLabel>
              <Select 
                label="ປະເພດການບໍລິການ" 
                name="catId"
                value={filterParams.catId || ''}
                onChange={handleCategoryChange}
              >
                <MenuItem value="">ປະເພດການບໍລິການທັງໝົດ</MenuItem>
                <MenuItem value="1">ທຳຄວາມສະອາດ</MenuItem>
                <MenuItem value="2">ສ້ອມແປງໄຟຟ້າ</MenuItem>
                <MenuItem value="3">ສ້ອງແປງແອ</MenuItem>
                <MenuItem value="4">ສ້ອມແປງນ້ຳປະປາ</MenuItem>
                <MenuItem value="5">ແກ່ເຄື່ອງ</MenuItem>
                <MenuItem value="6">ດູດສ້ວມ</MenuItem>
                <MenuItem value="7">ກຳຈັດປວກ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>ສະຖານະ</InputLabel>
              <Select 
                label="ສະຖານະ" 
                name="status"
                value={filterParams.status || ''}
                onChange={handleStatusChange}
              >
                <MenuItem value="">ທັງໝົດ</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>ເມືອງ</InputLabel>
              <Select 
                label="ເມືອງ" 
                name="city"
                value={filterParams.city || ''}
                onChange={handleCityChange}
              >
                <MenuItem value="">ທັງໝົດ</MenuItem>
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
            <TextField
              label="ໜ້າ"
              type="number"
              name="page"
              size="small"
              fullWidth
              value={filterParams.page}
              onChange={handleFilterChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="ຈຳນວນຕໍ່ໜ້າ"
              type="number"
              name="limit"
              size="small"
              fullWidth
              value={filterParams.limit}
              onChange={handleFilterChange}
              inputProps={{ min: 1, max: 100 }}
            />
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
                onClick={applyFilters}
                disabled={loading}
              >
                ນຳໃຊ້
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  color: '#611463', 
                  borderColor: '#611463',
                  '&:hover': { borderColor: '#4a0d4c' } 
                }}
                onClick={resetFilters}
                disabled={loading}
              >
                ຕັ້ງຄ່າໃໝ່
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
  // Reusable action buttons
  const ActionButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }} className="no-print">
      <Button
        startIcon={<FilterIcon />}
        onClick={toggleFilter}
        sx={{ 
          color: '#611463', 
          borderColor: '#611463',
          '&:hover': { borderColor: '#4a0d4c' } 
        }}
        variant="outlined"
      >
        ຟິວເຕີ
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
          onClick={handleExport}
          disabled={loading || providerData.length === 0}
        >
          ສົ່ງອອກ
        </Button>
        <Button
          startIcon={<PrintIcon />}
          sx={{ 
            bgcolor: '#f7981e', 
            '&:hover': { bgcolor: '#e58b17' } 
          }}
          variant="contained"
          onClick={handlePrint}
          disabled={loading || providerData.length === 0}
        >
          ພິມ
        </Button>
      </Box>
    </Box>
  );
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Print header component
  const PrintHeader = () => (
    <div className="print-header print-only">
      <h1>ລາຍງານຜູ້ໃຫ້ບໍລິການ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} ເຖິງ {filterParams.endDate}</p>
      )}
      <p>ສ້າງເມື່ອ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
    </div>
  );

  // Print footer component
  const PrintFooter = () => (
    <div className="print-footer print-only">
      <p>ພິມວັນທີ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
      <p>ລາຍງານສ້າງໂດຍລະບົບການຈັດການບໍລິການ HomeCare</p>
    </div>
  );
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress sx={{ color: '#611463' }} size={60} />
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Typography color="#611463">ກຳລັງໂຫຼດຂໍ້ມູນ...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        my: 4, 
        p: 3, 
        border: '1px solid #f44336',
        borderRadius: 2,
        bgcolor: '#ffebee'
      }}>
        <Typography color="error.main" variant="h6" mb={1}>ເກີດຂໍ້ຜິດພາດ</Typography>
        <Typography color="error.main" mb={2}>{error}</Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={applyFilters}
            sx={{ color: '#611463', borderColor: '#611463' }}
          >
            ລອງໃໝ່
          </Button>
          <Button 
            variant="outlined" 
            onClick={useMockData}
            sx={{ color: '#f7981e', borderColor: '#f7981e' }}
          >
            ທົດສອບດ້ວຍຂໍ້ມູນຕົວຢ່າງ
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              console.log('Debug Info:', debugInfo);
              console.log('Current filters:', filterParams);
              alert('ກະລຸນາເປີດ Developer Console (F12) ເພື່ອເບິ່ງລາຍລະອຽດຂໍ້ຜິດພາດ');
            }}
            sx={{ color: '#666', borderColor: '#666' }}
            size="small"
          >
            ເບິ່ງລາຍລະອຽດ
          </Button>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box id="service-provider-report-print">
      <Typography variant="h5" mb={3} fontWeight="bold" color="#611463" className="no-print">
        ລາຍງານຜູ້ໃຫ້ບໍລິການ
      </Typography>
      
      <PrintHeader />
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
        className="no-print"
      >
        <Tab label="ຜູ້ໃຫ້ບໍລິການທັງໝົດ" />
        <Tab label=":" />
        <Tab label="ສະຖິຕິຂອງຜູ້ໃຫ້ບໍລິການ" />
      </Tabs>
      
      {/* Tab 1: All Providers */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
            ລາຍຊື່ຜູ້ໃຫ້ບໍລິການ
          </Typography>
          {providerData.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center'
            }}>
              <Typography variant="h6">ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ</Typography>
              <Typography variant="body2">ກະລຸນາປັບແຕ່ງຕົວເລືອກການຟິວເຕີແລະລອງໃໝ່</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={applyFilters}
                  sx={{ color: '#611463', borderColor: '#611463' }}
                  size="small"
                >
                  ລອງໃໝ່
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={useMockData}
                  sx={{ color: '#f7981e', borderColor: '#f7981e' }}
                  size="small"
                >
                  ທົດສອບດ້ວຍຂໍ້ມູນຕົວຢ່າງ
                </Button>
              </Box>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#fafafa' }}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ຜູ້ໃຫ້ບໍລິການ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ປະເພດ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ຕິດຕໍ່</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ລາຄາ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ທີ່ຢູ່</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ບ້ານ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ເມືອງ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ສະຖານະ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providerData.map((provider) => {
                    const statusColor = getStatusColor(provider.status || provider.service_status);
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
                              label={categoryMap[provider.cat_id] || provider.cat_name || 'ບໍ່ທາງລຳດັບ'} 
                              size="small"
                              sx={{ 
                                bgcolor: provider.cat_id === 5 ? '#f7981e' : '#611463',
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{provider.email}</Typography>
                            <Typography variant="caption">{provider.tel}</Typography>
                          </TableCell>
                          <TableCell>{provider.price || provider.amount || 0} ກີບ</TableCell>
                          <TableCell>{provider.address || '-'}</TableCell>
                          <TableCell>{provider.village || '-'}</TableCell>
                          <TableCell>{provider.city || provider.district || '-'}</TableCell>
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
                              {(provider.status?.toLowerCase() === 'active' || provider.service_status?.toLowerCase() === 'active') ? 
                                <ActiveIcon fontSize="small" sx={{ mr: 0.5 }} /> : 
                                <InactiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                              }
                              <Typography variant="caption" fontWeight="bold">
                                {provider.status?.toUpperCase() || provider.service_status?.toUpperCase() || 'INACTIVE'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Row */}
                        <TableRow>
                          <TableCell colSpan={10} sx={{ p: 0, border: 0 }}>
                            <Collapse in={expandedRows[provider.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ py: 2, px: 4, bgcolor: '#f9f9f9' }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                      ຂໍ້ມູນລະອຽດ
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                      <strong>ອີເມວ:</strong> {provider.email || '-'}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                      <strong>ເບີໂທ:</strong> {provider.tel || '-'}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                      <strong>ທີ່ຢູ່:</strong> {provider.address || '-'}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                      <strong>ເພດ:</strong> {provider.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}
                                    </Typography>
                                  </Grid>
                                  {provider.cat_id === 5 && (provider.car || provider.car_brand) && (
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        ຂໍ້ມູນລົດ
                                      </Typography>
                                      <Typography variant="body2" mb={1}>
                                        <strong>ຍີ່ຫໍ້:</strong> {provider.car?.car_brand || provider.car_brand || '-'}
                                      </Typography>
                                      <Typography variant="body2" mb={1}>
                                        <strong>ຮຸ່ນ:</strong> {provider.car?.model || provider.model || '-'}
                                      </Typography>
                                      <Typography variant="body2" mb={1}>
                                        <strong>ປ້າຍທະບຽນ:</strong> {provider.car?.license_plate || provider.license_plate || '-'}
                                      </Typography>
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
          )}
          
          {providerData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ສະແດງ {providerData.length} ລາຍການ
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
                  disabled={filterParams.page <= 1}
                  onClick={() => {
                    if (filterParams.page > 1) {
                      handleFilterChange({
                        target: { name: 'page', value: filterParams.page - 1 }
                      });
                      applyFilters();
                    }
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
                  {filterParams.page}
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
                  onClick={() => {
                    handleFilterChange({
                      target: { name: 'page', value: filterParams.page + 1 }
                    });
                    applyFilters();
                  }}
                >
                  &gt;
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}
     
      {/* Tab 3: Provider Statistics */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" mb={2} fontWeight="bold" color="#611463">
                ຜູ້ໃຫ້ບໍລິການຕາມໝວດໝູ່
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
              <Typography variant="h6" mb={2} fontWeight="bold" color="#611463">
                ສະຖານະຂອງຜູ້ໃຫ້ບໍລິການ
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
              <Typography variant="h6" mb={2} fontWeight="bold" color="#611463">
                ການແຈກແຈງລາຄາຂອງຜູ້ໃຫ້ບໍລິການ
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" label={{ value: 'ຊ່ວງລາຄາ (ກີບ)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'ຈຳນວນຜູ້ໃຫ້ບໍລິການ', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#611463" name="ຜູ້ໃຫ້ບໍລິການ" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <PrintFooter />
    </Box>
  );
};

export default ServiceProviderReport;