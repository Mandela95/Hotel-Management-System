import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { DashlayoutProps } from "../../../../../Interfaces/interFaces";
import Navbar from "../../Navbar/Navbar";
import SideBar from "../../SideBar/SideBar";

export default function AdDashboardLayout({ setTheme }: DashlayoutProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    window.innerWidth < 900 ? setOpen(false) : setOpen(true);
    window.addEventListener("resize", function () {
      window.innerWidth < 900 ? setOpen(false) : setOpen(true);
    });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Navbar setOpen={setOpen} open={open} setTheme={setTheme} />
        <Box
          component="main"
          sx={{
            mt: "64px",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
          display="flex"
        >
          <SideBar open={open} />
          <Box sx={{ flex: 1, minWidth: 0, overflow: "auto", pb: { xs: "80px", md: 0 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
