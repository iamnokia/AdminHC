import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  FileDownload as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';

// Import report components (modify paths as needed)
import ServiceUsageReport from './components/serviceUsage';
import ServiceProviderReport from './components/employee';
import CarReport from './components/history'; // Updated from history to car
import PaymentReport from './components/payment';
import FeedbackReport from './components/feedback';

const ReportsIndex = () => {
  const [activeTab, setActiveTab] = useState('car'); // Set car as default active tab
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Function to render the active report content
  const renderReportContent = () => {
    switch (activeTab) {
      case 'usage':
        return <ServiceUsageReport />;
      case 'providers':
        return <ServiceProviderReport />;
      case 'car':
        return <CarReport />;
      case 'payments':
        return <PaymentReport />;
      case 'feedback':
        return <FeedbackReport />;
      default:
        return <CarReport />;
    }
  };
  
  return (
    <Box sx={{ pt: 2, px: 3, ml: { xs: 0, sm: 30 } }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#611463', 
        color: 'white', 
        borderRadius: '4px 4px 0 0',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="medium">ລາຍງານ ແລະ ການວິເຄາະຂໍ້ມູນ</Typography>
        <Typography variant="body2" sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          px: 2,
          py: 0.5,
          borderRadius: 1,
        }}>
          ອັບເດດລ່າສຸດ: ມື້ນີ້, 10:45 AM
        </Typography>
      </Box>

      {/* Tabs - Reordered to put Car after Service Providers */}
      <Box sx={{ 
        bgcolor: 'white', 
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
      }}>
        {[
          { id: 'usage', label: 'ລາຍງານການໃຊ້ບໍລິການ' },
          { id: 'providers', label: 'ລາຍງານຜູ້ໃຫ້ບໍລິການ' },
          { id: 'payments', label: 'ລາຍງານການຊຳລະເງິນ' },
          { id: 'feedback', label: 'ລາຍງານການໃຫ້ຄຳເຫັນ' },
          { id: 'history', label: 'ລາຍງານປະຫວັດການບໍລິການ' },

        ].map((tab) => (
          <Box 
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            sx={{
              px: 3,
              py: 1.5,
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #611463' : 'none',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              color: activeTab === tab.id ? '#611463' : 'inherit',
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Content Area */}
      <Box sx={{ bgcolor: 'white', p: 3, pb: 6 }}>
        {renderReportContent()}
      </Box>
    </Box>
  );
};

export default ReportsIndex;