import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';

// Define interfaces based on actual API response
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
  village?: string;
  district?: string;
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
    limit: 50,
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
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Map API response to expected format
  const mapProviderResponse = (apiData: any[]): Provider[] => {
    return apiData.map((item, index) => ({
      // Map fields from actual API response
      id: item.id || item.employee_id || index + 1,
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      employee_id: item.employee_id || item.id || 0,
      email: item.email || '',
      tel: item.tel || item.phone || '',
      address: item.address || '',
      gender: item.gender || 'male',
      cv: item.cv || '',
      avatar: item.avatar || '',
      cat_id: item.cat_id || 0,
      cat_name: item.cat_name || '',
      price: parseFloat(item.price || item.amount || 0),
      status: item.status || 'inactive',
      city: item.city || '',
      village: item.village || '',
      district: item.district || '',
      car_brand: item.car_brand || item.car?.car_brand || '',
      model: item.model || item.car?.model || '',
      license_plate: item.license_plate || item.car?.license_plate || '',
      service_status: item.service_status || item.status || '',
      order_date: item.order_date || '',
      created_at: item.created_at || '',
      updated_at: item.updated_at || ''
    }));
  };

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

  // Simple API test function
  const testAPI = async () => {
    console.log('🔍 Testing Provider API connections...');
    setDebugInfo('Testing APIs...');
    
    try {
      // Test employees endpoint
      const employeesResponse = await axios.get(
        'https://homecare-pro.onrender.com/employees/read_employees',
        { timeout: 10000 }
      );
      
      console.log('✅ Employees API Response:', employeesResponse);
      console.log('📊 Employees Data:', employeesResponse.data);
      
      // Test car history endpoint
      const carsResponse = await axios.get(
        'https://homecare-pro.onrender.com/reports/emp_cars_history',
        { timeout: 10000 }
      );
      
      console.log('✅ Cars API Response:', carsResponse);
      console.log('📊 Cars Data:', carsResponse.data);
      
      setDebugInfo(`APIs tested successfully. Employees: ${employeesResponse.data?.length || 0}, Cars: ${carsResponse.data?.data?.length || 0}`);
      
      return { employees: employeesResponse.data, cars: carsResponse.data };
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setDebugInfo(`API Error: ${error.message}`);
      throw error;
    }
  };

  // Get all providers - unified approach based on API endpoints
  const fetchProviderData = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('Starting provider data fetch...');
    
    try {
      console.log('🚀 Starting provider data fetch...');
      
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
      
      // 1. Get all employees data from the main endpoint
      try {
        console.log('📡 Fetching employees data...');
        const employeesResponse = await axios.get(
          `https://homecare-pro.onrender.com/employees/read_employees`,
          { timeout: 15000 }
        );
        
        console.log('📊 Employees Response:', employeesResponse.data);
        console.log('📊 Employees Type:', typeof employeesResponse.data);
        console.log('📊 Is Array:', Array.isArray(employeesResponse.data));
        
        if (employeesResponse.data && Array.isArray(employeesResponse.data)) {
          const processedEmployees = mapProviderResponse(employeesResponse.data);
          allProviders = [...processedEmployees];
          console.log('✅ Processed employees:', processedEmployees.length);
        }
      } catch (err) {
        console.error('❌ Error fetching employees data:', err);
        setDebugInfo(`Employee API error: ${err.message}`);
      }
      
      // 2. Get employees with cars
      try {
        console.log('📡 Fetching car employees data...');
        const carResponse = await axios.get(
          `https://homecare-pro.onrender.com/reports/emp_cars_history?${params.toString()}`,
          { timeout: 15000 }
        );
        
        console.log('📊 Car Response:', carResponse.data);
        
        if (carResponse.data && carResponse.data.data) {
          const carData = carResponse.data.data.filter((item: Provider) => 
            item.car_brand && item.license_plate
          );
          
          console.log('✅ Car providers found:', carData.length);
          
          // Process car providers to update main providers with car info
          carData.forEach((carProvider: Provider) => {
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
              const mappedCarProvider = mapProviderResponse([carProvider])[0];
              allProviders.push(mappedCarProvider);
            }
          });
          
          // Set car providers for the second tab
          setCarProviders(mapProviderResponse(carData));
        }
      } catch (err) {
        console.error('❌ Error fetching car employees data:', err);
        setDebugInfo(prev => `${prev}; Car API error: ${err.message}`);
      }
      
      // 3. Fetch specific moving category providers if needed
      if (tabValue === 1 || filterParams.catId === '5') {
        try {
          console.log('📡 Fetching moving providers...');
          const movingParams = new URLSearchParams(params);
          movingParams.set('cat_id', '5');
          
          const movingResponse = await axios.get(
            `https://homecare-pro.onrender.com/reports/read_emp_car_employees/5?${movingParams.toString()}`,
            { timeout: 15000 }
          );
          
          console.log('📊 Moving Response:', movingResponse.data);
          
          if (movingResponse.data && movingResponse.data.data) {
            const movingData = movingResponse.data.data;
            
            // Process moving providers
            movingData.forEach((movingProvider: Provider) => {
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
                const mappedMovingProvider = mapProviderResponse([movingProvider])[0];
                allProviders.push(mappedMovingProvider);
              }
            });
            
            // Update car providers for the second tab
            setCarProviders(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newProviders = movingData
                .filter((p: Provider) => !existingIds.has(p.id))
                .map((p: Provider) => mapProviderResponse([p])[0]);
              return [...prev, ...newProviders];
            });
          }
        } catch (err) {
          console.error('❌ Error fetching moving providers:', err);
          setDebugInfo(prev => `${prev}; Moving API error: ${err.message}`);
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
      
      console.log('📈 All providers before filtering:', allProviders.length);
      
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
      
      console.log('📈 Filtered providers:', filteredProviders.length);
      
      // Apply pagination
      const start = (filterParams.page - 1) * filterParams.limit;
      const end = start + filterParams.limit;
      const paginatedProviders = filteredProviders.slice(start, end);
      
      // Remove duplicates (by ID)
      const uniqueProviders = Array.from(
        new Map(paginatedProviders.map(item => [item.id, item])).values()
      );
      
      console.log('📈 Final unique providers:', uniqueProviders.length);
      
      setProviderData(uniqueProviders);
      setDebugInfo(`Successfully loaded ${uniqueProviders.length} providers`);
      
      // Process data for charts
      processDataForCharts(filteredProviders); // Use all filtered data for charts, not just paginated
      
      if (uniqueProviders.length === 0) {
        setError('ບໍ່ມີຂໍ້ມູນສຳລັບການເລືອກປະຈຸບັນ');
      }
      
    } catch (err) {
      console.error('💥 Error fetching provider data:', err);
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

    console.log('📊 Processing data for charts:', data.length, 'providers');

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
    console.log('📊 Category distribution:', categoryData);
    
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
      { range: '0-50000', count: 0 },
      { range: '50001-100000', count: 0 },
      { range: '100001-200000', count: 0 },
      { range: '200001+', count: 0 }
    ];
    
    data.forEach(provider => {
      const price = provider.price || provider.amount || 0;
      
      if (price <= 50000) {
        priceRanges[0].count++;
      } else if (price <= 100000) {
        priceRanges[1].count++;
      } else if (price <= 200000) {
        priceRanges[2].count++;
      } else {
        priceRanges[3].count++;
      }
    });
    
    setPriceRangeData(priceRanges);
    console.log('✅ Charts data processed successfully');
  };

  // Mock data for testing
  const useMockData = () => {
    console.log('🎭 Using mock provider data...');
    
    const mockApiData = [
      {
        id: 1,
        first_name: 'ສົມພອນ',
        last_name: 'ວົງສີ',
        email: 'sompon@example.com',
        tel: '020-12345678',
        address: 'ບ້ານໂພນເມືອງ, ເມືອງຈັນທະບູລີ',
        gender: 'male',
        cat_id: 1,
        price: 150000,
        status: 'active',
        city: 'CHANTHABULY',
        created_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 2,
        first_name: 'ມາລີ',
        last_name: 'ພົມມະ',
        email: 'malee@example.com',
        tel: '020-87654321',
        address: 'ບ້ານດົງປະລານ, ເມືອງສີໂຄດຕະບົງ',
        gender: 'female',
        cat_id: 2,
        price: 200000,
        status: 'active',
        city: 'SIKHOTTABONG',
        created_at: '2025-01-02T00:00:00Z'
      },
      {
        id: 3,
        first_name: 'ບຸນມີ',
        last_name: 'ແກ້ວ',
        email: 'bounmy@example.com',
        tel: '020-11223344',
        address: 'ບ້ານໂນນໝີ່ໃຕ້, ເມືອງໄຊເສດຖາ',
        gender: 'male',
        cat_id: 5,
        price: 350000,
        status: 'active',
        city: 'XAYSETHA',
        car_brand: 'Toyota',
        model: 'Hilux',
        license_plate: 'VTE-1234',
        created_at: '2025-01-03T00:00:00Z'
      },
      {
        id: 4,
        first_name: 'ນາງສີດາ',
        last_name: 'ຄຳ',
        email: 'sida@example.com',
        tel: '020-55667788',
        address: 'ບ້ານດົງນາທອງ, ເມືອງສີສັດຕະນາກ',
        gender: 'female',
        cat_id: 3,
        price: 120000,
        status: 'inactive',
        city: 'SISATTANAK',
        created_at: '2025-01-04T00:00:00Z'
      },
      {
        id: 5,
        first_name: 'ຄຳພອນ',
        last_name: 'ລາວົງ',
        email: 'kampone@example.com',
        tel: '020-99887766',
        address: 'ບ້ານໂພນຫອງ, ເມືອງນາໄຊທອງ',
        gender: 'male',
        cat_id: 4,
        price: 180000,
        status: 'active',
        city: 'NAXAITHONG',
        created_at: '2025-01-05T00:00:00Z'
      }
    ];
    
    const mappedMockData = mapProviderResponse(mockApiData);
    setProviderData(mappedMockData);
    processDataForCharts(mappedMockData);
    
    // Set car providers (filter those with cars)
    const mockCarProviders = mappedMockData.filter(p => p.car_brand);
    setCarProviders(mockCarProviders);
    
    setError(null);
    setDebugInfo('Using mock data for testing');
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    await fetchProviderData();
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 50,
      startDate: null,
      endDate: null,
      catId: null,
      status: null,
      city: null
    });
  };

  // Export data to CSV with proper Lao font support
  const handleExport = () => {
    if (!providerData.length) {
      alert('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
      return;
    }
    
    try {
      // Prepare data for export with Lao headers
      const exportData = providerData.map(provider => ({
        'ລະຫັດ': provider.id || '',
        'ຊື່': provider.first_name || '',
        'ນາມສະກຸນ': provider.last_name || '',
        'ອີເມວ': provider.email || '',
        'ເບີໂທ': provider.tel || '',
        'ທີ່ຢູ່': provider.address || '',
        'ເພດ': provider.gender === 'male' ? 'ຊາຍ' : 'ຍິງ',
        'ປະເພດການບໍລິການ': categoryMap[provider.cat_id] || '',
        'ລາຄາ': provider.price || '',
        'ສະຖານະ': provider.status || '',
        'ເມືອງ': provider.city || '',
        'ບ້ານ': provider.village || '',
        'ຍີ່ຫໍ້ລົດ': provider.car_brand || '',
        'ຮຸ່ນລົດ': provider.model || '',
        'ປ້າຍທະບຽນ': provider.license_plate || '',
        'ວັນທີສ້າງ': provider.created_at || '',
        'ວັນທີອັບເດດ': provider.updated_at || ''
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
      const filename = `ລາຍງານຜູ້ໃຫ້ບໍລິການ-${currentDate}.csv`;
      
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
      document.title = `ລາຍງານຜູ້ໃຫ້ບໍລິການ - ${new Date().toLocaleDateString('lo-LA')}`;
      
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
    debugInfo,
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
    handlePrint,
    useMockData,
    testAPI
  };
};