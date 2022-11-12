/* eslint-disable no-throw-literal */
/* eslint-disable no-extend-native */
import axios from "axios";
import { localStorageHelpers } from "./shared/Helpers/general";

window.ENDPOINT =
  process.env.NODE_ENV === "productions"
    ? process.env.REACT_APP_URL_LIVE
    : process.env.REACT_APP_URL;

String.prototype.xyzGlobalKey = function () {
  if (this.toString().toLocaleLowerCase() === "api") return ["api"];
  return ["api", this.toString()];
};
Array.prototype.xyzGlobalKey = function () {
  if (!this.includes("api")) this.unshift("api");
  return this;
};

axios.defaults.baseURL =
  process.env.NODE_ENV === "productions"
    ? process.env.REACT_APP_URL_LIVE
    : process.env.REACT_APP_URL;

const UN_PROTECTED_ROUTES = ["/api/auth/login", "/api/auth/register"];

axios.interceptors.request.use((config) => {
  const authHeaderNotRequired = UN_PROTECTED_ROUTES.some((route) =>
    config.url.includes(route)
  );
  if (!authHeaderNotRequired && localStorageHelpers.IsUserLoggedIn) {
    config.headers.Authorization = `${localStorageHelpers.AuthToken}`;
  }
  return config;
});

axios.interceptors.response.use(undefined, (err) => {
  let config = err.config;
  if (err.response && err.response.status === 401) {
    console.log("UnAuthenticated");
    localStorageHelpers.UserData = null;
    throw { message: "Un Authenticated", status: 401 };
  }
  return config;
});
