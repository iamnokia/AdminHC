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
  Divider,
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
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

import { usePaymentReportController } from '../controllers/payment';
import '../css/Payment.css';

const PaymentReport: React.FC = () => {
  const {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleStatusChange,
    applyFilters,
    resetFilters,
    paymentData,
    summaryData,
    loading,
    error,
    debugInfo,
    handleExport,
    handlePrint,
    formatDate,
    formatCurrency,
    useMockData,
    testAPI
  } = usePaymentReportController();
  
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
            <FormControl fullWidth size="small">
              <InputLabel>ສະຖານະການຊຳລະ</InputLabel>
              <Select 
                label="ສະຖານະການຊຳລະ" 
                name="paymentStatus"
                value={filterParams.paymentStatus || ''}
                onChange={handleStatusChange}
              >
                <MenuItem value="">ທັງໝົດ</MenuItem>
                <MenuItem value="paid">ຊຳລະແລ້ວ</MenuItem>
                <MenuItem value="pending">ລໍຖ້າ</MenuItem>
                <MenuItem value="failed">ຊຳລະບໍ່ສຳເລັດ</MenuItem>
                <MenuItem value="completed">ສຳເລັດ</MenuItem>
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
  const GrowthIndicator = ({ value }: { value: number }) => {
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
          disabled={loading || !paymentData.length}
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
          disabled={loading || !paymentData.length}
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
    <div className="print-header print-only">
      <h1>ລາຍງານການຊຳລະເງິນ</h1>
      {filterParams.startDate && filterParams.endDate && (
        <p>ໄລຍະເວລາ: {filterParams.startDate} ເຖິງ {filterParams.endDate}</p>
      )}
      <p>ສ້າງເມື່ອ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
    </div>
  );

  // Payment charts component
  const PaymentCharts = () => {
    if (paymentData.length === 0) {
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
          <Typography variant="body2" color="text.secondary">
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={2} color="#611463">
            ພາບລວມລາຍໄດ້ແບບລາຍເດືອນ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#611463" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#611463' }} 
                  name="ລາຍຮັບ" 
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f7981e" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#f7981e' }}
                  name="ລາຍຈ່າຍ" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="medium" mb={2} color="#611463">
            ການວິເຄາະລາຍຮັບແລະລາຍຈ່າຍ
          </Typography>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={paymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill="#611463" 
                  name="ລາຍຮັບ"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  fill="#f7981e" 
                  name="ລາຍຈ່າຍ"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Grid>
      </Grid>
    );
  };

  // Recent transactions component
  const RecentTransactions = () => {
    const { recentTransactions } = summaryData;
    
    if (!recentTransactions || recentTransactions.length === 0) {
      return (
        <Box sx={{ 
          py: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6">ບໍ່ມີຂໍ້ມູນທຸລະກຳລ່າສຸດ</Typography>
          <Typography variant="body2">ກະລຸນາປັບແຕ່ງຕົວເລືອກການຟິວເຕີແລະລອງໃໝ່</Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #611463', backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold', color: '#ffff' }}>ວັນທີ</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold', color: '#ffff' }}>ລະຫັດທຸລະກຳ</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold', color: '#ffff' }}>ປະເພດບໍລິການ</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold', color: '#ffff' }}>ຈຳນວນເງິນ</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold', color: '#ffff' }}>ສະຖານະ</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction, index) => {
              // Determine status color
              let statusColor = '';
              let statusBgColor = '';
              switch (transaction.payment_status.toLowerCase()) {
                case 'completed':
                case 'paid':
                  statusColor = '#2e7d32';
                  statusBgColor = '#e6f7ee';
                  break;
                case 'pending':
                  statusColor = '#ed6c02';
                  statusBgColor = '#fff4e5';
                  break;
                case 'failed':
                  statusColor = '#d32f2f';
                  statusBgColor = '#ffebee';
                  break;
                default:
                  statusColor = '#666';
                  statusBgColor = '#f5f5f5';
              }
              
              return (
                <tr key={transaction.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={{ padding: '12px 8px' }}>{formatDate(transaction.created_at)}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{transaction.payment_id}</td>
                  <td style={{ padding: '12px 8px' }}>{transaction.service_type}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{formatCurrency(transaction.amount)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      color: statusColor,
                      backgroundColor: statusBgColor,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      {transaction.payment_status.charAt(0).toUpperCase() + transaction.payment_status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    );
  };

  // Print footer component - only visible when printing
  const PrintFooter = () => (
    <div className="print-footer print-only">
      <p>ພິມວັນທີ: {new Date().toLocaleDateString('lo-LA')} {new Date().toLocaleTimeString('lo-LA')}</p>
      <p>ລາຍງານສ້າງໂດຍລະບົບການຈັດການບໍລິການ HomeCare</p>
    </div>
  );

  return (
    <Box className="payment-report-container" id="payment-report-print">
      <Typography variant="h5" mb={3} fontWeight="bold" color="#611463" className="report-title no-print">
        ລາຍງານການຊຳລະເງິນ
      </Typography>
      
      <PrintHeader />
      <ActionButtons />
      <FilterPanel />
      
     {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress sx={{ color: '#611463' }} size={60} />
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Typography color="#611463">ກຳລັງໂຫລດຂໍ້ມູນ...</Typography>
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
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
                ພາບລວມລາຍໄດ້ແບບລາຍເດືອນ
              </Typography>
              <PaymentCharts />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, bgcolor: '#611463', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>ລາຍຮັບທັງໝົດ</Typography>
                <Typography variant="h3" fontWeight="bold" mb={2}>
                  {formatCurrency(summaryData.totalRevenue)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 1, 
                    px: 1, 
                    py: 0.5,
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>
                    <Typography variant="caption">
                      {summaryData.revenueGrowthRate > 0 ? '+' : ''}
                      {summaryData.revenueGrowthRate.toFixed(1)}% ທຽບກັບໄລຍະກ່ອນ
                    </Typography>
                    {summaryData.revenueGrowthRate > 0 ? 
                      <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                      summaryData.revenueGrowthRate < 0 ? 
                        <TrendingDownIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                        <TrendingFlatIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    }
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, bgcolor: '#f7981e', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>ທຸລະກຳທັງໝົດ</Typography>
                <Typography variant="h3" fontWeight="bold" mb={2}>
                  {summaryData.totalTransactions.toLocaleString('lo-LA')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 1, 
                    px: 1, 
                    py: 0.5,
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>
                    <Typography variant="caption">
                      {summaryData.transactionsGrowthRate > 0 ? '+' : ''}
                      {summaryData.transactionsGrowthRate.toFixed(1)}% ທຽບກັບໄລຍະກ່ອນ
                    </Typography>
                    {summaryData.transactionsGrowthRate > 0 ? 
                      <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                      summaryData.transactionsGrowthRate < 0 ? 
                        <TrendingDownIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                        <TrendingFlatIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    }
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
                ການເຮັດທຸລະກຳລ່າສຸດ
              </Typography>
              <RecentTransactions />
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <PrintFooter />
    </Box>
  );
};

export default PaymentReport;