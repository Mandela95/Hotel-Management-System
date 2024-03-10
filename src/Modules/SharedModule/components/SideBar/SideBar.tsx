import {
  BookmarkAdded,
  Business,
  Group,
  Home,
  SettingsSuggest,
  Villa,
} from "@mui/icons-material";
import {
  CSSObject,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { SideBarProps } from "../../../../Interfaces/interFaces";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar({ open }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
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
      icon: <Home sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard",
    },
    {
      title: "Users",
      icon: <Group sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard/users",
    },
    {
      title: "Rooms",
      icon: <Villa sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard/rooms",
    },
    {
      title: "Ads",
      icon: <Business sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard/ads",
    },
    {
      title: "Bookings",
      icon: <BookmarkAdded sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard/bookings",
    },
    {
      title: "Facilities",
      icon: <SettingsSuggest sx={{ color: "#fff" }} fontSize="large" />,
      path: "/dashboard/facilities",
    },
  ];
  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <List>
          {sidebarList.map((item) => {
            return (
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
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ opacity: open ? 1 : 0, fontSize: "5rem" }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: theme.palette.bgSidebar.main,
  color: theme.palette.bgSidebar.contrastText,
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
});
