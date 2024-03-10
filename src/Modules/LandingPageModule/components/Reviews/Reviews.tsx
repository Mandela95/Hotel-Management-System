import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { getBaseUrl } from "../../../../Utils/Utils";
import axios from "axios";
import { toast } from "react-toastify";
import ReviewImg from "../../../../assets/images/Hotel.jpg";
import { Stack, Rating } from "@mui/material";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default function Reviews() {
  const [reviews, setReviews] = React.useState<string[]>([]);
  const [rating, setRating] = React.useState<number | null>();
  const [activeStep, setActiveStep] = React.useState(0);
  const theme = useTheme();
  const maxSteps = reviews.length;
  const { requestHeaders } = useAuth();

  const getReviews = React.useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${getBaseUrl()}/api/v0/portal/room-reviews/6668acc5257b76c4added8cc`,
        {
          headers: requestHeaders,
        }
      );

      setReviews(data.data.roomReviews);

      setRating(data.data.roomReviews[0].rating);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "fail adding");
      }
    }
  }, [requestHeaders]);

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  React.useEffect(() => {
    getReviews();
  }, [getReviews]);

  return (
    <Box sx={{ maxWidth: "100%", flexGrow: 1, padding: "20px" }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
        }}
      ></Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {reviews.map(
          (
            review: {
              _id: string;
              room: { roomNumber: string };
              review: string;
            },
            index: number
          ) => (
            <div key={review._id} style={{ width: "100%", margin: "auto" }}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Stack
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  spacing={6}
                  direction={"row"}
                  sx={{
                    flexWrap: {
                      xs: "wrap",
                      lg: "nowrap",
                    },
                  }}
                >
                  <Box overflow={"hidden"}>
                    <img src={ReviewImg} alt="..." />
                  </Box>
                  <Box>
                    <Typography
                      component={"h2"}
                      fontWeight={600}
                      fontSize={"1.5rem"}
                    >
                      {review?.room.roomNumber}
                    </Typography>
                    <Typography>{review?.review}</Typography>
                    <Box display="flex" alignItems="center">
                      {/* Rating component */}
                      <Rating name="read-only" value={rating} readOnly />
                      {/* Rating text */}
                      <Typography variant="body1" sx={{ marginLeft: 1 }}>
                        {rating != null && rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              ) : null}
              <Typography></Typography>
            </div>
          )
        )}
      </AutoPlaySwipeableViews>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              sx={{ marginLeft: "25px" }}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ marginRight: "25px" }}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
          sx={{ width: "fit-content" }}
        />
      </Box>
    </Box>
  );
}
