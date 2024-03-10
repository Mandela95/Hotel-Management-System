import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { getBaseUrl } from "../../../../Utils/Utils";
import { RoomsInterface } from "../../../../Interfaces/interFaces";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function HousesAndHotels() {
  const [houses, setHouses] = useState<RoomsInterface[]>([]);
  const [hotels, setHotels] = useState<RoomsInterface[]>([]);

  const navigate = useNavigate();
  const { requestHeaders } = useAuth();
  const getRooms = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/portal/rooms/available`,
        {
          headers: requestHeaders,
        }
      );

      setHouses(data.data.rooms.slice(1, 5));
      setHotels(data.data.rooms.slice(6, 10));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail adding");
      }
    }
  }, [requestHeaders]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  return (
    <Box>
      <Grid container spacing={2} padding={3}>
        <Typography component={"h2"} fontWeight={"bold"} fontSize={"1.6rem"}>
          Houses with beauty backyard
        </Typography>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            {houses.map((house, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={house._id}>
                <Button
                  sx={{ width: "100%", padding: 0 }}
                  onClick={() => navigate(`/explore/${house._id}`)}
                >
                  <Card
                    sx={{
                      position: "relative",
                      height: "300px",
                      background:
                        house.images && house.images.length > 0
                          ? `url(${house.images[0]})`
                          : "grey",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      "&:hover .overlay": {
                        opacity: 1,
                      },
                      boxShadow: "2px 2px 2px gray",
                      width: "100%",
                    }}
                  >
                    {index == 3 ? (
                      <Typography
                        sx={{
                          textAlign: "right",
                          backgroundColor: "tomato",
                          padding: "5px 7px",
                          width: "fit-content",
                          marginLeft: "auto",
                          borderRadius: "0px 10px 0 10px",
                          fontSize: "1.1rem",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        most popular
                      </Typography>
                    ) : (
                      ""
                    )}
                  </Card>
                </Button>
                <Box sx={{ marginTop: "5px" }}>
                  <Typography fontWeight={"bold"} fontSize={"1.1rem"}>
                    {house.roomNumber}
                  </Typography>
                  <Typography>{house.roomNumber}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Typography component={"h2"} fontWeight={"bold"} fontSize={"1.6rem"}>
          Hotels with large living room
        </Typography>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            {hotels.map((hotel, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={hotel._id}>
                <Button
                  sx={{ width: "100%", padding: 0 }}
                  onClick={() => navigate(`/explore/${hotel._id}`)}
                >
                  <Card
                    sx={{
                      position: "relative",
                      height: "300px",
                      background:
                        hotel.images && hotel.images.length > 0
                          ? `url(${hotel.images[0]})`
                          : "grey",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      "&:hover .overlay": {
                        opacity: 1,
                      },
                      boxShadow: "2px 2px 2px gray",
                      width: "100%",
                    }}
                  >
                    {index == 2 ? (
                      <Typography
                        sx={{
                          textAlign: "right",
                          backgroundColor: "tomato",
                          padding: "5px 7px",
                          width: "fit-content",
                          marginLeft: "auto",
                          borderRadius: "0px 10px 0 10px",
                          fontSize: "1.1rem",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        popular choice
                      </Typography>
                    ) : (
                      ""
                    )}
                  </Card>
                </Button>
                <Box sx={{ marginTop: "5px" }}>
                  <Typography fontWeight={"bold"} fontSize={"1.1rem"}>
                    {hotel.roomNumber}
                  </Typography>
                  <Typography>{hotel.roomNumber}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
