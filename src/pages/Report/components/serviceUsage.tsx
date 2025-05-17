import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  FilterAlt as FilterIcon,
  FileDownload as DownloadIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { useServiceReportController } from '../controllers/ServiceUsage';
import '../css/Usage.css';

const ServiceUsageReport = () => {
  const {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleServiceTypeChange,
    handleGrowthRateTypeChange,
    applyFilters,
    resetFilters,
    usageData,
    summaryData,
    loading,
    error,
    handleExport,
    handlePrint
  } = useServiceReportController();
  
  // Filter panel component
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
  
  // Growth indicator component
  const GrowthIndicator = ({ value }) => {
    if (value > 0) {
      return <TrendingUpIcon sx={{ color: '#4caf50', ml: 1 }} />;
    } else if (value < 0) {
      return <TrendingDownIcon sx={{ color: '#f44336', ml: 1 }} />;
    }
    return <TrendingFlatIcon sx={{ color: '#9e9e9e', ml: 1 }} />;
  };
  
  // Action buttons component
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
          onClick={handleExport}
          disabled={loading || !usageData.length}
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
          disabled={loading || !usageData.length}
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

  // Print header 
  const PrintHeader = () => (
    <div className="print-header print-only" style={{ display: 'none' }}>
      <h1>ລາຍງານການໃຊ້ບໍລິການ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} - {filterParams.endDate}</p>
      )}
    </div>
  );

  // Enhanced charts for usage data
  const UsageCharts = () => {
    if (usageData.length === 0) {
      return (
        <Box sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary' 
        }}>
          <Typography>ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            ພາກສ່ວນການບໍລິການ ແລະ ຜູ້ໃຊ້ບໍລິການ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#611463" name="ພາກສ່ວນການບໍລິການ" />
                <Bar dataKey="users" fill="#f7981e" name="ຜູ້ໃຊ້ບໍລິການປະຈຳ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            ແນວໂນ້ມການໃຊ້ບໍລິການ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#611463" 
                  activeDot={{ r: 8 }} 
                  name="ພາກສ່ວນການບໍລິການ"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#f7981e" 
                  activeDot={{ r: 8 }}
                  name="ຜູ້ໃຊ້ບໍລິການປະຈຳ" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Grid>
      </Grid>
    );
  };

  // Growth rate display component
  const GrowthRateDisplay = () => {
    const hasPreviousPeriod = summaryData.previousPeriodLabel && summaryData.currentPeriodLabel;
    
    if (!hasPreviousPeriod) {
      return (
        <Box sx={{ color: 'text.secondary', mt: 2 }}>
          <Typography>
            ຂໍ້ມູນບໍ່ພຽງພໍສຳລັບການຄຳນວນການເຕີບໂຕ. ຕ້ອງການຢ່າງໜ້ອຍສອງໄລຍະເວລາ.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ການປຽບທຽບ
          </Typography>
          <Typography variant="body1">
            {summaryData.currentPeriodLabel} vs {summaryData.previousPeriodLabel}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ອັດຕາການເຕີບໂຕຂອງແພກເກດການບໍລິການ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" color="#611463" fontWeight="bold">
              {summaryData.growthRate.sessions > 0 ? '+' : ''}{summaryData.growthRate.sessions.toFixed(1)}%
            </Typography>
            <GrowthIndicator value={summaryData.growthRate.sessions} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {summaryData.currentPeriodSessions} vs {summaryData.previousPeriodSessions}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            ອັດຕາການເຕີບໂຕຂອງຜູ້ໃຊ້ບໍລິການ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" color="#f7981e" fontWeight="bold">
              {summaryData.growthRate.users > 0 ? '+' : ''}{summaryData.growthRate.users.toFixed(1)}%
            </Typography>
            <GrowthIndicator value={summaryData.growthRate.users} />
          </Box>
        </Box>
      </>
    );
  };

  // Print footer
  const PrintFooter = () => (
    <div className="print-footer print-only" style={{ display: 'none' }}>
          ພິມວັນທີ: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
    </div>
  );

  return (
    <Box className="service-report-container" id="service-report-print">
      <Typography variant="h6" mb={3} fontWeight="bold" color="#611463" className="report-title no-print">
        ລາຍງານການໃຊ້ບໍລິການ
      </Typography>
      
      <PrintHeader />
      <ActionButtons />
      <FilterPanel />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress sx={{ color: '#611463' }} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ການໃຊ້ບໍລິການ
              </Typography>
              <UsageCharts />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ສະຫຼຸບການໃຊ້ງານ
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">ຈຳນວນທີ່ໃຊ້ທັງໝົດ</Typography>
                <Typography variant="h4" color="#611463" fontWeight="bold">
                  {summaryData.totalSessions.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">ຈຳນວນຜູ້ໃຊ້ບໍລິການທັງໝົດ</Typography>
                <Typography variant="h4" color="#f7981e" fontWeight="bold">
                  {summaryData.totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">ຈຳນວນສະເລ່ຍຜູ້ໃຊ້ບໍລິການຕໍ່ຄົນ</Typography>
                <Typography variant="h4" color="#611463" fontWeight="bold">
                  {summaryData.averageSessionsPerUser.toFixed(1)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center">
                  {filterParams.growthRateType === 'monthly' && 'ອັດຕາການເຕີບໂຕເດືອນຕໍ່ເດືອນ'}
                  {filterParams.growthRateType === 'quarterly' && 'ອັດຕາການເຕີບໂຕໄຕມາດຕໍ່ໄຕມາດ'}
                  {filterParams.growthRateType === 'yearly' && 'ອັດຕາການເຕີບໂຕປີຕໍ່ປີ'}
                  <MuiTooltip title="ປຽບທຽບລະຫວ່າງໄລຍະເວລາປະຈຸບັນແລະໄລຍະເວລາກ່ອນໜ້ານີ້">
                    <InfoIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                  </MuiTooltip>
                </Typography>
              </Box>
              
              <GrowthRateDisplay />
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <PrintFooter />
    </Box>
  );
};

export default ServiceUsageReport;