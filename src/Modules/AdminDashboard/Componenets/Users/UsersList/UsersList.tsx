import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { HighlightOff, RemoveRedEyeSharp } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
import { UsersInterface } from "../../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../../Utils/Utils";
import { useTranslation } from "react-i18next";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function UsersList() {
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [viewedUser, setViewedUser] = useState<UsersInterface>();
  const { requestHeaders } = useAuth();
  const { t } = useTranslation();

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
      label: t("usersTable.userName"),
      name: "userName",
    },
    {
      label: t("usersTable.email"),
      name: "email",
    },
    {
      label: t("usersTable.phoneNumber"),
      name: "phoneNumber",
    },
    {
      label: t("usersTable.country"),
      name: "country",
    },
    {
      label: t("usersTable.profileImage"),
      name: "profileImage",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string) => (
          <img src={value} alt="Profile" width="50" height="50" style={{ borderRadius: "50%", objectFit: "cover" }} />
        ),
      },
    },
    {
      name: "datauser",
      label: t("usersTable.action"),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: UsersInterface) => (
          <RemoveRedEyeSharp
            onClick={() => handleView(value)}
            sx={{ cursor: "pointer" }}
          />
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none" as const,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30, users.length],
    responsive: "standard" as const,
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
                {t("usersTable.title")}
                <Typography variant="body1">
                  {t("usersTable.subtitle")}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {/*Rendering The data table */}
        <CacheProvider value={muiCache}>
          <Box
            sx={{
              width: "95%",
              mx: "auto",
              my: 4,
              "& .MuiPaper-root": {
                boxShadow: 2,
                borderRadius: 2,
                overflowX: "hidden",
              },
              "& .MuiToolbar-root, & thead, & tbody, & tfoot, & table": {
                direction: "inherit",
              },
              "& .MuiTableContainer-root": {
                overflowX: "auto",
              },
              "& td, & th": {
                whiteSpace: "nowrap",
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                px: { xs: 1, sm: 2 },
                textAlign: "start !important",
              },
              "& th span": {
                justifyContent: "start !important",
              },
            }}
          >
            <MUIDataTable
              title={t("usersTable.listTitle")}
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
          <Box sx={style} width={{ xs: "90%", md: "40%" }} maxHeight="80vh !important" overflow="auto">
            <Box display="flex" justifyContent="space-between">
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {t("usersTable.userDetails")}
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
                color="error"
              />
            </Box>
            <Box width="100%" sx={{ padding: "8px" }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <img
                  src={viewedUser?.profileImage}
                  alt="profile"
                  style={{
                    margin: "auto",
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography>{t("usersTable.userName")}:</Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser?.userName}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography>{t("usersTable.email")}:</Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser?.email}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography>{t("usersTable.country")}:</Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser?.country}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center">
                  <Typography>{t("usersTable.phoneNumber")}:</Typography>
                  <Typography fontWeight="bold" color="teal" paddingLeft={1}>
                    {viewedUser?.phoneNumber}
                  </Typography>
                </Box>
              </Box>
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
