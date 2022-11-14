/* eslint-disable no-throw-literal */
/* eslint-disable no-extend-native */
import axios from "axios";
import { localStorageHelpers } from "./shared/Helpers/general";

window.ENDPOINT =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL_LIVE
    : process.env.REACT_APP_URL;
console.log("window.ENDPOINT", window.ENDPOINT);
String.prototype.xyzGlobalKey = function () {
  if (this.toString().toLocaleLowerCase() === "api") return ["api"];
  return ["api", this.toString()];
};
Array.prototype.xyzGlobalKey = function () {
  if (!this.includes("api")) this.unshift("api");
  return this;
};

Error.throw = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
Error.NotFound = (message) => {
  const error = new Error(message);
  error.status = 404;
  return error;
};
Error.BadRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};
Error.UnAuthorized = (message) => {
  const error = new Error(message);
  error.status = 401;
  return error;
};
axios.defaults.baseURL = window.ENDPOINT;

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
  if (
    localStorageHelpers.IsUserLoggedIn &&
    err.response &&
    err.response.status === 401
  ) {
    localStorageHelpers.UserData = null;
    return window.location.reload();
  }
  return config;
});
