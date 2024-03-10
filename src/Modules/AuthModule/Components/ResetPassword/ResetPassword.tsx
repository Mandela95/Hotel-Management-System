import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ResetPassInterFace } from "../../../../Interfaces/interFaces";
import {
  emailValidation,
  otpValidation,
  passwordValidation,
} from "../../../../Utils/InputValidations";
import { getBaseUrl } from "../../../../Utils/Utils";
import logoDark from "../../../../assets/images/logo-dark.svg";
import logoLight from "../../../../assets/images/logo-light.svg";
import Style from "../Auth.module.css";

export default function ResetPassword() {
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem("theme");
    if (value === "dark" || value === null) return true;
    return false;
  });
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUpWaitToast = {
    onClose: () => setIsClicked(false),
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ResetPassInterFace>();

  const onSubmit = async (data: ResetPassInterFace) => {
    setSpinner(true);
    setIsClicked(true);
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/v0/admin/users/reset-password`,
        data
      );
      setSpinner(false);
      toast.success(res.data.message, signUpWaitToast);
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
            className={`${Style.forgetPass} `}
          >
            <Box width={{ md: "65%", xs: "90%" }}>
              <Box>
                <Typography mb={3} fontWeight={"500"} variant="h5">
                  Sign up
                </Typography>
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
                        label="E-mail"
                        sx={{ mt: 3 }}
                        error={!!errors.email}
                      />
                    )}
                  />
                  {errors?.email && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.email.message}
                    </Typography>
                  )}
                  <Controller
                    name="seed"
                    control={control}
                    defaultValue=""
                    rules={otpValidation}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        label="OPT"
                        sx={{ mt: 3 }}
                        error={!!errors.seed}
                      />
                    )}
                  />
                  {errors?.seed && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors?.seed.message}
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
                  {errors.password && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors.password.message}
                    </Typography>
                  )}
                  {/* confirm password */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Confirm Password is required",
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
                  {errors.confirmPassword && (
                    <Typography sx={{ ml: 2 }} variant="caption" color="error">
                      {errors.confirmPassword.message}
                    </Typography>
                  )}

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
                      "Reset"
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
            className={`${Style.forgetPassCol}`}
          >
            <Box position={"absolute"} top={"80%"} left={"10%"}>
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "#FDFFFC",
                  fontSize: { lg: "2.5rem", md: "2.2rem" },
                }}
              >
                Reset Password
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
