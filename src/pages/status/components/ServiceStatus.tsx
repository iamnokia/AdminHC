import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  IconButton,
  Fade,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

// Brand colors
const PRIMARY_COLOR = '#611463'; // Purple
const SECONDARY_COLOR = '#f7931e'; // Orange

// Types
interface ServiceRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceName: string;
  currentStepId: number | null;
  completedSteps: number[];
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  createdAt: string;
}

interface StaffMember {
  id: string;
  name: string;
  isAvailable: boolean;
}

const ServiceStatusAdmin: React.FC = () => {
  // State
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Service steps (same as in the user view)
  const steps = [
    {
      id: 1,
      title: 'ພະນັກງານຮອດແລ້ວ',
      description: 'ພະນັກງານຮອດເຮືອນຂອງທ່ານແລ້ວ nah jah',
      icon: <AccessTimeIcon sx={{ fontSize: 24 }} />,
      color: '#00BFA6',
    },
    {
      id: 2,
      title: 'ກຳລັງດຳເນີນການ',
      description: 'ພະນັກງານກຳລັງດັງເນີນການ, ເມື່ອວຽກແລ້ວໆກະລຸນາກົດສຳເລັດດ້ວຍ.',
      icon: <TaskAltIcon sx={{ fontSize: 24 }} />,
      color: '#00BFA6',
    },
    {
      id: 3,
      title: 'ວຽກສຳເລັດແລ້ວ',
      description: 'ວຽກສຳເລັດແລ້ວຂໍຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງເຮົາ',
      icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
      color: '#00BFA6',
    },
  ];

  // Load mock data on component mount
  useEffect(() => {
    // Mock service requests data
    const mockRequests: ServiceRequest[] = [
      {
        id: 'SR-1001',
        customerName: 'John Doe',
        customerPhone: '+856 20 1234 5678',
        customerAddress: '123 Main St, Vientiane',
        serviceName: 'ທຳຄວາມສະອາດ',
        currentStepId: 2,
        completedSteps: [1],
        assignedStaffId: 'STAFF-001',
        assignedStaffName: 'Somchai L.',
        createdAt: '2025-04-10T09:30:00Z'
      },
      {
        id: 'SR-1002',
        customerName: 'Jane Smith',
        customerPhone: '+856 20 9876 5432',
        customerAddress: '456 Oak Ave, Vientiane',
        serviceName: 'ກຳຈັດປວກ',
        currentStepId: 1,
        completedSteps: [],
        assignedStaffId: 'STAFF-002',
        assignedStaffName: 'Bounmy K.',
        createdAt: '2025-04-10T10:15:00Z'
      },
      {
        id: 'SR-1003',
        customerName: 'Sarah Johnson',
        customerPhone: '+856 20 5555 6666',
        customerAddress: '789 Pine Rd, Vientiane',
        serviceName: 'ສ້ອມແປງແອ',
        currentStepId: null,
        completedSteps: [],
        assignedStaffId: null,
        assignedStaffName: null,
        createdAt: '2025-04-10T11:00:00Z'
      }
    ];

    // Mock staff data
    const mockStaff: StaffMember[] = [
      {
        id: 'STAFF-001',
        name: 'Somchai L.',
        isAvailable: false
      },
      {
        id: 'STAFF-002',
        name: 'Bounmy K.',
        isAvailable: false
      },
      {
        id: 'STAFF-003',
        name: 'Vilayvong S.',
        isAvailable: true
      },
      {
        id: 'STAFF-004',
        name: 'Khamla P.',
        isAvailable: true
      }
    ];

    setActiveRequests(mockRequests);
    setStaff(mockStaff);

    // Trigger animations after component mounts
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  // Get status for a step
  const getStepStatus = (request: ServiceRequest, stepId: number) => {
    if (request.completedSteps.includes(stepId)) {
      return 'completed';
    }
    if (request.currentStepId === stepId) {
      return 'current';
    }
    return 'pending';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle opening edit dialog
  const handleEditClick = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    if (!selectedRequest) return;
    
    // Update the request in the activeRequests array
    const updatedRequests = activeRequests.map(req =>
      req.id === selectedRequest.id ? selectedRequest : req
    );
    
    setActiveRequests(updatedRequests);
    setIsEditDialogOpen(false);
  };

  // Handle staff assignment
  const handleStaffAssignment = (event: SelectChangeEvent) => {
    if (!selectedRequest) return;
    
    const staffId = event.target.value;
    const staffMember = staff.find(s => s.id === staffId);
    
    setSelectedRequest({
      ...selectedRequest,
      assignedStaffId: staffId,
      assignedStaffName: staffMember ? staffMember.name : null
    });
  };

  // Handle status change
  const handleStatusChange = (event: SelectChangeEvent) => {
    if (!selectedRequest) return;
    
    const statusValue = Number(event.target.value);
    let updatedSteps: number[] = [];
    let currentStep: number | null = null;
    
    if (statusValue === 0) {
      // Not started
      currentStep = null;
      updatedSteps = [];
    } else if (statusValue === 1) {
      // Step 1: Staff arrived
      currentStep = 1;
      updatedSteps = [];
    } else if (statusValue === 2) {
      // Step 2: In progress
      currentStep = 2;
      updatedSteps = [1];
    } else if (statusValue === 3) {
      // Step 3: Completed
      currentStep = 3;
      updatedSteps = [1, 2];
    }
    
    setSelectedRequest({
      ...selectedRequest,
      currentStepId: currentStep,
      completedSteps: updatedSteps
    });
  };

  // Get current status text
  const getCurrentStatusText = (request: ServiceRequest) => {
    if (request.currentStepId === null) {
      return "ພະນັກງານຍັງບໍ່ຮອດ";
    } else if (request.currentStepId === 1) {
      return "ພະນັກງານຮອດແລ້ວ";
    } else if (request.currentStepId === 2) {
      return "ກຳລັງດຳເນີການ";
    } else if (request.currentStepId === 3) {
      return "ວຽກສຳເລັດແລ້ວ";
    }
    return "Unknown";
  };

  // Get current status numeric value for select
  const getCurrentStatusValue = (request: ServiceRequest) => {
    if (request.currentStepId === null) return 0;
    return request.currentStepId;
  };

  return (
    <Box sx={{ pt: 2, px: 3, ml: { xs: 0, sm: 30 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in={animate} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              background: PRIMARY_COLOR,
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HomeIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  ຈັດການສະຖານະການບໍລິການ
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Staff Overview */}
        <Fade in={animate} timeout={900}>
          <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              ຜູ້ໃຫ້ບໍລິການຕອນນີ້
            </Typography>
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              {staff.map((staffMember) => (
                <Grid item xs={6} sm={3} md={2} key={staffMember.id}>
                  <Card 
                    sx={{ 
                      bgcolor: staffMember.isAvailable ? '#e8f5e9' : '#ffebee',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: PRIMARY_COLOR, width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {staffMember.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            display="block"
                            sx={{ 
                              color: staffMember.isAvailable ? '#2e7d32' : '#d32f2f'
                            }}
                          >
                            {staffMember.isAvailable ? 'Available' : 'On Task'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>

        {/* Active Service Requests */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ ml: 1, fontWeight: 'bold' }}>
            ສະຖານະການບໍລິການຕອນນີ້
          </Typography>
          
          {activeRequests.map((request, index) => (
            <Fade
              key={request.id}
              in={animate}
              timeout={1000 + (index * 200)}
              style={{ transformOrigin: 'center top' }}
            >
                              <Paper
                elevation={3}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: request.currentStepId === 2 ? `1px solid ${SECONDARY_COLOR}` : 'none'
                }}
              >
                {/* Request Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: PRIMARY_COLOR,
                  color: 'white',
                  py: 1.5,
                  px: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">
                    {request.id}
                  </Typography>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Typography>
                      {request.serviceName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Created: {formatDate(request.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Customer Info */}
                <Box sx={{ p: 1.5, bgcolor: '#f9f9f9' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" />
                        <Typography fontWeight="medium">
                          {request.customerName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" />
                        <Typography>
                          {request.customerPhone}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Typography>
                          {request.customerAddress}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Service Status Steps */}
                <Box sx={{ p: 1.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 1
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ສະຖານະ: {getCurrentStatusText(request)}
                    </Typography>
                    <Tooltip title="Edit Service Status">
                      <IconButton 
                        onClick={() => handleEditClick(request)}
                        sx={{ 
                          border: '1px solid',
                          borderColor: SECONDARY_COLOR,
                          color: SECONDARY_COLOR,
                          '&:hover': {
                            bgcolor: `${SECONDARY_COLOR}10`
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Steps Timeline */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between',
                    position: 'relative',
                    px: 2,
                    py: 0.5
                  }}>
                    {/* Connecting Line */}
                    <Box sx={{
                      position: 'absolute',
                      top: '24px',
                      left: '40px',
                      right: '40px',
                      height: '4px',
                      bgcolor: '#e0e0e0',
                      zIndex: 0
                    }} />
                    
                    {/* Progress Line */}
                    <Box sx={{
                      position: 'absolute',
                      top: '24px',
                      left: '40px',
                      width: request.currentStepId === 3 ? 'calc(100% - 80px)' : 
                             request.currentStepId === 2 ? 'calc(50% - 40px)' : 
                             request.currentStepId === 1 ? '0px' : '0px',
                      height: '4px',
                      bgcolor: '#00BFA6',
                      zIndex: 1,
                      transition: 'width 0.5s ease-in-out'
                    }} />
                    
                    {/* Step Circles */}
                    {steps.map((step) => {
                      const status = getStepStatus(request, step.id);
                      return (
                        <Box 
                          key={step.id}
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 2,
                            width: '33.33%'
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: status === 'pending' ? '#e0e0e0' : '#00BFA6',
                              color: status === 'pending' ? '#9e9e9e' : 'white',
                              border: status === 'current' ? '2px solid #00BFA6' : 'none',
                              boxShadow: status === 'current' ? '0 0 0 4px rgba(0, 191, 166, 0.2)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {status === 'completed' ? <CheckCircleIcon /> : step.icon}
                          </Avatar>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1, 
                              textAlign: 'center',
                              color: status === 'pending' ? 'text.secondary' : 'text.primary',
                              fontWeight: status === 'current' || status === 'completed' ? 'bold' : 'normal'
                            }}
                          >
                            {step.title}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Bottom Panel: Staff Assignment */}
                <Box sx={{ py: 1.5, px: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight="medium">ຜູ້ໃຫ້ບໍລິການທີ່ຖືກເອີ້ນໃຊ້:</Typography>
                      <Typography color={request.assignedStaffName ? 'text.primary' : 'error'}>
                        {request.assignedStaffName || 'Not Assigned'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          ))}
        </Box>
      </Container>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: PRIMARY_COLOR, color: 'white' }}>
          Edit Service Request
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedRequest.id} - {selectedRequest.serviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer: {selectedRequest.customerName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Service Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={getCurrentStatusValue(selectedRequest).toString()}
                    label="Service Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="0">Not Started</MenuItem>
                    <MenuItem value="1">Staff Arrived</MenuItem>
                    <MenuItem value="2">In Progress</MenuItem>
                    <MenuItem value="3">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="staff-select-label">Assigned Staff</InputLabel>
                  <Select
                    labelId="staff-select-label"
                    value={selectedRequest.assignedStaffId || ''}
                    label="Assigned Staff"
                    onChange={handleStaffAssignment}
                  >
                    <MenuItem value="">Not Assigned</MenuItem>
                    {staff.map((staffMember) => (
                      <MenuItem key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} ({staffMember.isAvailable ? 'Available' : 'On Task'})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Service Progress:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  my: 1,
                  p: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: '#f5f5f5'
                }}>
                  {steps.map((step, index) => {
                    const status = getStepStatus(selectedRequest, step.id);
                    return (
                      <React.Fragment key={step.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: status === 'pending' ? '#e0e0e0' : 
                                      status === 'completed' ? PRIMARY_COLOR : SECONDARY_COLOR,
                              color: status === 'pending' ? '#9e9e9e' : 'white',
                            }}
                          >
                            {status === 'completed' ? <CheckCircleIcon fontSize="small" /> : 
                             React.cloneElement(step.icon, { fontSize: 'small' })}
                          </Avatar>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {step.title}
                          </Typography>
                        </Box>
                        
                        {index < steps.length - 1 && (
                          <ArrowForwardIcon sx={{ mx: 1, color: '#9e9e9e' }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            sx={{ 
              bgcolor: SECONDARY_COLOR, 
              '&:hover': { bgcolor: '#e07d09' }
            }}
          >
            ບັນທຶກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceStatusAdmin;