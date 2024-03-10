import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AdsList from "./Modules/AdminDashboard/Componenets/Ads/AdsList/AdsList";
import BookingsList from "./Modules/AdminDashboard/Componenets/BookingsList/BookingsList";
import Dashboard from "./Modules/AdminDashboard/Componenets/Dashboard/Dashboard";
import FacilitiesList from "./Modules/AdminDashboard/Componenets/Facilities/FacilitiesList/FacilitiesList";
import RoomsData from "./Modules/AdminDashboard/Componenets/Rooms/RoomsData/RoomsData";
import RoomsList from "./Modules/AdminDashboard/Componenets/Rooms/RoomsList/RoomsList";
import UsersList from "./Modules/AdminDashboard/Componenets/Users/UsersList/UsersList";
import ForgetPassword from "./Modules/AuthModule/Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./Modules/AuthModule/Components/ResetPassword/ResetPassword";
import Signin from "./Modules/AuthModule/Components/Signin/Signin";
import Signup from "./Modules/AuthModule/Components/Signup/Signup";
import Explore from "./Modules/LandingPageModule/components/Explore/Explore";
import Favorites from "./Modules/LandingPageModule/components/Favorites/Favorites";
import LandingPage from "./Modules/LandingPageModule/components/MainLandingPage/LandingPage";
import Reviews from "./Modules/LandingPageModule/components/Reviews/Reviews";
import RoomDetails from "./Modules/LandingPageModule/components/RoomDetails/RoomDetails";
import ConfirmPayment from "./Modules/PaymentModule/Components/ConfirmPayment/ConfirmPayment";
import DetailsPayment from "./Modules/PaymentModule/Components/DetailsPayment/DetailsPayment";
import FirstPaymentPage from "./Modules/PaymentModule/Components/FirstPaymentPage/FirstPaymentPage";
import AdDashboardLayout from "./Modules/SharedModule/components/LayOuts/AdDashboardLayout/AdDashboardLayout";
import AuthLayout from "./Modules/SharedModule/components/LayOuts/AuthLayout/AuthLayout";
import LandingLayout from "./Modules/SharedModule/components/LayOuts/LandingPageLayout/LandingLayout";
import PaymentLayout from "./Modules/SharedModule/components/LayOuts/PaymentLayout/PaymentLayout";
import NotFound from "./Modules/SharedModule/components/NotFound/NotFound";

declare module "@mui/material/styles" {
  interface Palette {
    bgSidebar: Palette["primary"];
    bgNav: Palette["primary"];
    bgitem: Palette["primary"];
    bditem: Palette["primary"];
  }

  interface PaletteOptions {
    bgSidebar?: PaletteOptions["primary"];
    bgNav?: PaletteOptions["primary"];
    bgitem?: PaletteOptions["primary"];
    bditem?: PaletteOptions["primary"];
  }
}

export default function App() {
  const [mode, setTheme] = useState(
    localStorage.getItem("theme") === null
      ? "dark"
      : localStorage.getItem("theme") === "light"
      ? "light"
      : "dark"
  );

  const darkTheme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            bgSidebar: {
              main: "#203FC7",
              contrastText: "#fff",
            },
            bgNav: {
              main: "#F8F9FB",
              contrastText: "#000",
            },
            bgitem: {
              main: "rgba(26, 27, 30, 0.17)",
            },
            bditem: {
              main: "#152C5B",
            },
          }
        : {
            // palette values for dark mode
            bgSidebar: {
              main: "#121212",
              contrastText: "#fff",
            },
            bgNav: {
              main: "#272727",
              contrastText: "#fff",
            },
            bgitem: {
              main: "rgb(84, 84, 84, 0.35)",
            },
            bditem: {
              main: "rgb(84, 84, 84)",
            },
          }),
    },
  });
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <LandingLayout setTheme={setTheme} />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "/explore/:id",
          element: <RoomDetails />,
        },
        {
          path: "favorites",
          element: <Favorites />,
        },
        {
          path: "reviews",
          element: <Reviews />,
        },
      ],
    },
    {
      path: "/payment",
      element: <PaymentLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <FirstPaymentPage />,
        },
        {
          path: "details",
          element: <DetailsPayment />,
        },
        {
          path: "confirm",
          element: <ConfirmPayment />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Signin />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <AdDashboardLayout setTheme={setTheme} />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <UsersList />,
        },
        {
          path: "rooms",
          element: <RoomsList />,
        },
        {
          path: "room-data",
          element: <RoomsData />,
        },
        {
          path: "ads",
          element: <AdsList />,
        },
        {
          path: "bookings",
          element: <BookingsList />,
        },
        {
          path: "facilities",
          element: <FacilitiesList />,
        },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}
