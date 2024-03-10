import {
  Favorite,
  FavoriteBorderOutlined,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { getBaseUrl } from "../../../../Utils/Utils";
import { useNavigate } from "react-router-dom";

export default function PopularAds() {
  const [Z5Ads, setZ5Ads] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { requestHeaders } = useAuth();
  const [clickedAdd, setClickedAdd] = useState<boolean>(false);
  const [clickedRemove, setClickedRemove] = useState<boolean>(false);
  const navigate = useNavigate();

  const FavsWaitToast = {
    onClose: () => {
      setClickedAdd(false);
      setClickedAdd(false);
    },
  };
  const fetchFavoritedRooms = useCallback(async () => {
    try {
      const res = await axios.get(
        `${getBaseUrl()}/api/v0/portal/favorite-rooms`,
        {
          headers: requestHeaders,
        }
      );

      setFavorites(res.data.data.favoriteRooms[0].rooms);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail to add to favs");
      }
    }
  }, [requestHeaders]);

  const FetchAds = useCallback(async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/v0/admin/ads`, {
        headers: requestHeaders,
      });
      const SplicedArray = res.data.data.ads.splice(0, 5);
      setZ5Ads(SplicedArray);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail to add to favs");
      }
    }
  }, [requestHeaders]);

  const AddToFavs = async (RoomId: string) => {
    setClickedAdd(true);
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/v0/portal/favorite-rooms`,
        {
          roomId: RoomId,
        },
        {
          headers: requestHeaders,
        }
      );
      toast.success(res?.data.message || "added to favs", FavsWaitToast);
      fetchFavoritedRooms();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "fail to add to favs",
          FavsWaitToast
        );
      }
    }
    setClickedAdd(false);
  };

  const RemoveFromFavs = async (RoomId: string) => {
    setClickedRemove(true);
    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/v0/portal/favorite-rooms/${RoomId}`,
        {
          headers: requestHeaders,
          data: { roomId: RoomId },
        }
      );
      toast.warning(res?.data.message || "Removed From favs", FavsWaitToast);
      fetchFavoritedRooms();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "fail to Remove From favs",
          FavsWaitToast
        );
      }
    }
    setClickedRemove(false);
  };

  useEffect(() => {
    FetchAds();
    fetchFavoritedRooms();
  }, [FetchAds, fetchFavoritedRooms]);
  return (
    <Box>
      <Typography component={"h2"} fontWeight={"bold"} fontSize={"1.8rem"}>
        Most Popular Ads
      </Typography>
      <Box
        component="div"
        sx={{
          p: 2,
        }}
      >
        <Grid height="80vh" container columns={12} spacing={5}>
          <Grid item xs={12} md={6}>
            {CardComponent(
              Z5Ads[0],
              "100%",
              AddToFavs,
              RemoveFromFavs,
              favorites,
              clickedAdd,
              clickedRemove,
              navigate
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {CardComponent(
              Z5Ads[1],
              "50%",
              AddToFavs,
              RemoveFromFavs,
              favorites,
              clickedAdd,
              clickedRemove,
              navigate
            )}
            {CardComponent(
              Z5Ads[2],
              "50%",
              AddToFavs,
              RemoveFromFavs,
              favorites,
              clickedAdd,
              clickedRemove,
              navigate
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {CardComponent(
              Z5Ads[3],
              "50%",
              AddToFavs,
              RemoveFromFavs,
              favorites,
              clickedAdd,
              clickedRemove,
              navigate
            )}
            {CardComponent(
              Z5Ads[4],
              "50%",
              AddToFavs,
              RemoveFromFavs,
              favorites,
              clickedAdd,
              clickedRemove,
              navigate
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const CardComponent = (
  AD: {
    room: {
      discount: string;
      images: string[];
      roomNumber: string;
      _id: string;
    };
  },
  height: string,
  AddToFavs: (roomid: string) => void,
  RemoveFromFavs: (id: string) => void,
  favorites: string[],
  clickedAdd: boolean,
  clickedRemove: boolean,
  navigate
) => {
  // Check if the current room is favorited or not
  const isFavorited = favorites.some(
    (fav: { _id: string }) => fav._id === AD?.room._id
  );

  return (
    <Card
      sx={{
        position: "relative",
        height: { height },
        background: `url(${AD?.room.images[0]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        "&:hover .overlay": {
          opacity: 1,
        },
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
          fontSize: {
            sx: ".5rem !important",
            md: "1.1rem !important",
          },
          fontFamily: "emoji",
          fontWeight: "bold",
        }}
      >
        ${AD?.room.discount} discount per night
      </Typography>
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Render "Add to Fvas" , "Remove From Favs" button if the room is not favorited , Favorite */}
        {!isFavorited ? (
          <Button
            color="warning"
            onClick={() => AddToFavs(AD.room._id)}
            disabled={clickedAdd}
          >
            <FavoriteBorderOutlined sx={{ fontSize: "1.8rem" }} />
          </Button>
        ) : (
          <Button
            color="warning"
            onClick={() => RemoveFromFavs(AD.room._id)}
            disabled={clickedRemove}
          >
            <Favorite sx={{ fontSize: "1.8rem" }} />
          </Button>
        )}

        <Button color="info">
          <RemoveRedEyeOutlined
            onClick={() => navigate(`/explore/${AD.room._id}`)}
          />
        </Button>
      </Box>
      <Box
        marginLeft={"10px"}
        position="absolute"
        bottom="10px"
        left="10px"
        color={"white"}
      >
        <Typography component={"h3"} fontWeight={"900"} fontSize={"1.2rem"}>
          {AD?.room.roomNumber}
        </Typography>
        <Typography>{AD?.room.roomNumber}</Typography>
      </Box>
    </Card>
  );
};
