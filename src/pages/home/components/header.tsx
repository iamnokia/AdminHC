import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    Paper,
    FormHelperText,
    InputAdornment,
    useMediaQuery,
    Alert,
    Collapse,
    Container,
    CircularProgress,
    IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, useTheme } from "@mui/material/styles";
import useMainControllers from "../controllers/index";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    color: "#611463",
    display: "flex",
    alignItems: "center",
    "& svg": {
        marginRight: theme.spacing(1),
        fontSize: 24,
    },
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

const WaveDivider = styled(Box)(({ theme }) => ({
    position: "relative",
    height: 60,
    marginBottom: theme.spacing(4),
    backgroundImage: "linear-gradient(to right, #611463, #f7931e)",
    "&:after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='white' fill-opacity='1' d='M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,176C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
        backgroundSize: "cover",
    },
    [theme.breakpoints.down("sm")]: {
        height: 40,
    },
}));

const SectionDivider = styled(Box)(({ theme }) => ({
    margin: theme.spacing(4, 0),
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
}));

const ServiceProviderForm = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {
        formData,
        handleChange,
        handleFileChange,
        handleSubmit,
        isFormValid,
        cities,
        categories,
        errors,
        isSubmitting,
        submitSuccess,
        setFormData
    } = useMainControllers();

    // State to store the preview URL
    const [imagePreview, setImagePreview] = useState(null);

    // Enhanced file change handler to create preview
    const handleEnhancedFileChange = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            // Create a preview URL for the image
            const previewUrl = URL.createObjectURL(files[0]);
            setImagePreview(previewUrl);
            
            // Call the original handler
            handleFileChange(e);
        }
    };

    // Delete image handler
    const handleDeleteImage = () => {
        // Revoke the object URL to avoid memory leaks
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        
        // Clear the preview and form data
        setImagePreview(null);
        setFormData({
            ...formData,
            avatar: null
        });
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ pt: 2, px: 3, ml: { xs: 0, sm: 30 } }}>
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    gutterBottom
                    sx={{
                        color: "#611463",
                        fontWeight: 700,
                        textAlign: { xs: "center", sm: "left" }
                    }}
                >
                    ເພີ່ມຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ
                </Typography>

                <WaveDivider />

                <Collapse in={submitSuccess}>
                    <Alert 
                        severity="success" 
                        sx={{ mb: 3 }}
                    >
                        ເພີ່ມຂໍ້ມູນສຳເລັດ!
                    </Alert>
                </Collapse>

                {errors.general && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 3 }}
                    >
                        {errors.general}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <StyledPaper elevation={3}>
                        <SectionTitle variant="h6">
                            <PersonAddIcon /> ຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ
                        </SectionTitle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ຊື່ຜູ້ໃຫ້ບໍລິການ"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="ໂຮມແຄຣ໌"
                                    error={!!errors.first_name}
                                    helperText={errors.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ນາມສະກຸນ"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="ດູແລບ້ານ"
                                    error={!!errors.last_name}
                                    helperText={errors.last_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ທີ່ຢູ່ອີເມລ"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="homecare@email.com"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ເບີໂທລະສັບ"
                                    name="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="020 12345678"
                                    error={!!errors.tel}
                                    helperText={errors.tel}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ລະຫັດຜ່ານ"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    helperText={errors.password || "ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 8 ໂຕລວມທັງໂຕເລກ ແລະ ໂຕໜັງສື"}
                                    error={!!errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required error={!!errors.gender}>
                                    <InputLabel>ເພດ</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        label="Gender"
                                    >
                                        <MenuItem value="male">ຊາຍ</MenuItem>
                                        <MenuItem value="female">ຍິງ</MenuItem>
                                        <MenuItem value="other">ອື່ນໆ</MenuItem>
                                    </Select>
                                    {errors.gender && (
                                        <FormHelperText>{errors.gender}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ທີ່ຢູ່"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="ຫາຍໂສກ"
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>

                    <SectionDivider />

                    {/* Service Information */}
                    <StyledPaper elevation={3}>
                        <SectionTitle variant="h6">
                            <DriveFileRenameOutlineIcon /> ຂໍ້ມູນການບໍລິການ
                        </SectionTitle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required error={!!errors.cat_id}>
                                    <InputLabel>ເລືອກປະເພດການບໍລິການ</InputLabel>
                                    <Select
                                        name="cat_id"
                                        value={formData.cat_id}
                                        onChange={handleChange}
                                        label="Service Category"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.cat_id && (
                                        <FormHelperText>{errors.cat_id}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required error={!!errors.city}>
                                    <InputLabel>ເມືອງ</InputLabel>
                                    <Select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        label="ເມືອງ"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <LocationOnIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        {cities.map((city) => (
                                            <MenuItem key={city} value={city}>
                                                {city}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.city && (
                                        <FormHelperText>{errors.city}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ລາຄາ"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="100000"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    helperText={errors.price || "ກະລຸນາໃສ່ລາຄາທີ່ຖືກຕ້ອງ ແລະ ເໝາະສົມ"}
                                    error={!!errors.price}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>

                    <SectionDivider />

                    {/* Additional Information */}
                    <StyledPaper elevation={3}>
                        <SectionTitle variant="h6">
                            <DriveFileRenameOutlineIcon /> ຂໍ້ມູນເພີ່ມເຕີມ
                        </SectionTitle>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ກະລຸນາຂຽນແນະນຳຕົນເອງ"
                                    name="cv"
                                    value={formData.cv}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    placeholder="ຂ້ອຍມີຄວາມສາມາດໃນການ..."
                                    error={!!errors.cv}
                                    helperText={errors.cv}
                                />
                            </Grid>
                            <Grid container justifyContent="center">
                                <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                                    <InputLabel sx={{ mb: 1 }}>ຮູບຜູ້ໃຫ້ບໍລິການ (ທາງເລືອກ)</InputLabel>
                                    
                                    {!imagePreview && (
                                        <UploadButton
                                            component="label"
                                            fullWidth
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            {formData.avatar ? formData.avatar.name : "ອັບໂຫຼດຮູບພາບ"}
                                            <VisuallyHiddenInput
                                                type="file"
                                                name="avatar"
                                                onChange={handleEnhancedFileChange}
                                                accept="image/*"
                                            />
                                        </UploadButton>
                                    )}
                                    
                                    {imagePreview && (
                                        <Box sx={{ mt: 2 }}>
                                            <ImagePreviewBox>
                                                <ImagePreview src={imagePreview} alt="Preview" />
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
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() => document.getElementById('avatar-upload').click()}
                                            >
                                                ປ່ຽນຮູບພາບ
                                            </Button>
                                            <VisuallyHiddenInput
                                                id="avatar-upload"
                                                type="file"
                                                name="avatar"
                                                onChange={handleEnhancedFileChange}
                                                accept="image/*"
                                            />
                                        </Box>
                                    )}
                                    
                                    <FormHelperText>
                                        ສາມາດຂ້າມໄດ້ຖ້າບໍ່ຕ້ອງການອັບໂຫຼດຮູບພາບໃນຕອນນີ້
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </Grid>
                    </StyledPaper>

                    {/* Submit Button */}
                    <Box sx={{ mt: 1, mb: 3, display: "flex", justifyContent: "center" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!isFormValid() || isSubmitting}
                            sx={{
                                bgcolor: "#f7931e",
                                color: "white",
                                px: 6,
                                py: 1.5,
                                "&:hover": {
                                    bgcolor: "#e07c0e"
                                }
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "ເພີ່ມຂໍ້ມູນ"
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default ServiceProviderForm;