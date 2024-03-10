import { Box } from "@mui/material";
import Home from "../Home/Home";
import HousesAndHotels from "../HousesAndHotels/HousesAndHotels";
import PopularAds from "../PopularAds/PopularAds";
import Reviews from "../Reviews/Reviews";
import Footer from "../../../SharedModule/components/Footer/Footer";

export default function LandingPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: { xs: 2, md: 4 },
      }}
    >
      <Box component="section" sx={{ marginBottom: { xs: 2, md: 4 } }}>
        <Home />
      </Box>
      <Box component="section" sx={{ marginBottom: { xs: 2, md: 4 } }}>
        <PopularAds />
      </Box>
      <Box component="section" sx={{ marginBottom: { xs: 2, md: 4 } }}>
        <HousesAndHotels />
      </Box>
      <Box component="section" sx={{ marginBottom: { xs: 2, md: 4 } }}>
        <Reviews />
      </Box>
      <Box component="section" sx={{ marginBottom: { xs: 2, md: 4 } }}>
        <Footer />
      </Box>
    </Box>
  );
}
