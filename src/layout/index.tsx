import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppLayout from "./header";
import Footer from "./footer";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppLayout />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginX: "auto",
        }}
      >
        <Box sx={{ flexGrow: 1, width: "100%", mt: { md: 2.5, xs: 1 } }}>
          <Outlet />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
