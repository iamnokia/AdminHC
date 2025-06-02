import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface CarData {
  emp_id: number;
  car_brand: string;
  model: string;
  license_plate: string;
  status: string;
  car_image?: File | null;
}

interface ErrorState {
  [key: string]: string | undefined;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  cat_id: number;
  cat_name: string;
}

interface ValidationResult {
  isValid: boolean;
  canRegisterCar: boolean;
  employee: Employee | null;
  errorMessage: string | null;
}

export const useEnhancedCarController = (employeeId: number) => {
  const [formData, setFormData] = useState<CarData>({
    emp_id: employeeId,
    car_brand: "",
    model: "",
    license_plate: "",
    status: "ACTIVE",
    car_image: null
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [validationLoading, setValidationLoading] = useState<boolean>(true);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    canRegisterCar: false,
    employee: null,
    errorMessage: null
  });

  // Validate employee eligibility on mount and when employeeId changes
  useEffect(() => {
    if (employeeId > 0) {
      validateEmployeeEligibility();
    }
  }, [employeeId]);

  const validateEmployeeEligibility = async () => {
    try {
      setValidationLoading(true);
      
      console.log("Validating employee eligibility for ID:", employeeId);
      
      // Fetch employee details and existing car data
      const [employeeResponse, carResponse] = await Promise.all([
        axios.get("https://homecare-pro.onrender.com/employees/read_employees", {
          headers: { "Content-Type": "application/json" }
        }),
        axios.get("https://homecare-pro.onrender.com/emp_car/read_emp_car", {
          headers: { "Content-Type": "application/json" }
        })
      ]);

      console.log("Employee response:", employeeResponse.data);
      console.log("Car response:", carResponse.data);

      const employee = employeeResponse.data.find((emp: Employee) => emp.id === employeeId);
      
      if (!employee) {
        setValidation({
          isValid: false,
          canRegisterCar: false,
          employee: null,
          errorMessage: "ບໍ່ພົບຂໍ້ມູນພະນັກງານ"
        });
        return;
      }

      // Check if employee is in Moving category (cat_id = 5)
      if (employee.cat_id !== 5) {
        setValidation({
          isValid: false,
          canRegisterCar: false,
          employee,
          errorMessage: "ພະນັກງານນີ້ບໍ່ແມ່ນໃນໝວດຂົນສົ່ງ - ບໍ່ສາມາດລົງທະບຽນລົດໄດ້"
        });
        return;
      }

      // Check if employee already has car data
      const existingCar = carResponse.data.find((car: any) => car.emp_id === employeeId);
      if (existingCar) {
        setValidation({
          isValid: false,
          canRegisterCar: false,
          employee,
          errorMessage: "ພະນັກງານນີ້ມີຂໍ້ມູນລົດແລ້ວ - ບໍ່ສາມາດເພີ່ມລົດອີກໄດ້"
        });
        return;
      }

      // Employee is eligible
      setValidation({
        isValid: true,
        canRegisterCar: true,
        employee,
        errorMessage: null
      });

      console.log("Employee validation successful:", employee);
      
    } catch (error) {
      console.error("Error validating employee:", error);
      setValidation({
        isValid: false,
        canRegisterCar: false,
        employee: null,
        errorMessage: "ບໍ່ສາມາດກວດສອບຂໍ້ມູນພະນັກງານໄດ້"
      });
    } finally {
      setValidationLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ErrorState = {};
    
    // First check if employee is eligible
    if (!validation.canRegisterCar) {
      newErrors.general = validation.errorMessage || "ບໍ່ສາມາດລົງທະບຽນລົດໄດ້";
      setErrors(newErrors);
      return false;
    }
    
    // Validate car details
    if (!formData.car_brand.trim()) newErrors.car_brand = "ກະລຸນາປ້ອນຍີ່ຫໍ້ລົດ";
    if (!formData.model.trim()) newErrors.model = "ກະລຸນາປ້ອນຮຸ່ນລົດ";
    if (!formData.license_plate.trim()) newErrors.license_plate = "ກະລຸນາປ້ອນປ້າຍທະບຽນ";
    
    // Car image is optional but can be validated if needed
    // if (!formData.car_image) newErrors.car_image = "ກະລຸນາເລືອກຮູບລົດ";

    // Make sure we have a valid employee ID
    if (!formData.emp_id || formData.emp_id <= 0) {
      newErrors.emp_id = "ບໍ່ມີລະຫັດພະນັກງານທີ່ຖືກຕ້ອງ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    
    console.log("Form submission started", {
      employeeId,
      formData,
      validation
    });
    
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      
      // Show validation error alert
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        Swal.fire({
          title: "ກະລຸນາກວດສອບຂໍ້ມູນ",
          text: errorMessages[0],
          icon: "warning",
          confirmButtonText: "ຕົກລົງ",
          confirmButtonColor: "#611463"
        });
      }
      return;
    }

    try {
      setLoading(true);
      
      // Show loading alert
      Swal.fire({
        title: "ກຳລັງບັນທຶກຂໍ້ມູນ",
        text: "ກະລຸນາລໍຖ້າ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Create JSON data for initial attempt
      const jsonData = {
        emp_id: formData.emp_id,
        car_brand: formData.car_brand,
        model: formData.model,
        license_plate: formData.license_plate,
        status: formData.status
      };
      
      console.log("Sending car data to API:", jsonData);
      
      // Try a direct JSON approach first if no image
      if (!formData.car_image) {
        try {
          const response = await axios.post(
            "https://homecare-pro.onrender.com/emp_car/create_emp_car",
            jsonData,
            { 
              headers: { 
                "Content-Type": "application/json" 
              } 
            }
          );
          
          console.log("API Response (JSON):", response.data);
          
          // Show success message
          await Swal.fire({
            title: "ສຳເລັດ!",
            text: "ບັນທຶກຂໍ້ມູນລົດສຳເລັດ",
            icon: "success",
            confirmButtonText: "ຕົກລົງ",
            confirmButtonColor: "#611463"
          });
          
          // Clear form after submission but keep employee ID
          setFormData({
            emp_id: formData.emp_id,
            car_brand: "",
            model: "",
            license_plate: "",
            status: "ACTIVE",
            car_image: null
          });
          
          // Call success callback if provided
          onSuccess?.();
          return;
        } catch (jsonError) {
          console.log("JSON submission failed, falling back to FormData", jsonError);
          // Fall through to FormData approach
        }
      }
      
      // If JSON approach failed or we have an image, use FormData
      const formDataToSend = new FormData();
      formDataToSend.append("emp_id", String(formData.emp_id));
      formDataToSend.append("car_brand", formData.car_brand);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("license_plate", formData.license_plate);
      formDataToSend.append("status", formData.status);
      
      if (formData.car_image) {
        formDataToSend.append("car_image", formData.car_image);
      }
      
      console.log("Sending FormData to API");
      
      // Make the API request
      const response = await axios.post(
        "https://homecare-pro.onrender.com/emp_car/create_emp_car",
        formDataToSend,
        { 
          headers: { 
            "Content-Type": "multipart/form-data" 
          } 
        }
      );
      
      console.log("API Response (FormData):", response.data);
      
      // Show success message
      await Swal.fire({
        title: "ສຳເລັດ!",
        text: "ບັນທຶກຂໍ້ມູນລົດສຳເລັດ",
        icon: "success",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });

      // Clear form after submission but keep employee ID
      setFormData({
        emp_id: formData.emp_id,
        car_brand: "",
        model: "",
        license_plate: "",
        status: "ACTIVE",
        car_image: null
      });
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (error) {
      console.error("Error creating car:", error);
      
      // Try to extract detailed error information
      let errorMessage = "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນລົດ";
      let errorDetails = "";
      
      if (axios.isAxiosError(error)) {
        console.log("API Error Response:", error.response?.data);
        console.log("API Error Status:", error.response?.status);
        console.log("API Error Headers:", error.response?.headers);
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        if (error.response?.data?.error) {
          errorDetails = JSON.stringify(error.response.data.error);
        }
      }
      
      // Show error message
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463",
        footer: errorDetails ? `<pre>${errorDetails}</pre>` : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      emp_id: employeeId,
      car_brand: "",
      model: "",
      license_plate: "",
      status: "ACTIVE",
      car_image: null
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    validationLoading,
    validation,
    handleChange,
    handleFileChange,
    handleSubmit,
    resetForm,
    validateEmployeeEligibility
  };
};