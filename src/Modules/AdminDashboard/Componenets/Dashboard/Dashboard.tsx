import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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
  const [chartsData, setChartsData] = useState<Charts>({});

  const { requestHeaders } = useAuth();

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
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            minHeight: {
              xs: "50px",
              lg: "75x",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
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
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            minHeight: {
              xs: "50px",
              lg: "75px",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
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
          sx={{
            bgcolor: "rgba(26, 27, 30, 1)",
            color: "white",
            borderRadius: "30px",
            minHeight: {
              xs: "75px",
              lg: "100px",
            },
            padding: {
              xs: "10px",
              lg: "20px",
            },
            minWidth: { xs: "60%", lg: "20%" },
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
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        flexWrap="wrap"
        marginTop="20px"
        display="flex"
      >
        <Box
          sx={{
            width: {
              xs: "350px !important",
              md: "400px !important",
            },
            height: {
              md: "100%",
            },
          }}
        >
          <Typography
            marginBottom={8}
            bgcolor="rgba(26, 27, 30, 1)"
            width="fit-content"
            padding={1}
            borderRadius={2}
            color="white"
          >
            Bookings Status
          </Typography>
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
              },
            ]}
            height={200}
          />
        </Box>
        <Box
          sx={{
            width: {
              xs: "350px !important",
              md: "400px !important",
            },
            height: {
              md: "100%",
            },
          }}
        >
          <Typography
            marginBottom={4}
            bgcolor="rgba(26, 27, 30, 1)"
            width="fit-content"
            padding={1}
            borderRadius={2}
            color="white"
          >
            Uers Status
          </Typography>
          <BarChart
            height={300}
            series={[
              { data: [chartsData.users?.admin], label: "Admin", id: "1" },
              { data: [chartsData.users?.user], label: "User", id: "2" },
            ]}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
