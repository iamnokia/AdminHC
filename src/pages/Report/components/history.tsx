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
  Print as PrintIcon,
  Sort as SortIcon
} from '@mui/icons-material';

import { useServiceHistoryController } from '../controllers/history';
import '../css/history.css'; // Import the flexible CSS

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
          <Grid item xs={12} md={2}>
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
          <Grid item xs={12} md={2}>
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
        
          <Grid item xs={12} md={2}>
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
                ນຳໃຊ້
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
                ຕັ້ງຄ່າໃໝ່
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
  // Action toolbar with filter and export/print buttons
  const ActionButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }} className="no-print">
      <Box>
        <Button
          startIcon={<FilterIcon />}
          onClick={toggleFilter}
          sx={{ 
            color: '#611463', 
            borderColor: '#611463',
            '&:hover': { borderColor: '#4a0d4c' },
            mr: 1
          }}
          variant="outlined"
        >
          ຟິວເຕີ
        </Button>
      </Box>
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
          ສົ່ງອອກ
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

  // Print header component - only visible when printing
  const PrintHeader = () => (
    <div className="print-header print-only" style={{ display: 'none' }}>
      <h1>ຂໍ້ມູນປະຫວັດການບໍລິການ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} - {filterParams.endDate}</p>
      )}
    </div>
  );
  
  // Service history table component - matching the example in Image 1
  const ServiceHistoryTable = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress sx={{ color: '#611463' }} />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 2, color: 'error.main' }}>
          <Typography variant="caption">{error}</Typography>
        </Box>
      );
    }
    
    if (serviceOrders.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
          <Typography variant="caption">ບໍ່ພົບຂໍ້ມູນສຳລັບການຄົ້ນຫາປະຈຸບັນ</Typography>
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ overflowX: 'auto' }} className="avoid-break">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
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
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{order.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }} className="pagination-container">
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
                p: 0.5,
                color: '#611463',
                borderColor: '#611463'
              }}
            >
              &lt;
            </Button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
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
                    p: 0.5,
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
                p: 0.5,
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
  
  // Charts components - with appropriate sizing
  const ChartComponents = () => {
    if (loading) {
      return null;
    }
    
    if (serviceOrders.length === 0) {
      return null;
    }
    
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 2 }} className="avoid-break">
            <Typography variant="subtitle2" mb={1} fontWeight="bold">
              ອັດຕາສ່ວນຂອງປະເພດການບໍລິການ
            </Typography>
            <div className="report-chart">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${value}%`}
                    labelLine={false}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, borderRadius: 2 }} className="avoid-break">
            <Typography variant="subtitle2" mb={1} fontWeight="bold">
              ການໃຊ້ບໍລິການລາຍເດືອນ
            </Typography>
            <div className="report-chart">
              <ResponsiveContainer width="100%" height={180}>
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
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Print footer component - only visible when printing
  const PrintFooter = () => (
    <div className="print-footer print-only" style={{ display: 'none' }}>
          ພິມວັນທີ: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
    </div>
  );
  
  return (
    <Box className="service-history-container" id="service-history-report-print">
      <Typography variant="h6" mb={2} fontWeight="bold" color="#611463" className="report-title no-print">
        ຂໍ້ມູນປະຫວັດການບໍລິການ
      </Typography>
      
      <PrintHeader />
      <ActionButtons />
      <FilterPanel />
      
      <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" mb={2} fontWeight="bold">
          ຂໍ້ມູນປະຫວັດການບໍລິການ
        </Typography>
        <ServiceHistoryTable />
      </Paper>
      
      <ChartComponents />
      
      <PrintFooter />
    </Box>
  );
};

export default ServiceHistoryReport;