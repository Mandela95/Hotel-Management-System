import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { useState } from "react";
import logoDark from "../../../../assets/images/logo-dark.svg";
import logoLight from "../../../../assets/images/logo-light.svg";

export default function Footer() {
  const theme = useTheme();
  const isXsOrSmaller = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === null;
  });

  return (
    <Box sx={{ width: "100%", padding: "50px 0", backgroundColor: "#f9f9f9" }}>
      <hr color="#E5E5E5" />
      <Grid container spacing={4} sx={{ padding: "10px 20px" }}>
        <Grid item xs={12} md={3}>
          <img width={"140px"} src={isDark ? logoDark : logoLight} alt="logo" />
          <Typography width={isXsOrSmaller ? "100%" : "60%"} color={"#B0B0B0"}>
            We kaboom your beauty holiday instantly and memorable.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" color={"#152C5B"} gutterBottom>
            For Beginners
          </Typography>
          <Typography color={"#B0B0B0"}>New Account</Typography>
          <Typography color={"#B0B0B0"}>Start Booking a Room</Typography>
          <Typography color={"#B0B0B0"}>Use Payments</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" color={"#152C5B"} gutterBottom>
            Explore Us
          </Typography>
          <Typography color={"#B0B0B0"}>Our Careers</Typography>
          <Typography color={"#B0B0B0"}>Privacy</Typography>
          <Typography color={"#B0B0B0"}>Terms & Conditions</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" color={"#152C5B"} gutterBottom>
            Contact Us
          </Typography>
          <Typography color={"#B0B0B0"}>support@staycation.id</Typography>
          <Typography color={"#B0B0B0"}>021-2208-1996</Typography>
          <Typography color={"#B0B0B0"}>Staycation, Kemang, Jakarta</Typography>
        </Grid>
      </Grid>
      <Typography
        marginTop={"50px"}
        color={"#B0B0B0"}
        display={"flex"}
        justifyContent={"center"}
      >
        Copyright 2019 • All rights reserved • Staycation
      </Typography>
    </Box>
  );
}
