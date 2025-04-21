import React from "react";
import {
  Box, Typography, TextField, Button, Grid,
  Paper, FormHelperText, Container, InputLabel
} from "@mui/material";
import { DirectionsCar, CloudUpload } from "@mui/icons-material";
import { useCarController } from "../controllers/index";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
}));

const UploadButton = styled(Button)({
  padding: "12px 24px",
  marginTop: 8,
  backgroundColor: "rgba(97, 20, 99, 0.04)",
  color: "#611463",
  border: "1px dashed rgba(97, 20, 99, 0.3)",
  "&:hover": {
    backgroundColor: "rgba(97, 20, 99, 0.08)",
    borderColor: "#611463"
  }
});

const CarForm = ({ employeeId }: { employeeId: number }) => {
  const {
    formData,
    errors,
    handleChange,
    handleFileChange,
    handleSubmit
  } = useCarController(employeeId);

  return (
    <Container maxWidth="lg">
      <Box py={2} px={3} ml={{ xs: 0, sm: 30 }}>
        <Typography variant="h5" fontWeight={700} color="#611463" mb={3}>
          <DirectionsCar sx={{ mr: 1 }} /> ເພີ່ມຂໍ້ມູນລົດ
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
                  error={!!errors.car_brand}
                  helperText={errors.car_brand}
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
                  error={!!errors.model}
                  helperText={errors.model}
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
                  error={!!errors.license_plate}
                  helperText={errors.license_plate}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>ຮູບລົດ *</InputLabel>
                <UploadButton
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  {formData.car_image?.name || "ເລືອກຮູບ"}
                  <input
                    type="file"
                    name="car_image"
                    onChange={handleFileChange}
                    hidden
                    accept="image/*"
                    required
                  />
                </UploadButton>
                <FormHelperText error={!!errors.car_image}>
                  {errors.car_image}
                </FormHelperText>
              </Grid>
            </Grid>
          </StyledPaper>

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
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