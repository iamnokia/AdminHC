import { Box, Button, Typography, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import './404.css';

const NotFoundPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      bgcolor: '#f9f4fa', // Light shade of your purple
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(97, 20, 99, 0.05) 0%, rgba(97, 20, 99, 0.02) 90%)'
    }}>
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          py: 8
        }}>
          {/* Decorative elements */}
          <Box className="circle-decoration" sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(97, 20, 99, 0.05)',
            top: -30,
            left: '10%',
            animation: 'float 8s ease-in-out infinite'
          }} />
          
          <Box className="circle-decoration" sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(97, 20, 99, 0.08)',
            bottom: 0,
            right: '15%',
            animation: 'float 6s ease-in-out infinite 1s'
          }} />
          
          {/* Main content */}
          <Typography 
            className='color-slide' 
            variant="h1" 
            sx={{ 
              letterSpacing: 6, 
              fontSize: { xs: 100, md: 150 }, 
              fontWeight: 800,
              color: '#611463',
              textShadow: '2px 2px 10px rgba(97, 20, 99, 0.2)',
              mb: 2,
              opacity: 0.9
            }}
          >
            404
          </Typography>
          
          <Typography 
            className='fade-in' 
            variant="h4" 
            sx={{ 
              letterSpacing: 1, 
              mt: 1, 
              textAlign: 'center', 
              maxWidth: 600, 
              px: 3,
              color: '#611463',
              fontWeight: 500,
              mb: 4
            }}
          >
            ຂໍອະໄພໃນຄວາມບໍ່ສະດວກ! ບໍ່ພົບຂໍ້ມູນໜ້ານີ້, ກະລຸນາກັບຄືນສູ່ໜ້າຫຼັກ.
          </Typography>
          
          <Box className="divider" sx={{ 
            width: '60px', 
            height: '4px', 
            bgcolor: '#611463', 
            mb: 4,
            borderRadius: '2px',
            opacity: 0.7
          }} />
          
          <Button
            size="large"
            variant="contained"
            startIcon={<HomeIcon />}
            href="/"
            sx={{ 
              textTransform: 'none', 
              mt: 2, 
              fontWeight: 'bold', 
              borderRadius: 100, 
              px: 4,
              py: 1.5,
              bgcolor: '#611463',
              '&:hover': {
                bgcolor: '#7a1a7d',
                boxShadow: '0 8px 16px rgba(97, 20, 99, 0.2)'
              },
              boxShadow: '0 4px 12px rgba(97, 20, 99, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            ກັບຄືນສູ່ໜ້າຫຼັກ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;