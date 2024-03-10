import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  DeleteForever,
  HighlightOff,
  RemoveRedEyeSharp,
} from "@mui/icons-material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import delImg from "../../../../assets/images/noData.png";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { BookingsInterface } from "../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../Utils/Utils";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function BookingsList() {
  const [bookings, setBookings] = useState<BookingsInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [viewedUser, setViewedUser] = useState<Partial<BookingsInterface>>({});
  const [deletedBook, setDeletedBook] = useState<Partial<BookingsInterface>>(
    {}
  );

  const { requestHeaders } = useAuth();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setOpenDelete(false);
  };

  const handleView = (value: BookingsInterface) => {
    setViewedUser(value);
    handleOpen();
  };

  const handleDelete = async (value: BookingsInterface) => {
    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/v0/admin/booking/${value._id}`,
        {
          headers: requestHeaders,
        }
      );

      toast.success(res.data.message || "Successfully deleted booking");
      getBookingsList(maxSize);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch bookings");
      }
    }
  };

  const columns = [
    {
      label: "Room Number",
      name: "roomNumber",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Price",
      name: "totalPrice",
      options: {
        customBodyRender: (value: number) => value,
      },
    },
    {
      label: "Start Date",
      name: "startDate",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "End Date",
      name: "endDate",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "User",
      name: "userName",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Action",
      name: "datauser",
      options: {
        filter: false,
        customBodyRender: (value: BookingsInterface) => (
          <>
            <RemoveRedEyeSharp
              onClick={() => {
                handleView(value);
              }}
              sx={{ cursor: "pointer" }}
            />
            <DeleteForever
              onClick={() => {
                setDeletedBook(value);
                setOpenDelete(true);
              }}
              sx={{ cursor: "pointer", marginLeft: "5px" }}
            />
          </>
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30, bookings.length],
    responsive: "vertical",
    download: false,
    print: false,
  };

  const getBookingsList = useCallback(
    async (maxSize: number) => {
      try {
        const { data } = await axios.get(
          `${getBaseUrl()}/api/v0/admin/booking?page=1&size=${maxSize}`,
          {
            headers: requestHeaders,
          }
        );
        setMaxSize(data.data.totalCount);
        const reRenderBookings =
          data.data.booking.length > 0 &&
          data.data.booking.map((booking: BookingsInterface) => ({
            ...booking,
            roomNumber: booking.room?.roomNumber,
            userName: booking.user?.userName,
            datauser: booking,
          }));

        setBookings(reRenderBookings);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(
            error.response.data.message || "Failed to fetch bookings"
          );
        }
      }
    },
    [requestHeaders]
  );

  useEffect(() => {
    getBookingsList(maxSize);
  }, [getBookingsList, maxSize]);

  return (
    <>
      <Box component="section" width="100%">
        <Box p={3} component="header" boxShadow={1}>
          <Grid container rowSpacing={2}>
            <Grid
              display="flex"
              justifyContent={{ sm: "start", xs: "center" }}
              item
              xs={12}
              sm={6}
              md={6}
            >
              <Typography variant="h5" fontWeight="500">
                Booking Table Details
                <Typography variant="body1">
                  You can check all details
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <CacheProvider value={muiCache}>
          <Box width="90%" mx="auto" my={8}>
            <MUIDataTable
              title={"Booking List"}
              data={bookings}
              columns={columns}
              options={options}
            />
          </Box>
        </CacheProvider>
      </Box>
      {/* Showing Booking Deatils In A Table */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Booking Details
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
                color="error"
              />
            </Box>
            <Box width="100%" sx={{ padding: "15px" }}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="booking details table"
                >
                  <TableBody>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="left">
                        {viewedUser?.user?.userName}
                        <Tooltip title={viewedUser?.user?._id} placement="top">
                          <IconButton sx={{ paddingTop: "3px !important" }}>
                            <ErrorOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Room Number</TableCell>
                      <TableCell align="left">
                        {viewedUser?.room?.roomNumber}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Price</TableCell>
                      <TableCell align="left">
                        {viewedUser.totalPrice}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Start Date</TableCell>
                      <TableCell align="left">{viewedUser.startDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>End Date</TableCell>
                      <TableCell align="left">{viewedUser.endDate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/*Delete Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDelete}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDelete}>
          <Box sx={style}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Will you Delete
                <span
                  style={{
                    color: "#c62828",
                    margin: "0 5px",
                    fontWeight: "bold",
                  }}
                >
                  {deletedBook.user?.userName} 's
                </span>
                Book ? 😢
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenDelete(false)}
                color="error"
              />
            </Box>
            <Box py={4} textAlign={"center"}>
              <Box>
                <img src={delImg} alt="" />
              </Box>
              <Typography variant="caption">
                are you sure you want to delete this item ? if you are sure just
                click on delete it
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleDelete(deletedBook);
                setOpenDelete(false);
              }}
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

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  maxWidth: "100%",
};
