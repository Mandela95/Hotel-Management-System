import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { FormData } from "../../../../Interfaces/interFaces";
import {
  emailValidation,
  passwordValidation,
} from "../../../../Utils/InputValidations";
import { getBaseUrl } from "../../../../Utils/Utils";
import logoDark from "../../../../assets/images/logo-dark.svg";
import logoLight from "../../../../assets/images/logo-light.svg";
import Style from "../Auth.module.css";

export default function Signin() {
  const { savLoginData } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem("theme");
    if (value === "dark" || value === null) return true;
    return false;
  });
  const [showPassword, setShowPassword] = useState("password");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const navigate = useNavigate();

  const signUpWaitToast = {
    onClose: () => setIsClicked(false),
  };

  const navigateTolayout = (userInfo: string) => {
    userInfo === "admin" ? navigate("/dashboard") : navigate("/");
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSpinner(true);
    setIsClicked(true);
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/v0/admin/users/login`,
        data
      );
      localStorage.setItem("token", res.data.data.token);
      setSpinner(false);
      toast.success(res.data.message, signUpWaitToast);
      navigateTolayout(res.data.data.user.role);
      savLoginData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "fail signin",
          signUpWaitToast
        );
      }
      setSpinner(false);
    }
  };

  return (
    <>
      <Box
        component={"section"}
        minHeight={"100vh"}
        sx={{ pt: { xs: "0px", md: "24px" } }}
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
          height={"96vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            width={"100%"}
            height={"100%"}
            item
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            xs={12}
            md={6}
            className={`${Style.signIn}`}
          >
            <Box width={{ md: "65%", xs: "90%" }}>
              <Box>
                <Typography mb={3} fontWeight={"500"} variant="h5">
                  Sign in
                </Typography>
                <Typography fontWeight={"500"} variant="body2">
                  If you don’t have an account register
                </Typography>
                <Typography
                  display={"flex"}
                  alignItems={"center"}
                  fontWeight={"500"}
                  variant="body2"
                >
                  You can
                  <Button variant="text" color={"primary"}>
                    <Link
                      style={{ textDecoration: "none", color: "inherit" }}
                      to={"/auth/signup"}
                    >
                      Register here !
                    </Link>
                  </Button>
                </Typography>
                {/* login form */}
                <Box
                  className="auth"
                  onSubmit={handleSubmit(onSubmit)}
                  component="form"
                  noValidate
                  autoComplete="off"
                  width={"100%"}
                >
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
                        id="filled-error"
                        label="E-mail"
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
                          id="outlined-adornment-password"
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
                  {errors.password && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors.password.message}
                    </Typography>
                  )}

                  <Button
                    sx={{ display: "block", ml: "auto", mt: "1rem" }}
                    variant="text"
                    color={"primary"}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "inherit" }}
                      to={"/auth/forget-password"}
                    >
                      Forgot Password ?
                    </Link>
                  </Button>
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
                      "Login"
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
            className={`${Style.signInCol}`}
          >
            <Box position={"absolute"} top={"80%"} left={"10%"}>
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "#FDFFFC",
                  fontSize: { lg: "2.5rem", md: "2.2rem" },
                }}
              >
                Sign in to Roamhome
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
