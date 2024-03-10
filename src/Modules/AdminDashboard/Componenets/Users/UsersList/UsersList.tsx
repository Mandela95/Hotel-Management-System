import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { HighlightOff, RemoveRedEyeSharp } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
import { UsersInterface } from "../../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../../Utils/Utils";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function UsersList() {
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [viewedUser, setViewedUser] = useState<UsersInterface>({});

  const { requestHeaders } = useAuth();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = (value: UsersInterface) => {
    setViewedUser(value);
    handleOpen();
  };

  const columns = [
    {
      label: "User Name",
      name: "userName",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Email",
      name: "email",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Country",
      name: "country",
      options: {
        customBodyRender: (value: string) => value,
      },
    },
    {
      label: "Profile Image",
      name: "profileImage",
      options: {
        customBodyRender: (value: string) => (
          <img src={value} alt="Profile" width="50" height="50" />
        ),
      },
    },
    {
      name: "datauser",
      label: "Action",
      options: {
        filter: false,
        customBodyRender: (value: UsersInterface) => (
          <>
            <RemoveRedEyeSharp
              onClick={() => handleView(value)}
              sx={{ cursor: "pointer" }}
            />
          </>
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30, users.length],
    responsive: "vertical",
    download: false,
    print: false,
  };

  const getUsersList = useCallback(
    async (maxSize: number) => {
      try {
        const { data } = await axios.get(
          `${getBaseUrl()}/api/v0/admin/users?page=1&size=${maxSize}`,
          {
            headers: requestHeaders,
          }
        );
        setMaxSize(data.data.totalCount);
        const reRenderUsers = data.data.users.map((user: UsersInterface) => ({
          ...user,
          datauser: {
            id: user._id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            country: user.country,
            profileImage: user.profileImage,
          },
        }));
        setUsers(reRenderUsers);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "fail in api request");
        }
      }
    },
    [requestHeaders]
  );

  useEffect(() => {
    getUsersList(maxSize);
  }, [getUsersList, maxSize]);

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
                Users Table Details
                <Typography variant="body1">
                  You can check all details
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {/*Rendering The data table */}
        <CacheProvider value={muiCache}>
          <Box width="90%" mx="auto" my={8}>
            <MUIDataTable
              title={"Users List"}
              data={users}
              columns={columns}
              options={options}
            />
          </Box>
        </CacheProvider>
      </Box>

      {/* modal view */}
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
                User Details
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
                color="error"
              />
            </Box>
            <Box width="100%" sx={{ padding: "8px" }}>
              <Box
                sx={{ textAlign: "center" }}
                maxHeight="50vh !important"
                maxWidth="70vw !important"
              >
                <img
                  src={viewedUser.profileImage}
                  alt="iamge"
                  style={{
                    margin: "auto",
                    maxWidth: "70vw",
                    maxHeight: "50vh",
                  }}
                />
              </Box>
              <Stack direction="column" spacing={2} sx={{ padding: "15px" }}>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography> User Name : </Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser.userName}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography> Email : </Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser.email}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography> Country : </Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser.country}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography> Phone Number : </Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser.phoneNumber}
                  </Typography>
                </Box>
              </Stack>
            </Box>
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
};
