import React, { useState } from "react";
import {Container,Box,Typography,TextField,Button,Divider,Alert,CircularProgress} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    
    // Simple password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo,  create a mock token
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, timestamp: Date.now() }))}.mock-signature`;
      
      // Navigate to dashboard with mock data
      navigate("/dashboard", { 
        state: { 
          userEmail: email, 
          accessToken: mockToken 
        } 
      });
      
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      // Sign in with Google via Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the access token
      const accessToken = await user.getIdToken();
      
      // Navigate to dashboard with real user data
      navigate("/dashboard", { 
        state: { 
          userEmail: user.email, 
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
          accessToken: accessToken 
        } 
      });
      
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Sign in to continue
        </Typography>

        <form onSubmit={handleEmailLogin} style={{ width: "100%", marginTop: 20 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
            helperText="Password must be at least 6 characters"
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login with Email"}
          </Button>
        </form>

        <Box sx={{ display: "flex", alignItems: "center", my: 3, width: "100%" }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
            OR
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          sx={{ mt: 1 }}
        >
          {googleLoading ? <CircularProgress size={24} /> : "Login with Google"}
        </Button>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 4, textAlign: "center" }}>
          Note: This is a demo app. Email login uses mock data.<br />
          Google login uses actual Firebase authentication.
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;