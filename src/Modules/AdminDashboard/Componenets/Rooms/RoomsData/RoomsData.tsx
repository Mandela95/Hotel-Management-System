import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../Context/AuthContext/AuthContext";
import {
  CreateRoom,
  FacilitiesInterface,
} from "../../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../../Utils/Utils";
import style from "../Rooms.module.css";

export default function RoomsData() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [facilities, setFacilities] = useState<FacilitiesInterface[]>([]);
  const { requestHeaders } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateRoom>();
  const roomData = location.state?.roomData;
  const resetFormValue = () => {
    if (roomData) {
      reset({
        roomNumber: roomData.roomNumber,
        price: roomData.price,
        capacity: roomData.capacity,
        discount: roomData.discount,
        facilities: roomData.facilities.map(
          (fac: FacilitiesInterface) => fac._id
        ),
      });
    }
  };

  const getFacilities = async () => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/admin/room-facilities?page=1&size=1000`,
        {
          headers: requestHeaders,
        }
      );
      setFacilities(data.data.facilities);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail get facilities");
      }
    }
  };
  const onSubmit = async (data: CreateRoom) => {
    setSpinner(true);
    setIsClicked(true);
    const roomFormData = appendToFormData(data);
    try {
      const res = await axios({
        method: roomData ? "put" : "post",
        url: roomData
          ? `${getBaseUrl()}/api/v0/admin/rooms/${roomData._id}`
          : `${getBaseUrl()}/api/v0/admin/rooms`,
        data: roomFormData,
        headers: requestHeaders,
      });
      setSpinner(false);
      toast.success(res.data.message);
      navigate("/dashboard/rooms");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail adding");
      }
      setSpinner(false);
    }
    setIsClicked(false);
  };
  const appendToFormData = (data: CreateRoom) => {
    const formData = new FormData();
    formData.append("roomNumber", data.roomNumber);
    formData.append("price", data.price);
    formData.append("capacity", data.capacity);
    formData.append("discount", data.discount);
    for (let i = 0; i < data.facilities.length; i++) {
      formData.append("facilities", data.facilities[i]);
    }
    for (let i = 0; i < data.imgs.length; i++) {
      formData.append("imgs", data.imgs[i]);
    }
    return formData;
  };
  useEffect(() => {
    getFacilities();
    resetFormValue();
    selectedImages.length > 5 ? setIsClicked(true) : setIsClicked(false);
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
                Add Room
                <Typography variant="body1">You can add new room</Typography>
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
                  navigate("/dashboard/rooms");
                }}
                sx={{
                  py: 1,
                  px: 3,
                }}
                variant="contained"
                color="info"
              >
                Back to Rooms
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box width={"90%"} mx={"auto"} mt={8}>
          <Box
            onSubmit={handleSubmit(onSubmit)}
            component="form"
            noValidate
            autoComplete="off"
            width={"100%"}
          >
            <Controller
              name="roomNumber"
              control={control}
              defaultValue=""
              rules={{
                required: "Room Number is rrquiers",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="text"
                  label="Room Numbe"
                  sx={{ mt: 3 }}
                  error={!!errors.roomNumber}
                />
              )}
            />
            {errors?.roomNumber && (
              <Typography sx={{ ml: 2 }} variant="caption" color="error">
                {errors?.roomNumber?.message}
              </Typography>
            )}
            <Grid container columnSpacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="price"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Price is rrquiers",
                    pattern: {
                      value: /^[\d]{1,9}$/gm,
                      message: "Price only numbers",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      label="Price"
                      sx={{ mt: 3 }}
                      error={!!errors.price}
                    />
                  )}
                />
                {errors?.price && (
                  <Typography sx={{ ml: 2 }} variant="caption" color="error">
                    {errors?.price?.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="capacity"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Capacity Is Required",
                    pattern: {
                      value: /^[\d]{1,9}$/gm,
                      message: "Capacity only numbers",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      label="Capacity"
                      sx={{ mt: 3 }}
                      error={!!errors.capacity}
                      helperText={
                        errors.capacity ? errors.capacity?.message : ""
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="discount"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Discount is rrquiers",
                    pattern: {
                      value: /^[\d]{1,9}$/gm,
                      message: "Discount only numbers",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      label="Discount"
                      sx={{ mt: 3 }}
                      error={!!errors.discount}
                    />
                  )}
                />
                {errors?.discount && (
                  <Typography sx={{ ml: 2 }} variant="caption" color="error">
                    {errors?.discount?.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="facilities"
                  control={control}
                  defaultValue={[]}
                  type="text"
                  rules={{
                    required: "Facilities Is Required",
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.facilities}
                      sx={{ mt: 3 }}
                      fullWidth
                    >
                      <InputLabel id="facilities">Facilities</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        labelId="facilities"
                        label="facilities"
                        multiple
                      >
                        {facilities.map((fac) => (
                          <MenuItem selected value={fac._id} key={fac._id}>
                            {fac.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors?.facilities && (
                  <Typography sx={{ ml: 2 }} variant="caption" color="error">
                    {errors?.facilities?.message}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* image  */}
            <Box className={style.formImage}>
              <Box width={"100%"} className="mb-2">
                <input
                  {...register("imgs", {
                    required: "Images is Required",
                  })}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = e.target.files;
                    const selectedFilesArr = Array.from(selectedFiles);
                    const imgsArr = selectedFilesArr.map((img) => {
                      return URL.createObjectURL(img);
                    });
                    setSelectedImages(imgsArr);
                    selectedFilesArr?.length > 5
                      ? setIsClicked(true)
                      : setIsClicked(false);
                  }}
                />

                <Box
                  py={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    width={"70px"}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <CloudUpload />
                  </Box>
                  <span>Choose an Item Images to Upload</span>
                </Box>
                {selectedImages.length > 0 && (
                  <>
                    <Box display={"flex"} mb={1} justifyContent={"center"}>
                      <Typography variant="h6">You selected </Typography>
                      <Typography
                        ml={1}
                        variant="h6"
                        sx={{
                          color: selectedImages.length > 5 ? "red" : "#203fc7",
                        }}
                      >
                        {selectedImages.length} images
                      </Typography>
                    </Box>
                    {selectedImages.length > 5 && (
                      <Typography
                        mb={1}
                        textAlign={"center"}
                        variant="body1"
                        color="error"
                      >
                        You cannot select more than 5 images, please re-select 5
                        images again
                      </Typography>
                    )}
                  </>
                )}
                <Box display={"flex"} justifyContent={"center"}>
                  {selectedImages &&
                    selectedImages.map((img, i) => {
                      return (
                        <Box display={"flex"} mx={1} key={i}>
                          <Box sx={{ flexGrow: 1 }}>
                            <img
                              width={"100%"}
                              height={"100px"}
                              src={img}
                              alt="room-images"
                            />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </Box>

              {errors.imgs && (
                <Typography sx={{ ml: 2 }} variant="caption" color="error">
                  {errors.imgs.message}
                </Typography>
              )}
              {roomData && selectedImages.length === 0 && (
                <span
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  Upload new images please !!
                </span>
              )}
            </Box>

            <Box
              mt={3}
              mx={"auto"}
              width={"70%"}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Button
                onClick={() => {
                  navigate("/dashboard/rooms");
                }}
                type="button"
                sx={{ py: 1, px: 5, fontSize: "1rem", fontWeight: "600" }}
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  ml: 2,
                  py: 1,
                  px: 5,
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                disabled={isClicked}
              >
                {spinner ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
