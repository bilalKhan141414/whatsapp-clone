/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { socketManager } from "../../utils/sockets/socket-manager.util";

export const useSocketManager = (setTyping, handleSetMessage) => {
  useEffect(() => {
    socketManager.init({
      setTyping,
      handleSetMessage,
    });
    socketManager.connect();
  }, []);
  return {
    socketManager,
  };
};
