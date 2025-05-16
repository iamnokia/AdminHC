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
  growthRateType: string;
}

interface UsageDataPoint {
  name: string;
  sessions: number;
  users: number;
}

interface GrowthRate {
  sessions: number;
  users: number;
}

interface SummaryData {
  totalSessions: number;
  totalUsers: number;
  averageSessionsPerUser: number;
  growthRate: GrowthRate;
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  currentPeriodSessions: number;
  previousPeriodSessions: number;
}

export const useServiceReportController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
    startDate: null,
    endDate: null,
    serviceType: null,
    growthRateType: 'monthly'
  });
  
  // Data states
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalSessions: 0,
    totalUsers: 0,
    averageSessionsPerUser: 0,
    growthRate: { sessions: 0, users: 0 },
    currentPeriodLabel: '',
    previousPeriodLabel: '',
    currentPeriodSessions: 0,
    previousPeriodSessions: 0
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
  
  // Handle growth rate type changes
  const handleGrowthRateTypeChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const value = e.target.value as string;
    setFilterParams(prev => ({
      ...prev,
      growthRateType: value
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
      serviceType: null,
      growthRateType: 'monthly'
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
        growthRate: { sessions: 0, users: 0 },
        currentPeriodLabel: '',
        previousPeriodLabel: '',
        currentPeriodSessions: 0,
        previousPeriodSessions: 0
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
        growthRate: { sessions: 0, users: 0 },
        currentPeriodLabel: '',
        previousPeriodLabel: '',
        currentPeriodSessions: 0,
        previousPeriodSessions: 0
      });
      return;
    }

    // Determine grouping based on growthRateType
    let groupByFunction;
    let formatLabel;
    
    switch(filterParams.growthRateType) {
      case 'yearly':
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date);
          return date.getFullYear().toString();
        };
        formatLabel = (date: Date) => date.getFullYear().toString();
        break;
      case 'quarterly':
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date);
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };
        formatLabel = (date: Date) => {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };
        break;
      case 'monthly':
      default:
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date);
          return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        };
        formatLabel = (date: Date) => 
          date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }
    
    // Group by period
    const groupedByPeriod = _.groupBy(data, groupByFunction);
    
    // Count unique customers per period
    const periodData = Object.entries(groupedByPeriod).map(([period, orders]) => {
      const uniqueUsers = _.uniqBy(orders, 'customer_id').length;
      
      return {
        name: period,
        sessions: orders.length,
        users: uniqueUsers,
        // Store the raw date for sorting
        date: new Date(orders[0].service_date)
      };
    });
    
    // Sort by date
    const sortedData = _.sortBy(periodData, 'date');
    
    // Remove date property before setting state
    const cleanData = sortedData.map(({ name, sessions, users }) => ({ 
      name, sessions, users 
    }));
    
    setUsageData(cleanData);
    
    // Calculate summary data
    const totalSessions = data.length;
    const totalUsers = _.uniqBy(data, 'customer_id').length;
    const averageSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;
    
    // Calculate growth rates
    let sessionsGrowthRate = 0;
    let usersGrowthRate = 0;
    let currentPeriodLabel = '';
    let previousPeriodLabel = '';
    let currentPeriodSessions = 0;
    let previousPeriodSessions = 0;
    
    if (sortedData.length >= 2) {
      const currentPeriod = sortedData[sortedData.length - 1];
      const previousPeriod = sortedData[sortedData.length - 2];
      
      currentPeriodLabel = currentPeriod.name;
      previousPeriodLabel = previousPeriod.name;
      currentPeriodSessions = currentPeriod.sessions;
      previousPeriodSessions = previousPeriod.sessions;
      
      if (previousPeriod.sessions > 0) {
        sessionsGrowthRate = ((currentPeriod.sessions - previousPeriod.sessions) / previousPeriod.sessions) * 100;
      }
      
      if (previousPeriod.users > 0) {
        usersGrowthRate = ((currentPeriod.users - previousPeriod.users) / previousPeriod.users) * 100;
      }
    }
    
    setSummaryData({
      totalSessions,
      totalUsers,
      averageSessionsPerUser,
      growthRate: {
        sessions: sessionsGrowthRate,
        users: usersGrowthRate
      },
      currentPeriodLabel,
      previousPeriodLabel,
      currentPeriodSessions,
      previousPeriodSessions
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

  // Simple print functionality - uses CSS for print styling
  const handlePrint = () => {
    window.print();
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
    handleGrowthRateTypeChange,
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