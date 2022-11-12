import { Navigate, Outlet } from "react-router-dom";
import { localStorageHelpers } from "../shared/Helpers/general";

const UnProtectedRootLayout = () => {
  const isAuthenticated = localStorageHelpers.IsUserLoggedIn;
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};

export default UnProtectedRootLayout;
