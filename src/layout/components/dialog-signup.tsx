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
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import bgImage from "../../assets/icons/Cat_login.png";
import googleIcon from "../../assets/icons/Platform=Google, Color=Original.png";
import facebookIcon from "../../assets/icons/Platform=Facebook, Color=Original (1).png";

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    console.log("Registering with:", fullName, email, password);
    onClose();
  };

  return (
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
        {/* Left side - Form */}
        <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#003333", mb: 4 }}
          >
            Sign Up to FurryFriends
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
            placeholder="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                    ✉️
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
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
            }
            label="I agree to the Terms and Conditions"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
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
            Sign Up
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 1, color: "text.secondary",}}>
              Or Sign Up with
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
