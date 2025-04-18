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
  TextField
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

// Sample data for charts
const carData = [
  { date: '10/04/2023', service: 'Cleaning', provider: 'Provider A', status: 'Completed', amount: '$120' },
  { date: '12/04/2023', service: 'Plumbing', provider: 'Provider B', status: 'Completed', amount: '$85' },
  { date: '15/04/2023', service: 'Electrical', provider: 'Provider C', status: 'Cancelled', amount: '$0' },
  { date: '18/04/2023', service: 'Gardening', provider: 'Provider A', status: 'Completed', amount: '$95' },
  { date: '22/04/2023', service: 'Painting', provider: 'Provider D', status: 'In Progress', amount: '$210' },
];

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22'];

const CarReport = () => {
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
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
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
        ລາຍງານລົດຂອງຜູ້ໃຫ້ບໍລິການ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" mb={3} fontWeight="bold">
          Car Records
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#f8f8f8' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Service Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Provider</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carData.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{row.date}</td>
                  <td style={{ padding: '12px 16px' }}>{row.service}</td>
                  <td style={{ padding: '12px 16px' }}>{row.provider}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Box sx={{ 
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 
                        row.status === 'Completed' ? '#e6f7ee' : 
                        row.status === 'In Progress' ? '#fff4e5' : 
                        '#ffebee',
                      color:
                        row.status === 'Completed' ? '#2e7d32' : 
                        row.status === 'In Progress' ? '#ed6c02' : 
                        '#d32f2f'
                    }}>
                      {row.status}
                    </Box>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{row.amount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: '#611463', 
                        color: '#611463',
                        '&:hover': { borderColor: '#4a0d4c' },
                        minWidth: 0,
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
                        '&:hover': { bgcolor: '#e58b17' },
                        minWidth: 0
                      }}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 5 of 120 records
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
              2
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
              3
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
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Car Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Sedan', value: 45 },
                    { name: 'SUV', value: 20 },
                    { name: 'Pickup', value: 15 },
                    { name: 'Van', value: 12 },
                    { name: 'Luxury', value: 8 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Sedan', value: 45 },
                    { name: 'SUV', value: 20 },
                    { name: 'Pickup', value: 15 },
                    { name: 'Van', value: 12 },
                    { name: 'Luxury', value: 8 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Monthly Car Usage
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { month: 'Jan', active: 65, maintenance: 8 },
                { month: 'Feb', active: 75, maintenance: 10 },
                { month: 'Mar', active: 80, maintenance: 12 },
                { month: 'Apr', active: 90, maintenance: 7 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#611463" name="Active" />
                <Bar dataKey="maintenance" fill="#f7981e" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarReport;