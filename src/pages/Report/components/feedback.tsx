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
  Card,
  CardContent,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FilterAlt as FilterIcon,
  FileDownload as DownloadIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

import { useFeedbackReportController } from '../controllers/feedback';
import '../css/Feedback.css';

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22'];

const FeedbackReport: React.FC = () => {
  const {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleRatingChange,
    applyFilters,
    resetFilters,
    feedbackData,
    summaryData,
    loading,
    error,
    handleExport,
    handlePrint,
    formatDate,
    RATING_TEXT_MAP
  } = useFeedbackReportController();

  // Filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2, display: filterOpen ? 'block' : 'none' }} className="filter-panel no-print">
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>ຕົວເລືອກການຟິວເຕີ</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
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
          <Grid item xs={12} md={2}>
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
        
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={applyFilters}
                disabled={loading}
                sx={{ 
                  bgcolor: '#611463', 
                  '&:hover': { bgcolor: '#4a0d4c' } 
                }}
                fullWidth
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
          disabled={loading || !feedbackData.length}
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
          disabled={loading || !feedbackData.length}
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
      <h1>ລາຍງານການໃຫ້ຄຳເຫັນ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} ເຖິງ {filterParams.endDate}</p>
      )}
      <p>ສ້າງເມື່ອ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
    </div>
  );

  // Rating chart component
  const RatingChart = () => {
    if (feedbackData.length === 0) {
      return (
        <Box sx={{ 
          height: 180, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary' 
        }}>
          <Typography>ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ</Typography>
        </Box>
      );
    }

    // Calculate percentages for display
    const total = feedbackData.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentage = feedbackData.map(item => ({
      ...item,
      percentage: Math.round((item.value / total) * 100)
    }));

    return (
      <div className="report-chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percentage}) => `${name}: ${percentage}%`}
            >
              {feedbackData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'ຈຳນວນ']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Recent comments component
  const RecentComments = () => {
    const { recentComments } = summaryData;
    
    if (!recentComments || recentComments.length === 0) {
      return (
        <Box sx={{ 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary' 
        }}>
          <Typography>ບໍ່ມີຂໍ້ມູນຄຳຕິຊົມລ່າສຸດ</Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ maxHeight: 220, overflow: 'auto' }}>
        {recentComments.map((comment, index) => {
          // Determine border color based on rating
          let borderColor = '#611463'; // Default purple
          if (comment.rating <= 2) {
            borderColor = '#e74c3c'; // Red for poor ratings
          } else if (comment.rating === 3) {
            borderColor = '#f7981e'; // Orange for average ratings
          }
          
          const bgColor = borderColor === '#611463' ? '#f9f5fa' : 
                         borderColor === '#f7981e' ? '#fef9f2' : '#fdf2f2';
          
          return (
            <Box 
              key={comment.id} 
              sx={{ 
                p: 1, 
                borderLeft: `4px solid ${borderColor}`, 
                mb: 1, 
                bgcolor: bgColor 
              }}
            >
              <Typography variant="body2" fontWeight="bold">{comment.rating_text || 'No Title'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                {comment.message || 'No detailed feedback provided.'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">
                  {comment.user_name} - {comment.service_name}
                </Typography>
                <Typography variant="caption">
                  ຄະແນນ: {comment.rating}/5
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Print footer component - only visible when printing
  const PrintFooter = () => (
    <div className="print-footer print-only" style={{ display: 'none' }}>
      <p>ພິມວັນທີ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
      <p>ລາຍງານສ້າງໂດຍລະບົບການຈັດການບໍລິການ HomeCare</p>
    </div>
  );

  return (
    <Box className="feedback-report-container" id="feedback-report-print">
      <Typography variant="h5" mb={3} fontWeight="bold" color="#611463" className="report-title no-print">
        ລາຍງານການໃຫ້ຄຳເຫັນ
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
          <Typography color="error.main">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ອັດຕາຂອງຄຳຕິຊົມ
              </Typography>
              <RatingChart />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" mb={2} fontWeight="bold">
                ຕົວຊີ້ວັດຄຳຕິຊົມ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="#611463" fontWeight="bold">
                      {summaryData.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2">ຄະແນນສະເລ່ຍ</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="#f7981e" fontWeight="bold">
                      {summaryData.totalReviews.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">ຄຳຕິຊົມທັງໝົດ</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="#611463" fontWeight="bold">
                      {summaryData.positivePercentage.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">ຄຳຕິຊົມດ້ານບວກ</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="#f7981e" fontWeight="bold">
                      {summaryData.responseRate}%
                    </Typography>
                    <Typography variant="body2">ອັດຕາການຕອບສະໜອງ</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" mb={1} fontWeight="bold">
                ຂໍ້ສະເໜີຄຳຕິຊົມ
              </Typography>
              <RecentComments />
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <PrintFooter />
    </Box>
  );
};

export default FeedbackReport;