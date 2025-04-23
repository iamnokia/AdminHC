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
} from "@mui/material";
import { PersonSearch } from "@mui/icons-material";
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

const EmployeeSelector: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(lowercaseSearch) ||
          emp.last_name.toLowerCase().includes(lowercaseSearch) ||
          emp.id.toString().includes(lowercaseSearch)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://homecare-pro.onrender.com/employees/read_employees",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານ");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmployee(Number(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleContinue = () => {
    if (selectedEmployee) {
      navigate(`${CAR_PATH}/${selectedEmployee}`);
    }
  };

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
                          maxHeight: 300,
                        },
                      },
                    },
                  }}
                >
                   {filteredEmployees.map((employee) => (
                    <MenuItem
                      key={employee.id}
                      value={employee.id}
                      sx={{
                        borderLeft: "3px solid",
                        borderColor: employee.cat_id === 5 ? "#f7931e" : "#611463",
                        mb: 0.5,
                        bgcolor: employee.cat_id === 5 ? "rgba(247, 147, 30, 0.05)" : "transparent",
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Typography fontWeight="medium">
                            {employee.first_name} {employee.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {employee.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body2"
                            color={employee.cat_id === 5 ? "#f7931e" : "#611463"}
                            fontWeight="medium"
                          >
                            {employee.cat_name}
                          </Typography>
                          {employee.cat_id === 5 ? (
                            <Typography variant="caption" color="success.main">
                              ສາມາດລົງທະບຽນລົດໄດ້
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="error">
                              ບໍ່ສາມາດລົງທະບຽນລົດໄດ້
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>
          </Grid>
        </StyledPaper>
        
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedEmployee}
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
      </Box>
    </Container>
  );
};

export default EmployeeSelector;