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
      const response = await axios.get(`${url}?${params.toString()}`);
      const rawData = response.data.data || [];
      
      // Enrich the comment data with derived fields
      const enrichedData = enrichCommentData(rawData);
      
      // Update comments
      setComments(enrichedData);
      
      // Process data for charts and summary
      processDataForCharts(enrichedData);
      
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.');
      
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

  // Export data to CSV
  const handleExport = () => {
    if (!comments.length) return;
    
    // Prepare data for export (with English rating text for better readability)
    const exportData = comments.map(comment => ({
      ID: comment.id,
      Comment: comment.comment,
      Message: comment.message,
      Rating: comment.rating,
      'Rating Text': RATING_TEXT_MAP_EN[comment.rating] || 'Unknown',
      'Service Type': comment.service_name,
      'User Name': comment.user_name,
      'Created Date': formatDate(comment.created_at)
    }));
    
    const csvData = Papa.unparse(exportData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle print functionality - simplified to use standard print flow
  const handlePrint = () => {
    window.print();
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