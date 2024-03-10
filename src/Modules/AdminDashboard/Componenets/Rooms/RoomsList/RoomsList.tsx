import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  DeleteForever,
  Draw,
  HighlightOff,
  RemoveRedEyeSharp,
} from "@mui/icons-material";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DiscountIcon from "@mui/icons-material/Discount";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FaceIcon from "@mui/icons-material/Face";
import GroupIcon from "@mui/icons-material/Group";
import PortraitIcon from "@mui/icons-material/Portrait";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  Fade,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import delImg from "../../../../../assets/images/noData.png";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
import { RoomsInterface } from "../../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../../Utils/Utils";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function RoomsList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomsInterface[]>([]);
  const [facilities, setFacilities] = useState<[{ name: string }]>([
    { name: "" },
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [viewRoom, setViewRoom] = useState<RoomsInterface>({});
  const [openFacModal, setOpenFacModal] = useState<boolean>(false);
  const [openImgModal, setOpenimgModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);

  const [roomID, setRoomID] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenFacModal = () => setOpenFacModal(true);
  const handleCloseFacModal = () => {
    setOpenFacModal(false);
    setFacilities([{ name: "" }]);
  };
  const handleDelete = (id: string, name: string) => {
    setRoomID(id);
    setRoomName(name);
    handleOpenDelete();
  };
  const handleOpenViewModal = () => setOpenViewModal(true);

  const { requestHeaders } = useAuth();

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setViewRoom({});
    setImages([]);
    setFacilities([{ name: "" }]);
  };

  const handleOpenImgModal = () => setOpenimgModal(true);
  const handleCloseImgModal = () => {
    setOpenimgModal(false);
    viewRoom ? "" : setImages([]);
  };
  const onSubmitDelete = async () => {
    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/v0/admin/rooms/${roomID}`,
        {
          headers: requestHeaders,
        }
      );

      getRooms();
      handleCloseDelete();
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail add");
      }
    }
  };
  const getRooms = async () => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/admin/rooms?page=1&size=1000`,
        {
          headers: requestHeaders,
        }
      );

      const reRenderRooms = data.data.rooms.map((room: RoomsInterface) => ({
        ...room,
        dataroom: {
          _id: room._id,
          roomNumber: room.roomNumber,
          price: room.price,
          capacity: room.capacity,
          discount: room.discount,
          facilities: room.facilities,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          createdBy: room.createdBy.userName,
          images: room?.images,
        },
      }));
      setRooms(reRenderRooms);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail adding");
      }
    }
  };
  const columns = [
    {
      name: "roomNumber",
      label: "Room Name",
    },
    {
      name: "images",
      label: "Images",
      options: {
        filter: false,
        customBodyRender: (value: string[]) => (
          <Tooltip title="view images" placement="top">
            <IconButton
              onClick={() => {
                setImages(value);
                handleOpenImgModal();
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={value[0]}
                sx={{ width: 56, height: 56, cursor: "pointer" }}
              />
            </IconButton>
          </Tooltip>
        ),
      },
    },
    {
      name: "facilities",
      label: "Facilities",
      options: {
        filter: false,
        customBodyRender: (value: [{ name: string }]) => (
          <>
            <Button
              onClick={() => {
                setFacilities(value);
                handleOpenFacModal();
              }}
              variant="text"
              color="primary"
            >
              Facilities
            </Button>
          </>
        ),
      },
    },
    {
      name: "price",
      label: "Price",
    },
    {
      name: "capacity",
      label: "Capacity",
    },
    {
      name: "discount",
      label: "Discount",
    },

    {
      name: "dataroom",
      label: "Action",
      options: {
        filter: false,
        customBodyRender: (value: RoomsInterface) => {
          return (
            <>
              <RemoveRedEyeSharp
                onClick={() => {
                  setViewRoom(value);
                  setImages(value.images);
                  setFacilities(value.facilities);
                  handleOpenViewModal();
                }}
                sx={{ cursor: "pointer" }}
              />
              <DeleteForever
                onClick={() => {
                  handleDelete(value._id, value.roomNumber);
                }}
                sx={{ mx: 2, cursor: "pointer" }}
              />
              <Draw
                onClick={() =>
                  navigate("/dashboard/room-data", {
                    state: { roomData: value },
                  })
                }
                sx={{ cursor: "pointer" }}
              />
            </>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30, rooms.length],
    responsive: "vertical",
    download: false,
    print: false,
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <>
      <Box component={`section`} width="100%">
        <Box p={3} component={"header"} boxShadow={1}>
          <Grid container rowSpacing={2}>
            <Grid
              display={"flex"}
              justifyContent={{ sm: "start", xs: "center" }}
              item
              xs={12}
              sm={6}
              md={6}
            >
              <Typography variant="h5" fontWeight={"500"}>
                Rooms Table Details
                <Typography variant="body1">
                  You can check all details
                </Typography>
              </Typography>
            </Grid>
            <Grid
              display={"flex"}
              justifyContent={{ sm: "end", xs: "center" }}
              item
              xs={12}
              sm={6}
              md={6}
            >
              <Button
                onClick={() => {
                  navigate("/dashboard/room-data");
                }}
                sx={{
                  py: 1,
                  px: 3,
                }}
                variant="contained"
                color="info"
              >
                Add New Room
              </Button>
            </Grid>
          </Grid>
        </Box>
        <CacheProvider value={muiCache}>
          <Box width={"90%"} mx={"auto"} my={8}>
            <MUIDataTable
              title={"Room List"}
              data={rooms}
              columns={columns}
              options={options}
            />
          </Box>
        </CacheProvider>
      </Box>
      {/* modal facilities */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openFacModal}
        onClose={handleCloseFacModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openFacModal}>
          <Box sx={styleModaleFac}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h1"
              >
                Room Facility
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleCloseFacModal}
                color="error"
              />
            </Box>
            <Box mt={3}>
              {facilities.length > 0 ? (
                facilities.map((fac) => (
                  <Typography
                    variant="h5"
                    key={fac.name}
                    bgcolor="#1976d21f"
                    margin={1}
                    padding={1}
                    sx={{ boxShadow: "1px 1px 1px 1px gray" }}
                    borderRadius={3}
                  >
                    {fac.name}
                  </Typography>
                ))
              ) : (
                <Typography variant="h5">Not Found Facilities</Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* modal image */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openImgModal}
        onClose={handleCloseImgModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openImgModal}>
          <Box sx={styleModalImages}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Room Images
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleCloseImgModal}
                color="error"
              />
            </Box>
            <Box mt={3}>
              <ImageList cols={1} sx={{ width: "100%", height: 650 }}>
                {images.length > 0
                  ? images.map((item) => (
                      <ImageListItem key={item}>
                        <img
                          srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item}?w=248&fit=crop&auto=format`}
                          alt="room-images"
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))
                  : "Not Found Images"}
              </ImageList>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* modal view */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openViewModal}
        onClose={handleCloseViewModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openViewModal}>
          <Box sx={styleModalView}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                View Room
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleCloseViewModal}
                color="error"
              />
            </Box>
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid xs={12} md={6} item className="room-image">
                  <Tooltip title="Click Me" placement="top">
                    <IconButton
                      onClick={() => handleOpenImgModal()}
                      sx={{ width: "100%" }}
                    >
                      <img
                        style={{ cursor: "pointer", maxHeight: "30vh" }}
                        width={"100%"}
                        src={images[0]}
                        alt="room-image"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  xs={12}
                  md={6}
                  item
                >
                  <Card
                    sx={{
                      padding: "7px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <PortraitIcon /> ID : {viewRoom._id}
                    </Typography>
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <AddHomeWorkIcon /> Name : {viewRoom.roomNumber}
                    </Typography>

                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <AttachMoneyIcon /> Price : {viewRoom.price}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={{ xs: 0, md: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <GroupIcon /> Capacity : {viewRoom.capacity}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <DiscountIcon /> Discount : {viewRoom.discount}
                </Typography>
                <Typography variant="h6">
                  Facilities :
                  {facilities.length > 0 ? (
                    facilities.map((fac) => (
                      <span
                        style={{
                          marginLeft: "3px",
                          background: "#90caf9",
                          borderRadius: "5px",
                          padding: "3px",
                        }}
                        key={fac.name}
                      >
                        {fac.name}
                      </span>
                    ))
                  ) : (
                    <span> Not Found Facilities</span>
                  )}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <FaceIcon /> Created By : {viewRoom?.createdBy}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <DoneIcon /> Created At :{" "}
                  {moment(viewRoom?.createdAt).format("llll")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <DoneAllIcon /> Updated At :{" "}
                  {moment(viewRoom?.updatedAt).fromNow()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* modal delete */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDelete}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDelete}>
          <Box sx={styleModaleFac}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {`Delete this ${roomName}`}
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleCloseDelete}
                color="error"
              />
            </Box>
            <Box py={4} textAlign={"center"}>
              <img src={delImg} alt="" />
              <Typography py={2} variant="body1">
                {` Delete This ${roomName} ?`}
              </Typography>
              <Typography variant="caption">
                are you sure you want to delete this item ? if you are sure just
                click on delete it
              </Typography>
            </Box>
            <Button
              onClick={onSubmitDelete}
              sx={{ display: "flex", ml: "auto" }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

const styleModaleFac = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
const styleModalView = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: "55%" },
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const styleModalImages = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: "65%" },
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
