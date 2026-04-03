import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Email,
  Phone,
  Public,
  CalendarMonth,
  VerifiedUser,
  Person,
} from "@mui/icons-material";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import defaultAvatar from "../../../../assets/images/profile.png";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  console.log('====================================');
  console.log('currentUser', currentUser);
  console.log('====================================');

  if (!currentUser) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        gap={2}
      >
        <Typography variant="h5" fontWeight="bold" color="text.secondary">
          Please log in to view your profile
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/auth")}
        >
          Login Now
        </Button>
      </Box>
    );
  }

  const formattedDate = new Date(currentUser.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, marginTop: "40px" }}>
      {/* Breadcrumbs */}
      <Stack
        flexDirection="row"
        justifyContent="start"
        marginBottom="30px"
        sx={{ marginTop: { xs: "20px", sm: "0" } }}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "20px" }}>
          <Link underline="hover" color="inherit" href="/Hotel-Management-System/dashboard">
            Home
          </Link>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Stack>

      <Grid container spacing={4} justifyContent="center">
        {/* Profile Header Card */}
        <Grid item xs={12} md={10} lg={8}>
          <Card
            elevation={3}
            sx={{
              borderRadius: "16px",
              overflow: "visible",
              position: "relative",
            }}
          >
            {/* Cover Banner */}
            <Box
              sx={{
                height: "180px",
                background:
                  "linear-gradient(135deg, #152C5B 0%, #3252a8 50%, #1565c0 100%)",
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-60px",
              }}
            >
              <Avatar
                src={currentUser.profileImage || defaultAvatar}
                alt={currentUser.userName}
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: 3,
                }}
              />
            </Box>

            <CardContent sx={{ textAlign: "center", pt: 2, pb: 4 }}>
              {/* Username */}
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                {currentUser.userName}
              </Typography>

              {/* Role Chip */}
              <Chip
                icon={<Person />}
                label={currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
                color={currentUser.role === "admin" ? "error" : "primary"}
                variant="outlined"
                sx={{ fontWeight: "bold", fontSize: "0.9rem", mb: 2 }}
              />

            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details Card */}
        <Grid item xs={12} md={10} lg={8}>
          <Card elevation={3} sx={{ borderRadius: "16px" }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        borderRadius: "12px",
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Email sx={{ color: "#fff" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Username
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {currentUser.userName || "Not provided"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Role */}
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        borderRadius: "12px",
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Phone sx={{ color: "#fff" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Role
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {currentUser.role || "Not provided"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                </Grid>

                
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
