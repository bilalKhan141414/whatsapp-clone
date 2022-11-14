/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { socketManager } from "../../utils/sockets/socket-manager.util";

export const useSocketManager = (reactHandlers) => {
  useEffect(() => {
    socketManager.init(reactHandlers);
    socketManager.connect();
  }, []);
  return {
    socketManager,
  };
};
