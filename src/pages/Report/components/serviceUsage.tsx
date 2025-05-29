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
    debugInfo,
    handleExport,
    handlePrint,
    useMockData,
    testAPI
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
            <FormControl size="small" fullWidth>
              <InputLabel>ປະເພດການເຕີບໂຕ</InputLabel>
              <Select
                name="growthRateType"
                value={filterParams.growthRateType}
                onChange={handleGrowthRateTypeChange}
                label="ປະເພດການເຕີບໂຕ"
              >
                <MenuItem value="monthly">ລາຍເດືອນ</MenuItem>
                <MenuItem value="quarterly">ລາຍໄຕມາດ</MenuItem>
                <MenuItem value="yearly">ລາຍປີ</MenuItem>
              </Select>
            </FormControl>
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
        </Grid>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
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
    <div className="print-header print-only">
      <h1>ລາຍງານການໃຊ້ບໍລິການ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} ເຖິງ {filterParams.endDate}</p>
      )}
      <p>ສ້າງເມື່ອ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
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
          color: 'text.secondary',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            ກະລຸນາປັບແຕ່ງຕົວເລືອກການຟິວເຕີແລະລອງໃໝ່
          </Typography>
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
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={2} color="#611463">
            ພາກສ່ວນການບໍລິການ ແລະ ຜູ້ໃຊ້ບໍລິການ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sessions" 
                  fill="#611463" 
                  name="ພາກສ່ວນການບໍລິການ"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="users" 
                  fill="#f7981e" 
                  name="ຜູ້ໃຊ້ບໍລິການປະຈຳ"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={2} color="#611463">
            ແນວໂນ້ມການໃຊ້ບໍລິການ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#611463" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#611463' }} 
                  name="ພາກສ່ວນການບໍລິການ"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#f7981e" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#f7981e' }}
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
        <Box sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            ຂໍ້ມູນບໍ່ພຽງພໍສຳລັບການຄຳນວນການເຕີບໂຕ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ຕ້ອງການຢ່າງໜ້ອຍສອງໄລຍະເວລາສຳລັບການປຽບທຽບ
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            ການປຽບທຽບ
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {summaryData.currentPeriodLabel} vs {summaryData.previousPeriodLabel}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            ອັດຕາການເຕີບໂຕຂອງແພກເກດການບໍລິການ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" color="#611463" fontWeight="bold">
              {summaryData.growthRate.sessions > 0 ? '+' : ''}{summaryData.growthRate.sessions.toFixed(1)}%
            </Typography>
            <GrowthIndicator value={summaryData.growthRate.sessions} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {summaryData.currentPeriodSessions} vs {summaryData.previousPeriodSessions}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            ອັດຕາການເຕີບໂຕຂອງຜູ້ໃຊ້ບໍລິການ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" color="#f7981e" fontWeight="bold">
              {summaryData.growthRate.users > 0 ? '+' : ''}{summaryData.growthRate.users.toFixed(1)}%
            </Typography>
            <GrowthIndicator value={summaryData.growthRate.users} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {summaryData.currentPeriodUsers} vs {summaryData.previousPeriodUsers}
          </Typography>
        </Box>
      </>
    );
  };

  // Print footer
  const PrintFooter = () => (
    <div className="print-footer print-only">
      <p>ພິມວັນທີ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
      <p>ລາຍງານສ້າງໂດຍລະບົບການຈັດການບໍລິການ HomeCare</p>
    </div>
  );

  return (
    <Box className="service-report-container" id="service-report-print">
      <Typography variant="h5" mb={3} fontWeight="bold" color="#611463" className="report-title no-print">
        ລາຍງານການໃຊ້ບໍລິການ
      </Typography>
      
      <PrintHeader />
      <ActionButtons />
      <FilterPanel />

      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress sx={{ color: '#611463' }} size={60} />
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Typography color="#611463">ກຳລັງໂຫຼດຂໍ້ມູນ...</Typography>
          </Box>
        </Box>
      ) : error ? (
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
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
              <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
                ການໃຊ້ບໍລິການ
              </Typography>
              <UsageCharts />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
              <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
                ສະຫຼຸບການໃຊ້ງານ
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ຈຳນວນທີ່ໃຊ້ທັງໝົດ
                </Typography>
                <Typography variant="h3" color="#611463" fontWeight="bold">
                  {summaryData.totalSessions.toLocaleString('lo-LA')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ຈຳນວນຜູ້ໃຊ້ບໍລິການປະຈຳ
                </Typography>
                <Typography variant="h3" color="#f7981e" fontWeight="bold">
                  {summaryData.totalUsers.toLocaleString('lo-LA')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  ຈຳນວນສະເລ່ຍຜູ້ໃຊ້ບໍລິການຕໍ່ຄົນ
                </Typography>
                <Typography variant="h3" color="#611463" fontWeight="bold">
                  {summaryData.averageSessionsPerUser.toFixed(1)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" color="#611463">
                  {filterParams.growthRateType === 'monthly' && 'ອັດຕາການເຕີບໂຕເດືອນຕໍ່ເດືອນ'}
                  {filterParams.growthRateType === 'quarterly' && 'ອັດຕາການເຕີບໂຕໄຕມາດຕໍ່ໄຕມາດ'}
                  {filterParams.growthRateType === 'yearly' && 'ອັດຕາການເຕີບໂຕປີຕໍ່ປີ'}
                  <MuiTooltip title="ປຽບທຽບລະຫວ່າງໄລຍະເວລາປະຈຸບັນແລະໄລຍະເວລາກ່ອນໜ້ານີ້">
                    <InfoIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary' }} />
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