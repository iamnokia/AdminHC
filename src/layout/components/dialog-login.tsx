import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bgImage from "../../assets/icons/Cat_login.png";
import RegisterDialog from "./dialog-signup";
import googleIcon from "../../assets/icons/Platform=Google, Color=Original.png";
import facebookIcon from "../../assets/icons/Platform=Facebook, Color=Original (1).png";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  const handleOpenRegister = () => {
    onClose();
    setRegisterDialogOpen(true);
  };

  const handleCloseRegister = () => {
    setRegisterDialogOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in with:", fullName, password);
    // After successful login, close dialog
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "700px",
            overflow: "hidden",
            m: 0,
            p: 0,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogContent sx={{ p: 0, display: "flex", height: "540px" }}>
          {/* Left side - Form */}
          <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#003333", mb: 4 }}
            >
              Log In to FurryFriends
            </Typography>

            <TextField
              fullWidth
              placeholder="Full Name"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                      }}
                    >
                      👤
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                      }}
                    >
                      🔒
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 0.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Link href="#" sx={{ color: "#6750A4", textDecoration: "none" }}>
                Forgot Password ?
              </Link>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Keep me logged in"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                bgcolor: "#6750A4",
                borderRadius: "24px",
                py: 1.5,
                textTransform: "none",
                mb: 3,
                "&:hover": {
                  bgcolor: "#5D4596",
                },
              }}
            >
              Log In
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                sx={{ mx: 1, color: "text.secondary" }}
              >
                Or Sign Up with
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
            >
              <IconButton
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "50%",
                  p: 1,
                  color: "#DB4437",
                }}
              >
                <img
                  src={googleIcon}
                  alt="google"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
              </IconButton>
              <IconButton
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "50%",
                  p: 1,
                  color: "#4267B2",
                }}
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Don't have an account ?&nbsp;
                <Link
                  onClick={handleOpenRegister}
                  sx={{
                    color: "#6750A4",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Right side - Image and logo */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#F2EEFA",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              backgroundImage: `url(${bgImage})`,
            }}
          ></Box>
        </DialogContent>
      </Dialog>

      <RegisterDialog open={registerDialogOpen} onClose={handleCloseRegister} />
    </>
  );
};

export default LoginDialog;
