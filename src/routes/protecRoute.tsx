// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { LOGIN_PATH } from "./path";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};