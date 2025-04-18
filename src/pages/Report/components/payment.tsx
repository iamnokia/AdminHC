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
  Card,
  CardContent
} from '@mui/material';
import { 
  LineChart, 
  Line, 
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

// Sample data for charts
const paymentData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const PaymentReport = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Reusable filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2, display: filterOpen ? 'block' : 'none' }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>Filter Options</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              defaultValue="2023-01-01"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              defaultValue="2023-06-30"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Status</InputLabel>
              <Select label="Payment Status" defaultValue="">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
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
  
  return (
    <Box>
      <Typography variant="h6" mb={3} fontWeight="bold" color="#611463">
        ລາຍງານການຊຳລະເງິນ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Monthly Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#611463" activeDot={{ r: 8 }} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#f7981e" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, bgcolor: '#611463', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Revenue</Typography>
              <Typography variant="h4" fontWeight="bold">$34,590</Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5,
                  display: 'inline-block'
                }}>
                  <Typography variant="caption">+18.2% vs last period</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, bgcolor: '#f7981e', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Transactions</Typography>
              <Typography variant="h4" fontWeight="bold">1,245</Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5,
                  display: 'inline-block'
                }}>
                  <Typography variant="caption">+8.7% vs last period</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Recent Transactions
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Transaction ID</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Service</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>Apr 25, 2023</td>
                    <td style={{ padding: '12px 8px' }}>TRX-7845</td>
                    <td style={{ padding: '12px 8px' }}>Cleaning</td>
                    <td style={{ padding: '12px 8px' }}>$120.00</td>
                    <td style={{ padding: '12px 8px' }}><span style={{ color: 'green' }}>Completed</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>Apr 24, 2023</td>
                    <td style={{ padding: '12px 8px' }}>TRX-7844</td>
                    <td style={{ padding: '12px 8px' }}>Plumbing</td>
                    <td style={{ padding: '12px 8px' }}>$85.50</td>
                    <td style={{ padding: '12px 8px' }}><span style={{ color: 'green' }}>Completed</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>Apr 23, 2023</td>
                    <td style={{ padding: '12px 8px' }}>TRX-7843</td>
                    <td style={{ padding: '12px 8px' }}>Gardening</td>
                    <td style={{ padding: '12px 8px' }}>$95.00</td>
                    <td style={{ padding: '12px 8px' }}><span style={{ color: 'orange' }}>Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentReport;