import React, { useState, useEffect } from "react";
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
    Switch,
    FormControlLabel,
    InputAdornment,
    useMediaQuery,
    Collapse,
    Alert,
    IconButton,
    Tooltip,
    Container
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { styled, useTheme } from "@mui/material/styles";

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
        has_car: false,
        car_brand: "",
        model: "",
        license_plate: "",
        car_image: null
    });

    // Cities list
    const cities = [
        "CHANTHABULY",
        "SIKHOTTABONG",
        "XAYSETHA",
        "SISATTANAK",
        "NAXAITHONG",
        "XAYTANY",
        "HADXAIFONG"
    ];

    // Categories list
    const categories = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Moving" },
        { id: 3, name: "Repairs" },
        { id: 4, name: "Electrical" },
        { id: 5, name: "Plumbing" },
        { id: 6, name: "Pest control" },
        { id: 7, name: "Bathroom" }
    ];

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
        }
    };

    // Handle car toggle
    const handleCarToggle = (e) => {
        setFormData({ ...formData, has_car: e.target.checked });
    };

    // Watch for category change to auto-enable car for Moving
    useEffect(() => {
        if (formData.cat_id === 2) {
            setFormData(prev => ({ ...prev, has_car: true }));
        }
    }, [formData.cat_id]);

    // Check if form is valid
    const isFormValid = () => {
        const requiredFields = [
            'first_name', 'last_name', 'email', 'tel', 'password',
            'gender', 'address', 'cat_id', 'city', 'price', 'cv'
        ];
    
        const basicFieldsValid = requiredFields.every(field => !!formData[field]);
    
        // Check car details if needed
        const carFieldsValid = !(formData.cat_id === 2 || formData.has_car) ||
            (formData.car_brand && formData.model && formData.license_plate);
    
        // Check files
        const filesValid = formData.avatar;
    
        return basicFieldsValid && carFieldsValid && filesValid;
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Here you would typically send the data to your API
        alert("ເພີ່ມຂໍ້ມູນສຳເລັດ!");
    };

    return (
        <Container maxWidth="lg">
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mx: "auto", p: { xs: 1, sm: 3 } }}>
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
                                helperText="ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 8 ໂຕລວມທັງໂຕເລກ ແລະ ໂຕໜັງສື"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
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
                            <FormControl fullWidth required>
                                <InputLabel>ເລືອກປະເພດການບໍລິດານ</InputLabel>
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
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
                                helperText="ກະລຸນາໃສ່ລາຄາທີ່ຖືກຕ້ອງ ແລະ ເໝາະສົມ"
                            />
                        </Grid>
                    </Grid>

                    {/* Car Details - Auto Show when Category is Moving */}
                    {formData.cat_id === 2 && (
                        <Alert
                            severity="info"
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            ຂໍ້ມູນລົດຂອງຜູ້ໃຫ້ບໍລິການທີ່ຢູ່ການບໍລິການແກ່ເຄື່ອງ
                        </Alert>
                    )}

                    {formData.cat_id !== 2 && (
                        <Box sx={{ mt: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.has_car}
                                        onChange={handleCarToggle}
                                    />
                                }
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1 }} />
                                        ຂ້ອຍມີລົດສຳລັບການບໍລິການນີ້
                                        <Tooltip title="ໃຫ້ຂໍ້ມູນລົດຖ້າມີລົດໃນການບໍລິການ" arrow>
                                            <IconButton size="small" sx={{ ml: 0.5 }}>
                                                <HelpOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                }
                            />
                        </Box>
                    )}

                    <Collapse in={formData.has_car || formData.cat_id === 2}>
                        <Paper
                            sx={{
                                mt: 2,
                                p: 3,
                                bgcolor: "rgba(97, 20, 99, 0.03)",
                                borderLeft: '4px solid #611463',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "#611463" }}>
                                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                ຂໍ້ມູນລົດຂອງຜູ້ໃຫ້ບໍລິການ
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="ຍີ່ຫໍ້ລົດ"
                                        name="car_brand"
                                        value={formData.car_brand}
                                        onChange={handleChange}
                                        variant="outlined"
                                        placeholder="Toyota"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="ປະເພດລົດ"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        variant="outlined"
                                        placeholder="Revo"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="ປ້າຍທະບຽນ"
                                        name="license_plate"
                                        value={formData.license_plate}
                                        onChange={handleChange}
                                        variant="outlined"
                                        placeholder="ຮຄ 1111"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>ຮູບລົດ</InputLabel>
                                    <UploadButton
                                        component="label"
                                        fullWidth
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        {formData.car_image ? formData.car_image.name : "ອັບໂຫຼດຮູບລົດ"}
                                        <VisuallyHiddenInput
                                            type="file"
                                            name="car_image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </UploadButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Collapse>
                </StyledPaper>

                <SectionDivider />

                {/* Documents & Profile */}
                <StyledPaper elevation={3}>
                    <SectionTitle variant="h6">
                        <CloudUploadIcon /> ຂໍ້ມູນເພີ່ມເຕີມ
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
                            />
                        </Grid>
                        <Grid container justifyContent="center">
                            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                                <InputLabel sx={{ mb: 1 }}>ຮູບຜູ້ໃຫ້ບໍລິການ</InputLabel>
                                <UploadButton
                                    component="label"
                                    fullWidth
                                    startIcon={<CloudUploadIcon />}
                                    required
                                >
                                    {formData.avatar ? formData.avatar.name : "ອັບໂຫຼດຮູບພາບ"}
                                    <VisuallyHiddenInput
                                        type="file"
                                        name="avatar"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                    />
                                </UploadButton>
                                <FormHelperText>ຕ້ອງເປັນນາມສະກຸນ JPG, PNG ເທົ່ານັ້ນ</FormHelperText>
                            </Grid>
                        </Grid>
                    </Grid>
                </StyledPaper>

                {/* Submit Button */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isFormValid()}
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
                        ເພີ່ມຂໍ້ມູນ
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ServiceProviderForm;