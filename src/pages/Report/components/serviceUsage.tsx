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
const usageData = [
  { name: 'Jan', sessions: 400, users: 240 },
  { name: 'Feb', sessions: 300, users: 139 },
  { name: 'Mar', sessions: 200, users: 980 },
  { name: 'Apr', sessions: 278, users: 390 },
  { name: 'May', sessions: 189, users: 480 },
  { name: 'Jun', sessions: 239, users: 380 },
];

const ServiceUsageReport = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Reusable filter panel component
  const FilterPanel = () => (
    <Box sx={{ py: 2,  display: filterOpen ? 'block' : 'none' }}>
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
              <InputLabel>Service Type</InputLabel>
              <Select label="Service Type" defaultValue="">
                <MenuItem value="">All Services</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="gardening">Gardening</MenuItem>
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
        ລາຍງານການໃຊ້ບໍລິການ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Monthly Service Usage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#611463" name="Service Sessions" />
                <Bar dataKey="users" fill="#f7981e" name="Unique Users" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Usage Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
              <Typography variant="h4" color="#611463" fontWeight="bold">1,606</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
              <Typography variant="h4" color="#f7981e" fontWeight="bold">952</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Average Sessions per User</Typography>
              <Typography variant="h4" color="#611463" fontWeight="bold">1.7</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
              <Typography variant="h4" color="#f7981e" fontWeight="bold">+12.4%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceUsageReport;