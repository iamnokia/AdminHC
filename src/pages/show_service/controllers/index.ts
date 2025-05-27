import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeModel } from "../../../models/employee";
import axios from "axios";
import { CarModel } from "../../../models/car";

// Define comment model based on the API response
interface CommentModel {
  id: number;
  users_id: number;
  employees_id: number;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Define Category interface
export interface Category {
  id: number;
  name: string;
  des?: string;
  image?: string;
}

// Define ServiceProvider interface (combined model)
export interface ServiceProvider extends Omit<EmployeeModel, 'price'> {
  price: number;
  categoryType: string;
  car?: CarModel;
  actualRating?: number; // Add actual rating field
}

const useMainController = () => {
  const [data, setData] = useState<EmployeeModel[]>([]);
  const [car, setCar] = useState<CarModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [employeeRatings, setEmployeeRatings] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Navigation helper
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Fetch all employees
  const handleGetAllData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://homecare-pro.onrender.com/employees/read_employees",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setData(res.data);
    } catch (error) {
      console.error("ບໍ່ສາມາດດາວໂຫຼດຂໍ້ມູນຜູ້ໃຫ້ບໍລິການໄດ້:", error);
      setError("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars for moving service providers
  const handleGetCarByCatId = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://homecare-pro.onrender.com/employees/read_emp_car_employees/5",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCar(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error("Error fetching car data:", error);
      setError("ບໍ່ສາມາດດາວໂຫຼດຂໍ້ມູນລົດໄດ້");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const handleGetCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://homecare-pro.onrender.com/categories/read_categories",
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch comments and calculate ratings
  const handleGetComments = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get("https://homecare-pro.onrender.com/comments", {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const commentsData: CommentModel[] = Array.isArray(res.data) ? res.data : [res.data];
      setComments(commentsData);
      
      // Calculate average ratings for each employee
      const ratingsMap = calculateEmployeeRatings(commentsData);
      setEmployeeRatings(ratingsMap);
      
      console.log("Admin - Comments fetched:", commentsData);
      console.log("Admin - Employee ratings calculated:", ratingsMap);
      
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Set empty map if there's an error
      setEmployeeRatings(new Map());
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate average ratings per employee
  const calculateEmployeeRatings = (comments: CommentModel[]): Map<string, number> => {
    const ratingsMap = new Map<string, number>();
    const employeeStats = new Map<string, { totalRating: number; count: number }>();

    // Filter active comments and group by employee
    comments
      .filter(comment => comment.status === 'active' && comment.rating > 0)
      .forEach(comment => {
        const employeeId = String(comment.employees_id);
        const currentStats = employeeStats.get(employeeId) || { totalRating: 0, count: 0 };
        
        employeeStats.set(employeeId, {
          totalRating: currentStats.totalRating + comment.rating,
          count: currentStats.count + 1
        });
      });

    // Calculate average ratings
    employeeStats.forEach(({ totalRating, count }, employeeId) => {
      const averageRating = Math.round((totalRating / count) * 10) / 10; // Round to 1 decimal place
      const starRating = Math.min(5, Math.max(1, Math.round(averageRating))); // Convert to 1-5 star rating
      ratingsMap.set(employeeId, starRating);
    });

    return ratingsMap;
  };

  // Function to get rating for a specific employee
  const getEmployeeRating = (employeeId: string | number): number => {
    const rating = employeeRatings.get(String(employeeId));
    return rating || 5; // Default to 5 stars if no rating found
  };

  // Convert image file to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Update employee with optional image
  const handleUpdateEmployee = async (id: number, employeeData: any, imageFile?: File): Promise<void> => {
    try {
      setLoading(true);
      
      let dataToUpdate = { ...employeeData };
      
      // Handle different approaches for image upload
      if (imageFile) {
        // First approach: Try with FormData (multipart/form-data)
        try {
          const formData = new FormData();
          
          // Add all text fields
          Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] !== undefined) {
              formData.append(key, dataToUpdate[key].toString());
            }
          });
          
          // Add the image file
          formData.append('avatar', imageFile);
          
          await axios.put(
            `https://homecare-pro.onrender.com/employees/update_employees/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          console.log("Image uploaded successfully via FormData");
        } catch (formDataError) {
          console.log("FormData approach failed, trying JSON with base64...");
          
          // Second approach: Convert image to base64 and send as JSON
          try {
            const base64Image = await convertImageToBase64(imageFile);
            dataToUpdate.avatar = base64Image;
            
            await axios.put(
              `https://homecare-pro.onrender.com/employees/update_employees/${id}`,
              dataToUpdate,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log("Image uploaded successfully via JSON with base64");
          } catch (jsonError) {
            console.error("Both image upload approaches failed:", {
              formDataError,
              jsonError
            });
            
            // Fall back to updating without image
            const { avatar, ...dataWithoutImage } = dataToUpdate;
            
            await axios.put(
              `https://homecare-pro.onrender.com/employees/update_employees/${id}`,
              dataWithoutImage,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log("Updated without image - manual image upload required");
          }
        }
      } else {
        // No image to upload, just update data
        await axios.put(
          `https://homecare-pro.onrender.com/employees/update_employees/${id}`,
          dataToUpdate,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Refresh data after update
      await handleGetAllData();
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create new car for moving service provider
  const handleCreateCar = async (carData: any, imageFile?: File): Promise<void> => {
    try {
      setLoading(true);
      
      if (imageFile) {
        const formData = new FormData();
        
        // Add all text fields
        Object.keys(carData).forEach(key => {
          if (carData[key] !== undefined) {
            formData.append(key, carData[key].toString());
          }
        });
        
        // Add the image file
        formData.append('car_image', imageFile);
        
        await axios.post(
          `https://homecare-pro.onrender.com/emp_car/create_emp_car`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // No image to upload
        await axios.post(
          `https://homecare-pro.onrender.com/emp_car/create_emp_car`,
          carData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Refresh car data after create
      await handleGetCarByCatId();
    } catch (error) {
      console.error("Error creating car:", error);
      setError("Failed to create car");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update car details
  const handleUpdateCar = async (id: number, carData: any, imageFile?: File): Promise<void> => {
    try {
      setLoading(true);
      
      // Handle different approaches for car image upload
      if (imageFile) {
        // First approach: Try with FormData (multipart/form-data)
        try {
          const formData = new FormData();
          
          // Add all text fields
          Object.keys(carData).forEach(key => {
            if (carData[key] !== undefined) {
              formData.append(key, carData[key].toString());
            }
          });
          
          // Add the image file
          formData.append('car_image', imageFile);
          
          await axios.put(
            `https://homecare-pro.onrender.com/emp_car/update_emp_car/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          console.log("Car image uploaded successfully via FormData");
        } catch (formDataError) {
          console.log("FormData approach failed, trying JSON with base64...");
          
          // Second approach: Convert image to base64 and send as JSON
          try {
            const base64Image = await convertImageToBase64(imageFile);
            carData.car_image = base64Image;
            
            await axios.put(
              `https://homecare-pro.onrender.com/emp_car/update_emp_car/${id}`,
              carData,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log("Car image uploaded successfully via JSON with base64");
          } catch (jsonError) {
            console.error("Both car image upload approaches failed:", {
              formDataError,
              jsonError
            });
            
            // Fall back to updating without image
            const { car_image, ...dataWithoutImage } = carData;
            
            await axios.put(
              `https://homecare-pro.onrender.com/emp_car/update_emp_car/${id}`,
              dataWithoutImage,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log("Updated car without image - manual image upload required");
          }
        }
      } else {
        // No image to upload, just update data
        await axios.put(
          `https://homecare-pro.onrender.com/emp_car/update_emp_car/${id}`,
          carData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Refresh data after update
      await handleGetCarByCatId();
    } catch (error) {
      console.error("Error updating car:", error);
      setError("Failed to update car");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update status function
  const handleUpdateStatus = async (id: number, status: 'active' | 'inactive'): Promise<void> => {
    try {
      setLoading(true);
      await axios.put(
        `https://homecare-pro.onrender.com/employees/update_employees/${id}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh data after update
      await handleGetAllData();
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete employee function
  const handleDeleteEmployee = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await axios.delete(
        `https://homecare-pro.onrender.com/employees/delete_employees/${id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh data after deletion
      await handleGetAllData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get category type from name for UI display
  const getCategoryType = (catName: string | undefined): string => {
    const normalizedName = (catName || '').toLowerCase();
    
    if (normalizedName.includes('cleaning') || normalizedName.includes('ທຳຄວາມສະອາດ')) return 'cleaning';
    if (normalizedName.includes('electrical') || normalizedName.includes('ໄຟຟ້າ')) return 'electrical';
    if (normalizedName.includes('aircon') || normalizedName.includes('air') || normalizedName.includes('ແອ')) return 'aircon';
    if (normalizedName.includes('plumbing') || normalizedName.includes('ປະປາ')) return 'plumbing';
    if (normalizedName.includes('moving') || normalizedName.includes('ຂົນສົ່ງ')) return 'moving';
    if (normalizedName.includes('bathroom') || normalizedName.includes('ຫ້ອງນ້ຳ')) return 'bathroom';
    if (normalizedName.includes('pest') || normalizedName.includes('ກຳຈັດແມງໄມ້')) return 'pest';
    return 'other';
  };

  // Combine employee and car data with actual ratings
  const getCombinedData = (): ServiceProvider[] => {
    return data.map(employee => {
      const employeeCar = car.find(c => c.emp_id === employee.id);
      const actualRating = getEmployeeRating(employee.id);
      
      return {
        ...employee,
        categoryType: getCategoryType(employee.cat_name),
        car: employeeCar,
        actualRating: actualRating
      };
    });
  };

  // Initialize data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        handleGetAllData(),
        handleGetCarByCatId(),
        handleGetCategories(),
        handleGetComments() // Add comment fetching
      ]);
    };

    fetchAllData();
  }, []);

  return {
    loading,
    error,
    serviceProviders: getCombinedData(),
    categories, // Explicitly expose categories to components
    comments,
    employeeRatings,
    getEmployeeRating,
    handleNavigate,
    handleUpdateEmployee,
    handleCreateCar,
    handleUpdateCar,
    handleUpdateStatus,
    handleDeleteEmployee,
    handleGetAllData,
    handleGetCategories,
    handleGetComments
  };
};

export default useMainController;