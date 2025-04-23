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
    tel: "",
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
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
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.tel && !/^\d{10,12}$/.test(formData.tel.replace(/\s/g, ""))) {
      newErrors.tel = "Please enter a valid phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
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

    return requiredFields.every((field) => !!formData[field]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show validation error alert
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
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
      
      // Prepare data based on whether we have an image or not
      if (formData.avatar) {
        // If we have an image, use FormData for multipart/form-data submission
        const submitData = new FormData();
        
        // Add all text fields
        Object.keys(formData).forEach(key => {
          if (key !== 'avatar') {
            submitData.append(key, formData[key]);
          }
        });
        
        // Add file
        submitData.append('avatar', formData.avatar);
        
        // Add additional fields
        submitData.append('status', Status.ACTIVE);
        submitData.append('cat_name', categoryName);
        
        // Send with multipart/form-data
        const response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log("Employee created with image:", response.data);
      } else {
        // If no image, use regular JSON submission
        const submitData = {
          ...formData,
          status: Status.ACTIVE,
          cat_name: categoryName,
          // Remove the avatar field if it's null to avoid sending null
          avatar: undefined
        };
        
        // Remove the avatar field completely if it's null to avoid sending null
        delete submitData.avatar;
        
        // Send as JSON
        const response = await axios.post(
          "https://homecare-pro.onrender.com/employees/create_employees",
          submitData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Employee created without image:", response.data);
      }
      
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
        tel: "",
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
      
      // Determine error message
      let errorMessage = "ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.";
      
      // Handle API error responses
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
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
    cities,
    categories,
    errors,
    isSubmitting,
    submitSuccess
  };
};

export default useMainControllers;