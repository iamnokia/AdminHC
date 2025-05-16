import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';

// Define interfaces
interface Provider {
  id: number;
  first_name?: string;
  last_name?: string;
  employee_id?: number;
  email?: string;
  tel?: string;
  address?: string;
  gender?: string;
  cv?: string;
  avatar?: string;
  cat_id?: number;
  cat_name?: string;
  price?: number;
  status?: string;
  city?: string;
  village?: string; // Added for village (ບ້ານ)
  district?: string; // Added for district (ເມືອງ)
  car?: any;
  car_brand?: string;
  model?: string;
  license_plate?: string;
  amount?: number;
  service_status?: string;
  order_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface FilterParams {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  catId: string | null;
  status: string | null;
  city: string | null;
}

interface DataPoint {
  name: string;
  value: number;
}

interface PriceRange {
  range: string;
  count: number;
}

// Category mapping for charts
const categoryMap = {
  1: "ທຳຄວາມສະອາດ",
  2: "ສ້ອມແປງໄຟຟ້າ",
  3: "ສ້ອງແປງແອ",
  4: "ສ້ອມແປງນ້ຳປະປາ",
  5: "ແກ່ເຄື່ອງ",
  6: "ດູດສ້ວມ",
  7: "ກຳຈັດປວກ"
};

export const useServiceProviderReportController = () => {
  // State for filtering and UI
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
    startDate: null,
    endDate: null,
    catId: null,
    status: null,
    city: null
  });
  
  const [tabValue, setTabValue] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  
  // Data states
  const [providerData, setProviderData] = useState<Provider[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<DataPoint[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<DataPoint[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<PriceRange[]>([]);
  const [carProviders, setCarProviders] = useState<Provider[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle filter panel
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle basic filter changes
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (e: any) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  // Handle category changes
  const handleCategoryChange = (e: any) => {
    const value = e.target.value;
    setFilterParams(prev => ({
      ...prev,
      catId: value || null
    }));
  };

  // Handle status changes
  const handleStatusChange = (e: any) => {
    const value = e.target.value;
    setFilterParams(prev => ({
      ...prev,
      status: value || null
    }));
  };

  // Handle city changes
  const handleCityChange = (e: any) => {
    const value = e.target.value;
    setFilterParams(prev => ({
      ...prev,
      city: value || null
    }));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows({
      ...expandedRows,
      [id]: !expandedRows[id]
    });
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchProviderData();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
      startDate: null,
      endDate: null,
      catId: null,
      status: null,
      city: null
    });
  };

  // Get all providers - unified approach based on new API endpoint
  const fetchProviderData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the query parameters
      const params = new URLSearchParams();
      
      params.append('page', filterParams.page.toString());
      params.append('limit', filterParams.limit.toString());
      
      if (filterParams.startDate) {
        params.append('startDate', filterParams.startDate);
      }
      
      if (filterParams.endDate) {
        params.append('endDate', filterParams.endDate);
      }
      
      if (filterParams.catId) {
        params.append('cat_id', filterParams.catId);
      }
      
      if (filterParams.status) {
        params.append('status', filterParams.status);
      }
      
      if (filterParams.city) {
        params.append('city', filterParams.city);
      }
      
      // Main array to store all providers
      let allProviders: Provider[] = [];
      
      // 1. Get all employees data from the new endpoint
      try {
        const employeesResponse = await axios.get(
          `https://homecare-pro.onrender.com/employees/read_employees`
        );
        
        if (employeesResponse.data && Array.isArray(employeesResponse.data)) {
          // Process the data to match our Provider interface
          const processedEmployees = employeesResponse.data.map((emp: any) => {
            return {
              id: emp.id || 0,
              first_name: emp.first_name || '',
              last_name: emp.last_name || '',
              email: emp.email || '',
              tel: emp.tel || '',
              address: emp.address || '',
              gender: emp.gender || 'male',
              cv: emp.cv || '',
              avatar: emp.avatar || '',
              cat_id: emp.cat_id || 0,
              cat_name: emp.cat_name || '',
              price: parseFloat(emp.price) || 0,
              status: emp.status || 'inactive',
              city: emp.city || '',
              village: '', // Extract from address if possible
              district: '', // Extract from address if possible
              created_at: emp.created_at || '',
              updated_at: emp.updated_at || ''
            };
          });
          
          allProviders = [...processedEmployees];
        }
      } catch (err) {
        console.error('Error fetching employees data:', err);
      }
      
      // 2. Get employees with cars
      try {
        const carResponse = await axios.get(
          `https://homecare-pro.onrender.com/reports/emp_cars_history?${params.toString()}`
        );
        
        if (carResponse.data && carResponse.data.data) {
          const carData = carResponse.data.data.filter((item: Provider) => 
            item.car_brand && item.license_plate
          );
          
          // Process car providers to update main providers with car info
          carData.forEach((carProvider: Provider) => {
            // Try to find matching provider in the main array
            const existingIndex = allProviders.findIndex(p => p.id === carProvider.id);
            
            if (existingIndex >= 0) {
              // Update existing provider with car info
              allProviders[existingIndex] = {
                ...allProviders[existingIndex],
                car_brand: carProvider.car_brand,
                model: carProvider.model,
                license_plate: carProvider.license_plate,
                service_status: carProvider.service_status
              };
            } else {
              // Add as new provider
              allProviders.push(carProvider);
            }
          });
          
          // Set car providers for the second tab
          setCarProviders(carData);
        }
      } catch (err) {
        console.error('Error fetching car employees data:', err);
      }
      
      // 3. Fetch specific moving category providers if needed
      if (tabValue === 1 || filterParams.catId === '5') {
        try {
          const movingParams = new URLSearchParams(params);
          // Force the category to Moving (5)
          movingParams.set('cat_id', '5');
          
          const movingResponse = await axios.get(
            `https://homecare-pro.onrender.com/reports/read_emp_car_employees/5?${movingParams.toString()}`
          );
          
          if (movingResponse.data && movingResponse.data.data) {
            const movingData = movingResponse.data.data;
            
            // Process moving providers
            movingData.forEach((movingProvider: Provider) => {
              // Try to find matching provider in the main array
              const existingIndex = allProviders.findIndex(p => p.id === movingProvider.id);
              
              if (existingIndex >= 0) {
                // Update existing provider with car info
                allProviders[existingIndex] = {
                  ...allProviders[existingIndex],
                  car_brand: movingProvider.car_brand,
                  model: movingProvider.model,
                  license_plate: movingProvider.license_plate,
                  service_status: movingProvider.service_status
                };
              } else {
                // Add as new provider
                allProviders.push(movingProvider);
              }
            });
            
            // Update car providers for the second tab
            setCarProviders(prev => {
              // Add only unique providers (not already in the list)
              const existingIds = new Set(prev.map(p => p.id));
              const newProviders = movingData.filter((p: Provider) => !existingIds.has(p.id));
              return [...prev, ...newProviders];
            });
          }
        } catch (err) {
          console.error('Error fetching moving providers:', err);
        }
      }
      
      // Process addresses to extract village and district if possible
      allProviders = allProviders.map(provider => {
        const addressParts = (provider.address || '').split(',').map(part => part.trim());
        
        let village = '';
        let district = '';
        
        // Extract village and district from address if it follows a pattern
        if (addressParts.length >= 2) {
          village = addressParts[0];
          district = addressParts[addressParts.length - 1];
        }
        
        return {
          ...provider,
          village: provider.village || village,
          district: provider.district || district
        };
      });
      
      // Apply filtering based on params
      let filteredProviders = allProviders;
      
      if (filterParams.catId) {
        filteredProviders = filteredProviders.filter(p => 
          p.cat_id === parseInt(filterParams.catId || '0')
        );
      }
      
      if (filterParams.status) {
        filteredProviders = filteredProviders.filter(p => 
          p.status?.toLowerCase() === filterParams.status?.toLowerCase() ||
          p.service_status?.toLowerCase() === filterParams.status?.toLowerCase()
        );
      }
      
      if (filterParams.city) {
        filteredProviders = filteredProviders.filter(p => 
          p.city === filterParams.city
        );
      }
      
      if (filterParams.startDate && filterParams.endDate) {
        filteredProviders = filteredProviders.filter(p => {
          const createdDate = new Date(p.created_at || '');
          const startDate = new Date(filterParams.startDate || '');
          const endDate = new Date(filterParams.endDate || '');
          
          return createdDate >= startDate && createdDate <= endDate;
        });
      }
      
      // Apply pagination
      const start = (filterParams.page - 1) * filterParams.limit;
      const end = start + filterParams.limit;
      const paginatedProviders = filteredProviders.slice(start, end);
      
      // Remove duplicates (by ID)
      const uniqueProviders = Array.from(
        new Map(paginatedProviders.map(item => [item.id, item])).values()
      );
      
      setProviderData(uniqueProviders);
      
      // Process data for charts
      processDataForCharts(filteredProviders); // Use all filtered data for charts, not just paginated
      
    } catch (err) {
      console.error('Error fetching provider data:', err);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.');
      
      // Reset data
      setProviderData([]);
      setCategoryDistribution([]);
      setStatusDistribution([]);
      setPriceRangeData([]);
      setCarProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Process the data for charts
  const processDataForCharts = (data: Provider[]) => {
    if (!data || data.length === 0) {
      setCategoryDistribution([]);
      setStatusDistribution([]);
      setPriceRangeData([]);
      return;
    }

    // Count providers by category
    const categoryCounts: Record<string, number> = {};
    
    data.forEach(provider => {
      const catId = provider.cat_id?.toString() || 'unknown';
      categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
    });
    
    // Format category distribution data
    const categoryData = Object.entries(categoryCounts)
      .filter(([key]) => key !== 'unknown')
      .map(([key, value]) => ({
        name: categoryMap[key as keyof typeof categoryMap] || `Category ${key}`,
        value
      }));
    
    setCategoryDistribution(categoryData);
    
    // Count providers by status
    const activeCount = data.filter(
      p => p.status?.toLowerCase() === 'active' || p.service_status?.toLowerCase() === 'active'
    ).length;
    
    const inactiveCount = data.filter(
      p => p.status?.toLowerCase() === 'inactive' || p.service_status?.toLowerCase() === 'inactive' || 
           p.service_status?.toLowerCase() === 'not start'
    ).length;
    
    setStatusDistribution([
      { name: 'Active', value: activeCount },
      { name: 'Inactive', value: inactiveCount }
    ]);
    
    // Process price ranges
    const priceRanges = [
      { range: '0-50', count: 0 },
      { range: '51-100', count: 0 },
      { range: '101-150', count: 0 },
      { range: '151+', count: 0 }
    ];
    
    data.forEach(provider => {
      const price = provider.price || provider.amount || 0;
      
      if (price <= 50) {
        priceRanges[0].count++;
      } else if (price <= 100) {
        priceRanges[1].count++;
      } else if (price <= 150) {
        priceRanges[2].count++;
      } else {
        priceRanges[3].count++;
      }
    });
    
    setPriceRangeData(priceRanges);
  };

  // Export data to CSV
  const handleExport = () => {
    if (!providerData.length) return;
    
    const csvData = Papa.unparse(providerData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `service-provider-report-${new Date().toISOString().split('T')[0]}.csv`);
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
    fetchProviderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data when tab changes to ensure we have the right data for each tab
  useEffect(() => {
    if (tabValue === 1) {
      // When switching to the car providers tab, ensure we fetch car data
      fetchProviderData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return {
    filterOpen,
    toggleFilter,
    filterParams,
    handleFilterChange,
    handleDateChange,
    handleCategoryChange,
    handleStatusChange,
    handleCityChange,
    applyFilters,
    resetFilters,
    loading,
    error,
    providerData,
    categoryDistribution,
    statusDistribution,
    priceRangeData,
    carProviders,
    tabValue,
    setTabValue,
    expandedRows,
    toggleRowExpansion,
    handleExport,
    handlePrint
  };
};