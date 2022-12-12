/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { MESSAGE_STATUS, USER_STATUS } from "../../constants/events.constant";
import { useChatContext } from "../../shared/custom-hooks/useChatContext";
import { encode } from "../../utils/encoder.util";
import {
  addEventListenerById,
  getElements,
  removeScrollEvent,
} from "./utils/chat-message.util";

export const useChatMessageStatus = ({ isReply, message, serverMessage }) => {
  const [isSending, setIsSending] = useState(false);

  const { emitMessage, emitMessageStatus, updateStatus, isSelectedUserOnline } =
    useChatContext();

  const { id, from, status, userStatus } = message;
  const { ONLINE, OFFLINE } = USER_STATUS;
  const selectedUserStatus = isSelectedUserOnline ? ONLINE : OFFLINE;

  const sendMessageToServer = () => {
    setIsSending(true);

    const msgToSend = encode({
      ...serverMessage,
      userStatus: selectedUserStatus,
    });

    emitMessage(msgToSend, (status) => {
      setIsSending(false);
      updateStatus(message.id, status);
    });
  };

  const handleScroll = (e) => {
    const { isMessageVisible } = getElements(e, id);

    if (isMessageVisible) {
      removeScrollEvent(handleScroll);
      updateStatus(id, MESSAGE_STATUS.SEEN);
      emitStatusBackToMsgSender(MESSAGE_STATUS.SEEN);
    }
  };

  const emitStatusBackToMsgSender = (msgStatus) => {
    emitMessageStatus({
      to: from,
      id,
      status: msgStatus,
    });
  };

  useEffect(() => {
    if (serverMessage) {
      sendMessageToServer();
    }
    if (!isReply && status !== MESSAGE_STATUS.SEEN) {
      handleScroll();
      addEventListenerById("chat-container", "scroll", handleScroll);
      addEventListenerById(id, "click", () => handleScroll());

      if (userStatus === OFFLINE) {
        emitStatusBackToMsgSender(MESSAGE_STATUS.RECEIVED);
      }
      // if (!shouldScrollToBottom && message.status !== MESSAGE_STATUS.SEEN) {
      //   document.getElementById(message.id).scrollIntoView();
      // }
    }

    return () => {
      removeScrollEvent(handleScroll);
    };
  }, []);
  return {
    isSending,
  };
};
