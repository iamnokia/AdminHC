import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import useMainController from "./controller";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import ICON_FB from "../../assets/Logo/Group 481825.svg";
import ICON_GG from "../../assets/Logo/super g.svg";
import { REGISTER_PATH } from "../../routes/path";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const ctrl = useMainController();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "auto",
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          bgcolor: "white",
          borderRadius: 4,
          boxShadow: "0 0 16px 6px #0000000d",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          LOG IN
        </Typography>

        <Box mt={3}>
          <form onSubmit={ctrl.handleSubmit}>
            <Box>
              <Typography>Username</Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter your username"
                value={ctrl.username ?? ""}
                onChange={ctrl.handleChangeusername}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mt={4}>
              <Typography>Password</Typography>
              <TextField
                value={ctrl?.password ?? ""}
                onChange={ctrl.handleChangePassword}
                placeholder="Enter password"
                fullWidth
                type={ctrl.showPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={ctrl.handleClickShowPassword}
                        edge="end"
                      >
                        {ctrl.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <a style={{ color: "#FF6D00", textDecoration: "none" }} href="#">
                Forgot Password?
              </a>
            </Box>

            <Button
              sx={{
                height: "3rem",
                bgcolor: "#0067BC",
                textTransform: "none",
                borderRadius: 10,
                mt: 3,
                fontSize: 16,
              }}
              type="submit"
              variant="contained"
              fullWidth
            >
              {ctrl.loading ? <CircularProgress size={20} /> : "Log In"}
            </Button>

            <Box
              mt={3}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Divider
                sx={{
                  backgroundColor: "#5B5B5E",
                  width: "35%",
                  height: "1px",
                  mt: 1,
                }}
              />
              <Typography color={"#5B5B5E"}>or Login With </Typography>
              <Divider
                sx={{
                  backgroundColor: "#5B5B5E",
                  width: "35%",
                  height: "1px",
                  mt: 1,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mt: 3,
              }}
            >
              <Box>
                <Button
                  fullWidth
                  sx={{
                    border: "1px solid #E5E5E5",
                    p: 2,
                    fontWeight: "bold",
                    height: "50px",
                    color: "#4B4B4B",
                    textTransform: "none",
                    borderRadius: 3,
                  }}
                  startIcon={<img src={ICON_GG} alt="Icon" />}
                >
                  Google
                </Button>
              </Box>
              <Box>
                <Button
                  fullWidth
                  sx={{
                    p: 2,
                    fontWeight: "bold",
                    height: "50px",
                    color: "#4B4B4B",
                    textTransform: "none",
                    borderRadius: 3,
                    border: "1px solid #E5E5E5",
                  }}
                  startIcon={<img src={ICON_FB} alt="Icon" />}
                >
                  Facebook
                </Button>
              </Box>
            </Box>

            <Typography mt={5}>
              Don't have an account? <Link to={REGISTER_PATH}>Register</Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
