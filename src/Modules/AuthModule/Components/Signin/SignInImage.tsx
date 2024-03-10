import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import Style from "./Signin.module.css"; // Make sure to adjust the path accordingly

interface CustomCSSProperties extends React.CSSProperties {
  "--x"?: number;
  "--y"?: number;
}

const SigninImage: React.FC = () => {
  const nSliceX = 8;
  const nSliceY = 8;
  const slices = Array.from({ length: nSliceX * nSliceY });

  return (
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
      <div
        className={Style.frame}
        style={
          {
            "--img": `url(../../../../assets/images/login0.png)`,
            "--w": "60vmin",
            "--h": "39vmin",
          } as React.CSSProperties
        }
      >
        {slices.map((_, index) => (
          <div
            key={index}
            className={Style.slice}
            style={
              {
                "--x": (index % nSliceX) / (nSliceX - 1),
                "--y": Math.floor(index / nSliceX) / (nSliceY - 1),
              } as CustomCSSProperties
            }
          ></div>
        ))}
      </div>
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
  );
};

export default SigninImage;
