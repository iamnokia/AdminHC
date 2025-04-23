import { useState } from "react";
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

export const useSimpleCarController = (employeeId: number) => {
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
    
    // Validate car details
    if (!formData.car_brand.trim()) newErrors.car_brand = "ກະລຸນາປ້ອນຍີ່ຫໍ້ລົດ";
    if (!formData.model.trim()) newErrors.model = "ກະລຸນາປ້ອນຮຸ່ນລົດ";
    if (!formData.license_plate.trim()) newErrors.license_plate = "ກະລຸນາປ້ອນປ້າຍທະບຽນ";
    
    // Only require car image if it's available in the form
    if (formData.car_image === null) newErrors.car_image = "ກະລຸນາເລືອກຮູບລົດ";

    // Make sure we have a valid employee ID
    if (!formData.emp_id || formData.emp_id <= 0) {
      newErrors.emp_id = "ບໍ່ມີລະຫັດພະນັກງານທີ່ຖືກຕ້ອງ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started", {
      employeeId,
      formData
    });
    
    if (!validateForm()) {
      console.log("Form validation failed", errors);
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
      
      // Create JSON data
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
          
          return; // Exit early if successful
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

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};