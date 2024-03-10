import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../../../Context/AuthContext/AuthContext";
import { FormatAlignCenter, KeyboardArrowDown } from "@mui/icons-material";
import MuiAppBar from "@mui/material/AppBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBarProps } from "../../../../Interfaces/interFaces";
import logoDark from "../../../../assets/images/logo-dark.svg";
import logoLight from "../../../../assets/images/logo-light.svg";

export default function Navbar({
  setTheme,
  setOpen,
  open,
  window,
}: AppBarProps) {
  const { loginData, logOut } = useAuth();
  const navigate = useNavigate();
  const [profileMenu, setProfileMenu] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem("theme");
    if (value === "dark" || value === null) return true;
    return false;
  });
  const navBtns = (
    <Box
      display={"flex"}
      justifyItems={"center"}
      alignItems={"center"}
      gap={2}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Button
        onClick={() => navigate("/auth/signup")}
        variant="contained"
        disableElevation
      >
        Register
      </Button>
      <Button
        onClick={() => navigate("/auth")}
        variant="contained"
        disableElevation
      >
        Login Now
      </Button>
    </Box>
  );
  const getProfileMenu = (
    <Box ml={2} position={"relative"}>
      <Box
        onClick={() => {
          setProfileMenu(!profileMenu);
        }}
        sx={{ cursor: "pointer" }}
        display={"flex"}
        alignItems={"center"}
      >
        <IconButton sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src="https://mui.com//static/images/avatar/2.jpg"
          />
        </IconButton>
        <Typography ml={1} variant="body1">
          Mandela
        </Typography>
        <KeyboardArrowDown />
      </Box>
      <Box
        display={profileMenu ? "block" : "none"}
        borderRadius={1}
        boxShadow={3}
        border={"solid 1px #bdbdbd"}
        bgcolor={isDark ? "#272727" : "#fff"}
        position={"absolute"}
        top={"45px"}
      >
        <Button
          fullWidth
          color="inherit"
          py={1}
          px={4}
          sx={{
            "&:hover": {
              backgroundColor: isDark ? "#121212" : "#e0e0e0",
            },
            transition: "all .5s",
          }}
        >
          Profile
        </Button>
        <Button
          onClick={() => {
            logOut();
            navigate("/");
          }}
          color="inherit"
          fullWidth
          py={1}
          px={4}
          sx={{
            "&:hover": {
              backgroundColor: isDark ? "#121212" : "#e0e0e0",
            },
            transition: "all .5s",
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const navItems =
    loginData?.role === "user"
      ? [
          { title: "Home", path: "/" },
          { title: "Explore", path: "/explore" },
          { title: "Reviews", path: "/reviews" },
          { title: "Favorites", path: "/favorites" },
          { component: getProfileMenu },
        ]
      : loginData === null
      ? [
          { title: "Home", path: "/" },
          { title: "Explore", path: "/explore" },
          { component: navBtns },
        ]
      : [];
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        my={2}
        component="div"
      >
        <img width={"180px"} src={isDark ? logoDark : logoLight} alt="logo" />
      </Typography>
      <Divider />
      <List>
        {loginData?.role !== "admin"
          ? navItems.map((item, index) =>
              item.component ? (
                <ListItem key={index} disablePadding>
                  {item.component}
                </ListItem>
              ) : (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    sx={{ textAlign: "center" }}
                    onClick={() => navigate(item.path)}
                  >
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              )
            )
          : ""}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.bgNav.contrastText,
  }));

  return (
    <>
      {loginData?.role === "admin" ? (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setOpen(!open);
              }}
              edge="start"
              sx={{
                marginRight: 2,
              }}
            >
              <FormatAlignCenter />
            </IconButton>

            <Typography
              display={"flex"}
              alignItems={"center"}
              sx={{ flexGrow: 1 }}
              variant="h6"
              noWrap
              component="div"
            >
              <Box display={"flex"} width={{ xs: "130px", md: "200px" }}>
                <img
                  width={"100%"}
                  src={isDark ? logoDark : logoLight}
                  alt="logo"
                />
              </Box>
            </Typography>
            {getProfileMenu}
            <Typography ml={3} mt={1} display={"flex"} alignItems={"center"}>
              <label id="theme-toggle-button">
                <input
                  type="checkbox"
                  onChange={() => {
                    localStorage.setItem(
                      "theme",
                      theme.palette.mode === "dark" ? "light" : "dark"
                    );
                    setIsDark(!isDark);
                    setTheme(theme.palette.mode === "light" ? "dark" : "light");
                  }}
                  // defaultChecked
                  checked={isDark}
                  id="toggle"
                />
                <svg
                  width={75}
                  viewBox="0 0 69.667 44"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    transform="translate(3.5 3.5)"
                    data-name="Component 15 – 1"
                    id="Component_15_1"
                  >
                    <g
                      filter="url(#container)"
                      transform="matrix(1, 0, 0, 1, -3.5, -3.5)"
                    >
                      <rect
                        fill="#83cbd8"
                        transform="translate(3.5 3.5)"
                        rx="17.5"
                        height={35}
                        width="60.667"
                        data-name="container"
                        id="container"
                      />
                    </g>
                    <g transform="translate(2.333 2.333)" id="button">
                      {isDark ? moon() : sun()}
                    </g>
                    {isDark ? stars() : cloud()}
                  </g>
                </svg>
              </label>
            </Typography>
          </Toolbar>
        </AppBar>
      ) : (
        ""
      )}
      {loginData?.role !== "admin" ? (
        <>
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                display={"flex"}
                alignItems={"center"}
                sx={{ flexGrow: 1 }}
                variant="h6"
                component="div"
              >
                <Box display={"flex"} width={{ xs: "130px", md: "200px" }}>
                  <img
                    width={"100%"}
                    src={isDark ? logoDark : logoLight}
                    alt="logo"
                  />
                </Box>
              </Typography>
              <Box
                sx={{ display: { xs: "none", sm: "flex" } }}
                alignItems={"center"}
              >
                {navItems.map((item, index) =>
                  item.component ? (
                    <Box key={index} display={"flex"}>
                      {item.component}
                    </Box>
                  ) : (
                    <Button key={index} onClick={() => navigate(item.path)}>
                      {item.title}
                    </Button>
                  )
                )}
                <Typography
                  ml={3}
                  mt={1}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <label id="theme-toggle-button">
                    <input
                      type="checkbox"
                      onChange={() => {
                        localStorage.setItem(
                          "theme",
                          theme.palette.mode === "dark" ? "light" : "dark"
                        );
                        setIsDark(!isDark);
                        setTheme(
                          theme.palette.mode === "light" ? "dark" : "light"
                        );
                      }}
                      // defaultChecked
                      checked={isDark}
                      id="toggle"
                    />
                    <svg
                      width={75}
                      viewBox="0 0 69.667 44"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(3.5 3.5)"
                        data-name="Component 15 – 1"
                        id="Component_15_1"
                      >
                        <g
                          filter="url(#container)"
                          transform="matrix(1, 0, 0, 1, -3.5, -3.5)"
                        >
                          <rect
                            fill="#83cbd8"
                            transform="translate(3.5 3.5)"
                            rx="17.5"
                            height={35}
                            width="60.667"
                            data-name="container"
                            id="container"
                          />
                        </g>
                        <g transform="translate(2.333 2.333)" id="button">
                          {isDark ? moon() : sun()}
                        </g>
                        {isDark ? stars() : cloud()}
                      </g>
                    </svg>
                  </label>
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      ) : (
        ""
      )}
    </>
  );
}

const drawerWidth = 240;

const sun = () => {
  return (
    <g data-name="sun" id="sun">
      <g filter="url(#sun-outer)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
        <circle
          fill="#f8e664"
          transform="translate(5.83 5.83)"
          r="15.167"
          cy="15.167"
          cx="15.167"
          data-name="sun-outer"
          id="sun-outer-2"
        />
      </g>
      <g filter="url(#sun)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
        <path
          fill="rgba(246,254,247,0.29)"
          transform="translate(9.33 9.33)"
          d="M11.667,0A11.667,11.667,0,1,1,0,11.667,11.667,11.667,0,0,1,11.667,0Z"
          data-name="sun"
          id="sun-3"
        />
      </g>
      <circle
        fill="#fcf4b9"
        transform="translate(8.167 8.167)"
        r={7}
        cy={7}
        cx={7}
        id="sun-inner"
      />
    </g>
  );
};

const moon = () => {
  return (
    <g data-name="moon" id="moon">
      <g filter="url(#moon)" transform="matrix(1, 0, 0, 1, -31.5, -5.83)">
        <circle
          fill="#cce6ee"
          transform="translate(31.5 5.83)"
          r="15.167"
          cy="15.167"
          cx="15.167"
          data-name="moon"
          id="moon-3"
        />
      </g>
      <g fill="#a6cad0" transform="translate(-24.415 -1.009)" id="patches">
        <circle transform="translate(43.009 4.496)" r={2} cy={2} cx={2} />
        <circle
          transform="translate(39.366 17.952)"
          r={2}
          cy={2}
          cx={2}
          data-name="patch"
        />
        <circle
          transform="translate(33.016 8.044)"
          r={1}
          cy={1}
          cx={1}
          data-name="patch"
        />
        <circle
          transform="translate(51.081 18.888)"
          r={1}
          cy={1}
          cx={1}
          data-name="patch"
        />
        <circle
          transform="translate(33.016 22.503)"
          r={1}
          cy={1}
          cx={1}
          data-name="patch"
        />
        <circle
          transform="translate(50.081 10.53)"
          r="1.5"
          cy="1.5"
          cx="1.5"
          data-name="patch"
        />
      </g>
    </g>
  );
};

const stars = () => {
  return (
    <g fill="#def8ff" transform="translate(3.585 1.325)" id="stars">
      <path
        transform="matrix(-1, 0.017, -0.017, -1, 24.231, 3.055)"
        d="M.774,0,.566.559,0,.539.458.933.25,1.492l.485-.361.458.394L1.024.953,1.509.592.943.572Z"
      />
      <path
        transform="matrix(-0.777, 0.629, -0.629, -0.777, 23.185, 12.358)"
        d="M1.341.529.836.472.736,0,.505.46,0,.4.4.729l-.231.46L.605.932l.4.326L.9.786Z"
        data-name="star"
      />
      <path
        transform="matrix(0.438, 0.899, -0.899, 0.438, 23.177, 29.735)"
        d="M.015,1.065.475.9l.285.365L.766.772l.46-.164L.745.494.751,0,.481.407,0,.293.285.658Z"
        data-name="star"
      />
      <path
        transform="translate(12.677 0.388) rotate(104)"
        d="M1.161,1.6,1.059,1,1.574.722.962.607.86,0,.613.572,0,.457.446.881.2,1.454l.516-.274Z"
        data-name="star"
      />
      <path
        transform="matrix(-0.07, 0.998, -0.998, -0.07, 11.066, 15.457)"
        d="M.873,1.648l.114-.62L1.579.945,1.03.62,1.144,0,.706.464.157.139.438.7,0,1.167l.592-.083Z"
        data-name="star"
      />
      <path
        transform="translate(8.326 28.061) rotate(11)"
        d="M.593,0,.638.724,0,.982l.7.211.045.724.36-.64.7.211L1.342.935,1.7.294,1.063.552Z"
        data-name="star"
      />
      <path
        transform="translate(5.012 5.962) rotate(172)"
        d="M.816,0,.5.455,0,.311.323.767l-.312.455.516-.215.323.456L.827.911,1.343.7.839.552Z"
        data-name="star"
      />
      <path
        transform="translate(2.218 14.616) rotate(169)"
        d="M1.261,0,.774.571.114.3.487.967,0,1.538.728,1.32l.372.662.047-.749.728-.218L1.215.749Z"
        data-name="star"
      />
    </g>
  );
};

const cloud = () => {
  return (
    <g filter="url(#cloud)" transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
      <path
        fill="#fff"
        transform="translate(-3466.47 -160.94)"
        d="M3512.81,173.815a4.463,4.463,0,0,1,2.243.62.95.95,0,0,1,.72-1.281,4.852,4.852,0,0,1,2.623.519c.034.02-.5-1.968.281-2.716a2.117,2.117,0,0,1,2.829-.274,1.821,1.821,0,0,1,.854,1.858c.063.037,2.594-.049,3.285,1.273s-.865,2.544-.807,2.626a12.192,12.192,0,0,1,2.278.892c.553.448,1.106,1.992-1.62,2.927a7.742,7.742,0,0,1-3.762-.3c-1.28-.49-1.181-2.65-1.137-2.624s-1.417,2.2-2.623,2.2a4.172,4.172,0,0,1-2.394-1.206,3.825,3.825,0,0,1-2.771.774c-3.429-.46-2.333-3.267-2.2-3.55A3.721,3.721,0,0,1,3512.81,173.815Z"
        data-name="cloud"
        id="cloud"
      />
    </g>
  );
};
