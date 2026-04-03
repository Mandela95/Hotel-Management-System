import {
  BookmarkAdded,
  Business,
  Group,
  Home,
  SettingsSuggest,
  Villa,
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CSSObject,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Theme,
  Tooltip,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { SideBarProps } from "../../../../Interfaces/interFaces";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar({ open }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));
  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const sidebarList = [
    {
      title: "Home",
      icon: <Home />,
      path: "/dashboard",
    },
    {
      title: "Users",
      icon: <Group />,
      path: "/dashboard/users",
    },
    {
      title: "Rooms",
      icon: <Villa />,
      path: "/dashboard/rooms",
    },
    {
      title: "Ads",
      icon: <Business />,
      path: "/dashboard/ads",
    },
    {
      title: "Bookings",
      icon: <BookmarkAdded />,
      path: "/dashboard/bookings",
    },
    {
      title: "Facilities",
      icon: <SettingsSuggest />,
      path: "/dashboard/facilities",
    },
  ];

  // Find active tab index
  const activeIndex = sidebarList.findIndex(
    (item) => item.path === location.pathname
  );

  // Mobile: bottom tabs
  if (isMobile) {
    return (
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.drawer + 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
        elevation={8}
      >
        <BottomNavigation
          value={activeIndex === -1 ? 0 : activeIndex}
          onChange={(_e, newValue) => {
            navigate(sidebarList[newValue].path);
          }}
          showLabels
          sx={{
            bgcolor: theme.palette.bgSidebar.main,
            height: 64,
            "& .MuiBottomNavigationAction-root": {
              color: "rgba(255,255,255,0.55)",
              minWidth: "auto",
              px: 0.5,
              py: 0.5,
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.6rem",
                mt: 0.3,
              },
            },
            "& .Mui-selected": {
              color: "#fff !important",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.65rem",
                fontWeight: 600,
              },
            },
          }}
        >
          {sidebarList.map((item) => (
            <BottomNavigationAction
              key={item.title}
              label={item.title}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  // Desktop: sidebar drawer
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      <List>
        {sidebarList.map((item) => (
          <Tooltip key={item.title} title={item.title} placement="right">
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              style={{
                backgroundColor:
                  item.path === location.pathname
                    ? `${theme.palette.bgitem.main}`
                    : "",
                borderLeft:
                  item.path === location.pathname
                    ? `solid 6px ${theme.palette.bditem.main}`
                    : "",
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Box sx={{ fontSize: "large" }}>{item.icon}</Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0, fontSize: "5rem" }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: theme.palette.bgSidebar.main,
  color: theme.palette.bgSidebar.contrastText,
  [theme.breakpoints.down("md")]: {
    width: 0,
    minWidth: 0,
    border: "none",
    overflow: "hidden",
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("xs")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
    backgroundColor: theme.palette.bgSidebar.main,
  },
  [theme.breakpoints.down("md")]: {
    width: 0,
    minWidth: 0,
    border: "none",
    overflow: "hidden",
  },
});
