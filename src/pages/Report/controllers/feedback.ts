import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';

// Define types based on the API response
interface Comment {
  id: number;
  comment: string;
  message: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    id: number;
  };
  service_type?: string;
}

interface FilterParams {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  rating: string | null;
}

interface FeedbackDataPoint {
  name: string;
  value: number;
}

interface FeedbackSummary {
  averageRating: number;
  totalReviews: number;
  positivePercentage: number;
  responseRate: number;
  recentComments: EnrichedComment[];
}

// Extended comment interface with derived fields for display
interface EnrichedComment extends Comment {
  service_name: string;
  rating_text: string;
  user_name: string;
}

// Map to translate rating numbers to text
const RATING_TEXT_MAP: Record<number, string> = {
  5: 'ດີຫຼາຍ', // Excellent
  4: 'ດີ', // Good
  3: 'ພໍໃຊ້ໄດ້', // Average
  2: 'ຄວນປັບປຸງ', // Poor
  1: 'ບໍ່ພໍໃຈ' // Very Poor
};

// English translations for export purposes
const RATING_TEXT_MAP_EN: Record<number, string> = {
  5: 'Excellent',
  4: 'Good',
  3: 'Average',
  2: 'Poor',
  1: 'Very Poor'
};

export const useFeedbackReportController = () => {
  // State for filtering and data
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
    startDate: null,
    endDate: null,
    rating: null
  });
  
  // Data states
  const [comments, setComments] = useState<EnrichedComment[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackDataPoint[]>([]);
  const [summaryData, setSummaryData] = useState<FeedbackSummary>({
    averageRating: 0,
    totalReviews: 0,
    positivePercentage: 0,
    responseRate: 0,
    recentComments: []
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

  // Handle rating changes
  const handleRatingChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const value = e.target.value as string;
    setFilterParams(prev => ({
      ...prev,
      rating: value || null
    }));
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchComments();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
      startDate: null,
      endDate: null,
      rating: null
    });
  };

  // Enrich comment data with derived fields
  const enrichCommentData = (data: Comment[]): EnrichedComment[] => {
    return data.map(comment => ({
      ...comment,
      service_name: comment.service_type || 'HomeCare',
      rating_text: RATING_TEXT_MAP[comment.rating] || 'Unknown',
      user_name: comment.user?.name || 'Anonymous'
    }));
  };

  // Fetch comments from the API
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the URL with query parameters
      let url = `https://homecare-pro.onrender.com/reports/comments`;
      const params = new URLSearchParams();
      
      params.append('page', filterParams.page.toString());
      params.append('limit', filterParams.limit.toString());
      
      if (filterParams.startDate) {
        params.append('startDate', filterParams.startDate);
      }
      
      if (filterParams.endDate) {
        params.append('endDate', filterParams.endDate);
      }
      
      if (filterParams.rating) {
        params.append('rating', filterParams.rating);
      }
      
      // Make the API request
      const response = await axios.get(`${url}?${params.toString()}`, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const rawData = response.data.data || [];
      
      // Enrich the comment data with derived fields
      const enrichedData = enrichCommentData(rawData);
      
      // Update comments
      setComments(enrichedData);
      
      // Process data for charts and summary
      processDataForCharts(enrichedData);
      
    } catch (err) {
      console.error('Error fetching comments:', err);
      
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
      
      // Set empty data
      setComments([]);
      setFeedbackData([]);
      setSummaryData({
        averageRating: 0,
        totalReviews: 0,
        positivePercentage: 0,
        responseRate: 0,
        recentComments: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Process the comments data for charts and summary
  const processDataForCharts = (data: EnrichedComment[]) => {
    if (!data || data.length === 0) {
      setFeedbackData([]);
      setSummaryData({
        averageRating: 0,
        totalReviews: 0,
        positivePercentage: 0,
        responseRate: 0,
        recentComments: []
      });
      return;
    }

    // Group by rating
    const groupedByRating = _.groupBy(data, 'rating');
    
    // Calculate distribution for pie chart
    const ratingDistribution = _.map(RATING_TEXT_MAP, (ratingText, ratingValue) => {
      const count = (groupedByRating[ratingValue] || []).length;
      return {
        name: ratingText,
        value: count
      };
    }).filter(item => item.value > 0); // Only include ratings with data
    
    setFeedbackData(ratingDistribution);
    
    // Calculate summary data
    const totalReviews = data.length;
    
    // Calculate average rating
    const totalRatingSum = data.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;
    
    // Calculate positive percentage (ratings 4 and 5)
    const positiveComments = data.filter(comment => comment.rating >= 4).length;
    const positivePercentage = totalReviews > 0 ? (positiveComments / totalReviews) * 100 : 0;
    
    // Calculate response rate (this is a mock value as the API doesn't provide this info)
    // In a real scenario, this might come from another API endpoint or be calculated differently
    const responseRate = 89; // Using a fixed value for demonstration
    
    // Get recent comments (latest 3)
    const recentComments = _.orderBy(data, ['created_at'], ['desc']).slice(0, 3);
    
    setSummaryData({
      averageRating,
      totalReviews,
      positivePercentage,
      responseRate,
      recentComments
    });
  };

  // Enhanced export function with proper UTF-8 encoding for Lao text
const handleExport = () => {
  if (!comments.length) {
    alert('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
    return;
  }
  
  try {
    // IMPROVED date formatting that Excel definitely recognizes
    const formatDateForExcel = (dateString) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return dateString; // Return original if can't parse
        }
        
        // Use YYYY-MM-DD format (ISO format) - most reliable for Excel
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Date formatting error:', error);
        return dateString;
      }
    };

    // Prepare data with EXPLICIT field naming and typing
    const exportData = comments.map((comment, index) => ({
      'ID': String(comment.id || index + 1),
      'Comment': String(comment.comment || ''),
      'Message': String(comment.message || ''),
      'Rating': String(comment.rating || ''),
      'Rating_Text': String(comment.rating_text || ''),
      'Service_Type': String(comment.service_name || ''),
      'User_Name': String(comment.user_name || ''),
      'Created_Date': formatDateForExcel(comment.created_at),
      'Updated_Date': formatDateForExcel(comment.updated_at)
    }));
    
    // Enhanced CSV generation
    const csvData = Papa.unparse(exportData, {
      header: true,
      encoding: 'utf8',
      delimiter: ',',
      newline: '\r\n',
      skipEmptyLines: false,
      quotes: false, // Let Papa decide when to quote
      quoteChar: '"',
      escapeChar: '"'
    });
    
    // Add UTF-8 BOM
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvData;
    
    // Create and download
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `ຂໍ້ມູນການໃຫ້ຄຳເຫັນ-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Feedback export successful');
    
  } catch (error) {
    console.error('❌ Feedback export error:', error);
    alert('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກຂໍ້ມູນ. ກະລຸນາລອງໃໝ່.');
  }
};
  // Enhanced print functionality
  const handlePrint = () => {
    try {
      // Store the original title
      const originalTitle = document.title;
      
      // Set a descriptive title for the print
      document.title = `ລາຍງານການໃຫ້ຄຳເຫັນ - ${new Date().toLocaleDateString('lo-LA')}`;
      
      // Add a small delay to ensure the page is fully rendered
      setTimeout(() => {
        // Trigger the print dialog
        window.print();
        
        // Restore the original title after printing
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleRatingChange,
    applyFilters,
    resetFilters,
    feedbackData,
    summaryData,
    loading,
    error,
    handleExport,
    handlePrint,
    formatDate,
    RATING_TEXT_MAP
  };
};