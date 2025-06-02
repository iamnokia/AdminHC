import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  MenuItem,
  Alert,
  Container,
  Chip,
  Tooltip,
} from "@mui/material";
import { 
  PersonSearch, 
  Warning, 
  Error, 
  CheckCircle,
  DirectionsCar,
  Block 
} from "@mui/icons-material";
import axios from "axios";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { CAR_PATH } from "../../../routes/path";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
}));

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  cat_id: number;
  cat_name: string;
}

interface EmployeeCar {
  id: number;
  emp_id: number;
  car_brand: string;
  model: string;
  license_plate: string;
  status: string;
}

interface EmployeeWithCarStatus extends Employee {
  hasCarData: boolean;
  canRegisterCar: boolean;
  warningType: 'none' | 'red' | 'yellow';
  warningMessage: string;
}

const EmployeeSelector: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeCars, setEmployeeCars] = useState<EmployeeCar[]>([]);
  const [processedEmployees, setProcessedEmployees] = useState<EmployeeWithCarStatus[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithCarStatus[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = processedEmployees.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(lowercaseSearch) ||
          emp.last_name.toLowerCase().includes(lowercaseSearch) ||
          emp.id.toString().includes(lowercaseSearch)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(processedEmployees);
    }
  }, [searchTerm, processedEmployees]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both employees and employee cars data
      const [employeesResponse, carsResponse] = await Promise.all([
        axios.get("https://homecare-pro.onrender.com/employees/read_employees", {
          headers: { "Content-Type": "application/json" }
        }),
        axios.get("https://homecare-pro.onrender.com/emp_car/read_emp_car", {
          headers: { "Content-Type": "application/json" }
        })
      ]);

      setEmployees(employeesResponse.data);
      setEmployeeCars(carsResponse.data);
      
      // Process employees with car status
      const processed = processEmployeeData(employeesResponse.data, carsResponse.data);
      setProcessedEmployees(processed);
      setFilteredEmployees(processed);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້");
    } finally {
      setLoading(false);
    }
  };

  const processEmployeeData = (employees: Employee[], cars: EmployeeCar[]): EmployeeWithCarStatus[] => {
    return employees.map(employee => {
      // Check if employee has existing car data
      const hasCarData = cars.some(car => car.emp_id === employee.id);
      
      // Determine if employee can register car and warning type
      let canRegisterCar = false;
      let warningType: 'none' | 'red' | 'yellow' = 'none';
      let warningMessage = '';

      if (employee.cat_id !== 5) {
        // Not in Moving category - red warning
        warningType = 'red';
        warningMessage = 'ບໍ່ແມ່ນພະນັກງານຂົນສົ່ງ - ບໍ່ສາມາດລົງທະບຽນລົດໄດ້';
        canRegisterCar = false;
      } else if (hasCarData) {
        // In Moving category but already has car - yellow warning
        warningType = 'yellow';
        warningMessage = 'ມີຂໍ້ມູນລົດແລ້ວ - ບໍ່ສາມາດເພີ່ມລົດອີກໄດ້';
        canRegisterCar = false;
      } else {
        // In Moving category and no car data - can register
        warningType = 'none';
        warningMessage = 'ສາມາດລົງທະບຽນລົດໄດ້';
        canRegisterCar = true;
      }

      return {
        ...employee,
        hasCarData,
        canRegisterCar,
        warningType,
        warningMessage
      };
    });
  };

  const handleEmployeeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const employeeId = Number(event.target.value);
    const employee = processedEmployees.find(emp => emp.id === employeeId);
    
    // Only allow selection if employee can register car
    if (employee?.canRegisterCar) {
      setSelectedEmployee(employeeId);
    } else {
      setSelectedEmployee(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleContinue = () => {
    if (selectedEmployee) {
      const employee = processedEmployees.find(emp => emp.id === selectedEmployee);
      if (employee?.canRegisterCar) {
        navigate(`${CAR_PATH}/${selectedEmployee}`);
      }
    }
  };

  const getStatusIcon = (employee: EmployeeWithCarStatus) => {
    switch (employee.warningType) {
      case 'red':
        return <Error sx={{ color: '#f44336', fontSize: 20 }} />;
      case 'yellow':
        return <Warning sx={{ color: '#ff9800', fontSize: 20 }} />;
      default:
        return <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />;
    }
  };

  const getStatusChip = (employee: EmployeeWithCarStatus) => {
    switch (employee.warningType) {
      case 'red':
        return (
          <Chip
            size="small"
            icon={<Block />}
            label="ບໍ່ສາມາດລົງທະບຽນ"
            sx={{ 
              bgcolor: '#ffebee', 
              color: '#c62828',
              border: '1px solid #f44336'
            }}
          />
        );
      case 'yellow':
        return (
          <Chip
            size="small"
            icon={<DirectionsCar />}
            label="ມີລົດແລ້ວ"
            sx={{ 
              bgcolor: '#fff8e1', 
              color: '#f57c00',
              border: '1px solid #ff9800'
            }}
          />
        );
      default:
        return (
          <Chip
            size="small"
            icon={<CheckCircle />}
            label="ພ້ອມລົງທະບຽນ"
            sx={{ 
              bgcolor: '#e8f5e8', 
              color: '#2e7d32',
              border: '1px solid #4caf50'
            }}
          />
        );
    }
  };

  const selectedEmployeeData = processedEmployees.find(emp => emp.id === selectedEmployee);

  return (
    <Container maxWidth="md">
      <Box sx={{ pt: 2, px: 3, ml: { xs: 0, sm: 30 } }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          color="#611463" 
          mb={3}
          textAlign="center"
        >
          ເລືອກຜູ້ໃຫ້ບໍລິການເພື່ອເພີ່ມຂໍ້ມູນລົດ
        </Typography>
        
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" mb={2}>
                ຄົ້ນຫາຜູ້ໃຫ້ບໍລິການ
              </Typography>
              <TextField
                fullWidth
                placeholder="ພິມຊື່ ຫຼື ລະຫັດພະນັກງານ"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <PersonSearch color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1" mb={2}>
                ເລືອກພະນັກງານ
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress sx={{ color: "#611463" }} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : filteredEmployees.length === 0 ? (
                <Alert severity="info">ບໍ່ພົບພະນັກງານ</Alert>
              ) : (
                <TextField
                  select
                  fullWidth
                  value={selectedEmployee || ""}
                  onChange={handleEmployeeSelect}
                  label="ພະນັກງານ"
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                        },
                      },
                    },
                  }}
                >
                  {filteredEmployees.map((employee) => (
                    <MenuItem
                      key={employee.id}
                      value={employee.id}
                      disabled={!employee.canRegisterCar}
                      sx={{
                        borderLeft: "4px solid",
                        borderColor: 
                          employee.warningType === 'red' ? '#f44336' :
                          employee.warningType === 'yellow' ? '#ff9800' : '#4caf50',
                        mb: 0.5,
                        bgcolor: 
                          employee.warningType === 'red' ? 'rgba(244, 67, 54, 0.05)' :
                          employee.warningType === 'yellow' ? 'rgba(255, 152, 0, 0.05)' : 
                          'rgba(76, 175, 80, 0.05)',
                        opacity: employee.canRegisterCar ? 1 : 0.6,
                        '&:hover': {
                          bgcolor: employee.canRegisterCar ? 
                            (employee.warningType === 'red' ? 'rgba(244, 67, 54, 0.08)' :
                             employee.warningType === 'yellow' ? 'rgba(255, 152, 0, 0.08)' : 
                             'rgba(76, 175, 80, 0.08)') : 
                            'transparent'
                        }
                      }}
                    >
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getStatusIcon(employee)}
                            <Box>
                              <Typography fontWeight="medium">
                                {employee.first_name} {employee.last_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {employee.id}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            color={employee.cat_id === 5 ? "#f7931e" : "#611463"}
                            fontWeight="medium"
                          >
                            {employee.cat_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Tooltip title={employee.warningMessage} arrow>
                            {getStatusChip(employee)}
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>

            {/* Show warning message for selected employee */}
            {selectedEmployeeData && (
              <Grid item xs={12}>
                <Alert 
                  severity={
                    selectedEmployeeData.warningType === 'red' ? 'error' :
                    selectedEmployeeData.warningType === 'yellow' ? 'warning' : 'success'
                  }
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    <strong>{selectedEmployeeData.first_name} {selectedEmployeeData.last_name}</strong>: {selectedEmployeeData.warningMessage}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </StyledPaper>
        
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedEmployee || !selectedEmployeeData?.canRegisterCar}
            onClick={handleContinue}
            sx={{
              bgcolor: "#f7931e",
              color: "white",
              px: 6,
              "&:hover": { bgcolor: "#e07c0e" },
              "&.Mui-disabled": {
                bgcolor: "rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            ດຳເນີນການຕໍ່
          </Button>
        </Box>

        {/* Suggestion Box */}
        <Box sx={{ mt: 4, width: '100%', maxWidth: '100%' }}>
          <StyledPaper 
            elevation={2} 
            sx={{ 
              bgcolor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              p: 3
            }}
          >
            <Typography 
              variant="body1" 
              fontWeight={600} 
              color="#611463" 
              mb={2}
              display="flex"
              alignItems="center"
              gap={0.5}
              fontSize="0.95rem"
            >
              ຄຳແນະນຳການໃຊ້ງານ
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6} lg={4}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5, 
                    bgcolor: 'rgba(244, 67, 54, 0.05)',
                    border: '1px solid #f44336',
                    borderLeft: '4px solid #f44336',
                    height: '100%'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <Error sx={{ color: '#f44336', fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={600} color="#c62828" fontSize="0.8rem">
                      ສີແດງ - ບໍ່ສາມາດລົງທະບຽນ
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.75rem" lineHeight={1.3}>
                    ພະນັກງານທີ່ບໍ່ແມ່ນໃນໝວດໝູ່ແກ່ເຄື່ອງ ບໍ່ສາມາດລົງທະບຽນລົດໄດ້
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5, 
                    bgcolor: 'rgba(255, 152, 0, 0.05)',
                    border: '1px solid #ff9800',
                    borderLeft: '4px solid #ff9800',
                    height: '100%'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <Warning sx={{ color: '#ff9800', fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={600} color="#f57c00" fontSize="0.8rem">
                      ສີເຫຼືອງ - ມີລົດແລ້ວ
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.75rem" lineHeight={1.3}>
                    ພະນັກງານແກ່ເຄື່ອງທີ່ມີຂໍ້ມູນລົດແລ້ວ ບໍ່ສາມາດເພີ່ມລົດອີກໄດ້
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} lg={4}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5, 
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    border: '1px solid #4caf50',
                    borderLeft: '4px solid #4caf50',
                    height: '100%'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <CheckCircle sx={{ color: '#4caf50', fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={600} color="#2e7d32" fontSize="0.8rem">
                      ສີຂຽວ - ສາມາດລົງທະບຽນລົດໄດ້
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.75rem" lineHeight={1.3}>
                    ພະນັກງານແກ່ເຄື່ອງທີ່ຍັງບໍ່ມີຂໍ້ມູນລົດ ສາມາດລົງທະບຽນລົດໄດ້
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                borderRadius: 1.5, 
                bgcolor: 'rgba(97, 20, 99, 0.05)',
                border: '1px dashed #611463'
              }}
            >
              <Typography variant="caption" color="#611463" textAlign="center" fontSize="0.8rem" lineHeight={1.4}>
                <strong>ໝາຍເຫດ:</strong> ມີພຽງພະນັກງານໃນໝວດ "ແກ່ເຄື່ອງ" ເທົ່ານັ້ນທີ່ສາມາດລົງທະບຽນຂໍ້ມູນລົດໄດ້ 
                ແລະ ແຕ່ລະຄົນສາມາດລົງທະບຽນໄດ້ພຽງ 1 ຄັນເທົ່ານັ້ນ
              </Typography>
            </Box>
          </StyledPaper>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeSelector;