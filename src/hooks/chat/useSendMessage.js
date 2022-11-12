/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useChatContext } from "../../shared/custom-hooks/useChatContext";
import { useQueryString } from "../../shared/custom-hooks/useQueryString";
import { sendMessageManager } from "../../utils/send-message.util";

export const useSendMessage = () => {
  const formElement = useRef(null);
  const inputElement = useRef(null);

  const { queryString } = useQueryString();
  const { emitTypingStatus, handleSetMessage } = useChatContext();

  useEffect(() => {
    sendMessageManager.init(
      queryString.friend,
      document.getElementById("chat-container"),
      document.getElementById("chat-form"),
      document.getElementById("chat-input"),
      {
        emitTypingStatus,
        handleSetMessage,
      }
    );
  }, []);

  useEffect(() => {
    sendMessageManager.friendId = queryString.friend;

    if (inputElement.current) {
      const inputVal = sendMessageManager.friendLastInput ?? "";
      inputElement.current.value = inputVal;
      inputElement.current.focus();
    }
  }, [queryString.friend]);

  return {
    sendMessageManager,
    formElement,
    inputElement,
  };
};
