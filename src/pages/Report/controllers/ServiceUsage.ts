import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';

// Define types based on actual API response
interface ServiceOrder {
  employee_id: number;
  first_name: string;
  last_name: string;
  user_id: number;
  cat_id: number;
  amount: number;
  address_users_detail_id: number;
  payment_status: string;
  order_date: string;
  updated_at: string;
  // Mapped fields for compatibility
  id?: number;
  order_id?: string;
  customer_id?: number;
  service_date?: string;
  service_time?: string;
  service_type?: string;
  status?: string;
  created_at?: string;
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
  currentPeriodUsers: number;
  previousPeriodUsers: number;
}

export const useServiceReportController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 100,
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
    previousPeriodSessions: 0,
    currentPeriodUsers: 0,
    previousPeriodUsers: 0
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Map API response to expected format
  const mapApiResponse = (apiData: any[]): ServiceOrder[] => {
    return apiData.map((item, index) => ({
      // Original API fields
      employee_id: item.employee_id || 0,
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      user_id: item.user_id || 0,
      cat_id: item.cat_id || 0,
      amount: item.amount || 0,
      address_users_detail_id: item.address_users_detail_id || 0,
      payment_status: item.payment_status || '',
      order_date: item.order_date || '',
      updated_at: item.updated_at || '',
      
      // Mapped fields for compatibility
      id: item.employee_id || index + 1,
      order_id: `ORD-${item.employee_id || index + 1}`,
      customer_id: item.user_id || 0,
      service_date: item.order_date || '',
      service_time: item.order_date ? new Date(item.order_date).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' }) : '',
      service_type: item.cat_id === 1 ? 'ການພະຍາບານ' : 
                   item.cat_id === 2 ? 'ການທຳຄວາມສະອາດ' : 
                   item.cat_id === 3 ? 'ການດູແລສຸຂະພາບ' : 'ບໍລິການອື່ນໆ',
      status: item.payment_status || 'unknown',
      created_at: item.order_date || '',
    }));
  };

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

  // Simple API test function
  const testAPI = async () => {
    console.log('🔍 Testing API connection...');
    setDebugInfo('Testing API...');
    
    try {
      const response = await axios.get('https://homecare-pro.onrender.com/reports/service_orders', {
        timeout: 10000
      });
      
      console.log('✅ Raw API Response:', response);
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Headers:', response.headers);
      console.log('📊 Response Data:', response.data);
      
      setDebugInfo(`API Response: ${JSON.stringify(response.data, null, 2)}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setDebugInfo(`API Error: ${error.message}`);
      throw error;
    }
  };

  // Fetch service orders from the API
  const fetchServiceOrders = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('Starting fetch...');
    
    try {
      console.log('🚀 Starting API call...');
      
      // Build the URL with query parameters
      const baseUrl = 'https://homecare-pro.onrender.com/reports/service_orders';
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
      
      const fullUrl = `${baseUrl}?${params.toString()}`;
      console.log('🌐 Full URL:', fullUrl);
      setDebugInfo(`Calling: ${fullUrl}`);
      
      // Make the API request
      const response = await axios.get(fullUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📋 Full Response Object:', response);
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Data:', response.data);
      console.log('📊 Response Type:', typeof response.data);
      console.log('📊 Is Array:', Array.isArray(response.data));
      
  // Map API response to expected format
  const mapApiResponse = (apiData: any[]): ServiceOrder[] => {
    return apiData.map((item, index) => ({
      // Original API fields
      employee_id: item.employee_id || 0,
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      user_id: item.user_id || 0,
      cat_id: item.cat_id || 0,
      amount: item.amount || 0,
      address_users_detail_id: item.address_users_detail_id || 0,
      payment_status: item.payment_status || '',
      order_date: item.order_date || '',
      updated_at: item.updated_at || '',
      
      // Mapped fields for compatibility
      id: item.employee_id || index + 1,
      order_id: `ORD-${item.employee_id || index + 1}`,
      customer_id: item.user_id || 0,
      service_date: item.order_date || '',
      service_time: item.order_date ? new Date(item.order_date).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' }) : '',
      service_type: item.cat_id === 1 ? 'ການພະຍາບານ' : 
                   item.cat_id === 2 ? 'ການທຳຄວາມສະອາດ' : 
                   item.cat_id === 3 ? 'ການດູແລສຸຂະພາບ' : 'ບໍລິການອື່ນໆ',
      status: item.payment_status || 'unknown',
      created_at: item.order_date || '',
    }));
  };
      // Try to extract data from different possible structures
      let rawData = [];
      
      if (response.data) {
        // Log all possible properties
        console.log('🔍 Response data keys:', Object.keys(response.data));
        
        if (Array.isArray(response.data)) {
          rawData = response.data;
          console.log('✅ Data is direct array');
        } else if (response.data.data && Array.isArray(response.data.data)) {
          rawData = response.data.data;
          console.log('✅ Data found in .data property');
        } else if (response.data.result && Array.isArray(response.data.result)) {
          rawData = response.data.result;
          console.log('✅ Data found in .result property');
        } else if (response.data.results && Array.isArray(response.data.results)) {
          rawData = response.data.results;
          console.log('✅ Data found in .results property');
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          rawData = response.data.orders;
          console.log('✅ Data found in .orders property');
        } else if (response.data.serviceOrders && Array.isArray(response.data.serviceOrders)) {
          rawData = response.data.serviceOrders;
          console.log('✅ Data found in .serviceOrders property');
        } else {
          console.log('❓ Unexpected response structure:', response.data);
          setDebugInfo('Unexpected response structure. Check console for details.');
        }
      }
      
      console.log('📈 Raw API data:', rawData);
      console.log('📈 Raw data length:', rawData.length);
      console.log('📈 First raw item:', rawData[0]);
      
      // Map API response to expected format
      const data = mapApiResponse(rawData);
      
      console.log('📈 Mapped data:', data);
      console.log('📈 Mapped data length:', data.length);
      console.log('📈 First mapped item:', data[0]);
      
      setDebugInfo(`Found ${data.length} records`);
      
      // Update service orders
      setServiceOrders(data);
      
      // Process data for charts and summary
      processDataForCharts(data);
      
      if (data.length === 0) {
        setError('ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ');
      }
      
    } catch (err) {
      console.error('💥 Fetch Error:', err);
      console.error('💥 Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      });
      
      let errorMessage = 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'ການເຊື່ອມຕໍ່ໃຊ້ເວລານານເກີນໄປ. ກະລຸນາລອງໃໝ່.';
      } else if (err.response?.status === 404) {
        errorMessage = 'ບໍ່ພົບ endpoint ນີ້. ກະລຸນາກວດສອບ URL.';
      } else if (err.response?.status === 401) {
        errorMessage = 'ບໍ່ມີສິດເຂົ້າເຖິງ. ຕ້ອງການການຢັ້ງຢືນ.';
      } else if (err.response?.status === 403) {
        errorMessage = 'ຖືກປະຕິເສດການເຂົ້າເຖິງ.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນເຊີເວີ.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'ບັນຫາເຄືອຂ່າຍ. ກະລຸນາກວດສອບການເຊື່ອມຕໍ່.';
      }
      
      setError(errorMessage);
      setDebugInfo(`Error: ${err.message}`);
      
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
        previousPeriodSessions: 0,
        currentPeriodUsers: 0,
        previousPeriodUsers: 0
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
        previousPeriodSessions: 0,
        currentPeriodUsers: 0,
        previousPeriodUsers: 0
      });
      return;
    }

    console.log('📊 Processing data for charts:', data.length, 'items');

    // Determine grouping based on growthRateType
    let groupByFunction;
    
    switch(filterParams.growthRateType) {
      case 'yearly':
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date || order.order_date);
          return date.getFullYear().toString();
        };
        break;
      case 'quarterly':
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date || order.order_date);
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };
        break;
      case 'monthly':
      default:
        groupByFunction = (order: ServiceOrder) => {
          const date = new Date(order.service_date || order.order_date);
          return date.toLocaleString('lo-LA', { month: 'short', year: 'numeric' });
        };
    }
    
    // Group by period
    const groupedByPeriod = _.groupBy(data, groupByFunction);
    console.log('📊 Grouped by period:', groupedByPeriod);
    
    // Count unique customers per period
    const periodData = Object.entries(groupedByPeriod).map(([period, orders]) => {
      const uniqueUsers = _.uniqBy(orders, (order) => order.customer_id || order.user_id).length;
      
      return {
        name: period,
        sessions: orders.length,
        users: uniqueUsers,
        date: new Date(orders[0].service_date || orders[0].order_date)
      };
    });
    
    // Sort by date
    const sortedData = _.sortBy(periodData, 'date');
    console.log('📊 Sorted data:', sortedData);
    
    // Remove date property before setting state
    const cleanData = sortedData.map(({ name, sessions, users }) => ({ 
      name, sessions, users 
    }));
    
    setUsageData(cleanData);
    
    // Calculate summary data
    const totalSessions = data.length;
    const totalUsers = _.uniqBy(data, (order) => order.customer_id || order.user_id).length;
    const averageSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;
    
    // Calculate growth rates
    let sessionsGrowthRate = 0;
    let usersGrowthRate = 0;
    let currentPeriodLabel = '';
    let previousPeriodLabel = '';
    let currentPeriodSessions = 0;
    let previousPeriodSessions = 0;
    let currentPeriodUsers = 0;
    let previousPeriodUsers = 0;
    
    if (sortedData.length >= 2) {
      const currentPeriod = sortedData[sortedData.length - 1];
      const previousPeriod = sortedData[sortedData.length - 2];
      
      currentPeriodLabel = currentPeriod.name;
      previousPeriodLabel = previousPeriod.name;
      currentPeriodSessions = currentPeriod.sessions;
      previousPeriodSessions = previousPeriod.sessions;
      currentPeriodUsers = currentPeriod.users;
      previousPeriodUsers = previousPeriod.users;
      
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
      previousPeriodSessions,
      currentPeriodUsers,
      previousPeriodUsers
    });

    console.log('✅ Chart data processed successfully');
  };

  // Mock data for testing
  const useMockData = () => {
    console.log('🎭 Using mock data...');
    
    const mockApiData = [
      {
        employee_id: 1,
        first_name: 'ສົມພອນ',
        last_name: 'ວົງສີ',
        user_id: 101,
        cat_id: 1,
        amount: 150000,
        address_users_detail_id: 201,
        payment_status: 'paid',
        order_date: '2025-05-01T10:00:00.000Z',
        updated_at: '2025-05-01T12:00:00.000Z'
      },
      {
        employee_id: 2,
        first_name: 'ມາລີ',
        last_name: 'ພົມມະ',
        user_id: 102,
        cat_id: 2,
        amount: 200000,
        address_users_detail_id: 202,
        payment_status: 'paid',
        order_date: '2025-05-02T14:00:00.000Z',
        updated_at: '2025-05-02T16:00:00.000Z'
      },
      {
        employee_id: 3,
        first_name: 'ສີດາ',
        last_name: 'ຄຳ',
        user_id: 103,
        cat_id: 3,
        amount: 350000,
        address_users_detail_id: 203,
        payment_status: 'paid',
        order_date: '2025-05-03T09:00:00.000Z',
        updated_at: '2025-05-03T11:00:00.000Z'
      },
      {
        employee_id: 1,
        first_name: 'ສົມພອນ',
        last_name: 'ວົງສີ',
        user_id: 101,
        cat_id: 1,
        amount: 200000,
        address_users_detail_id: 201,
        payment_status: 'paid',
        order_date: '2025-05-04T15:00:00.000Z',
        updated_at: '2025-05-04T17:00:00.000Z'
      },
      {
        employee_id: 4,
        first_name: 'ບຸນມີ',
        last_name: 'ແກ້ວ',
        user_id: 104,
        cat_id: 2,
        amount: 200000,
        address_users_detail_id: 204,
        payment_status: 'paid',
        order_date: '2025-05-05T11:00:00.000Z',
        updated_at: '2025-05-05T13:00:00.000Z'
      }
    ];
    
    const mappedMockData = mapApiResponse(mockApiData);
    setServiceOrders(mappedMockData);
    processDataForCharts(mappedMockData);
    setError(null);
    setDebugInfo('Using mock data for testing');
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchServiceOrders();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 100,
      startDate: null,
      endDate: null,
      serviceType: null,
      growthRateType: 'monthly'
    });
  };

  // Export data to CSV with proper Lao font support
  const handleExport = () => {
    if (!serviceOrders.length) {
      alert('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
      return;
    }
    
    try {
      // Prepare data for export with Lao headers using actual API fields
      const exportData = serviceOrders.map(order => ({
        'ລະຫັດພະນັກງານ': order.employee_id || '',
        'ຊື່': order.first_name || '',
        'ນາມສະກຸນ': order.last_name || '',
        'ລະຫັດລູກຄ້າ': order.user_id || '',
        'ປະເພດບໍລິການ': order.cat_id || '',
        'ຈຳນວນເງິນ': order.amount || '',
        'ລະຫັດທີ່ຢູ່': order.address_users_detail_id || '',
        'ສະຖານະການຈ່າຍ': order.payment_status || '',
        'ວັນທີສັ່ງຊື້': order.order_date || '',
        'ວັນທີອັບເດດ': order.updated_at || '',
        // Also include mapped fields
        'ລະຫັດການສັ່ງຊື້': order.order_id || '',
        'ວັນທີບໍລິການ': order.service_date || '',
        'ເວລາບໍລິການ': order.service_time || '',
        'ປະເພດບໍລິການ (ແປ)': order.service_type || '',
        'ສະຖານະ': order.status || ''
      }));
      
      // Create CSV data with Papa Parse
      const csvData = Papa.unparse(exportData, {
        header: true,
        encoding: 'utf8'
      });
      
      // Add UTF-8 BOM to ensure proper encoding in Excel for Lao text
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvData;
      
      // Create blob with proper MIME type
      const blob = new Blob([csvWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // Generate filename with Lao text and current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `ລາຍງານການໃຊ້ບໍລິການ-${currentDate}.csv`;
      
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      console.log('✅ Export successful');
      
    } catch (error) {
      console.error('❌ Export error:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກຂໍ້ມູນ. ກະລຸນາລອງໃໝ່.');
    }
  };

  // Enhanced print functionality
  const handlePrint = () => {
    try {
      const originalTitle = document.title;
      document.title = `ລາຍງານການໃຊ້ບໍລິການ - ${new Date().toLocaleDateString('lo-LA')}`;
      
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 1000);
      }, 300);
      
    } catch (error) {
      console.error('❌ Print error:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການພິມ. ກະລຸນາລອງໃໝ່.');
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchServiceOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch data when growth rate type changes
  useEffect(() => {
    if (serviceOrders.length > 0) {
      processDataForCharts(serviceOrders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams.growthRateType]);

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
    debugInfo,
    handleExport,
    handlePrint,
    serviceOrders,
    useMockData,
    testAPI
  };
};