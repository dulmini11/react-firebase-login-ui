import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/logingPage.png";

// Social media icon components (using simple SVGs for Google, Apple, Facebook)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M19.8 10.2273C19.8 9.51818 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5818C15.3273 13.3 14.5636 14.3591 13.4273 15.0682V17.5773H16.7364C18.7091 15.7682 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
    <path d="M10.2 20C12.9 20 15.1727 19.1045 16.7364 17.5773L13.4273 15.0682C12.4727 15.6682 11.2636 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.1955 4.54091 11.8H1.13636V14.3909C2.68636 17.4455 6.20909 20 10.2 20Z" fill="#34A853"/>
    <path d="M4.54091 11.8C4.32273 11.2 4.2 10.5591 4.2 9.9C4.2 9.24091 4.32273 8.6 4.54091 8H1.13636C0.418182 9.42273 0 11.0227 0 12.7273C0 14.4318 0.418182 16.0318 1.13636 17.4545L4.54091 14.8636V11.8Z" fill="#FBBC05"/>
    <path d="M10.2 3.77727C11.3727 3.77727 12.4227 4.18182 13.2409 4.95455L16.1818 2.01364C15.1682 1.08182 12.9 0 10.2 0C6.20909 0 2.68636 2.55455 1.13636 5.60909L4.54091 8.2C5.38182 5.80455 7.59545 3.77727 10.2 3.77727Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15.5 10.5C15.5 8.5 17 7.5 17 7.5C17 7.5 15.8 5.8 13.9 5.8C12.4 5.8 11.8 6.7 10.8 6.7C9.7 6.7 8.9 5.8 7.6 5.8C5.9 5.8 4 7.3 4 10.2C4 12.2 4.8 14.3 5.7 15.6C6.4 16.6 7 17.5 8 17.5C9 17.5 9.4 16.8 10.7 16.8C12 16.8 12.3 17.5 13.4 17.5C14.5 17.5 15.1 16.5 15.7 15.6C16.4 14.5 16.6 13.5 16.6 13.4C16.6 13.4 15.5 12.9 15.5 10.5Z"/>
    <path d="M13 2C13.6 2.7 13.9 3.6 13.8 4.5C12.9 4.6 11.9 4.1 11.3 3.4C10.7 2.7 10.3 1.8 10.4 0.9C11.3 0.9 12.3 1.3 13 2Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 14.84 3.44 18.87 8 19.8V13H6V10H8V7.5C8 5.57 9.57 4 11.5 4H14V7H12C11.45 7 11 7.45 11 8V10H14V13H11V19.95C16.05 19.45 20 15.19 20 10Z"/>
  </svg>
);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, timestamp: Date.now() }))}.mock-signature`;
      
      navigate("/dashboard", { 
        state: { 
          userEmail: email, 
          accessToken: mockToken 
        } 
      });
      
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const accessToken = await user.getIdToken();
      
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
    <Container maxWidth="lg" sx={{ minHeight: "80vh", py: 8 }}>
      <Grid container spacing={0} sx={{ minHeight: "80vh" }}>
        {/* Left Column - Login Form */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            px: { xs: 2, sm: 4, md: 10 }
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
              >
                Welcome back!
              </Typography>
              <Typography 
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Simplify your workflow and boost your productivity with Tuga's App. 
                Get started for free.
              </Typography>
            </Box>

            <form onSubmit={handleEmailLogin}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Username"
                  value={email}
                  onChange={handleEmailChange}
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 50,
                      backgroundColor: "#ffffff",
                      '&:hover': {
                        backgroundColor: "#ffffff",
                      },
                      '&.Mui-focused': {
                        backgroundColor: "#ffffff",
                      },
                      '& fieldset': {
                        borderColor: "#000000",
                        borderWidth: 1.5,
                      },
                      '&:hover fieldset': {
                        borderColor: "#000000",
                        borderWidth: 1.5,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#0f0f0fdc",
                        borderWidth: 2,
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                      px: 2.5,
                      fontSize: "0.875rem",
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleClickShowPassword} 
                          edge="end"
                          size="small"
                          sx={{ mr: 0.5 }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 50,
                      backgroundColor: "#ffffff",
                      '&:hover': {
                        backgroundColor: "#ffffff",
                      },
                      '&.Mui-focused': {
                        backgroundColor: "#ffffff",
                      },
                      '& fieldset': {
                        borderColor: "#000000",
                        borderWidth: 1.5,
                      },
                      '&:hover fieldset': {
                        borderColor: "#000000",
                        borderWidth: 1.5,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#0f0f0fdc",
                        borderWidth: 2,
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                      px: 2.5,
                      fontSize: "0.875rem",
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>  {/* Reduced from mb: 3 */}
                <Button 
                  color="inherit" 
                  size="small"
                  sx={{ 
                    textTransform: "none",
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    '&:hover': {
                      backgroundColor: "transparent",
                      textDecoration: "underline"
                    }
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="medium"
                disabled={loading}
                sx={{
                  py: 1.25,
                  borderRadius: 50,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  mb: 2,
                  backgroundColor: "#000000",
                  '&:hover': {
                    backgroundColor: "#333333",
                  }
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Login"}
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography 
                  variant="caption"
                  sx={{ 
                    mx: 1.5,
                    color: "text.secondary",
                    fontSize: "0.75rem"
                  }}
                >
                  or continue with
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "center", alignItems: "center" }}>
                <IconButton
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #e0e0e0",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    '&:hover': {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#000000",
                    }
                  }}
                >
                  {googleLoading ? <CircularProgress size={24} /> : <GoogleIcon />}
                </IconButton>
                
                <IconButton
                  onClick={() => alert("Apple login coming soon")}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #e0e0e0",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    '&:hover': {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#000000",
                    }
                  }}
                >
                  <AppleIcon />
                </IconButton>
                
                <IconButton
                  onClick={() => alert("Facebook login coming soon")}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #e0e0e0",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    '&:hover': {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#000000",
                    }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Not a member?{" "}
                  <Button 
                    color="primary" 
                    size="small"
                    sx={{ 
                      textTransform: "none",
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: "transparent",
                        textDecoration: "underline"
                      }
                    }}
                  >
                    Register now
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Grid>

        {/* Right Column*/}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f8f8",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "80%",
              height: "80%",
              textAlign: "center",
            }}
          >
            <img
              src={loginImage}
              alt="Login Illustration"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: 500,
                color: "#222",
                maxWidth: 400,
                lineHeight: 1.3,
              }}
            >
              Make your work easier and organized{" "}<br/> with{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                Tuga's App
              </Box>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;