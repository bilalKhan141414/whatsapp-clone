/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import * as qs from "qs";
import { getResponseData, isCanceled } from "./AxiosHelper";
import useAlerts from "../useAlerts";
import { localStorageHelpers } from "./../../Helpers/general";
// import { useHistory } from "react-router";

const axiosInstance = axios.create({
  paramsSerializer: {
    encode: qs.parse,
    serialize: qs.stringify,
  },
  headers: new Headers({
    "Content-Type": "application/json",
  }),
});

const RetryConstants = {
  Retry: "retry",
  RetryCount: "retryCount",
  RetryDelay: "retryDelay",
};
const UN_PROTECTED_ROUTES = ["/api/auth/register"];
export default function useApi() {
  const [progress, setProgress] = useState(0);
  // const history = useHistory();
  const { alertError } = useAlerts();
  let cancelTokenSource = useRef(axios.CancelToken);
  const pendingRequests = useRef({});

  useEffect(() => {
    let axiosNumber = -1;
    axiosNumber = axiosInstance.interceptors.request.use((config) => {
      const authHeaderNotRequired = UN_PROTECTED_ROUTES.some((route) =>
        config.url.includes(route)
      );
      if (!authHeaderNotRequired && localStorageHelpers.IsUserLoggedIn) {
        config.headers.Authorization = `${localStorageHelpers.AuthToken}`;
      }

      return config;
    });

    return () => {
      if (axiosNumber !== -1) {
        axiosInstance.interceptors.request.eject(axiosNumber);
      }
      clearAllRequests();
    };
  }, []);

  useEffect(() => {
    axiosInstance.interceptors.response.use(undefined, (err) => {
      let config = err.config;
      if (err.response && err.response.status === 401) {
        // dispatch(setAuthentication(false));
        // history.push("/login");
      }
      // if(!config) return;
      // If config does not exist or the retry option is not set, reject
      if (!config.headers[RetryConstants.Retry]) {
        return Promise.reject(err);
      }

      // Set the variable for keeping track of the retry count
      config.headers[RetryConstants.RetryCount] =
        config.headers[RetryConstants.RetryCount] ?? 0;

      // Check if we've maxed out the total number of retries
      if (
        config.headers[RetryConstants.RetryCount] >=
        config.headers[RetryConstants.Retry]
      ) {
        // Reject with the error
        return Promise.reject(err);
      }

      // Increase the retry count
      config.headers[RetryConstants.RetryCount] += 1;

      // Create new promise to handle exponential backoff
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, config.headers[RetryConstants.RetryDelay] || 1);
      });

      // Return the promise in which recalls axios to retry the request
      return backoff.then(() => {
        return axiosInstance.request(config);
      });
    });
  }, []);

  const throwError = useCallback(
    (error) => {
      let resp = {
        status: false,
        error,
        message: null,
        showErrorAlerts: function () {
          if (axios.isCancel(this.error)) {
            console.log("Request has been canceled");
            return;
          }
          if (!alertError) {
            console.log(this.message);
            return;
          }
          if (typeof this.message === "string") {
            alertError(this.message);
          } else {
            Object.keys(this.message).map((key) =>
              alertError(this.message[key])
            );
          }
        },
      };
      if (error.response) {
        resp.message = error.response.data;
      } else if (error.request) {
        resp.message = error.request;
      } else if (error.message) {
        resp.message = error.message;
      } else {
        resp.message = error;
      }
      throw resp;
    },
    [alertError]
  );

  const clearAllRequests = () => {
    if (pendingRequests.current) {
      Object.keys(pendingRequests.current).forEach((key) => {
        if (pendingRequests.current[key]) {
          pendingRequests.current[key].cancel();
        }
      });

      pendingRequests.current = {};
    }
  };
  const addPendingRequest = (key) => {
    if (pendingRequests.current && cancelTokenSource.current) {
      if (pendingRequests.current[key]) {
        pendingRequests.current[key].cancel();
      }
      pendingRequests.current[key] = cancelTokenSource.current.source();
      return pendingRequests.current[key];
    } else {
      if (!pendingRequests.current) {
        throw new Error("Pending request object not instantiated.");
      } else {
        throw new Error("Cancel token source is not instantiated");
      }
    }
  };
  const HandleProgressUpload = ({ loaded, total }) => {
    let percentage = Math.floor((loaded * 100) / total);
    setProgress(percentage);
  };
  const postRequest = useCallback(
    ({ url, data, config = {} }, showProgress = false) => {
      // config.cancelToken = addPendingRequest(url).token;
      if (showProgress) config.onUploadProgress = HandleProgressUpload;

      return axiosInstance
        .post(`${window.ENDPOINT}${url}`, data, config)
        .then(getResponseData)
        .catch(throwError);
    },
    [throwError]
  );

  const getRequest = useCallback(
    (path, extraConfig = {}) => {
      extraConfig.cancelToken = addPendingRequest(path).token;

      return axiosInstance
        .get(`${window.ENDPOINT}${path}`, extraConfig)
        .then(getResponseData)
        .catch(throwError);
    },
    [throwError]
  );

  const getRequestMultiple = useCallback(
    (paths, config = {}) => {
      config.cancelToken = addPendingRequest(paths.toString()).token;

      const promises = paths.map((path) =>
        axiosInstance
          .get(`${window.ENDPOINT}${path}`, config)
          .then(getResponseData)
          .catch(throwError)
      );
      return axiosInstance.all(promises);
    },
    [throwError]
  );

  const putRequest = useCallback(
    async (path, data, config = {}) => {
      return axiosInstance
        .put(`${window.ENDPOINT}${path}`, data, config)
        .then(getResponseData)
        .catch(throwError);
    },
    [throwError]
  );

  const deleteRequest = useCallback(
    async (path, id, config = {}) => {
      return axiosInstance
        .delete(`${window.ENDPOINT}${path}/${id}`, config)
        .then(getResponseData)
        .catch(throwError);
    },
    [throwError]
  );

  return {
    progress,
    isCanceled,
    getRequest,
    getRequestMultiple,
    postRequest,
    putRequest,
    deleteRequest,
  };
}
