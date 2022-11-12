import { Navigate, Outlet } from "react-router-dom";
import { localStorageHelpers } from "../shared/Helpers/general";

const ProtectedRootLayout = () => {
  const isAuthenticated = localStorageHelpers.IsUserLoggedIn;
  if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate to={"/login"} />;
};

export default ProtectedRootLayout;
