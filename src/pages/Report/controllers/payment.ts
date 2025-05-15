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
    limit: 10,
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

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchPayments();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
      startDate: null,
      endDate: null,
      paymentStatus: null
    });
  };

  // Enrich payment data with derived fields
  const enrichPaymentData = (data: Payment[]): EnrichedPayment[] => {
    return data.map(payment => ({
      ...payment,
      service_type: SERVICE_TYPE_MAP[payment.cat_id] || `Service ${payment.cat_id}`,
      payment_id: `HC-${payment.id}-${new Date(payment.created_at).getTime().toString().slice(-6)}`
    }));
  };

  // Fetch payments from the API
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
      
      // Make the API request
      const response = await axios.get(`${url}?${params.toString()}`);
      const rawData = response.data.data || [];
      
      // Enrich the payment data with derived fields
      const enrichedData = enrichPaymentData(rawData);
      
      // Update payments
      setPayments(enrichedData);
      
      // Process data for charts and summary
      processDataForCharts(enrichedData);
      
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.');
      
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

    // Group by month
    const groupedByMonth = _.groupBy(data, (payment) => {
      // Extract month from created_at (assuming format is YYYY-MM-DD HH:MM:SS)
      const date = new Date(payment.created_at);
      return date.toLocaleString('en-US', { month: 'short' });
    });
    
    // Calculate income and expenses per month
    const monthlyData = Object.entries(groupedByMonth).map(([month, monthPayments]) => {
      // Calculate total income (consider only completed/paid payments)
      const income = monthPayments
        .filter(payment => payment.payment_status.toLowerCase() === 'paid' || payment.payment_status.toLowerCase() === 'completed')
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
    const sortedData = _.sortBy(monthlyData, item => monthOrder.indexOf(item.name));
    
    setPaymentData(sortedData);
    
    // Calculate summary data - consider only paid/completed transactions
    const totalRevenue = data
      .filter(payment => payment.payment_status.toLowerCase() === 'paid' || payment.payment_status.toLowerCase() === 'completed')
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
    
    // Get recent transactions (latest 3)
    const recentTransactions = _.orderBy(data, ['created_at'], ['desc']).slice(0, 3);
    
    setSummaryData({
      totalRevenue,
      totalTransactions,
      revenueGrowthRate,
      transactionsGrowthRate,
      recentTransactions
    });
  };

  // Export data to CSV
  const handleExport = () => {
    if (!payments.length) return;
    
    const csvData = Papa.unparse(payments);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payment-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = document.getElementById('payment-report-print');
    
    if (printContent) {
      const printCSS = `
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            #payment-report-print, #payment-report-print * {
              visibility: visible;
            }
            #payment-report-print {
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
        printWindow.document.write('<html><head><title>Payment Report</title>');
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

  // Format date for display (YYYY-MM-DD to Mon DD, YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `₭ ${amount.toFixed(2)} `;
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
    handleExport,
    handlePrint,
    formatDate,
    formatCurrency
  };
};