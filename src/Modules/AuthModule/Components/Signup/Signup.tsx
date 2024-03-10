import {
  CloudUpload,
  DeleteForever,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { RegisterFormData } from "../../../../Interfaces/interFaces";
import { getBaseUrl } from "../../../../Utils/Utils";
import logoDark from "../../../../assets/images/logo-dark.svg";
import logoLight from "../../../../assets/images/logo-light.svg";
import Style from "../Auth.module.css";
import {
  emailValidation,
  passwordValidation,
  phoneNumberValidation,
  userNameValidation,
} from "../../../../Utils/InputValidations";

export default function Signup() {
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem("theme");
    if (value === "dark" || value === null) return true;
    return false;
  });
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No Selected File");
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUpWaitToast = {
    onClose: () => setIsClicked(false),
  };
  const resetSecretKey = () => {
    setValue("role", "");
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setSpinner(true);
    setIsClicked(true);
    const registerFormData = appendToFormData(data);

    console.log(registerFormData);
    try {
      const response = await axios.post(
        `${getBaseUrl()}/api/v0/admin/users`,
        registerFormData
      );
      setSpinner(false);
      toast.success(response.data.message, signUpWaitToast);
      navigate("/auth");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Cannot Reset Password",
          signUpWaitToast
        );
      }
      setSpinner(false);
    }
  };

  const appendToFormData = (data: RegisterFormData) => {
    const UserRole = data.role === "0123456" ? "admin" : "user";
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("country", data.country);
    formData.append("role", UserRole);
    formData.append("profileImage", data.profileImage[0]);
    return formData;
  };

  return (
    <>
      <Box
        component={"section"}
        minHeight={"100vh"}
        sx={{ pt: { xs: "0px", md: "24px" } }}
        className={`${Style.signInBody}`}
      >
        <Box
          sx={{ display: { xs: "none", md: "block" } }}
          left={50}
          top={30}
          position={"absolute"}
        >
          <img width={"150px"} src={isDark ? logoDark : logoLight} alt="logo" />
        </Box>
        <Box
          sx={{ display: { xs: "block", md: "none" } }}
          left={50}
          top={30}
          position={"absolute"}
        >
          <img width={"150px"} src={logoDark} alt="logo" />
        </Box>
        <Grid
          container
          minHeight={"96vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            pt={8}
            width={"100%"}
            height={"100%"}
            item
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            xs={12}
            md={6}
            className={`${Style.signUp} ${Style.ptXs}`}
          >
            <Box
              width={{ md: "65%", xs: "90%" }}
              onSubmit={handleSubmit(onSubmit)}
              component="form"
              noValidate
            >
              <Box>
                <Stack
                  display={"flex"}
                  flexDirection={"row"}
                  gap={1}
                  alignItems={"center"}
                  width={"100%"}
                  justifyContent={"space-between"}
                  marginBottom={2}
                >
                  <Typography fontWeight={"500"} variant="h5">
                    Sign up
                  </Typography>
                  <Button
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => {
                      setShowSecret(!showSecret);
                      resetSecretKey();
                    }}
                  >
                    {showSecret ? "As user ?" : "sercret key"}
                  </Button>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    rules={{
                      pattern: {
                        value: /0123456/,
                        message: "Key Must Match To Provided",
                      },
                      required: false,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label="Secret Key"
                        sx={{
                          maxWidth: "50%",
                          display: `${showSecret ? "block" : "none"}`,
                        }}
                        error={!!errors.role}
                        helperText={errors?.role?.message}
                      />
                    )}
                  />
                </Stack>
                {errors?.userName && (
                  <Typography
                    sx={{ ml: 2, textAlign: "right" }}
                    variant="caption"
                    color="error"
                  >
                    {errors?.userName?.message}
                  </Typography>
                )}
                <Typography fontWeight={"500"} variant="body2">
                  If you already have an account register
                </Typography>
                <Typography
                  display={"flex"}
                  alignItems={"center"}
                  fontWeight={"500"}
                  variant="body2"
                >
                  You can
                  <Button variant="text" color={"error"}>
                    <Link
                      style={{ textDecoration: "none", color: "inherit" }}
                      to={"/auth"}
                    >
                      Login here !
                    </Link>
                  </Button>
                </Typography>
                {/* login form */}
                <Box className="auth" autoComplete="off" width={"100%"}>
                  <Controller
                    name="userName"
                    control={control}
                    defaultValue=""
                    rules={userNameValidation}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        label="User Name"
                        sx={{ mt: 3 }}
                        error={!!errors.userName}
                      />
                    )}
                  />
                  {errors?.userName && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.userName?.message}
                    </Typography>
                  )}
                  <Grid container columnSpacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        defaultValue=""
                        rules={phoneNumberValidation}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="text"
                            label="Phone Number"
                            sx={{ mt: 3 }}
                            error={!!errors.phoneNumber}
                          />
                        )}
                      />
                      {errors?.phoneNumber && (
                        <Typography
                          sx={{ ml: 2 }}
                          variant="caption"
                          color="error"
                        >
                          {errors?.phoneNumber?.message}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Country Is Required",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="text"
                            label="Country"
                            sx={{ mt: 3 }}
                            error={!!errors.country}
                            helperText={
                              errors.country ? errors.country?.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={emailValidation}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        label="E-mail Address"
                        sx={{ mt: 3 }}
                        error={!!errors.email}
                      />
                    )}
                  />
                  {errors?.email && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.email?.message}
                    </Typography>
                  )}
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={passwordValidation}
                    render={({ field }) => (
                      <FormControl
                        sx={{ mt: 3 }}
                        error={!!errors.password}
                        fullWidth
                        {...field}
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          type={showPassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setShowPassword(
                                    showPassword === "password"
                                      ? "text"
                                      : "password"
                                  );
                                }}
                                edge="end"
                              >
                                {showPassword === "password" ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    )}
                  />
                  {errors?.password && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.password.message}
                    </Typography>
                  )}
                  {/* confirm password */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "ConfirmPassword Is Required",
                      validate: (value) =>
                        value === watch("password") ||
                        "Confirm Password do not match",
                    }}
                    render={({ field }) => (
                      <FormControl
                        sx={{ mt: 3 }}
                        error={!!errors.confirmPassword}
                        fullWidth
                        {...field}
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          type={showConfirmPassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setShowConfirmPassword(
                                    showConfirmPassword === "password"
                                      ? "text"
                                      : "password"
                                  );
                                }}
                                edge="end"
                              >
                                {showConfirmPassword === "password" ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirm Password"
                        />
                      </FormControl>
                    )}
                  />
                  {errors?.confirmPassword && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.confirmPassword?.message}
                    </Typography>
                  )}
                  {/* image  */}
                  <Box className={Style.formImage}>
                    <Box className="mb-2">
                      <input
                        {...register("profileImage", {
                          required: "Image is Required",
                        })}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFileName(file.name);
                            setImage(URL.createObjectURL(file));
                          }
                        }}
                      />
                      {image ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <img
                            src={image}
                            width={60}
                            height={60}
                            alt={fileName}
                          />
                        </Box>
                      ) : (
                        <Box
                          py={1}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <CloudUpload />
                          <span>Choose an Item Image to Upload</span>
                        </Box>
                      )}
                    </Box>
                    <span>
                      {fileName}
                      {image ? (
                        <DeleteForever
                          color="error"
                          sx={{ ml: ".6rem", cursor: "pointer" }}
                          onClick={() => {
                            setFileName("No Selected File");
                            setImage(null);
                          }}
                        />
                      ) : null}
                    </span>
                    {errors.profileImage && (
                      <Typography
                        sx={{ ml: 2 }}
                        variant="caption"
                        color="error"
                      >
                        {errors.profileImage.message}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, mb: 2, py: 1 }}
                    disabled={isClicked}
                  >
                    {spinner ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            position={"relative"}
            sx={{
              display: { xs: "none", md: "block" },
            }}
            item
            xs={12}
            md={6}
            className={`${Style.signUPCol}`}
          >
            <Box position={"absolute"} top={"80%"} left={"10%"}>
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "#FDFFFC",
                  fontSize: { lg: "2.5rem", md: "2.2rem" },
                }}
              >
                Sign up to Roamhome
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "#FDFFFC",
                  fontSize: "1.3rem",
                }}
              >
                Homes as unique as you.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
