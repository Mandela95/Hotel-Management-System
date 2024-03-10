/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the authentication data//
export interface IAuth {
  loginData: { role: string } | null;
  savLoginData: () => void;
  logOut: () => void;
  requestHeaders: { Authorization: string };
}

export const AuthContext = createContext<IAuth | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loginData, setloginData] = useState<{ role: string } | null>(null);

  const requestHeaders = {
    Authorization: `${localStorage.getItem("token")}`,
  };
  const savLoginData = () => {
    const encodedToken = localStorage.getItem("token");
    if (!encodedToken) throw new Error("token not found");

    const decodedToken = jwtDecode(encodedToken!) as { role: string };
    setloginData(decodedToken);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setloginData(null);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      savLoginData();
    }
  }, []);

  const contextValue: IAuth | null = {
    loginData,
    savLoginData,
    requestHeaders,
    logOut,
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
