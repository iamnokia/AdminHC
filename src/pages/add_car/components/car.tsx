import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Container,
  FormControlLabel,
  Switch,
  InputLabel,
  CircularProgress,
  IconButton
} from "@mui/material";
import { DirectionsCar, CloudUpload } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  backgroundColor: "rgba(97, 20, 99, 0.04)",
  color: "#611463",
  borderStyle: "dashed",
  borderWidth: 1,
  borderColor: "rgba(97, 20, 99, 0.3)",
  "&:hover": {
    backgroundColor: "rgba(97, 20, 99, 0.08)",
    borderColor: "#611463",
  },
}));

const ImagePreviewBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  position: "relative",
  width: "100%",
  maxWidth: 200,
  height: 200,
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  margin: "0 auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.04)",
}));

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "cover",
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
}));

const CarForm = () => {
  const { employeeId } = useParams();
  const empId = employeeId ? parseInt(employeeId) : 0;
  
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    emp_id: empId,
    car_brand: "",
    model: "",
    license_plate: "",
    status: "ACTIVE",
    car_image: null
  });
  
  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle switch change
  const handleStatusChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      status: e.target.checked ? "ACTIVE" : "INACTIVE"
    }));
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        car_image: file
      }));
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Delete image handler
  const handleDeleteImage = () => {
    // Revoke the object URL to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Clear the preview and image state
    setImagePreview(null);
    setFormData(prevData => ({
      ...prevData,
      car_image: null
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.car_brand.trim() || !formData.model.trim() || !formData.license_plate.trim()) {
      Swal.fire({
        title: "ກະລຸນາກວດສອບຂໍ້ມູນ",
        text: "ກະລຸນາປ້ອນຂໍ້ມູນລົດໃຫ້ຄົບຖ້ວນ",
        icon: "warning",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Show loading alert
      Swal.fire({
        title: "ກຳລັງບັນທຶກຂໍ້ມູນ",
        text: "ກະລຸນາລໍຖ້າ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Create FormData object for multipart/form-data submission
      const formDataToSend = new FormData();
      formDataToSend.append("emp_id", String(formData.emp_id));
      formDataToSend.append("car_brand", formData.car_brand);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("license_plate", formData.license_plate);
      formDataToSend.append("status", formData.status);
      
      // Only append car_image if it exists
      if (formData.car_image) {
        formDataToSend.append("car_image", formData.car_image);
        console.log("Image included in submission:", formData.car_image.name);
      } else {
        console.log("No image included in submission");
      }
      
      console.log("Submitting car data for employee ID:", formData.emp_id);
      
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
      
      console.log("API response:", response.data);
      
      // Show success message
      Swal.fire({
        title: "ສຳເລັດ!",
        text: "ບັນທຶກຂໍ້ມູນລົດສຳເລັດ",
        icon: "success",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });
      
      // Reset form
      setFormData({
        emp_id: empId,
        car_brand: "",
        model: "",
        license_plate: "",
        status: "ACTIVE",
        car_image: null
      });
      
      // Clear image preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error submitting car data:", error);
      
      let errorMessage = "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນລົດ";
      
      // Try to extract detailed error information
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Show error message
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#611463"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={2} px={3} ml={{ xs: 0, sm: 30 }}>
        <Typography variant="h5" fontWeight={700} color="#611463" mb={3}>
          <DirectionsCar sx={{ mr: 1 }} /> ເພີ່ມຂໍ້ມູນລົດ
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          ລະຫັດຜູ້ໃຫ້ບໍລິການ: <strong>{empId}</strong>
        </Typography>

        <form onSubmit={handleSubmit}>
          <StyledPaper elevation={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ຍີ່ຫໍ້ລົດ"
                  name="car_brand"
                  value={formData.car_brand}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ຮຸ່ນລົດ"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ປ້າຍທະບຽນ"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === "ACTIVE"}
                      onChange={handleStatusChange}
                      color="success"
                    />
                  }
                  label="ພ້ອມໃຊ້ງານ"
                />
              </Grid>
              
              {/* Car Image Upload Section */}
              <Grid item xs={12}>
                <Box textAlign="center" mt={2}>
                  <InputLabel sx={{ mb: 1 }}>ຮູບພາບລົດ</InputLabel>
                  
                  {!imagePreview && (
                    <UploadButton
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                    >
                      {formData.car_image ? formData.car_image.name : "ອັບໂຫຼດຮູບພາບລົດ"}
                      <VisuallyHiddenInput
                        type="file"
                        name="car_image"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </UploadButton>
                  )}
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <ImagePreviewBox>
                        <ImagePreview src={imagePreview} alt="Car Preview" />
                        <DeleteButton 
                          size="small" 
                          onClick={handleDeleteImage}
                          aria-label="Delete image"
                        >
                          <DeleteIcon sx={{ color: '#f44336' }} />
                        </DeleteButton>
                      </ImagePreviewBox>
                      
                      <Button
                        sx={{ mt: 1 }}
                        startIcon={<CloudUpload />}
                        onClick={() => document.getElementById('car-image-upload').click()}
                      >
                        ປ່ຽນຮູບພາບ
                      </Button>
                      <VisuallyHiddenInput
                        id="car-image-upload"
                        type="file"
                        name="car_image"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: "#f7931e",
                color: "white",
                px: 6,
                "&:hover": { bgcolor: "#e07c0e" }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ເພີ່ມຂໍ້ມູນລົດ"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CarForm;