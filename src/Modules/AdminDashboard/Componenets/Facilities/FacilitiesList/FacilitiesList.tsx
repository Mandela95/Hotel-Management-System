import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  FacilitiesInterface,
  facilitiesForm,
} from "../../../../../Interfaces/interFaces";
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
  TextField,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { DeleteForever, Draw, HighlightOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import delImg from "../../../../../assets/images/noData.png";
import { getBaseUrl } from "../../../../../Utils/Utils";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function FacilitiesList() {
  const [facilities, setFacilities] = useState<FacilitiesInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [facID, setFacID] = useState<string | null>(null);
  const [facName, setFacName] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(10);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<facilitiesForm>();

  const { requestHeaders } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleClose = () => {
    setOpen(false);
    setFacID(null);
    setFacName(null);
    setValue("name", "");
    setIsUpdate(false);
  };
  const handleUpdate = (id: string, name: string) => {
    setFacID(id);
    setFacName(name);
    handleOpen();
    setValue("name", name);
    setIsUpdate(true);
  };
  const handleDelete = (id: string, name: string) => {
    setFacID(id);
    setFacName(name);
    handleOpenDelete();
  };
  const columns = [
    {
      name: "name",
      label: "Name",
    },
    {
      name: "createdAt",
      label: "Created At",
      options: {
        customBodyRender: (value: string) => moment(value).format("ll"),
      },
    },
    {
      label: "Updated At",
      name: "updatedAt",
      options: {
        customBodyRender: (value: string) => moment(value).fromNow(),
      },
    },
    {
      label: "Created By",
      name: "createdBy",
      options: {
        customBodyRender: (value: { userName: string }) => value.userName,
      },
    },
    {
      name: "datafac",

      label: "Action",
      options: {
        filter: false,
        customBodyRender: (value: { id: string; name: string }) => {
          return (
            <>
              <DeleteForever
                onClick={() => handleDelete(value.id, value.name)}
                sx={{ mr: 2, cursor: "pointer" }}
              />
              <Draw
                onClick={() => handleUpdate(value.id, value.name)}
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
    rowsPerPageOptions: [10, 20, 30, facilities.length],
    responsive: "vertical",
    download: false,
    print: false,
  };

  const getFacilities = useCallback(async (totalCount: number) => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/admin/room-facilities?page=1&size=${totalCount}`,
        {
          headers: requestHeaders,
        }
      );
      setTotalCount(data.data.totalCount);
      const reRenderFacilities = data.data.facilities.map(
        (fac: FacilitiesInterface) => ({
          ...fac,
          datafac: { id: fac._id, name: fac.name },
        })
      );
      setFacilities(reRenderFacilities);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "failed to get facilities");
      }
    }
  }, []);

  const onSubmitAdd = async (data: facilitiesForm) => {
    setSpinner(true);

    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/v0/admin/room-facilities`,
        data,
        {
          headers: requestHeaders,
        }
      );
      setSpinner(false);
      getFacilities(totalCount);
      handleClose();
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail add");
      }
      setSpinner(false);
    }
  };
  const onSubmitUpdate = async (data: facilitiesForm) => {
    setSpinner(true);

    try {
      const res = await axios.put(
        `${getBaseUrl()}/api/v0/admin/room-facilities/${facID}`,
        data,
        {
          headers: requestHeaders,
        }
      );

      getFacilities(totalCount);
      handleClose();
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail add");
      }
      setSpinner(false);
    }
    setSpinner(false);
  };
  const onSubmitDelete = async () => {
    setSpinner(true);

    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/v0/admin/room-facilities/${facID}`,
        {
          headers: requestHeaders,
        }
      );

      getFacilities(totalCount);
      handleCloseDelete();
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail add");
      }
      setSpinner(false);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getFacilities(totalCount);
  }, [getFacilities, totalCount]);

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
                Facilities Table Details
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
                onClick={handleOpen}
                sx={{
                  py: 1,
                  px: 3,
                }}
                variant="contained"
                color="info"
              >
                Add New Facility
              </Button>
            </Grid>
          </Grid>
        </Box>
        <CacheProvider value={muiCache}>
          <Box width={"90%"} mx={"auto"} my={8}>
            <MUIDataTable
              title={"Facilities List"}
              data={facilities}
              columns={columns}
              options={options}
            />
          </Box>
        </CacheProvider>
      </Box>

      {/* modal add and edit */}
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
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {isUpdate ? `Update this ${facName}` : " Add Facility"}
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
                color="error"
              />
            </Box>
            <Box
              py={3}
              onSubmit={handleSubmit(!isUpdate ? onSubmitAdd : onSubmitUpdate)}
              component="form"
              noValidate
              autoComplete="off"
              width={"100%"}
            >
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is requierd" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    id="filled-error"
                    label="Name"
                    sx={{ mt: 3 }}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name?.message : ""}
                  />
                )}
              />
              {errors?.name && (
                <Typography sx={{ ml: 2 }} variant="caption" color="error">
                  {errors?.name?.message}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2, py: 1, display: "flex", ml: "auto" }}
              >
                {spinner ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
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
          <Box sx={style}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Delete this
                <span style={{ color: "#c62828" }}> {facName} </span>
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
                {` Delete This ${facName} ?`}
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

const style = {
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
