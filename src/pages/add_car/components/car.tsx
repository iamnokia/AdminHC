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
} from "@mui/material";
import { DirectionsCar } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
}));

const CarForm = () => {
  const { employeeId } = useParams();
  const empId = employeeId ? parseInt(employeeId) : 0;
  
  const [loading, setLoading] = useState(false);
  
  // Form state - minimal required fields only
  const [carBrand, setCarBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  
  // Handle submission with minimal validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only validate that we have the basic required data
    if (!carBrand.trim() || !model.trim() || !licensePlate.trim()) {
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
      // Prepare minimal data
      const carData = {
        emp_id: empId,
        car_brand: carBrand,
        model: model,
        license_plate: licensePlate,
        status: status
      };
      
      console.log("Submitting car data:", carData);
      
      // Make the API request directly as JSON
      const response = await axios.post(
        "https://homecare-pro.onrender.com/emp_car/create_emp_car",
        carData,
        {
          headers: {
            "Content-Type": "application/json"
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
      setCarBrand("");
      setModel("");
      setLicensePlate("");
    } catch (error) {
      console.error("Error submitting car data:", error);
      
      // Show error message
      Swal.fire({
        title: "ຂໍ້ຜິດພາດ!",
        text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນລົດ",
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
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ຮຸ່ນລົດ"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ປ້າຍທະບຽນ"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status === "ACTIVE"}
                      onChange={(e) => setStatus(e.target.checked ? "ACTIVE" : "INACTIVE")}
                      color="success"
                    />
                  }
                  label="ພ້ອມໃຊ້ງານ"
                />
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
              ເພີ່ມຂໍ້ມູນລົດ
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CarForm;