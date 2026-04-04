import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  adsForm,
  AdsInterface,
  roomsInterface,
  UpdateAdsForm,
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
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { DeleteForever, Draw, HighlightOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import delImg from "../../../../../assets/images/noData.png";
import { getBaseUrl } from "../../../../../Utils/Utils";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
import { useTranslation } from "react-i18next";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function AdsList() {
  const { t } = useTranslation();
  const [ads, setAds] = useState<AdsInterface[]>([]);
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [adID, setAdID] = useState<string | null>(null);
  const [adName, setAdName] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [roomSelect, setRoomSelect] = useState("");
  const [isActiveSelect, setIsActiveSelect] = useState<string | boolean>("");
  const [totalCount, setTotalCount] = useState(10);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<adsForm, UpdateAdsForm>();
  const { requestHeaders } = useAuth();
  const handleRoomChange = (event: SelectChangeEvent) => {
    setRoomSelect(event.target.value as string);
  };

  const handleActiveChange = (event: SelectChangeEvent) => {
    const isActive = event.target.value === "true";
    setIsActiveSelect(isActive);
  };

  const handleOpen = () => setOpen(true);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleClose = () => {
    setOpen(false);
    setAdID(null);
    setAdName(null);
    setValue("room", "");
    setValue("discount", "");
    setValue("isActive", false);
    setIsUpdate(false);
    setRoomSelect("");
    setIsActiveSelect("");
  };

  const handleUpdate = (value: AdsInterface) => {
    setAdID(value._id);
    setAdName(value.room.roomNumber);
    handleOpen();
    setValue("discount", value.room.discount);
    setValue("isActive", value.isActive);
    setIsActiveSelect(String(value.isActive));
    setIsUpdate(true);
  };

  const handleDelete = (value: AdsInterface) => {
    setAdID(value._id);
    setAdName(value.room.roomNumber);
    handleOpenDelete();
  };

  const columns = [
    {
      name: `roomNumber`,
      label: t("adsTable.roomName"),
      options: {
        customBodyRender: (value: string) => {
          return value ? value : t("common.nothing");
        },
      },
    },
    {
      name: "price",
      label: t("adsTable.price"),
      options: {
        customBodyRender: (value: string) => {
          return value ? value : t("common.nothing");
        },
      },
    },
    {
      name: "discount",
      label: t("adsTable.discount"),
      options: {
        customBodyRender: (value: string) => {
          return value ? value : t("common.nothing");
        },
      },
    },
    {
      name: "capacity",
      label: t("adsTable.capacity"),
      options: {
        customBodyRender: (value: string) => {
          return value ? value : t("common.nothing");
        },
      },
    },
    {
      name: "isActive",
      label: t("adsTable.active"),
      options: {
        customBodyRender: (value: boolean) => {
          return value ? t("common.active") : t("common.inactive");
        },
      },
    },
    {
      name: "dataSingleAd",
      label: t("adsTable.actions"),
      options: {
        filter: false,
        customBodyRender: (value: AdsInterface) => {
          return (
            <>
              <DeleteForever
                onClick={() => {
                  handleDelete(value);
                }}
                sx={{ mr: 2, cursor: "pointer" }}
              />
              <Draw
                onClick={() => {
                  handleUpdate(value);
                }}
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
    rowsPerPageOptions: [10, 20, 30, ads.length],
    responsive: "vertical",
    download: false,
    print: false,
  };

  const getAds = useCallback(
    async (totalCount: number) => {
      try {
        const { data } = await axios.get(
          `${getBaseUrl()}/api/v0/admin/ads?page=1&size=${totalCount}`,
          {
            headers: requestHeaders,
          }
        );
        const reRenderAds = data.data.ads.map((ad: AdsInterface) => ({
          ...ad,
          dataAd: { id: ad._id, name: ad.room.roomNumber },
          isActive: ad.isActive,
          roomNumber: ad.room.roomNumber,
          capacity: ad.room.capacity,
          price: ad.room.price,
          discount: ad.room.discount,
          dataSingleAd: ad,
        }));
        setAds(reRenderAds);
        setTotalCount(data.data.totalCount);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Failed to fetch Ads");
        }
      }
    },
    [requestHeaders]
  );

  const getRooms = async () => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/admin/rooms?page=1&size=1000`,
        {
          headers: requestHeaders,
        }
      );
      const reRenderRooms = data.data.rooms.map((room: roomsInterface) => ({
        ...room,
        dataAd: { id: room._id, roomNumber: room.roomNumber },
        roomNumber: room.roomNumber,
        id: room._id,
      }));
      setRooms(reRenderRooms);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch Rooms");
      }
    }
  };

  const onSubmitAdd = async (data: adsForm) => {
    setSpinner(true);

    const adData = {
      room: data.room,
      discount: data.discount,
      isActive: data.isActive,
    };

    try {
      const res = await axios.post(`${getBaseUrl()}/api/v0/admin/ads`, adData, {
        headers: requestHeaders,
      });
      setSpinner(false);
      getAds(totalCount);
      handleClose();
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail add");
      }
      setSpinner(false);
    }
  };

  const onSubmitUpdate = async (data: adsForm) => {
    setSpinner(true);

    const updateData = {
      discount: data.discount,
      isActive: data.isActive,
    };

    try {
      const res = await axios.put(
        `${getBaseUrl()}/api/v0/admin/ads/${adID}`,
        updateData,
        {
          headers: requestHeaders,
        }
      );

      toast.success(res.data.message || "ad updated");
      getAds(totalCount);
      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "failed to Update");
      }
      setSpinner(false);
    }
    setSpinner(false);
  };

  const onSubmitDelete = async () => {
    setSpinner(true);

    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/v0/admin/ads/${adID}`,
        {
          headers: requestHeaders,
        }
      );

      getAds(totalCount);
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
    getAds(totalCount);
    getRooms();
  }, [totalCount]);

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
                {t("adsTable.title")}
                <Typography variant="body1">
                  {t("adsTable.subtitle")}
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
                {t("adsTable.addNewAds")}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <CacheProvider value={muiCache}>
          <Box width={"90%"} mx={"auto"} my={8}>
            <MUIDataTable
              title={t("adsTable.listTitle")}
              data={ads}
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
                {isUpdate ? t("adsTable.updateAd", { name: adName }) : t("adsTable.addAds")}
              </Typography>
              <HighlightOff
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
                color="error"
              />
            </Box>
            <Box
              py={3}
              onSubmit={handleSubmit(isUpdate ? onSubmitUpdate : onSubmitAdd)}
              component="form"
              noValidate
              autoComplete="off"
              width={"100%"}
            >
              {!isUpdate ? (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="demo-simple-select-label">{t("common.room")}</InputLabel>
                  <Controller
                    name="room"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Room is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        {...field}
                        id="demo-simple-select"
                        value={roomSelect}
                        label={t("common.room")}
                        onChange={(e) => {
                          handleRoomChange(e);
                          field.onChange(e);
                        }}
                      >
                        {rooms.map((room: roomsInterface) => (
                          <MenuItem key={room._id} value={room._id}>
                            {room.roomNumber}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.room && (
                    <Typography color="error">{errors.room.message}</Typography>
                  )}
                </FormControl>
              ) : null}

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="isActiveLabel">{t("adsTable.isActive")}</InputLabel>
                <Controller
                  name="isActive"
                  control={control}
                  defaultValue={isUpdate ? Boolean(isActiveSelect) : undefined}
                  rules={{ required: "isActive is required" }}
                  render={({ field }) => (
                    <Select
                      labelId="isActiveLabel"
                      {...field}
                      id="isActive-select"
                      value={String(isActiveSelect)}
                      label={t("adsTable.isActive")}
                      onChange={(e) => {
                        handleActiveChange(e);
                        field.onChange(e.target.value === "true");
                      }}
                    >
                      <MenuItem value={"false"}>false</MenuItem>
                      <MenuItem value={"true"}>true</MenuItem>
                    </Select>
                  )}
                />
                {errors.isActive && (
                  <Typography color="error">
                    {errors.isActive.message}
                  </Typography>
                )}
              </FormControl>

              <Controller
                name="discount"
                control={control}
                defaultValue=""
                rules={{ required: "Discount is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    id="filled-error"
                    label={t("common.discount")}
                    sx={{ mt: 3 }}
                    error={!!errors.discount}
                    helperText={errors.discount ? errors.discount.message : ""}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2, py: 1, display: "flex", ml: "auto" }}
              >
                {spinner ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("common.save")
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
                {t("adsTable.deleteAd", { name: adName })}
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
                {t("adsTable.deleteAd", { name: adName })}
              </Typography>
              <Typography variant="caption">
                {t("common.deleteConfirm")}
              </Typography>
            </Box>
            <Button
              onClick={onSubmitDelete}
              sx={{ display: "flex", ml: "auto" }}
              variant="contained"
              color="error"
            >
              {t("common.delete")}
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
