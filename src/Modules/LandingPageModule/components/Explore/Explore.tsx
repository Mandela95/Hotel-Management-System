import {
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Link,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { RoomsInterface } from "../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../Utils/Utils";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const [rooms, setRooms] = useState<RoomsInterface[]>([]);
  const { requestHeaders } = useAuth();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const pageSize = 20;
  const navigate = useNavigate();
  //getRooms Api Call
  const getRooms = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const { data } = await axios.get(
          `${getBaseUrl()}/api/v0/portal/rooms/available?page=${page}&size=${pageSize}`,
          {
            headers: requestHeaders,
          }
        );
        setRooms(data.data.rooms);
        setTotalPages(Math.ceil(data.data.totalCount / pageSize));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "fail adding");
        }
      }
    },
    [requestHeaders]
  );

  useEffect(() => {
    getRooms(page, pageSize);
  }, [page, pageSize, getRooms]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Typography
        marginTop={"100px"}
        display={"flex"}
        justifyContent={"center"}
        color={"#152C5B"}
        variant={"h5"}
        fontWeight={"bold"}
      >
        Explore ALL Rooms
      </Typography>
      <Stack
        flexDirection={"row"}
        justifyContent={"start"}
        marginBottom={"60px"}
        sx={{
          marginTop: {
            xs: "20px",
            sm: "0",
          },
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "20px" }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit">
            Explore
          </Link>
        </Breadcrumbs>
      </Stack>
      <Grid marginLeft={"25px"}>
        <Typography color={"#152C5B"} fontWeight={"Bold"} variant="h5">
          All Rooms
        </Typography>
      </Grid>
      <Grid container spacing={2} padding={"25px"}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} lg={3} padding={2} key={room._id}>
            <Button
              sx={{ width: "100%" }}
              onClick={() => navigate(`/explore/${room._id}`)}
            >
              <Card
                sx={{
                  position: "relative",
                  height: "300px",
                  background:
                    room.images && room.images.length > 0
                      ? `url(${room.images[0]})`
                      : "grey",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  "&:hover .overlay": {
                    opacity: 1,
                  },
                  width: "100%",
                }}
              >
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
                  ${room.discount} discount per night
                </Typography>
              </Card>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        marginTop={"35px"}
        marginBottom={"35px"}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Grid>
    </>
  );
}
