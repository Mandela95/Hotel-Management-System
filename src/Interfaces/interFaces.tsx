export interface FormData {
  email: string;
  password: string;
  loginData: string;
}

export interface AddRoomFormData {
  roomNumber: number;
  imgs: File;
  price: number;
  capacity: number;
  discount: number;
  facilities: number;
}

export interface RegisterFormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  role: string;
  profileImage: FileList;
}
export interface ResetPassInterFace {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string;
}

import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  window?: () => Window;
}

export interface SideBarProps {
  open: boolean;
}
export interface DashlayoutProps {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export interface RoomInterface {
  id: number;
  roomNumber: number;
  imgs: File;
  price: number;
  capacity: number;
  discount: number;
  category: string;
}
export interface FacilitiesInterface {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { userName: string; _id: string };
}

export interface AdsInterface {
  _id: string;
  // roomNumber: string;
  price: string;
  // discount: number;
  capacity: string;
  isActive: boolean;
  room: {
    discount: string;
    roomNumber: string;
    capacity: number;
    price: number;
  };
  name: string;
}

export interface roomsInterface {
  _id: string;
  roomNumber: string;
}

export interface UsersInterface {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  profileImage: string;
}

export interface facilitiesForm {
  name: string;
}
export interface adsForm {
  room: string;
  discount: string;
  isActive: boolean;
}
export interface UpdateAdsForm {
  room: string;
  discount: string;
  isActive: boolean;
}

export interface IBookingStatus {
  pending: number;
  completed: number;
}
export interface IUsers {
  adminsCount: number;
  usersCount: number;
  user: number;
  admin: number;
}

export interface AuthContextType {
  saveAdminData: () => void;
  userRole: string | null;
  token: string | null;
  logout: () => void;
  userData: string | null;
}

export interface Charts {
  rooms: number;
  facilities: number;
  ads: number;
  bookings: IBookingStatus;
  users: IUsers;
}

export interface RoomsInterface {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: [{ name: string; _id: string }];
  createdAt: string;
  updatedAt: string;
  createdBy: { userName: string; _id: string };
  images: [];
}

export interface CreateRoom {
  roomNumber: string;
  imgs: [];
  price: string;
  capacity: string;
  discount: string;
  facilities: [];
}
export interface BookingsInterface {
  roomNumber: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  user: { userName: string; _id: string };
  room: { roomNumber: number };
  userName: string;
  _id: number;
}
