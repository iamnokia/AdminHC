import React from 'react';
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
  CircularProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
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
  Print as PrintIcon
} from '@mui/icons-material';

import { useServiceHistoryController } from '../controllers/history';

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22', '#3498db', '#e74c3c'];

const ServiceHistoryReport: React.FC = () => {
  const {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleServiceTypeChange,
    handleStatusChange,
    applyFilters,
    resetFilters,
    serviceOrders,
    categoryDistribution,
    monthlyServiceData,
    totalCount,
    loading,
    error,
    handleExport,
    handlePrint,
    handlePageChange,
    getStatusColor
  } = useServiceHistoryController();
  
  // Calculate pagination values
  const currentPage = filterParams.page;
  const totalPages = Math.ceil(totalCount / filterParams.limit);
  
  // Reusable filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2, display: filterOpen ? 'block' : 'none' }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>ຕົວເລືອກການກັ່ນຕອງ</Typography>
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
                defaultValue=""
                onChange={handleServiceTypeChange}
              >
                <MenuItem value="">ທຸກປະເພດ</MenuItem>
                <MenuItem value="ທຳຄວາມສະອາດ">ທຳຄວາມສະອາດ</MenuItem>
                <MenuItem value="ສ້ອມແປງແອ">ສ້ອມແປງແອ</MenuItem>
                <MenuItem value="ສ້ອມແປງໄຟຟ້າ">ສ້ອມແປງໄຟຟ້າ</MenuItem>
                <MenuItem value="ສ້ອມແປງນ້ຳປະປາ">ສ້ອມແປງນ້ຳປະປາ</MenuItem>
                <MenuItem value="ແກ່ເຄື່ອງ">ແກ່ເຄື່ອງ</MenuItem>
                <MenuItem value="ດູດສ້ວມ">ດູດສ້ວມ</MenuItem>
                <MenuItem value="ກຳຈັດປວກ">ກຳຈັດປວກ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>ສະຖານະ</InputLabel>
              <Select 
                label="ສະຖານະ" 
                defaultValue=""
                onChange={handleStatusChange}
              >
                <MenuItem value="">ທຸກສະຖານະ</MenuItem>
                <MenuItem value="completed">ສຳເລັດແລ້ວ</MenuItem>
                <MenuItem value="in-progress">ກຳລັງດຳເນີນການ</MenuItem>
                <MenuItem value="cancelled">ຍົກເລີກແລ້ວ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={applyFilters}
                disabled={loading}
                sx={{ 
                  bgcolor: '#611463', 
                  '&:hover': { bgcolor: '#4a0d4c' } 
                }}
              >
                ນຳໃຊ້ຕົວກອງ
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                disabled={loading}
                sx={{ 
                  color: '#611463', 
                  borderColor: '#611463',
                  '&:hover': { borderColor: '#4a0d4c' } 
                }}
              >
                ລີເຊັດ
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
        onClick={toggleFilter}
        sx={{ 
          color: '#611463', 
          borderColor: '#611463',
          '&:hover': { borderColor: '#4a0d4c' } 
        }}
        variant="outlined"
      >
        ຕົວກອງ
      </Button>
      <Box>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={loading || serviceOrders.length === 0}
          sx={{ 
            mr: 1,
            color: '#611463', 
            borderColor: '#611463',
            '&:hover': { borderColor: '#4a0d4c' } 
          }}
          variant="outlined"
        >
          ດາວໂຫລດ
        </Button>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={loading || serviceOrders.length === 0}
          sx={{ 
            bgcolor: '#f7981e', 
            '&:hover': { bgcolor: '#e58b17' } 
          }}
          variant="contained"
        >
          ພິມ
        </Button>
      </Box>
    </Box>
  );
  
  // Service history table component
  const ServiceHistoryTable = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: '#611463' }} />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      );
    }
    
    if (serviceOrders.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Typography>ບໍ່ພົບຂໍ້ມູນສຳລັບການຄົ້ນຫາປະຈຸບັນ</Typography>
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#f8f8f8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ວັນທີ</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ປະເພດການບໍລິການ</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ລາຍຊື່ຜູ້ໃຫ້ບໍລິການ</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ສະຖານະ</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ຈຳນວນເງີນ</th>
              </tr>
            </thead>
            <tbody>
              {serviceOrders.map((order, index) => {
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>{order.date}</td>
                    <td style={{ padding: '12px 16px' }}>{order.service}</td>
                    <td style={{ padding: '12px 16px' }}>{order.provider}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Box sx={{ 
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: order.statusColor.bg,
                        color: order.statusColor.text
                      }}>
                        {order.status}
                      </Box>
                    </td>
                    <td style={{ padding: '12px 16px', }}>{order.amount}</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ສະແດງ {serviceOrders.length} ຈາກ {totalCount} ລາຍການ
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              sx={{ 
                minWidth: 0, 
                p: 1,
                color: '#611463',
                borderColor: '#611463'
              }}
            >
              &lt;
            </Button>
            
            {/* Showing up to 3 page buttons */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              // Calculate page number to ensure current page is in the middle if possible
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              return (
                <Button 
                  key={i}
                  size="small" 
                  variant={pageNum === currentPage ? "contained" : "outlined"}
                  onClick={() => handlePageChange(pageNum)}
                  sx={{ 
                    minWidth: 0, 
                    p: 1,
                    ...(pageNum === currentPage ? {
                      bgcolor: '#611463'
                    } : {
                      color: '#611463',
                      borderColor: '#611463'
                    })
                  }}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button 
              size="small" 
              variant="outlined"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
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
      </>
    );
  };
  
  // Charts components
  const ChartComponents = () => {
    if (loading) {
      return null; // Don't show loading indicator for charts
    }
    
    if (serviceOrders.length === 0) {
      return null;
    }
    
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              ອັດຕາສ່ວນຂອງປະເພດການບໍລິການ
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  labelLine={false}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              ການໃຊ້ບໍລິການລາຍເດືອນ
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cleaning" name="ທຳຄວາມສະອາດ" fill="#611463" />
                <Bar dataKey="ac" name="ສ້ອມແປງແອ" fill="#f7981e" />
                <Bar dataKey="electrical" name="ສ້ອມແປງໄຟຟ້າ" fill="#8e44ad" />
                <Bar dataKey="plumbing" name="ສ້ອມແປງນ້ຳປະປາ" fill="#16a085" />
                <Bar dataKey="appliance" name="ແກ່ເຄື່ອງ" fill="#e67e22" />
                <Bar dataKey="septic" name="ດູດສ້ວມ" fill="#3498db" />
                <Bar dataKey="termite" name="ກຳຈັດປວກ" fill="#e74c3c" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  return (
    <Box id="service-history-report-print">
      <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
        ລາຍງານປະຫວັດການບໍລິການ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle1" mb={3} fontWeight="bold">
          ບັນທຶກປະຫວັດການບໍລິການ
        </Typography>
        <ServiceHistoryTable />
      </Paper>
      
      <ChartComponents />
    </Box>
  );
};

export default ServiceHistoryReport;