import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Alert, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Dashboard = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail;

  useEffect(() => {
    setShowSuccessMessage(true);
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Logout Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 3,
            borderRadius: 50,
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: '#000000',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {showSuccessMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
          onClose={() => setShowSuccessMessage(false)}
        >
          Successfully logged in{userEmail ? `, ${userEmail}` : ''}!
        </Alert>
      )}

      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h3" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;