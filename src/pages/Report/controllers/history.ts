import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';

// Define types based on the API response seen in the images
interface ServiceOrder {
  id: number;
  employee_id: number;
  service_detail_id: number;
  cat_id: number;
  order_date: string;
  payment_status: string;
  updated_at: string;
  amount?: number;
  first_name?: string;
  last_name?: string;
  user_id?: number; 
}

// Map to translate cat_id to service type 
const SERVICE_TYPE_MAP: Record<number, string> = {
  1: 'ທຳຄວາມສະອາດ',
  2: 'ສ້ອມແປງໄຟຟ້າ',
  3: 'ສ້ອມແປງແອ',
  4: 'ສ້ອມແປງນ້ຳປະປາ',
  5: 'ແກ່ເຄື່ອງ',
  6: 'ດູດສ້ວມ',
  7: 'ກຳຈັດປວກ'
};

// Map payment status to display status
const PAYMENT_STATUS_MAP: Record<string, string> = {
  'paid': 'ສຳເລັດແລ້ວ',
  'pending': 'ກຳລັງດຳເນີນການ',
  'cancelled': 'ຍົກເລີກແລ້ວ'
};

// Define status colors for UI
const STATUS_COLORS: Record<string, { bg: string, text: string }> = {
  'paid': { bg: '#e6f7ee', text: '#2e7d32' },
  'pending': { bg: '#fff4e5', text: '#ed6c02' },
  'cancelled': { bg: '#ffebee', text: '#d32f2f' }
};

interface FilterParams {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  serviceType: number | null;
  paymentStatus: string | null;
}

interface CategoryDistribution {
  name: string;
  value: number;
}

interface MonthlyServiceData {
  month: string;
  cleaning: number;
  ac: number;
  electrical: number;
  plumbing: number;
  appliance: number;
  septic: number;
  termite: number;
}

// Extended service order interface with derived fields for display
interface EnrichedServiceOrder {
  id: number;
  date: string;
  service: string;
  provider: string;
  status: string;
  amount: string;
  statusColor: { bg: string, text: string };
  cat_id: number;
}

export const useServiceHistoryController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
    startDate: null,
    endDate: null,
    serviceType: null,
    paymentStatus: null
  });
  
  // Data states
  const [serviceOrders, setServiceOrders] = useState<EnrichedServiceOrder[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [monthlyServiceData, setMonthlyServiceData] = useState<MonthlyServiceData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  
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
  const handleServiceTypeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value = e.target.value as string;
    if (value === "") {
      setFilterParams(prev => ({
        ...prev,
        serviceType: null
      }));
    } else {
      // Find the cat_id that corresponds to this service name
      const entries = Object.entries(SERVICE_TYPE_MAP);
      const entry = entries.find(([_, serviceName]) => serviceName === value);
      
      if (entry) {
        const catId = parseInt(entry[0]);
        setFilterParams(prev => ({
          ...prev,
          serviceType: catId
        }));
      }
    }
  };

  // Handle payment status changes
  const handleStatusChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value = e.target.value as string;
    
    // Map UI selection to API value
    let apiStatus = null;
    if (value === 'completed') {
      apiStatus = 'paid';
    } else if (value === 'in-progress') {
      apiStatus = 'pending';
    } else if (value === 'cancelled') {
      apiStatus = 'cancelled';
    }
    
    setFilterParams(prev => ({
      ...prev,
      paymentStatus: apiStatus
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
      paymentStatus: null
    });
    
    // Fetch with reset filters
    setTimeout(() => {
      fetchServiceOrders();
    }, 0);
  };

  // Format date (YYYY-MM-DD to DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format currency
  const formatCurrency = (amount: number = 0) => {
    return `${amount.toLocaleString()} ₭`;
  };

  // Enrich service order data with derived fields
  const enrichServiceOrderData = (data: ServiceOrder[]): EnrichedServiceOrder[] => {
    return data.map(order => {
      // Determine service type based on cat_id
      const serviceType = SERVICE_TYPE_MAP[order.cat_id] || `Service ${order.cat_id}`;
      
      // Format provider name
      const providerName = order.first_name && order.last_name 
        ? `${order.first_name} ${order.last_name}`
        : `Provider ${order.employee_id}`;
      
      // Get status display text
      const status = order.payment_status.toLowerCase();
      const statusText = PAYMENT_STATUS_MAP[status] || status;
      
      // Get status color
      const statusColor = STATUS_COLORS[status] || { bg: '#f5f5f5', text: '#757575' };
      
      // Format amount
      const formattedAmount = order.amount ? formatCurrency(order.amount) : '0 ₭';
      
      return {
        id: order.id,
        date: formatDate(order.order_date),
        service: serviceType,
        provider: providerName,
        status: statusText,
        amount: formattedAmount,
        statusColor,
        cat_id: order.cat_id
      };
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
        params.append('cat_id', filterParams.serviceType.toString());
      }
      
      if (filterParams.paymentStatus) {
        params.append('payment_status', filterParams.paymentStatus);
      }
      
      // Make the API request
      const response = await axios.get(`${url}?${params.toString()}`);
      const rawData = response.data.data || [];
      const totalCount = response.data.total || rawData.length;
      
      // Enrich the service order data with derived fields
      const enrichedData = enrichServiceOrderData(rawData);
      
      // Update service orders
      setServiceOrders(enrichedData);
      setTotalCount(totalCount);
      
      // Process data for charts and stats
      processDataForCharts(enrichedData, rawData);
      
    } catch (err) {
      console.error('Error fetching service orders:', err);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.');
      
      // Set empty data
      setServiceOrders([]);
      setCategoryDistribution([]);
      setMonthlyServiceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Process the service orders data for charts
  const processDataForCharts = (enrichedData: EnrichedServiceOrder[], rawData: ServiceOrder[]) => {
    if (!enrichedData || enrichedData.length === 0) {
      setCategoryDistribution([]);
      setMonthlyServiceData([]);
      return;
    }

    // Process category distribution
    calculateCategoryDistribution(enrichedData);
    
    // Process monthly service data
    calculateMonthlyServiceData(rawData);
  };

  // Calculate category distribution for pie chart
  const calculateCategoryDistribution = (data: EnrichedServiceOrder[]) => {
    // Count occurrences of each service type
    const categoryCounts = _.countBy(data, 'service');
    
    // Calculate percentages
    const total = data.length;
    const distribution = Object.entries(categoryCounts).map(([name, count]) => {
      return {
        name,
        value: Math.round((count / total) * 100)
      };
    });
    
    setCategoryDistribution(distribution);
  };

  // Calculate monthly service data for bar chart
  const calculateMonthlyServiceData = (data: ServiceOrder[]) => {
    // Create a map of months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group by month
    const groupedByMonth = _.groupBy(data, (order) => {
      const date = new Date(order.order_date);
      return months[date.getMonth()];
    });
    
    // Initialize monthly data with zeros
    const monthlyData: MonthlyServiceData[] = months.map(month => ({
      month,
      cleaning: 0,  // cat_id 1
      ac: 0,        // cat_id 3
      electrical: 0, // cat_id 2
      plumbing: 0,   // cat_id 4
      appliance: 0,  // cat_id 5
      septic: 0,     // cat_id 6
      termite: 0     // cat_id 7
    }));
    
    // Fill in the data
    months.forEach(month => {
      const monthOrders = groupedByMonth[month] || [];
      
      if (monthOrders.length > 0) {
        // Count by category
        const countByCat = _.countBy(monthOrders, 'cat_id');
        
        // Update the monthly data
        const monthData = monthlyData.find(m => m.month === month);
        if (monthData) {
          monthData.cleaning = countByCat[1] || 0;
          monthData.electrical = countByCat[2] || 0;
          monthData.ac = countByCat[3] || 0;
          monthData.plumbing = countByCat[4] || 0;
          monthData.appliance = countByCat[5] || 0;
          monthData.septic = countByCat[6] || 0;
          monthData.termite = countByCat[7] || 0;
        }
      }
    });
    
    // Filter to only include relevant months (current and previous few months)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Get data for the current and previous 3 months
    const relevantMonths = [];
    for (let i = 0; i < 4; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Ensure we wrap around correctly
      relevantMonths.push(months[monthIndex]);
    }
    
    // Filter and sort the data
    const filteredData = monthlyData
      .filter(data => relevantMonths.includes(data.month))
      .sort((a, b) => {
        // Sort months chronologically
        const aIndex = months.indexOf(a.month);
        const bIndex = months.indexOf(b.month);
        
        // Ensure proper ordering when wrapping around December to January
        if (Math.abs(aIndex - bIndex) > 6) {
          // If the difference is more than 6 months, one is from last year
          return aIndex > bIndex ? -1 : 1;
        }
        
        return aIndex - bIndex;
      });
    
    setMonthlyServiceData(filteredData);
  };

  // Export data to CSV
  const handleExport = () => {
    if (!serviceOrders.length) return;
    
    const csvData = Papa.unparse(serviceOrders.map(order => ({
      ID: order.id,
      Date: order.date,
      Service: order.service,
      Provider: order.provider,
      Status: order.status,
      Amount: order.amount
    })));
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `service-history-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle print functionality - simplified to use standard print flow
  const handlePrint = () => {
    window.print();
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    setFilterParams(prev => ({
      ...prev,
      page: newPage
    }));
    
    // Fetch data for the new page
    setTimeout(() => {
      fetchServiceOrders();
    }, 0);
  };

  // Get status color for UI
  const getStatusColor = (status: string): { bg: string, text: string } => {
    const lowerStatus = status.toLowerCase();
    return STATUS_COLORS[lowerStatus] || { bg: '#f5f5f5', text: '#757575' };
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
    handleStatusChange,
    applyFilters,
    resetFilters,
    serviceOrders,
    categoryDistribution,
    monthlyServiceData,
    totalCount,
    loading,
    error,
    handleExport,
    handlePrint,
    formatDate,
    formatCurrency,
    handlePageChange,
    getStatusColor
  };
};