import { useState } from "react";
import axios from "axios";
import { Gender } from "../../../enums/gender";
import { Status } from "../../../enums/status";
import Swal from "sweetalert2";

export interface EmployeeModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  address: string;
  city: string;
  gender: Gender;
  cv: string;
  avatar: string;
  cat_id: string;
  cat_name: string;
  price: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export const useMainControllers = () => {
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    tel: "+85620",
    password: "",
    address: "",
    gender: "",
    cv: "",
    avatar: null,
    cat_id: "",
    price: "",
    city: "",
  });

  // Form error state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cities list
  const cities = [
    "CHANTHABULY",
    "SIKHOTTABONG",
    "XAYSETHA",
    "SISATTANAK",
    "NAXAITHONG",
    "XAYTANY",
    "HADXAIFONG",
  ];

  // Categories list
  const categories = [
    { id: "1", name: "ທຳຄວາມສະອາດ" },
    { id: "2", name: "ສ້ອມແປງໄຟຟ້າ" },
    { id: "3", name: "ສ້ອມແປງແອ" },
    { id: "4", name: "ສ້ອມແປງນ້ຳປະປາ" },
    { id: "5", name: "ແກ່ເຄື່ອງ" },
    { id: "6", name: "ດູດສ້ວມ" },
    { id: "7", name: "ກຳຈັດປວກ" },
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });

      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields validation
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "tel",
      "password",
      "gender",
      "address",
      "cat_id",
      "city",
      "price",
      "cv",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation - very important
    if (formData.tel) {
      const cleanedTel = formData.tel.replace(/\s/g, "");
      if (!/^\+85620\d{8}$/.test(cleanedTel)) {
        newErrors.tel = "Please enter a valid phone number with 8 digits after +85620";
        isValid = false;
      }
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Price validation
    if (formData.price) {
      const price = parseInt(formData.price, 10);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Please enter a valid price amount";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Check if form is valid (used for enabling/disabling submit button)
  const isFormValid = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "tel",
      "password",
      "gender",
      "address",
      "cat_id",
      "city",
      "price",
      "cv",
    ];

    return requiredFields.every((field) => !!formData[field]) && 
           formData.tel.length >= 13; // +85620 (6 chars) + 8 digits = 14 chars (or more with spaces)
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation and stop if invalid
    if (!validateForm()) {
      // Show validation error alert
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ ແລະ ຖືກຕ້ອງ",
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "ກຳລັງບັນທຶກຂໍ້ມູນ",
      text: "ກະລຸນາລໍຖ້າ...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setIsSubmitting(true);

    try {
      // Find category name based on cat_id
      const selectedCategory = categories.find(cat => cat.id === formData.cat_id);
      const categoryName = selectedCategory ? selectedCategory.name : "";

      // Clean form data - remove whitespace and format properly
      const cleanedFormData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        tel: formData.tel.replace(/\s/g, ""), // Remove any spaces
        password: formData.password,
        address: formData.address.trim(),
        gender: formData.gender,
        cv: formData.cv.trim(),
        cat_id: formData.cat_id,
        cat_name: categoryName,
        price: formData.price,
        city: formData.city,
        status: Status.ACTIVE
      };

      let response;

      if (formData.avatar) {
        // If we have an image, use FormData approach
        const submitData = new FormData();
        
        // Add all text fields to FormData
        Object.entries(cleanedFormData).forEach(([key, value]) => {
          submitData.append(key, value);
        });
        
        // Add file last
        submitData.append('avatar', formData.avatar);

        // Log what we're sending for debugging
        console.log("Submitting form with image", {
          method: "POST",
          url: "https://homecare-pro.onrender.com/employees/create_employees",
          contentType: "multipart/form-data",
          data: Object.fromEntries(submitData.entries())
        });

        // Send with multipart/form-data
        response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 15000 // Set a reasonable timeout
          }
        );
      } else {
        // If no image, use regular JSON submission
        // Log what we're sending for debugging
        console.log("Submitting form without image", {
          method: "POST",
          url: "https://homecare-pro.onrender.com/employees/create_employees",
          contentType: "application/json",
          data: cleanedFormData
        });

        // Send as JSON
        response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          cleanedFormData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 15000 // Set a reasonable timeout
          }
        );
      }

      console.log("API Response:", response.data);
      setSubmitSuccess(true);

      // Show success alert
      Swal.fire({
        title: "ສຳເລັດ!",
        text: "ບັນທຶກຂໍ້ມູນພະນັກງານສຳເລັດແລ້ວ",
        icon: "success",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });

      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        tel: "+85620",
        password: "",
        address: "",
        gender: "",
        cv: "",
        avatar: null,
        cat_id: "",
        price: "",
        city: "",
      });

    } catch (error) {
      console.error("Error creating employee:", error);
      
      // Detailed error logging for debugging
      console.error("API Error Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });

      // Determine error message
      let errorMessage = "ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.";

      // Handle API error responses
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string' && error.response.data.includes('Internal Server Error')) {
          errorMessage = "ເກີດຂໍ້ຜິດພາດທາງເຊີບເວີ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງຫຼັງຈາກ.";
        }
      }

      // Show error alert
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });

      // Set errors state for form validation
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ general: error.response.data.message || "An error occurred" });
        }
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleFileChange,
    handleSubmit,
    isFormValid,
    validateForm,
    cities,
    categories,
    errors,
    isSubmitting,
    submitSuccess
  };
};

export default useMainControllers;