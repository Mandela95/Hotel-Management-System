/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the decoded token shape
export interface DecodedToken {
  _id?: string;
  role: string;
  userName?: string;
  userEmail?: string;
  userGroup?: string;
  [key: string]: any;
}

// Current user profile shape (built from JWT + login response)
export interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  role: string;
  profileImage: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the authentication data
export interface IAuth {
  loginData: DecodedToken | null;
  savLoginData: (userData?: UserProfile) => void;
  logOut: () => void;
  requestHeaders: { Authorization: string };
  currentUser: UserProfile | null;
}

export const AuthContext = createContext<IAuth | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loginData, setloginData] = useState<DecodedToken | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const requestHeaders = {
    Authorization: `${localStorage.getItem("token")}`,
  };

  const savLoginData = (userData?: UserProfile) => {
    const encodedToken = localStorage.getItem("token");
    if (!encodedToken) throw new Error("token not found");

    const decodedToken = jwtDecode(encodedToken!) as DecodedToken;
    setloginData(decodedToken);

    // If user data is provided from login response, store it
    if (userData) {
      setCurrentUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } else {
      // Build a minimal user profile from the JWT token
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser({
          _id: decodedToken._id || "",
          userName: decodedToken.userName || "",
          email: decodedToken.userEmail || "",
          phoneNumber: "",
          country: "",
          role: decodedToken.role || "",
          profileImage: "",
          verified: false,
          createdAt: "",
          updatedAt: "",
        });
      }
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setloginData(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      savLoginData();
    }
  }, []);

  const contextValue: IAuth = {
    loginData,
    savLoginData,
    requestHeaders,
    logOut,
    currentUser,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ZContext = useContext(AuthContext);
  if (!ZContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return ZContext;
};
