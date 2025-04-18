import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Define colors
const FOOTER_PURPLE = "#611463";

const Footer = () => {

  return (
    <Box component="footer">
      {/* Social Media Bar */}
      <Box
        sx={{
          bgcolor: FOOTER_PURPLE,
          py: 2,
          px: 3,
          ml:30,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
        }}
      >
        <Typography variant="body2">HomeCare@gmail.com</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" sx={{ color: "white" }}>
            <FacebookIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <PinterestIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <YouTubeIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
