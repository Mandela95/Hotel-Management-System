import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { Charts } from "../../../../Interfaces/interFaces";
import { PieChart } from "@mui/x-charts/PieChart";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import Shop2Icon from "@mui/icons-material/Shop2";
import CampaignIcon from "@mui/icons-material/Campaign";
import { toast } from "react-toastify";
import { getBaseUrl } from "../../../../Utils/Utils";
import { BarChart } from "@mui/x-charts";

export default function DashboardHome() {
  const [chartsData, setChartsData] = useState<Charts>({} as Charts);
  const { requestHeaders } = useAuth();
  const navigate = useNavigate();

  const getCharts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/api/v0/admin/dashboard`,
        {
          headers: requestHeaders,
        }
      );
      setChartsData(response?.data?.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail signin");
      }
    }
  }, [requestHeaders]);

  useEffect(() => {
    getCharts();
  }, [getCharts]);

  return (
    <Stack
      component={"section"}
      width="100%"
      display="flex"
      direction="column"
      justifyContent="flex-start"
      gap={12}
      marginTop={8}
      sx={{ overflow: "hidden", px: { xs: 1, md: 2 } }}
    >
      <Stack
        gap="20px"
        alignItems="center"
        justifyContent="space-around"
        direction="row"
        sx={{
          flexWrap: "wrap",
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="space-around"
          direction="row"
          margin="auto !important"
          onClick={() => navigate("/dashboard/rooms")}
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            cursor: "pointer",
            minHeight: {
              xs: "50px",
              lg: "75px",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
            "&:hover": { opacity: 0.85 },
          }}
          boxShadow="2px 2px 2px gray"
        >
          <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
              {chartsData.rooms}
            </Typography>
            <Typography
              sx={{ marginTop: "1em", fontWeight: "bold", fontSize: "1.2em" }}
            >
              Rooms
            </Typography>
          </Box>
          <Box>
            <AddHomeWorkIcon sx={{ fontSize: "3em" }} />
          </Box>
        </Stack>
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="space-around"
          direction="row"
          margin="auto !important"
          boxShadow="2px 2px 2px gray"
          onClick={() => navigate("/dashboard/facilities")}
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            cursor: "pointer",
            minHeight: {
              xs: "50px",
              lg: "75px",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
            "&:hover": { opacity: 0.85 },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
              {chartsData.facilities}
            </Typography>
            <Typography
              sx={{ marginTop: "1em", fontWeight: "bold", fontSize: "1.2em" }}
            >
              Facilities
            </Typography>
          </Box>
          <Box>
            <Shop2Icon sx={{ fontSize: "3em" }} />
          </Box>
        </Stack>
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="space-around"
          direction="row"
          margin="auto !important"
          boxShadow="2px 2px 2px gray"
          onClick={() => navigate("/dashboard/ads")}
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            cursor: "pointer",
            minHeight: {
              xs: "75px",
              lg: "100px",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
            "&:hover": { opacity: 0.85 },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
              {chartsData.ads}
            </Typography>
            <Typography
              sx={{ marginTop: "1em", fontWeight: "bold", fontSize: "1.2em" }}
            >
              Ads
            </Typography>
          </Box>
          <Box>
            <CampaignIcon sx={{ fontSize: "3em" }} />
          </Box>
        </Stack>
      </Stack>
      {/*Charts */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "center", md: "stretch" }}
        justifyContent="center"
        marginTop="20px"
        display="flex"
        gap={4}
        sx={{
          width: "100%",
          px: { xs: 1, md: 0 },
        }}
      >
        {/* Bookings Status */}
        <Box
          sx={{
            flex: { md: "1 1 0" },
            maxWidth: { md: "420px" },
            width: { xs: "100%", sm: "320px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            marginBottom={2}
            bgcolor="rgba(26, 27, 30, 1)"
            padding={1}
            borderRadius={2}
            color="white"
          >
            Bookings Status
          </Typography>
          {/* Legend above chart */}
          <Stack direction="row" justifyContent="center" gap={3} mb={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "#2196f3" }} />
              <Typography variant="body2">
                Completed: {chartsData.bookings?.completed ?? 0}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "#ff9800" }} />
              <Typography variant="body2">
                Pending: {chartsData.bookings?.pending ?? 0}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: chartsData.bookings?.completed,
                      label: "Completed",
                    },
                    {
                      id: 1,
                      value: chartsData.bookings?.pending,
                      label: "Pending",
                    },
                  ],
                  cx: 150,
                  cy: 120,
                },
              ]}
              slotProps={{ legend: { hidden: true } }}
              height={250}
              width={300}
            />
          </Box>
        </Box>

        {/* Users Status */}
        <Box
          sx={{
            flex: { md: "1 1 0" },
            maxWidth: { md: "420px" },
            width: { xs: "100%", sm: "320px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            marginBottom={2}
            bgcolor="rgba(26, 27, 30, 1)"
            padding={1}
            borderRadius={2}
            color="white"
          >
            Users Status
          </Typography>
          {/* Legend above chart to align with Bookings legend */}
          <Stack direction="row" justifyContent="center" gap={3} mb={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: "#2e7d32" }} />
              <Typography variant="body2">
                Admin: {chartsData.users?.admin ?? 0}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: "#1976d2" }} />
              <Typography variant="body2">
                User: {chartsData.users?.user ?? 0}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <BarChart
              height={250}
              width={300}
              series={[
                { data: [chartsData.users?.admin], label: "Admin", id: "1" },
                { data: [chartsData.users?.user], label: "User", id: "2" },
              ]}
              slotProps={{ legend: { hidden: true } }}
            />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
