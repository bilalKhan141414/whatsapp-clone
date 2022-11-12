import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  useRouteError,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRootLayout from "./components/ProtectedRootLayout";
import RootLayout from "./components/RootLayout";
import UnProtectedRootLayout from "./components/UnProtectedRootLayout";
import Chat, { loader as userDetailsLoader } from "./pages/Chat";
const ProtectedErrorElement = () => {
  let error = useRouteError();
  console.error(error);
  if (error.status === 401) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div className='flex w-full justify-center items-center'>
      Some thing went wrong
    </div>
  );
};
const ErrorElement = () => {
  let error = useRouteError();
  console.error(error);
  return (
    <div className='flex w-full justify-center items-center'>
      Some thing went wrong
    </div>
  );
};
export const router = (queryClient) =>
  createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path='/'
          element={<RootLayout />}
          errorElement={<ErrorElement />}>
          <Route
            element={<ProtectedRootLayout />}
            errorElement={<ProtectedErrorElement />}>
            <Route
              index
              element={<Chat />}
              loader={userDetailsLoader(queryClient)}
            />
          </Route>
          <Route element={<UnProtectedRootLayout />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Signup />} />
          </Route>
        </Route>
      </>
    )
  );
