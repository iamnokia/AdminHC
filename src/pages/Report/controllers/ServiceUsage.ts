import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';

// Define types
interface ServiceOrder {
  id: number;
  order_id: string;
  customer_id: number;
  service_date: string;
  service_time: string;
  service_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  // There may be more fields in the actual API response
}

interface FilterParams {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  serviceType: string | null;
}

interface UsageDataPoint {
  name: string;
  sessions: number;
  users: number;
}

interface SummaryData {
  totalSessions: number;
  totalUsers: number;
  averageSessionsPerUser: number;
  growthRate: number;
}

export const useServiceReportController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
    startDate: null,
    endDate: null,
    serviceType: null
  });
  
  // Data states
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalSessions: 0,
    totalUsers: 0,
    averageSessionsPerUser: 0,
    growthRate: 0
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle filter panel
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle basic filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue) && numValue > 0) {
      setFilterParams(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  // Handle service type changes
  const handleServiceTypeChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const value = e.target.value as string;
    setFilterParams(prev => ({
      ...prev,
      serviceType: value || null
    }));
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchServiceOrders();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
      startDate: null,
      endDate: null,
      serviceType: null
    });
  };

  // Fetch service orders from the API
  const fetchServiceOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the URL with query parameters
      let url = `https://homecare-pro.onrender.com/reports/service_orders`;
      const params = new URLSearchParams();
      
      params.append('page', filterParams.page.toString());
      params.append('limit', filterParams.limit.toString());
      
      if (filterParams.startDate) {
        params.append('startDate', filterParams.startDate);
      }
      
      if (filterParams.endDate) {
        params.append('endDate', filterParams.endDate);
      }
      
      if (filterParams.serviceType) {
        params.append('serviceType', filterParams.serviceType);
      }
      
      // Make the API request
      const response = await axios.get(`${url}?${params.toString()}`);
      const data = response.data.data || [];
      
      // Update service orders
      setServiceOrders(data);
      
      // Process data for charts and summary
      processDataForCharts(data);
      
    } catch (err) {
      console.error('Error fetching service orders:', err);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.');
      
      // Set empty data
      setServiceOrders([]);
      setUsageData([]);
      setSummaryData({
        totalSessions: 0,
        totalUsers: 0,
        averageSessionsPerUser: 0,
        growthRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Process the service orders data for charts and summary
  const processDataForCharts = (data: ServiceOrder[]) => {
    if (!data || data.length === 0) {
      setUsageData([]);
      setSummaryData({
        totalSessions: 0,
        totalUsers: 0,
        averageSessionsPerUser: 0,
        growthRate: 0
      });
      return;
    }

    // Group by month
    const groupedByMonth = _.groupBy(data, (order) => {
      // Extract month from service_date (assuming format is YYYY-MM-DD)
      const date = new Date(order.service_date);
      return date.toLocaleString('en-US', { month: 'short' });
    });
    
    // Count unique customers per month
    const monthlyData = Object.entries(groupedByMonth).map(([month, orders]) => {
      const uniqueUsers = _.uniqBy(orders, 'customer_id').length;
      
      return {
        name: month,
        sessions: orders.length,
        users: uniqueUsers
      };
    });
    
    // Sort months chronologically
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedData = _.sortBy(monthlyData, item => monthOrder.indexOf(item.name));
    
    setUsageData(sortedData);
    
    // Calculate summary data
    const totalSessions = data.length;
    const totalUsers = _.uniqBy(data, 'customer_id').length;
    const averageSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;
    
    // Calculate growth rate (compare current month with previous month)
    let growthRate = 0;
    
    if (sortedData.length >= 2) {
      const currentMonth = sortedData[sortedData.length - 1];
      const previousMonth = sortedData[sortedData.length - 2];
      
      if (previousMonth.sessions > 0) {
        growthRate = ((currentMonth.sessions - previousMonth.sessions) / previousMonth.sessions) * 100;
      }
    }
    
    setSummaryData({
      totalSessions,
      totalUsers,
      averageSessionsPerUser,
      growthRate
    });
  };

  // Export data to CSV
  const handleExport = () => {
    if (!serviceOrders.length) return;
    
    const csvData = Papa.unparse(serviceOrders);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `service-usage-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = document.getElementById('service-report-print');
    const originalContents = document.body.innerHTML;
    
    if (printContent) {
      const printCSS = `
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            #service-report-print, #service-report-print * {
              visibility: visible;
            }
            #service-report-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            button, .MuiButton-root {
              display: none !important;
            }
          }
        </style>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Service Usage Report</title>');
        printWindow.document.write(printCSS);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchServiceOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleServiceTypeChange,
    applyFilters,
    resetFilters,
    usageData,
    summaryData,
    loading,
    error,
    handleExport,
    handlePrint
  };
};