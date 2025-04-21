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
  Print as PrintIcon
} from '@mui/icons-material';

// Sample data for charts
const feedbackData = [
  { name: 'Excellent', value: 500 },
  { name: 'Good', value: 300 },
  { name: 'Average', value: 200 },
  { name: 'Poor', value: 80 },
  { name: 'Very Poor', value: 40 },
];

// Color configurations
const COLORS = ['#611463', '#f7981e', '#8e44ad', '#16a085', '#e67e22'];

const FeedbackReport = () => {
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
              <InputLabel>Rating</InputLabel>
              <Select label="Rating" defaultValue="">
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
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
        ລາຍງານການໃຫ້ຄຳເຫັນ
      </Typography>
      
      <ActionButtons />
      <FilterPanel />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              ອັດຕາຂອງຄຳຕິຊົມ
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedbackData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {feedbackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
                  <Typography variant="h4" color="#611463" fontWeight="bold">4.6</Typography>
                  <Typography variant="body2">Average Rating</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="#f7981e" fontWeight="bold">1,120</Typography>
                  <Typography variant="body2">Total Reviews</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="#611463" fontWeight="bold">92%</Typography>
                  <Typography variant="body2">Positive Feedback</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="#f7981e" fontWeight="bold">89%</Typography>
                  <Typography variant="body2">Response Rate</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              ຂໍ້ສະເໜີຄຳຕິຊົມ
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Box sx={{ p: 2, borderLeft: '4px solid #611463', mb: 2, bgcolor: '#f9f5fa' }}>
                <Typography variant="body2" fontWeight="bold">Excellent Service</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  The cleaning service was thorough and professional. Will definitely book again!
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">John D. - Cleaning Service</Typography>
                  <Typography variant="caption">Rating: 5/5</Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, borderLeft: '4px solid #f7981e', mb: 2, bgcolor: '#fef9f2' }}>
                <Typography variant="body2" fontWeight="bold">Good Job</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  The plumber fixed our issue quickly. Service was a bit expensive though.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Sarah M. - Plumbing Service</Typography>
                  <Typography variant="caption">Rating: 4/5</Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, borderLeft: '4px solid #611463', mb: 2, bgcolor: '#f9f5fa' }}>
                <Typography variant="body2" fontWeight="bold">Very Responsive</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Gardener was on time and did an excellent job with our lawn.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Michael R. - Gardening Service</Typography>
                  <Typography variant="caption">Rating: 5/5</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackReport;