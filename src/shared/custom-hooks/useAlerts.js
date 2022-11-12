import { useCallback } from "react";
import { toast } from "react-toastify";

export default function useAlerts() {
  const alertSuccess = useCallback((message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }, []);

  const alertInfo = useCallback((message) => {
    toast.info(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }, []);

  const alertWarn = useCallback((message) => {
    toast.warn(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }, []);

  const alertError = useCallback((message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }, []);

  return {
    alertSuccess,
    alertInfo,
    alertWarn,
    alertError,
  };
}
