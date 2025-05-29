import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';

// Define types based on the actual API response
interface Payment {
  id: number;
  amount: number;
  cat_id: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Map to translate cat_id to service_type
const SERVICE_TYPE_MAP: Record<number, string> = {
  1: 'ທຳຄວາມສະອາດ',
  2: 'ສ້ອມແປງໄຟຟ້າ',
  3: 'ສ້ອງແປງແອ',
  4: 'ສ້ອມແປງນ້ຳປະປາ',
  5: 'ແກ່ເຄື່ອງ',
  6: 'ດູດສ້ວມ',
  7: 'ກຳຈັດປວກ'
};

interface FilterParams {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  paymentStatus: string | null;
}

interface PaymentDataPoint {
  name: string;
  income: number;
  expense: number;
}

interface SummaryData {
  totalRevenue: number;
  totalTransactions: number;
  revenueGrowthRate: number;
  transactionsGrowthRate: number;
  recentTransactions: EnrichedPayment[];
}

// Extended payment interface with derived fields for display
interface EnrichedPayment extends Payment {
  service_type: string;
  payment_id: string; // We'll generate this if it's missing
}

export const usePaymentReportController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 100,
    startDate: null,
    endDate: null,
    paymentStatus: null
  });
  
  // Data states
  const [payments, setPayments] = useState<EnrichedPayment[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentDataPoint[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalRevenue: 0,
    totalTransactions: 0,
    revenueGrowthRate: 0,
    transactionsGrowthRate: 0,
    recentTransactions: []
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Map API response to expected format
  const mapPaymentResponse = (apiData: any[]): Payment[] => {
    return apiData.map((item, index) => ({
      // Map fields from actual API response
      id: item.id || index + 1,
      amount: parseFloat(item.amount) || 0,
      cat_id: item.cat_id || 0,
      payment_status: item.payment_status || item.status || 'pending',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
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

  // Handle payment status changes
  const handleStatusChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const value = e.target.value as string;
    setFilterParams(prev => ({
      ...prev,
      paymentStatus: value || null
    }));
  };

  // Simple API test function
  const testAPI = async () => {
    console.log('🔍 Testing Payment API connection...');
    setDebugInfo('Testing API...');
    
    try {
      const response = await axios.get('https://homecare-pro.onrender.com/reports/payments', {
        timeout: 10000
      });
      
      console.log('✅ Raw API Response:', response);
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Headers:', response.headers);
      console.log('📊 Response Data:', response.data);
      
      setDebugInfo(`API Response: Status ${response.status}, Data length: ${response.data?.data?.length || 0}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setDebugInfo(`API Error: ${error.message}`);
      throw error;
    }
  };

  // Enrich payment data with derived fields
  const enrichPaymentData = (data: Payment[]): EnrichedPayment[] => {
    return data.map(payment => ({
      ...payment,
      service_type: SERVICE_TYPE_MAP[payment.cat_id] || `Service ${payment.cat_id}`,
      payment_id: `PAY-${payment.id}-${new Date(payment.created_at).getTime().toString().slice(-6)}`
    }));
  };

  // Fetch payments from the API
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('Starting payment data fetch...');
    
    try {
      console.log('🚀 Starting payment data fetch...');
      
      // Build the URL with query parameters
      let url = `https://homecare-pro.onrender.com/reports/payments`;
      const params = new URLSearchParams();
      
      params.append('page', filterParams.page.toString());
      params.append('limit', filterParams.limit.toString());
      
      if (filterParams.startDate) {
        params.append('startDate', filterParams.startDate);
      }
      
      if (filterParams.endDate) {
        params.append('endDate', filterParams.endDate);
      }
      
      if (filterParams.paymentStatus) {
        params.append('paymentStatus', filterParams.paymentStatus);
      }
      
      const fullUrl = `${url}?${params.toString()}`;
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
      
      // Try to extract data from different possible structures
      let rawData = [];
      
      if (response.data) {
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
        } else if (response.data.payments && Array.isArray(response.data.payments)) {
          rawData = response.data.payments;
          console.log('✅ Data found in .payments property');
        } else {
          console.log('❓ Unexpected response structure:', response.data);
          setDebugInfo('Unexpected response structure. Check console for details.');
        }
      }
      
      console.log('📈 Raw API data:', rawData);
      console.log('📈 Raw data length:', rawData.length);
      console.log('📈 First raw item:', rawData[0]);
      
      // Map API response to expected format
      const mappedData = mapPaymentResponse(rawData);
      
      // Enrich the payment data with derived fields
      const enrichedData = enrichPaymentData(mappedData);
      
      console.log('📈 Enriched data:', enrichedData);
      console.log('📈 Enriched data length:', enrichedData.length);
      console.log('📈 First enriched item:', enrichedData[0]);
      
      setDebugInfo(`Successfully loaded ${enrichedData.length} payments`);
      
      // Update payments
      setPayments(enrichedData);
      
      // Process data for charts and summary
      processDataForCharts(enrichedData);
      
      if (enrichedData.length === 0) {
        setError('ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ');
      }
      
    } catch (err) {
      console.error('💥 Error fetching payments:', err);
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
      setPayments([]);
      setPaymentData([]);
      setSummaryData({
        totalRevenue: 0,
        totalTransactions: 0,
        revenueGrowthRate: 0,
        transactionsGrowthRate: 0,
        recentTransactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Process the payments data for charts and summary
  const processDataForCharts = (data: EnrichedPayment[]) => {
    if (!data || data.length === 0) {
      setPaymentData([]);
      setSummaryData({
        totalRevenue: 0,
        totalTransactions: 0,
        revenueGrowthRate: 0,
        transactionsGrowthRate: 0,
        recentTransactions: []
      });
      return;
    }

    console.log('📊 Processing payment data for charts:', data.length, 'payments');

    // Group by month
    const groupedByMonth = _.groupBy(data, (payment) => {
      const date = new Date(payment.created_at);
      return date.toLocaleString('lo-LA', { month: 'short', year: 'numeric' });
    });
    
    console.log('📊 Grouped by month:', groupedByMonth);
    
    // Calculate income and expenses per month
    const monthlyData = Object.entries(groupedByMonth).map(([month, monthPayments]) => {
      // Calculate total income (consider only completed/paid payments)
      const income = monthPayments
        .filter(payment => 
          payment.payment_status.toLowerCase() === 'paid' || 
          payment.payment_status.toLowerCase() === 'completed'
        )
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Calculate expenses (placeholder - in a real app this might come from a different endpoint)
      // This is just a placeholder to match the expected data format
      const expense = income * 0.6; // For demonstration purposes, expenses are 60% of income
      
      return {
        name: month,
        income,
        expense
      };
    });
    
    // Sort months chronologically
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedData = _.sortBy(monthlyData, item => {
      const monthPart = item.name.split(' ')[0];
      return monthOrder.indexOf(monthPart);
    });
    
    console.log('📊 Sorted monthly data:', sortedData);
    
    setPaymentData(sortedData);
    
    // Calculate summary data - consider only paid/completed transactions
    const totalRevenue = data
      .filter(payment => 
        payment.payment_status.toLowerCase() === 'paid' || 
        payment.payment_status.toLowerCase() === 'completed'
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalTransactions = data.length;
    
    // Calculate growth rates (compare current month with previous month)
    let revenueGrowthRate = 0;
    let transactionsGrowthRate = 0;
    
    if (sortedData.length >= 2) {
      const currentMonth = sortedData[sortedData.length - 1];
      const previousMonth = sortedData[sortedData.length - 2];
      
      if (previousMonth.income > 0) {
        revenueGrowthRate = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
      }
      
      // Calculate transaction growth using the original payments data
      const currentMonthPayments = groupedByMonth[currentMonth.name] || [];
      const previousMonthPayments = groupedByMonth[previousMonth.name] || [];
      
      if (previousMonthPayments.length > 0) {
        transactionsGrowthRate = ((currentMonthPayments.length - previousMonthPayments.length) / previousMonthPayments.length) * 100;
      }
    }
    
    // Get recent transactions (latest 5)
    const recentTransactions = _.orderBy(data, ['created_at'], ['desc']).slice(0, 5);
    
    setSummaryData({
      totalRevenue,
      totalTransactions,
      revenueGrowthRate,
      transactionsGrowthRate,
      recentTransactions
    });

    console.log('✅ Payment charts data processed successfully');
  };

  // Mock data for testing
  const useMockData = () => {
    console.log('🎭 Using mock payment data...');
    
    const mockApiData = [
      {
        id: 1,
        amount: 150000,
        cat_id: 1,
        payment_status: 'paid',
        created_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-01-15T10:35:00Z'
      },
      {
        id: 2,
        amount: 200000,
        cat_id: 2,
        payment_status: 'completed',
        created_at: '2025-01-20T14:15:00Z',
        updated_at: '2025-01-20T14:20:00Z'
      },
      {
        id: 3,
        amount: 350000,
        cat_id: 5,
        payment_status: 'paid',
        created_at: '2025-02-05T09:45:00Z',
        updated_at: '2025-02-05T09:50:00Z'
      },
      {
        id: 4,
        amount: 120000,
        cat_id: 3,
        payment_status: 'pending',
        created_at: '2025-02-10T16:20:00Z',
        updated_at: '2025-02-10T16:25:00Z'
      },
      {
        id: 5,
        amount: 180000,
        cat_id: 4,
        payment_status: 'completed',
        created_at: '2025-02-15T11:10:00Z',
        updated_at: '2025-02-15T11:15:00Z'
      },
      {
        id: 6,
        amount: 250000,
        cat_id: 1,
        payment_status: 'paid',
        created_at: '2025-03-01T13:30:00Z',
        updated_at: '2025-03-01T13:35:00Z'
      },
      {
        id: 7,
        amount: 300000,
        cat_id: 6,
        payment_status: 'completed',
        created_at: '2025-03-10T08:45:00Z',
        updated_at: '2025-03-10T08:50:00Z'
      },
      {
        id: 8,
        amount: 95000,
        cat_id: 7,
        payment_status: 'failed',
        created_at: '2025-03-15T15:20:00Z',
        updated_at: '2025-03-15T15:25:00Z'
      }
    ];
    
    const mappedMockData = mapPaymentResponse(mockApiData);
    const enrichedMockData = enrichPaymentData(mappedMockData);
    
    setPayments(enrichedMockData);
    processDataForCharts(enrichedMockData);
    
    setError(null);
    setDebugInfo('Using mock data for testing');
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchPayments();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 100,
      startDate: null,
      endDate: null,
      paymentStatus: null
    });
  };

  // Export data to CSV with proper Lao font support
  const handleExport = () => {
    if (!payments.length) {
      alert('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
      return;
    }
    
    try {
      // Prepare data for export with Lao headers
      const exportData = payments.map(payment => ({
        'ລະຫັດ': payment.id || '',
        'ລະຫັດການຊຳລະ': payment.payment_id || '',
        'ຈຳນວນເງິນ': payment.amount || '',
        'ປະເພດບໍລິການ': payment.service_type || '',
        'ລະຫັດປະເພດ': payment.cat_id || '',
        'ສະຖານະການຊຳລະ': payment.payment_status || '',
        'ວັນທີສ້າງ': payment.created_at || '',
        'ວັນທີອັບເດດ': payment.updated_at || ''
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
      const filename = `ລາຍງານການຊຳລະເງິນ-${currentDate}.csv`;
      
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
      document.title = `ລາຍງານການຊຳລະເງິນ - ${new Date().toLocaleDateString('lo-LA')}`;
      
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

  // Format date for display (YYYY-MM-DD to Mon DD, YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('lo-LA')} ກີບ`;
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
};